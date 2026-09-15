import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import rateLimit from 'express-rate-limit'
import ws from 'ws'

// Node 20 has no native WebSocket; Supabase's realtime client expects one.
// We don't use realtime, but the client still initializes it — so polyfill.
if (!globalThis.WebSocket) globalThis.WebSocket = ws

const app = express()
const PORT = process.env.PORT || 3001

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

// Stripe is optional until the live keys are added — endpoints that need it
// return 503 until then, so the rest of the server runs fine without it.
let stripe = null
if (process.env.STRIPE_SECRET_KEY) {
  const Stripe = (await import('stripe')).default
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
}

// Behind nginx, so the real client IP arrives in X-Forwarded-For. Without
// this every request looks like 127.0.0.1 and rate limiting would throttle
// every user as if they were one person.
app.set('trust proxy', 1)

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }))

// The AI Coach spends real money per request and the endpoint is reachable by
// anyone, so cap how fast a single IP can run up the bill.
const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 40,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many coaching requests. Please try again in a little while.' },
})

// A wider net over everything else, to blunt scripted abuse. /health is
// exempt so uptime monitoring never trips it.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
})

// ── STRIPE WEBHOOK (raw body, must precede express.json) ──────────────────────
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).json({ error: 'Stripe not configured' })
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }
  // Stripe retries delivery, so guard the whole handler against reprocessing
  // the same event (e.g. inviting a mat buyer twice or double-granting a trial).
  const { error: dupeError } = await supabase.from('stripe_events').insert({ id: event.id })
  if (dupeError) return res.json({ received: true, duplicate: true })

  const obj = event.data.object
  // Map a Stripe price amount to our tier
  const tierFromAmount = (cents) => (cents >= 1400 ? 'tier3' : 'tier2')
  try {
    if (event.type === 'checkout.session.completed' && obj.mode === 'payment' && obj.metadata?.product === 'star_mat') {
      let userId = obj.client_reference_id || null
      if (!userId) {
        const email = obj.customer_details?.email || obj.customer_email
        if (email) userId = await findOrCreateUserByEmail(email)
      }
      // The trial itself is already granted by the handle_new_subscriber DB
      // trigger the instant the account is created (see server/schema.sql) —
      // this only needs to attach the Stripe customer id. Upsert only touches
      // the columns listed here, so an existing row's plan/trial_ends_at are
      // left exactly as the trigger (or a later upgrade) set them.
      if (userId && obj.customer) {
        await supabase.from('subscriptions').upsert(
          { user_id: userId, stripe_customer_id: obj.customer, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
      } else if (!userId) {
        console.error('Mat purchase webhook: no client_reference_id or email on session', obj.id)
      }
    }
    if (event.type === 'checkout.session.completed' && obj.subscription) {
      const sub = await stripe.subscriptions.retrieve(obj.subscription)
      const amount = sub.items?.data?.[0]?.price?.unit_amount ?? 0
      const uid = obj.client_reference_id
      const patch = {
        stripe_subscription_id: sub.id,
        stripe_customer_id: obj.customer,
        status: 'active',
        plan: tierFromAmount(amount),
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }
      if (uid) await supabase.from('subscriptions').upsert({ user_id: uid, ...patch }, { onConflict: 'user_id' })
      else await supabase.from('subscriptions').update(patch).eq('stripe_customer_id', obj.customer)
    }
    if (event.type === 'customer.subscription.updated') {
      const amount = obj.items?.data?.[0]?.price?.unit_amount ?? 0
      await supabase.from('subscriptions').update({
        status: obj.status,
        plan: obj.status === 'active' ? tierFromAmount(amount) : 'free',
        current_period_end: new Date(obj.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('stripe_subscription_id', obj.id)
    }
    if (event.type === 'customer.subscription.deleted') {
      await supabase.from('subscriptions').update({
        status: 'canceled', plan: 'free', updated_at: new Date().toISOString(),
      }).eq('stripe_subscription_id', obj.id)
    }
  } catch (err) {
    console.error('Webhook handler error:', err.message)
  }
  res.json({ received: true })
})

app.use(express.json({ limit: '10mb' }))

// ── Auth middleware ───────────────────────────────────────────────────────────
async function requireAuth(req, res, next) {
  const h = req.headers.authorization
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' })
  const { data: { user }, error } = await supabase.auth.getUser(h.split(' ')[1])
  if (error || !user) return res.status(401).json({ error: 'Invalid or expired token' })
  req.user = user
  next()
}

async function getSub(userId) {
  const { data } = await supabase.from('subscriptions').select('*').eq('user_id', userId).single()
  return data
}

// Looks up an existing account by email (via the service-role-only
// get_user_id_by_email RPC, since auth.users isn't exposed via PostgREST),
// or invites a new one. Used to turn an anonymous mat buyer's checkout email
// into a real account.
async function findOrCreateUserByEmail(email) {
  const { data: existingId } = await supabase.rpc('get_user_id_by_email', { lookup_email: email })
  if (existingId) return existingId

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.SITE_URL}/`,
  })
  if (error) {
    // Race: another concurrent webhook event may have just created this user — re-check once.
    const { data: retryId } = await supabase.rpc('get_user_id_by_email', { lookup_email: email })
    if (retryId) return retryId
    throw error
  }
  return data.user.id
}

// What a subscription unlocks. tier3/comp/trial = full (incl. voice+camera).
// tier2 = videos + text coach only. free/expired = locked.
function entitlement(sub) {
  if (!sub) return { tier: 'free', access: false, vision: false }
  const trialActive = sub.plan === 'trial' && sub.trial_ends_at && new Date(sub.trial_ends_at).getTime() > Date.now()
  if (sub.plan === 'comp') return { tier: 'comp', access: true, vision: true }
  if (sub.plan === 'tier3' && sub.status === 'active') return { tier: 'tier3', access: true, vision: true }
  if (sub.plan === 'tier2' && sub.status === 'active') return { tier: 'tier2', access: true, vision: false }
  if (trialActive) return { tier: 'trial', access: true, vision: true }
  return { tier: 'free', access: false, vision: false }
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok' }))

// Tells the frontend whether paid plans can be sold yet (flips to true once
// the Stripe secret + webhook secret are configured) and the trial length
// currently on offer (30 days for the first 5,000 subscribers, 14 after —
// see handle_new_subscriber in server/schema.sql), so copy never goes stale.
app.get('/config', async (_, res) => {
  const { data: count } = await supabase.rpc('get_subscriber_count')
  res.json({
    paymentsEnabled: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
    currentTrialDays: (count ?? 0) < 5000 ? 30 : 14,
  })
})

app.get('/auth/me', requireAuth, async (req, res) => {
  const sub = await getSub(req.user.id)
  res.json({
    user: { id: req.user.id, email: req.user.email, name: req.user.user_metadata?.full_name },
    subscription: sub || { plan: 'free', status: 'inactive' },
    entitlement: entitlement(sub),
  })
})

// Redeem a code (boss/comp codes)
app.post('/redeem', requireAuth, async (req, res) => {
  const code = (req.body?.code || '').trim()
  if (!code) return res.status(400).json({ error: 'Code required' })

  const { data: rc } = await supabase
    .from('redemption_codes').select('*').eq('code', code).eq('active', true).single()
  if (!rc) return res.status(404).json({ error: 'That code is invalid or no longer active.' })
  if (rc.max_uses != null && rc.uses >= rc.max_uses) {
    return res.status(410).json({ error: 'That code has been fully redeemed.' })
  }

  const plan = rc.grants_plan || 'comp'
  await supabase.from('subscriptions').upsert(
    { user_id: req.user.id, plan, status: 'active', updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  )
  await supabase.from('code_redemptions').insert({ user_id: req.user.id, code: rc.code })
  await supabase.from('redemption_codes').update({ uses: rc.uses + 1 }).eq('id', rc.id)

  const sub = await getSub(req.user.id)
  res.json({ success: true, plan, entitlement: entitlement(sub) })
})

// ── STAR ASSESSMENT ───────────────────────────────────────────────────────────
// Free tier gets ONE Star Score; retakes + progress history are an Elite perk
// (Elite / trial / comp all count as "vision"-level entitlement).
app.get('/assessment/history', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('assessments')
    .select('overall, level, mobility, balance, control, symmetry, created_at')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(24)
  if (error) return res.status(500).json({ error: 'Could not load assessments' })
  res.json({ history: data || [] })
})

app.post('/assessment', requireAuth, async (req, res) => {
  const { overall, level, categories } = req.body || {}
  if (typeof overall !== 'number' || !level || !categories) {
    return res.status(400).json({ error: 'Invalid assessment payload' })
  }

  const ent = entitlement(await getSub(req.user.id))
  if (!ent.vision) {
    const { count } = await supabase
      .from('assessments')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', req.user.id)
    if ((count ?? 0) >= 1) {
      return res.status(403).json({
        code: 'ASSESSMENT_LIMIT',
        error: 'Your free Star Score is saved. Retakes and progress tracking are an Elite feature.',
      })
    }
  }

  const { data, error } = await supabase.from('assessments').insert({
    user_id: req.user.id,
    overall: Math.round(overall),
    level,
    mobility: Math.round(categories.mobility ?? 0),
    balance: Math.round(categories.balance ?? 0),
    control: Math.round(categories.control ?? 0),
    symmetry: Math.round(categories.symmetry ?? 0),
  }).select().single()

  if (error) return res.status(500).json({ error: 'Could not save assessment' })
  res.json({ success: true, assessment: data })
})

// ── CONSENT LOGGING (liability waiver + biometric/camera) ─────────────────────
app.get('/consent', requireAuth, async (req, res) => {
  const { data } = await supabase.from('consents').select('type').eq('user_id', req.user.id)
  const types = new Set((data || []).map(r => r.type))
  res.json({ liability_waiver: types.has('liability_waiver'), biometric: types.has('biometric') })
})

app.post('/consent', requireAuth, async (req, res) => {
  const type = req.body?.type
  if (!['liability_waiver', 'biometric'].includes(type)) return res.status(400).json({ error: 'Invalid consent type' })
  const { error } = await supabase.from('consents').insert({
    user_id: req.user.id,
    type,
    user_agent: (req.headers['user-agent'] || '').slice(0, 300),
  })
  if (error) return res.status(500).json({ error: 'Could not record consent' })
  res.json({ success: true })
})

// ── STRIPE BILLING PORTAL (manage / cancel subscription) ──────────────────────
app.post('/billing-portal', requireAuth, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Billing is not available yet.' })
  const sub = await getSub(req.user.id)
  if (!sub?.stripe_customer_id) return res.status(400).json({ error: 'No paid subscription to manage yet.' })
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${process.env.SITE_URL || 'https://starmat.app'}/account`,
    })
    res.json({ url: session.url })
  } catch (e) {
    console.error('billing portal error:', e.message)
    res.status(500).json({ error: 'Could not open subscription management. Try again.' })
  }
})

// Permanently delete the account and all data tied to it. Deleting the auth
// user cascades to coach_profiles, coach_sessions, and subscriptions via the
// `on delete cascade` foreign keys in schema.sql.
app.delete('/account', requireAuth, async (req, res) => {
  const { error } = await supabase.auth.admin.deleteUser(req.user.id)
  if (error) return res.status(500).json({ error: 'Could not delete account. Please try again.' })
  res.json({ success: true })
})

// Per-user subscription checkout via the Stripe Payment Links (client passes tier)
app.post('/subscribe/checkout', requireAuth, async (req, res) => {
  // Refuse to take money until the webhook is configured — otherwise a customer
  // could pay and never get their access upgraded.
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    const ent = entitlement(await getSub(req.user.id))
    const msg = ent.tier === 'trial'
      ? 'Paid plans open in a few days — your free trial is active until then, so you already have full access.'
      : ent.tier === 'comp'
        ? 'Paid plans open in a few days — you already have complimentary full access.'
        : 'Paid plans open in a few days — your free trial is available to start in the meantime.'
    return res.status(503).json({ error: msg })
  }
  const links = {
    tier2: process.env.STRIPE_LINK_TIER2,
    tier3: process.env.STRIPE_LINK_TIER3,
  }
  const url = links[req.body?.tier]
  if (!url) return res.status(400).json({ error: 'Unknown tier' })
  // Attach the user so the webhook can link the subscription back to the account
  res.json({ url: `${url}?client_reference_id=${req.user.id}&prefilled_email=${encodeURIComponent(req.user.email)}` })
})

// ── PROGRESS: profile, workouts, streaks, sharing (Phase 1) ──────────────────

// Turns a list of workout dates into streak numbers. Dates arrive as
// 'YYYY-MM-DD' strings in the athlete's own local calendar, which is the only
// honest way to do this: a 11pm session should count for today, not tomorrow
// because the server happens to be in a different timezone.
function computeStreaks(dateStrings, todayStr) {
  const days = [...new Set(dateStrings)].sort().reverse()
  if (!days.length) return { current: 0, longest: 0 }

  const toDate = (s) => new Date(s + 'T00:00:00Z')
  const dayDiff = (a, b) => Math.round((toDate(a) - toDate(b)) / 86400000)

  // Current streak: must include today or yesterday, otherwise it has lapsed.
  let current = 0
  if (dayDiff(todayStr, days[0]) <= 1) {
    current = 1
    for (let i = 1; i < days.length; i++) {
      if (dayDiff(days[i - 1], days[i]) === 1) current++
      else break
    }
  }

  let longest = 1, run = 1
  for (let i = 1; i < days.length; i++) {
    if (dayDiff(days[i - 1], days[i]) === 1) { run++; longest = Math.max(longest, run) }
    else run = 1
  }
  return { current, longest }
}

app.get('/profile', requireAuth, async (req, res) => {
  const { data } = await supabase.from('profiles').select('*').eq('user_id', req.user.id).single()
  res.json({ profile: data || { user_id: req.user.id, leaderboard_opt_in: false } })
})

app.put('/profile', requireAuth, async (req, res) => {
  const allowed = ['display_name', 'sport', 'position', 'sex', 'area', 'leaderboard_opt_in']
  const patch = {}
  for (const k of allowed) if (k in (req.body || {})) patch[k] = req.body[k]

  if (typeof patch.display_name === 'string') {
    patch.display_name = patch.display_name.trim().slice(0, 24)
    if (patch.display_name.length < 2) return res.status(400).json({ error: 'Display name needs at least 2 characters.' })
  }
  for (const k of ['sport', 'position', 'sex', 'area']) {
    if (typeof patch[k] === 'string') patch[k] = patch[k].trim().slice(0, 40) || null
  }
  // Opting into the board requires a display name, so real names never leak.
  if (patch.leaderboard_opt_in === true) {
    const { data: cur } = await supabase.from('profiles').select('display_name').eq('user_id', req.user.id).single()
    const name = patch.display_name ?? cur?.display_name
    if (!name) return res.status(400).json({ error: 'Set a display name before joining the leaderboard.' })
  }

  const { data, error } = await supabase.from('profiles')
    .upsert({ user_id: req.user.id, ...patch, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    .select().single()
  if (error) return res.status(500).json({ error: 'Could not save profile' })
  res.json({ profile: data })
})

// Log a training day. Client sends its local date so the streak respects the
// athlete's own midnight, not the server's.
app.post('/workouts', requireAuth, async (req, res) => {
  const { date, source, ref } = req.body || {}
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return res.status(400).json({ error: 'date must be YYYY-MM-DD' })
  if (!['class', 'coach', 'manual', 'assessment'].includes(source)) return res.status(400).json({ error: 'Invalid source' })

  const { error } = await supabase.from('workouts').upsert(
    { user_id: req.user.id, workout_date: date, source, ref: String(ref || '').slice(0, 80) },
    { onConflict: 'user_id,workout_date,source,ref', ignoreDuplicates: true }
  )
  if (error) return res.status(500).json({ error: 'Could not log workout' })
  res.json({ success: true })
})

// Everything the progress card needs in one call.
app.get('/stats', requireAuth, async (req, res) => {
  const today = /^\d{4}-\d{2}-\d{2}$/.test(req.query.today || '') ? req.query.today : new Date().toISOString().slice(0, 10)

  const [{ data: workouts }, { data: scores }] = await Promise.all([
    supabase.from('workouts').select('workout_date, source').eq('user_id', req.user.id).order('workout_date', { ascending: false }).limit(400),
    supabase.from('assessments').select('id, overall, level, created_at, shared').eq('user_id', req.user.id).order('created_at', { ascending: false }),
  ])

  const dates = (workouts || []).map(w => w.workout_date)
  const { current, longest } = computeStreaks(dates, today)

  const t = new Date(today + 'T00:00:00Z')
  const weekAgo = new Date(t); weekAgo.setUTCDate(t.getUTCDate() - 6)
  const monthAgo = new Date(t); monthAgo.setUTCDate(t.getUTCDate() - 29)
  const iso = d => d.toISOString().slice(0, 10)
  const distinct = [...new Set(dates)]

  const latest = scores?.[0] || null
  const first = scores?.length ? scores[scores.length - 1] : null

  res.json({
    streak: current,
    longestStreak: longest,
    totalDays: distinct.length,
    thisWeek: distinct.filter(d => d >= iso(weekAgo) && d <= today).length,
    last30: distinct.filter(d => d >= iso(monthAgo) && d <= today),
    trainedToday: distinct.includes(today),
    latestScore: latest,
    improvement: latest && first && latest.id !== first.id ? latest.overall - first.overall : 0,
    assessments: scores?.length || 0,
  })
})

// Owner flips a score to shareable and gets the public URL back.
app.post('/assessment/:id/share', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('assessments')
    .update({ shared: true })
    .eq('id', req.params.id).eq('user_id', req.user.id)
    .select('id').single()
  if (error || !data) return res.status(404).json({ error: 'Assessment not found' })
  res.json({ url: `${process.env.ALLOWED_ORIGIN || 'https://starmat.app'}/score/${data.id}` })
})

app.post('/assessment/:id/unshare', requireAuth, async (req, res) => {
  await supabase.from('assessments').update({ shared: false }).eq('id', req.params.id).eq('user_id', req.user.id)
  res.json({ success: true })
})

// Public. Returns a score only if its owner shared it, and only the display
// name, never the email or real name.
app.get('/share/:id', async (req, res) => {
  const { data: a } = await supabase.from('assessments')
    .select('id, user_id, overall, level, mobility, balance, control, symmetry, created_at, shared')
    .eq('id', req.params.id).single()
  if (!a || !a.shared) return res.status(404).json({ error: 'This score is not shared.' })

  const { data: p } = await supabase.from('profiles').select('display_name, sport').eq('user_id', a.user_id).single()
  const { data: w } = await supabase.from('workouts').select('workout_date').eq('user_id', a.user_id)
  const { current } = computeStreaks((w || []).map(x => x.workout_date), new Date().toISOString().slice(0, 10))

  res.json({
    id: a.id,
    overall: a.overall, level: a.level,
    categories: { mobility: a.mobility, balance: a.balance, control: a.control, symmetry: a.symmetry },
    date: a.created_at,
    name: p?.display_name || 'A Star Mat athlete',
    sport: p?.sport || null,
    streak: current,
  })
})

// ── TEAMS (Phase 2) ──────────────────────────────────────────────────────────

// Unambiguous alphabet: no 0/O, 1/I/L, so a code read aloud or typed from a
// photo does not get mistaken.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
function makeInviteCode() {
  let out = ''
  for (let i = 0; i < 8; i++) out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  return out.slice(0, 4) + '-' + out.slice(4)
}

async function membershipOf(teamId, userId) {
  const { data } = await supabase.from('team_members').select('role').eq('team_id', teamId).eq('user_id', userId).single()
  return data?.role || null
}

// Builds the three rankings for a set of members in one pass. Returns rows
// with display name, current score, streak, and 30-day improvement, plus the
// row's rank under each ordering so the client can flip between boards
// without another round trip.
async function buildLeaderboard(userIds, todayStr) {
  if (!userIds.length) return []
  const monthAgo = new Date(todayStr + 'T00:00:00Z'); monthAgo.setUTCDate(monthAgo.getUTCDate() - 30)

  const [{ data: profiles }, { data: workouts }, { data: scores }] = await Promise.all([
    supabase.from('profiles').select('user_id, display_name, sport, position').in('user_id', userIds),
    supabase.from('workouts').select('user_id, workout_date').in('user_id', userIds),
    supabase.from('assessments').select('user_id, overall, level, created_at').in('user_id', userIds).order('created_at', { ascending: false }),
  ])

  const byUser = {}
  for (const id of userIds) byUser[id] = { user_id: id, name: null, sport: null, position: null, score: null, level: null, streak: 0, improvement: 0, days30: 0 }
  for (const p of profiles || []) Object.assign(byUser[p.user_id], { name: p.display_name, sport: p.sport, position: p.position })

  const datesBy = {}
  for (const w of workouts || []) (datesBy[w.user_id] ||= []).push(w.workout_date)
  for (const id of userIds) {
    const ds = datesBy[id] || []
    byUser[id].streak = computeStreaks(ds, todayStr).current
    byUser[id].days30 = new Set(ds.filter(d => d >= monthAgo.toISOString().slice(0, 10))).size
  }

  const scoresBy = {}
  for (const s of scores || []) (scoresBy[s.user_id] ||= []).push(s)
  for (const id of userIds) {
    const list = scoresBy[id] || []
    if (!list.length) continue
    const latest = list[0]
    byUser[id].score = latest.overall
    byUser[id].level = latest.level
    // Improvement = latest minus the most recent score from 30+ days ago, or
    // the earliest score if none is that old yet.
    const baseline = list.find(s => new Date(s.created_at) <= monthAgo) || list[list.length - 1]
    byUser[id].improvement = baseline === latest ? 0 : latest.overall - baseline.overall
  }

  const rows = Object.values(byUser).map(r => ({ ...r, name: r.name || 'Anonymous athlete' }))
  const rank = (key) => {
    const sorted = [...rows].sort((a, b) => (b[key] ?? -1) - (a[key] ?? -1))
    const m = {}; sorted.forEach((r, i) => { m[r.user_id] = i + 1 }); return m
  }
  const rScore = rank('score'), rStreak = rank('streak'), rImproved = rank('improvement')
  return rows.map(r => ({ ...r, rank: { score: rScore[r.user_id], streak: rStreak[r.user_id], improved: rImproved[r.user_id] } }))
}

app.post('/teams', requireAuth, async (req, res) => {
  const name = String(req.body?.name || '').trim().slice(0, 40)
  const sport = String(req.body?.sport || '').trim().slice(0, 40) || null
  if (name.length < 2) return res.status(400).json({ error: 'Team name needs at least 2 characters.' })

  // Retry on the vanishingly rare code collision rather than fail the request.
  let team = null
  for (let i = 0; i < 4 && !team; i++) {
    const { data, error } = await supabase.from('teams')
      .insert({ name, sport, owner_id: req.user.id, invite_code: makeInviteCode() })
      .select().single()
    if (!error) team = data
    else if (error.code !== '23505') return res.status(500).json({ error: 'Could not create team' })
  }
  if (!team) return res.status(500).json({ error: 'Could not create team' })

  await supabase.from('team_members').insert({ team_id: team.id, user_id: req.user.id, role: 'owner' })
  res.json({ team })
})

app.post('/teams/join', requireAuth, async (req, res) => {
  const code = String(req.body?.code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (code.length !== 8) return res.status(400).json({ error: 'That doesn\'t look like a team code.' })
  const formatted = code.slice(0, 4) + '-' + code.slice(4)

  const { data: team } = await supabase.from('teams').select('id, name').eq('invite_code', formatted).single()
  if (!team) return res.status(404).json({ error: 'No team with that code.' })

  const { error } = await supabase.from('team_members')
    .upsert({ team_id: team.id, user_id: req.user.id, role: 'member' }, { onConflict: 'team_id,user_id', ignoreDuplicates: true })
  if (error) return res.status(500).json({ error: 'Could not join team' })
  res.json({ team })
})

app.get('/teams/mine', requireAuth, async (req, res) => {
  const { data: rows } = await supabase.from('team_members').select('role, teams(id, name, sport, visibility, owner_id, created_at)').eq('user_id', req.user.id)
  const teams = (rows || []).filter(r => r.teams).map(r => ({ ...r.teams, role: r.role }))
  // Member counts in one query rather than one per team.
  const ids = teams.map(t => t.id)
  if (ids.length) {
    const { data: counts } = await supabase.from('team_members').select('team_id').in('team_id', ids)
    const c = {}; for (const r of counts || []) c[r.team_id] = (c[r.team_id] || 0) + 1
    for (const t of teams) t.member_count = c[t.id] || 0
  }
  res.json({ teams })
})

// Team page. Members always see it; outsiders only if visibility is public.
// The invite code is only ever returned to members.
app.get('/teams/:id', async (req, res) => {
  const { data: team } = await supabase.from('teams').select('*').eq('id', req.params.id).single()
  if (!team) return res.status(404).json({ error: 'Team not found' })

  let viewer = null
  const h = req.headers.authorization
  if (h?.startsWith('Bearer ')) {
    const { data: { user } } = await supabase.auth.getUser(h.split(' ')[1])
    viewer = user || null
  }
  const role = viewer ? await membershipOf(team.id, viewer.id) : null
  if (!role && team.visibility !== 'public') return res.status(403).json({ error: 'This team is private.' })

  const { data: members } = await supabase.from('team_members').select('user_id, role, joined_at').eq('team_id', team.id)
  const today = /^\d{4}-\d{2}-\d{2}$/.test(req.query.today || '') ? req.query.today : new Date().toISOString().slice(0, 10)
  const board = await buildLeaderboard((members || []).map(m => m.user_id), today)

  res.json({
    team: {
      id: team.id, name: team.name, sport: team.sport, visibility: team.visibility,
      owner_id: team.owner_id, created_at: team.created_at,
      invite_code: role ? team.invite_code : undefined,
    },
    role,
    member_count: (members || []).length,
    leaderboard: board,
  })
})

app.put('/teams/:id', requireAuth, async (req, res) => {
  const role = await membershipOf(req.params.id, req.user.id)
  if (role !== 'owner') return res.status(403).json({ error: 'Only the team owner can change settings.' })

  const patch = {}
  if (typeof req.body?.name === 'string') {
    const n = req.body.name.trim().slice(0, 40)
    if (n.length < 2) return res.status(400).json({ error: 'Team name needs at least 2 characters.' })
    patch.name = n
  }
  if (['members', 'public'].includes(req.body?.visibility)) patch.visibility = req.body.visibility
  if (req.body?.rotate_code === true) patch.invite_code = makeInviteCode()
  if (!Object.keys(patch).length) return res.status(400).json({ error: 'Nothing to update' })

  const { data, error } = await supabase.from('teams').update(patch).eq('id', req.params.id).select().single()
  if (error) return res.status(500).json({ error: 'Could not update team' })
  res.json({ team: data })
})

app.post('/teams/:id/leave', requireAuth, async (req, res) => {
  const role = await membershipOf(req.params.id, req.user.id)
  if (!role) return res.status(404).json({ error: 'You are not on this team.' })
  if (role === 'owner') return res.status(400).json({ error: 'Owners cannot leave. Delete the team, or it stays with you.' })
  await supabase.from('team_members').delete().eq('team_id', req.params.id).eq('user_id', req.user.id)
  res.json({ success: true })
})

app.delete('/teams/:id', requireAuth, async (req, res) => {
  const role = await membershipOf(req.params.id, req.user.id)
  if (role !== 'owner') return res.status(403).json({ error: 'Only the team owner can delete it.' })
  await supabase.from('teams').delete().eq('id', req.params.id)
  res.json({ success: true })
})

// Owner can remove a member.
app.delete('/teams/:id/members/:userId', requireAuth, async (req, res) => {
  const role = await membershipOf(req.params.id, req.user.id)
  if (role !== 'owner') return res.status(403).json({ error: 'Only the team owner can remove members.' })
  if (req.params.userId === req.user.id) return res.status(400).json({ error: 'Use delete team instead.' })
  await supabase.from('team_members').delete().eq('team_id', req.params.id).eq('user_id', req.params.userId)
  res.json({ success: true })
})

// ── AI CHAT (kept open for now so the live site keeps working;
//    will be gated by entitlement when the new frontend ships) ─────────────────
app.post('/chat', chatLimiter, async (req, res) => {
  try {
    const { messages, system, hasVision } = req.body
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages array required' })
    const model = hasVision ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001'
    const response = await anthropic.messages.create({
      model, max_tokens: hasVision ? 1024 : 800,
      system: system || '', messages: messages.filter(m => m.role !== 'system'),
    })
    res.json(response)
  } catch (err) {
    console.error('Chat error:', err.message)
    res.status(500).json({ error: 'Failed to generate response' })
  }
})

// Loopback only. nginx proxies /api/ to here, so this port must not be
// reachable from the internet directly.
app.listen(PORT, '127.0.0.1', () => console.log(`Star Fitness API running on 127.0.0.1:${PORT}`))

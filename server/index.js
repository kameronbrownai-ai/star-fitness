import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { requireAuth, requireSubscription } from './middleware/auth.js'

const app = express()
const PORT = process.env.PORT || 3001

const client   = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const stripe   = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }))

// ── STRIPE WEBHOOK ────────────────────────────────────────────────────────────
// Must come BEFORE express.json() — Stripe requires the raw request body to
// verify the signature. Any JSON parsing before this breaks the check.
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  const obj = event.data.object

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const sub = await stripe.subscriptions.retrieve(obj.subscription)
        await supabase.from('subscriptions').update({
          stripe_subscription_id: obj.subscription,
          status: 'active',
          plan: 'pro',
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }).eq('stripe_customer_id', obj.customer)
        console.log('Subscription activated:', obj.customer)
        break
      }

      case 'customer.subscription.updated': {
        await supabase.from('subscriptions').update({
          status: obj.status,
          current_period_end: new Date(obj.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }).eq('stripe_subscription_id', obj.id)
        break
      }

      case 'customer.subscription.deleted': {
        await supabase.from('subscriptions').update({
          status: 'canceled',
          plan: 'free',
          updated_at: new Date().toISOString(),
        }).eq('stripe_subscription_id', obj.id)
        console.log('Subscription canceled:', obj.id)
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err.message)
  }

  res.json({ received: true })
})

// ── JSON body parser ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))

// ── HEALTH ────────────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok' }))

// ── AUTH: current user + subscription status ──────────────────────────────────
app.get('/auth/me', requireAuth, async (req, res) => {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status, plan, current_period_end')
    .eq('user_id', req.user.id)
    .single()

  res.json({
    user: { id: req.user.id, email: req.user.email },
    subscription: sub || { status: 'inactive', plan: 'free' },
  })
})

// ── COACH PROFILE ─────────────────────────────────────────────────────────────
app.get('/profile', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('coach_profiles')
    .select('*')
    .eq('user_id', req.user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    return res.status(500).json({ error: 'Failed to fetch profile' })
  }
  res.json(data || null)
})

app.post('/profile', requireAuth, async (req, res) => {
  const { sport, position, level, goal, injuries, equipment, metrics } = req.body

  const { data, error } = await supabase
    .from('coach_profiles')
    .upsert(
      { user_id: req.user.id, sport, position, level, goal, injuries, equipment, metrics, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) return res.status(500).json({ error: 'Failed to save profile' })
  res.json(data)
})

// ── SESSION HISTORY ───────────────────────────────────────────────────────────
app.get('/history', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('coach_sessions')
    .select('date, note, session_number')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) return res.status(500).json({ error: 'Failed to fetch history' })
  res.json(data || [])
})

app.post('/history', requireAuth, async (req, res) => {
  const { note, session_number } = req.body
  if (!note) return res.status(400).json({ error: 'note required' })

  const { data, error } = await supabase
    .from('coach_sessions')
    .insert({ user_id: req.user.id, note, session_number, date: new Date().toISOString().split('T')[0] })
    .select()
    .single()

  if (error) return res.status(500).json({ error: 'Failed to save session' })
  res.json(data)
})

// ── STRIPE CHECKOUT ───────────────────────────────────────────────────────────
app.post('/subscribe/create-checkout', requireAuth, async (req, res) => {
  const { id: userId, email } = req.user

  let { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single()

  let customerId = sub?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({ email, metadata: { supabase_uid: userId } })
    customerId = customer.id
    await supabase.from('subscriptions').upsert(
      { user_id: userId, stripe_customer_id: customerId, status: 'inactive', plan: 'free' },
      { onConflict: 'user_id' }
    )
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.SITE_URL}/booking?success=true`,
      cancel_url: `${process.env.SITE_URL}/booking`,
    })
    res.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err.message)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

// ── AI CHAT ───────────────────────────────────────────────────────────────────
// To gate behind login + subscription, replace the line below with:
// app.post('/chat', requireAuth, requireSubscription, async (req, res) => {
app.post('/chat', async (req, res) => {
  try {
    const { messages, system, hasVision } = req.body
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' })
    }

    const model      = hasVision ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001'
    const max_tokens = hasVision ? 1024 : 800

    const response = await client.messages.create({
      model,
      max_tokens,
      system: system || '',
      messages: messages.filter(m => m.role !== 'system'),
    })

    res.json(response)
  } catch (err) {
    console.error('Chat error:', err.message)
    res.status(500).json({ error: 'Failed to generate response' })
  }
})

app.listen(PORT, () => console.log(`Star Fitness AI server running on port ${PORT}`))

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Check, Ticket, LogOut, ArrowRight, Crown, ShieldCheck, Trash2, Activity, TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import StarAssessment from '../components/StarAssessment'
import { LEVEL_COLOR } from '../lib/starScore'

const PLAN_LABEL = {
  comp: { name: 'Complimentary, Full Access', color: '#FFD700' },
  tier3: { name: 'Elite', color: '#FFD700' },
  tier2: { name: 'Training', color: '#007AFF' },
  trial: { name: 'Free Trial', color: '#30D158' },
  free: { name: 'Free', color: '#8E8E93' },
}

export default function Account() {
  const { user, session, signOut, openAuth, tier, trialDaysLeft, hasVision, refreshEntitlement, requireConsent, subscription, openBillingPortal } = useAuth()
  const navigate = useNavigate()

  // Camera (biometric) + liability consent must be captured before the camera-
  // based assessment mounts. Gating here fires the consent modal above the page.
  const startAssessment = () =>
    requireConsent('biometric', () => requireConsent('liability', () => setShowAssessment(true)))
  const [code, setCode] = useState('')
  const [redeeming, setRedeeming] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteErr, setDeleteErr] = useState(null)
  const [showAssessment, setShowAssessment] = useState(false)
  const [history, setHistory] = useState(null)
  const [billingErr, setBillingErr] = useState(null)
  const [billingLoading, setBillingLoading] = useState(false)

  async function manageBilling() {
    setBillingErr(null); setBillingLoading(true)
    const r = await openBillingPortal()
    if (r?.error) { setBillingErr(r.error); setBillingLoading(false) }
  }

  async function loadHistory() {
    if (!session?.access_token) return
    try {
      const res = await fetch('/api/assessment/history', { headers: { Authorization: `Bearer ${session.access_token}` } })
      const data = await res.json()
      setHistory(data.history || [])
    } catch { setHistory([]) }
  }
  useEffect(() => { loadHistory() }, [session?.access_token])

  if (!user) {
    return (
      <main className="pt-32 pb-24 section-padding text-center">
        <h1 className="text-4xl font-black mb-4">Your Account</h1>
        <p className="text-star-grey mb-8">Log in to see your plan and redeem codes.</p>
        <button onClick={() => openAuth({ mode: 'login' })} className="btn-primary">Log in</button>
      </main>
    )
  }

  const plan = PLAN_LABEL[tier] || PLAN_LABEL.free

  async function redeem(e) {
    e.preventDefault()
    setErr(null); setMsg(null); setRedeeming(true)
    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ code: code.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not redeem that code.')
      await refreshEntitlement()
      setMsg('Code redeemed, your access has been upgraded!')
      setCode('')
    } catch (e2) {
      setErr(e2.message)
    } finally {
      setRedeeming(false)
    }
  }

  async function deleteMyData() {
    setDeleteErr(null); setDeleting(true)
    try {
      const res = await fetch('/api/account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not delete your data.')
      await signOut()
      navigate('/')
    } catch (e2) {
      setDeleteErr(e2.message)
      setDeleting(false)
    }
  }

  return (
    <main className="pt-28 pb-24">
      <div className="section-padding max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-star-yellow text-xs font-bold tracking-widest uppercase mb-3">Your Account</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            {user.user_metadata?.full_name || 'Welcome back'}
          </h1>
          <p className="text-star-grey mb-10">{user.email}</p>

          {/* Current plan */}
          <div className="rounded-2xl border border-star-border bg-star-card p-6 mb-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-star-grey text-xs uppercase tracking-wider mb-1.5">Current plan</p>
                <p className="font-black text-2xl flex items-center gap-2" style={{ color: plan.color }}>
                  {(tier === 'comp' || tier === 'tier3') && <Crown size={20} />}
                  {plan.name}
                </p>
                {trialDaysLeft != null && (
                  <p className="text-star-grey text-sm mt-1.5">
                    {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} remaining
                  </p>
                )}
                <p className="text-star-grey text-xs mt-2">
                  {hasVision
                    ? 'Full access, all training classes, injury recovery, AI Coach, voice & camera.'
                    : tier === 'tier2'
                      ? 'All training classes + AI Coach (text). Injury recovery, voice & camera need Elite.'
                      : 'Starter Library only, hand-selected classes.'}
                </p>
              </div>
              {tier !== 'comp' && tier !== 'tier3' && (
                <Link to="/pricing" className="btn-primary text-sm py-2.5 px-5">
                  Upgrade <ArrowRight size={15} />
                </Link>
              )}
            </div>

            {/* Manage / cancel, shown for paid subscribers (Stripe billing portal) */}
            {(tier === 'tier2' || tier === 'tier3' || subscription?.stripe_customer_id) && (
              <div className="mt-4 pt-4 border-t border-star-border/50">
                <button onClick={manageBilling} disabled={billingLoading}
                  className="text-star-grey hover:text-white text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50">
                  {billingLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                  Manage or cancel subscription <ArrowRight size={14} />
                </button>
                <p className="text-star-grey/60 text-xs mt-1">Update payment, change plan, or cancel anytime, no fees.</p>
                {billingErr && <p className="text-red-400 text-xs mt-2">{billingErr}</p>}
              </div>
            )}
          </div>

          {/* Star Score */}
          <div className="rounded-2xl border border-star-border bg-star-card p-6 mb-5">
            <div className="flex items-center gap-2 mb-1.5">
              <Activity size={16} className="text-star-yellow" />
              <p className="text-white font-bold">Your Star Score</p>
            </div>

            {history === null ? (
              <div className="flex items-center gap-2 text-star-grey text-sm py-3"><Loader2 size={14} className="animate-spin" /> Loading…</div>
            ) : history.length === 0 ? (
              <>
                <p className="text-star-grey text-sm mb-4">
                  Get your movement scored in 60 seconds with your camera, 5 moves on the mat, one Star Score. Your first assessment is free.
                </p>
                <button onClick={startAssessment}
                  className="px-6 py-3 rounded-xl bg-star-yellow text-black font-bold text-sm inline-flex items-center gap-2">
                  <Activity size={16} /> Take the Star Assessment
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-5 mb-4">
                  <div className="text-center flex-shrink-0">
                    <p className="font-black text-5xl leading-none" style={{ color: LEVEL_COLOR[history[0].level] }}>{history[0].overall}</p>
                    <p className="text-xs font-bold mt-1" style={{ color: LEVEL_COLOR[history[0].level] }}>{history[0].level}</p>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
                    {['mobility', 'balance', 'control', 'symmetry'].map((k) => (
                      <div key={k}>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-star-grey capitalize">{k}</span>
                          <span className="text-white font-semibold">{history[0][k]}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${history[0][k]}%`, background: LEVEL_COLOR[history[0].level] }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trend (Elite: multiple scores) */}
                {history.length > 1 && (
                  <div className="flex items-center gap-2 text-star-grey text-xs mb-4 pt-3 border-t border-star-border/50">
                    <TrendingUp size={14} className="text-star-green" />
                    <span>
                      {history[0].overall > history[history.length - 1].overall
                        ? `Up ${history[0].overall - history[history.length - 1].overall} points since your first assessment`
                        : 'Keep training, your next score is one session away'}
                      {' · '}{history.length} assessments
                    </span>
                  </div>
                )}

                {hasVision ? (
                  <button onClick={startAssessment}
                    className="px-5 py-2.5 rounded-xl border border-star-yellow/40 bg-star-yellow/10 text-star-yellow font-bold text-sm inline-flex items-center gap-2">
                    <Activity size={15} /> Retake assessment
                  </button>
                ) : (
                  <div className="rounded-xl border border-star-yellow/25 bg-star-yellow/[0.06] p-3.5">
                    <p className="text-white/80 text-sm">Retakes and progress tracking are an Elite feature. <Link to="/pricing" className="text-star-yellow font-semibold">Upgrade</Link> to reassess and watch your score climb.</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Redeem a code */}
          <div className="rounded-2xl border border-star-border bg-star-card p-6 mb-5">
            <div className="flex items-center gap-2 mb-1.5">
              <Ticket size={16} className="text-star-yellow" />
              <p className="text-white font-bold">Redeem a code</p>
            </div>
            <p className="text-star-grey text-sm mb-4">Have an access code? Enter it here to unlock your account.</p>
            <form onSubmit={redeem} className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="STAR-XXXX-XXXX-XXXX"
                className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-star-black border border-star-border text-white placeholder:text-star-grey/50 text-sm focus:outline-none focus:border-star-yellow/50 uppercase"
              />
              <button
                type="submit" disabled={redeeming || !code.trim()}
                className="px-5 py-3 rounded-xl bg-star-yellow text-star-black font-bold text-sm disabled:opacity-40 flex items-center gap-2"
              >
                {redeeming ? <Loader2 size={16} className="animate-spin" /> : 'Redeem'}
              </button>
            </form>
            {msg && <p className="text-star-green text-sm mt-3 flex items-center gap-1.5"><Check size={14} /> {msg}</p>}
            {err && <p className="text-red-400 text-sm mt-3">{err}</p>}
          </div>

          {/* Data & Privacy */}
          <div className="rounded-2xl border border-star-border bg-star-card p-6 mb-5">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck size={16} className="text-star-yellow" />
              <p className="text-white font-bold">Data & privacy</p>
            </div>
            <p className="text-star-grey text-sm mb-4">
              We store your name and email (for login), your coach profile (sport, goals, injuries),
              your AI Coach session history, and your subscription/billing status, all tied to this
              account and used only to personalize your training and manage your plan.
            </p>

            {!confirmingDelete ? (
              <button
                onClick={() => setConfirmingDelete(true)}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                <Trash2 size={15} /> Delete my data
              </button>
            ) : (
              <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-4">
                <p className="text-white text-sm font-bold mb-1">Delete your account and all data?</p>
                <p className="text-star-grey text-sm mb-4">
                  This permanently removes your login, coach profile, session history, and subscription
                  record. This can't be undone.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={deleteMyData}
                    disabled={deleting}
                    className="px-4 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm disabled:opacity-40 flex items-center gap-2"
                  >
                    {deleting ? <Loader2 size={16} className="animate-spin" /> : 'Yes, delete everything'}
                  </button>
                  <button
                    onClick={() => { setConfirmingDelete(false); setDeleteErr(null) }}
                    disabled={deleting}
                    className="text-star-grey hover:text-white text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                {deleteErr && <p className="text-red-400 text-sm mt-3">{deleteErr}</p>}
              </div>
            )}
          </div>

          <button
            onClick={signOut}
            className="flex items-center gap-2 text-star-grey hover:text-white text-sm transition-colors"
          >
            <LogOut size={15} /> Log out
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showAssessment && (
          <StarAssessment onClose={() => { setShowAssessment(false); loadHistory() }} />
        )}
      </AnimatePresence>
    </main>
  )
}

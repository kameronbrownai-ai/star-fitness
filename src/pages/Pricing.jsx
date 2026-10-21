import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X as XIcon, Loader2, Star, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { track } from '../lib/analytics'

// Plan labels and prices for analytics. tier2/tier3 are internal keys; the
// tracking plan uses the names people actually see.
const PLAN_ANALYTICS = {
  tier2: { item: 'training', value: { month: 5, year: 50 } },
  tier3: { item: 'elite', value: { month: 14.99, year: 149.9 } },
}

// Yearly is priced at exactly ten months, so "two months free" is literally
// true rather than approximately true. Changing a yearly price here means
// changing the matching Stripe Payment Link too, or the page will advertise
// one number and charge another.
const MONTHS_PAID_YEARLY = 10

const TIERS = [
  {
    key: 'free',
    name: 'Free',
    price: { month: '$0', year: '$0' },
    cadence: { month: 'forever', year: 'forever' },
    color: '#8E8E93',
    blurb: 'Start moving with our hand-selected Starter Library.',
    features: [
      [true, 'The Starter Library, hand-selected classes'],
      [true, 'Selected training + recovery classes per sport'],
      [true, 'Your first Star Assessment™, free'],
      [false, 'Complete training library'],
      [false, 'AI Coach'],
      [false, 'Star Score™ progress tracking'],
    ],
  },
  {
    key: 'tier2',
    name: 'Training',
    price: { month: '$5', year: '$50' },
    cadence: { month: '/month', year: '/year' },
    monthly: 5,
    color: '#007AFF',
    blurb: 'Unlock every training class plus your AI training partner.',
    features: [
      [true, 'Everything in Free'],
      [true, 'Every training class, every sport'],
      [true, 'AI Coach (text)'],
      [false, 'Full injury recovery library'],
      [false, 'Voice & camera coaching'],
      [false, 'Live events'],
    ],
  },
  {
    key: 'tier3',
    name: 'Elite',
    price: { month: '$14.99', year: '$149.90' },
    cadence: { month: '/month', year: '/year' },
    monthly: 14.99,
    color: '#FFD700',
    featured: true,
    blurb: 'The complete system, measure, coach, and track your progress.',
    features: [
      [true, 'Everything in Training'],
      [true, 'Unlimited Star Assessment™ retakes'],
      [true, 'Star Score™ tracking, watch your progress climb'],
      [true, 'Full injury recovery library'],
      [true, 'Voice + live camera AI coaching'],
      [true, 'Live events & priority support'],
    ],
  },
]

export default function Pricing() {
  const { user, session, openAuth, tier: currentTier, trialDaysLeft, trialDaysOffer, yearlyEnabled } = useAuth()
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)
  const [interval, setInterval] = useState('month')

  // yearlyEnabled arrives from /api/config a moment after mount. If the yearly
  // Payment Links are missing, fall back rather than leave someone stranded on
  // a selection that cannot check out.
  const billing = yearlyEnabled ? interval : 'month'

  async function subscribe(tierKey) {
    setError(null)
    if (!user) {
      openAuth({ mode: 'signup', prompt: 'checkout_gate', reason: 'Create your account, then pick your plan.' })
      return
    }
    setLoading(tierKey)
    try {
      const res = await fetch('/api/subscribe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ tier: tierKey, interval: billing }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout unavailable')

      // Fired only once Stripe has actually given us a URL, so a failed
      // checkout call never counts as a started one.
      const plan = PLAN_ANALYTICS[tierKey]
      track('checkout.started', {
        checkout_type: 'subscription',
        item: plan?.item ?? tierKey,
        billing_interval: billing,
        value: plan?.value?.[billing] ?? 0,
        currency: 'USD',
      })

      window.location.href = data.url
    } catch (e) {
      setError(e.message || 'Could not start checkout. Try again.')
      setLoading(null)
    }
  }

  return (
    <main className="pt-28 pb-24">
      <section className="section-padding text-center mb-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-star-yellow text-xs font-bold tracking-widest uppercase mb-3">Membership</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Train at <span className="text-gradient-yellow">Your Level.</span>
          </h1>
          <p className="text-star-grey text-lg max-w-xl mx-auto">
            Every new account starts with a <span className="text-white font-semibold">{trialDaysOffer}-day free trial</span> of Elite, full access, no card required.
          </p>
          {trialDaysLeft != null && (
            <p className="mt-4 inline-block px-4 py-2 rounded-full bg-star-yellow/10 border border-star-yellow/30 text-star-yellow text-sm font-semibold">
              {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} left in your free trial
            </p>
          )}

          {/* Monthly / yearly switch. Hidden entirely until both yearly
              Payment Links exist in Stripe, so it can never offer a checkout
              that fails. */}
          {yearlyEnabled && (
            <div role="radiogroup" aria-label="Billing period"
              className="mt-8 inline-flex items-center gap-1 p-1 rounded-full border border-star-border bg-white/[0.03]">
              {[
                { id: 'month', label: 'Monthly' },
                { id: 'year', label: 'Yearly' },
              ].map((opt) => {
                const on = billing === opt.id
                return (
                  <button
                    key={opt.id}
                    role="radio"
                    aria-checked={on}
                    onClick={() => setInterval(opt.id)}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                      on ? 'bg-star-yellow text-star-black' : 'text-star-grey hover:text-white'
                    }`}
                  >
                    {opt.label}
                    {opt.id === 'year' && (
                      <span className={`ml-2 text-[11px] font-semibold ${on ? 'text-star-black/70' : 'text-star-green'}`}>
                        2 months free
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </motion.div>
      </section>

      <section className="section-padding">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
          {TIERS.map((t, i) => {
            const isCurrent = currentTier === t.key || (t.key === 'free' && currentTier === 'free')
            return (
              <motion.div
                key={t.key}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-3xl border p-7 flex flex-col"
                style={{
                  borderColor: t.featured ? `${t.color}55` : 'rgba(255,255,255,0.08)',
                  background: t.featured ? `${t.color}0a` : 'rgba(255,255,255,0.02)',
                  boxShadow: t.featured ? `0 0 40px ${t.color}12` : 'none',
                }}
              >
                {t.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold text-star-black flex items-center gap-1"
                    style={{ background: t.color }}>
                    <Star size={11} fill="currentColor" /> Most Complete
                  </div>
                )}

                <h2 className="text-white font-black text-xl mb-1">{t.name}</h2>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black" style={{ color: t.color }}>{t.price[billing]}</span>
                  <span className="text-star-grey text-sm mb-1.5">{t.cadence[billing]}</span>
                </div>
                {/* Reserve the line in both states so switching billing period
                    does not jog the cards up and down. */}
                <p className="text-xs mb-4 mt-1.5 h-4">
                  {billing === 'year' && t.monthly ? (
                    <span className="text-star-green font-semibold">
                      ${(t.monthly * MONTHS_PAID_YEARLY / 12).toFixed(2)}/month, billed yearly
                    </span>
                  ) : <span>&nbsp;</span>}
                </p>
                <p className="text-star-grey text-sm leading-relaxed mb-6">{t.blurb}</p>

                <ul className="space-y-2.5 mb-7 flex-1">
                  {t.features.map(([on, label]) => (
                    <li key={label} className="flex items-start gap-2.5">
                      {on
                        ? <Check size={15} className="mt-0.5 flex-shrink-0" style={{ color: t.color }} />
                        : <XIcon size={15} className="mt-0.5 flex-shrink-0 text-white/15" />}
                      <span className={`text-sm ${on ? 'text-white/80' : 'text-white/25'}`}>{label}</span>
                    </li>
                  ))}
                </ul>

                {t.key === 'free' ? (
                  <button
                    onClick={() => !user && openAuth({ mode: 'signup' })}
                    disabled={!!user}
                    className="w-full py-3.5 rounded-xl border border-star-border text-white font-semibold text-sm disabled:opacity-40"
                  >
                    {user ? 'Included with your account' : 'Create free account'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => subscribe(t.key)}
                      disabled={loading === t.key || isCurrent}
                      className="w-full py-3.5 rounded-xl font-bold text-sm text-star-black disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: t.color }}
                    >
                      {loading === t.key ? <Loader2 size={16} className="animate-spin" />
                        : isCurrent ? 'Your current plan' : `Get ${t.name}`}
                    </button>
                    {/* Auto-renew disclosure, required at the point of
                        payment. It has to name the amount and period actually
                        being charged, so it follows the billing switch. */}
                    <p className="text-star-grey/70 text-[11px] leading-snug mt-2.5 text-center">
                      Your {t.name} subscription renews automatically at {t.price[billing]}{' '}
                      {billing === 'year' ? 'per year' : 'per month'} until canceled. Cancel anytime in your account settings.
                    </p>
                  </>
                )}
              </motion.div>
            )
          })}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-7 mx-auto max-w-md rounded-2xl border border-star-yellow/30 bg-star-yellow/[0.07] px-5 py-4 flex items-start gap-3"
          >
            <Clock size={17} className="text-star-yellow flex-shrink-0 mt-0.5" />
            <p className="text-white/80 text-sm leading-relaxed">{error}</p>
          </motion.div>
        )}

        <p className="text-star-grey text-xs text-center mt-8">
          Have a promo code? Enter it at checkout. Cancel anytime, no long-term contract.
        </p>
      </section>
    </main>
  )
}

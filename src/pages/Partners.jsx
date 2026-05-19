import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap, Globe, Award, ArrowRight } from 'lucide-react'
import { saveSubmission } from '../utils/dataStore'

const tiers = [
  {
    id: 'studio',
    name: 'Studio Partner',
    price: 'Free',
    color: '#007AFF',
    icon: Star,
    perks: ['Co-branded marketing kit', 'Wholesale mat pricing (30% off)', 'Monthly partner newsletter', 'Social media features'],
  },
  {
    id: 'sponsor',
    name: 'Official Sponsor',
    price: 'Custom',
    color: '#FFD700',
    icon: Award,
    featured: true,
    perks: ['Everything in Studio', 'Logo on Star Mat packaging', 'Dedicated account manager', 'Event collaboration rights', 'Revenue share on referrals'],
  },
  {
    id: 'ambassador',
    name: 'Brand Ambassador',
    price: 'Revenue Share',
    color: '#BF5AF2',
    icon: Zap,
    perks: ['Personal discount code', 'Commission on sales (15%)', 'Free gear each season', 'Early product access'],
  },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

export default function Partners() {
  const [selected, setSelected] = useState('studio')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    company: '', website: '', location: '', partnerType: 'studio', message: '',
  })

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    saveSubmission('partners', { ...form, partnerType: selected })
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      <section className="section-padding py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50vw] h-[30vw] rounded-full bg-star-yellow/5 blur-[100px]" />
        </div>
        <motion.div {...fadeUp()} className="relative z-10 max-w-3xl">
          <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-3">Partnerships & Sponsorships</p>
          <h1 className="text-5xl md:text-6xl font-black mb-5">
            Grow With <span className="text-gradient-yellow">Star Fitness.</span>
          </h1>
          <p className="text-star-grey text-lg leading-relaxed">
            Join our partner network — whether you're a fitness studio, a brand looking for co-marketing,
            or an athlete ready to represent. We grow together.
          </p>
        </motion.div>
      </section>

      {/* Tier Cards */}
      <section className="section-padding mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.id}
                {...fadeUp(i * 0.12)}
                onClick={() => setSelected(tier.id)}
                className={`relative rounded-2xl border p-8 cursor-pointer transition-all duration-300 card-hover ${
                  selected === tier.id
                    ? 'border-opacity-100 bg-star-card'
                    : 'border-star-border bg-star-card/50 hover:bg-star-card'
                }`}
                style={{ borderColor: selected === tier.id ? tier.color : undefined }}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-star-black bg-star-yellow">
                    Most Popular
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${tier.color}15`, border: `1px solid ${tier.color}30` }}>
                  <tier.icon size={22} style={{ color: tier.color }} />
                </div>
                <h3 className="text-white font-bold text-xl mb-1">{tier.name}</h3>
                <p className="font-black text-2xl mb-5" style={{ color: tier.color }}>{tier.price}</p>
                <ul className="space-y-2.5">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm text-star-grey">
                      <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                      {perk}
                    </li>
                  ))}
                </ul>
                {selected === tier.id && (
                  <motion.div
                    layoutId="tier-selected"
                    className="absolute inset-0 rounded-2xl ring-2 pointer-events-none"
                    style={{ ringColor: tier.color, boxShadow: `0 0 0 2px ${tier.color}` }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-10">
            <p className="text-star-grey text-sm tracking-widest uppercase mb-3">Apply Now</p>
            <h2 className="text-4xl font-black">Partner Application</h2>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-3xl p-16 text-center border border-star-yellow/20"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                <Check size={28} className="text-green-400" />
              </div>
              <h3 className="text-2xl font-black mb-3">Application Received!</h3>
              <p className="text-star-grey max-w-md mx-auto">
                Our partnerships team will review your application and reach out within 3–5 business days.
              </p>
            </motion.div>
          ) : (
            <motion.form
              {...fadeUp(0.1)}
              onSubmit={handleSubmit}
              className="glass rounded-3xl p-8 md:p-12 border border-star-border space-y-5"
            >
              {/* Partner type (synced with tier selection) */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Partnership Type</label>
                <div className="flex gap-2 flex-wrap">
                  {tiers.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { setSelected(t.id); setForm((f) => ({ ...f, partnerType: t.id })) }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        selected === t.id ? 'text-star-black' : 'glass text-star-grey border border-star-border'
                      }`}
                      style={selected === t.id ? { backgroundColor: t.color } : {}}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                {[['firstName', 'First Name'], ['lastName', 'Last Name']].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-star-grey text-sm mb-1.5">{label} *</label>
                    <input required name={name} value={form[name]} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-star-card border border-star-border text-white placeholder-star-grey/50 focus:outline-none focus:border-star-blue transition-colors text-sm"
                      placeholder={label} />
                  </div>
                ))}
              </div>

              {/* Contact row */}
              <div className="grid grid-cols-2 gap-4">
                {[['email', 'Email Address', 'email'], ['phone', 'Phone Number', 'tel']].map(([name, label, type]) => (
                  <div key={name}>
                    <label className="block text-star-grey text-sm mb-1.5">{label} *</label>
                    <input required type={type} name={name} value={form[name]} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-star-card border border-star-border text-white placeholder-star-grey/50 focus:outline-none focus:border-star-blue transition-colors text-sm"
                      placeholder={label} />
                  </div>
                ))}
              </div>

              {/* Company */}
              <div className="grid grid-cols-2 gap-4">
                {[['company', 'Company / Studio Name'], ['website', 'Website (optional)']].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-star-grey text-sm mb-1.5">{label}</label>
                    <input name={name} value={form[name]} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-star-card border border-star-border text-white placeholder-star-grey/50 focus:outline-none focus:border-star-blue transition-colors text-sm"
                      placeholder={label} />
                  </div>
                ))}
              </div>

              {/* Location */}
              <div>
                <label className="block text-star-grey text-sm mb-1.5">Location / City *</label>
                <input required name="location" value={form.location} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-star-card border border-star-border text-white placeholder-star-grey/50 focus:outline-none focus:border-star-blue transition-colors text-sm"
                  placeholder="City, State, Country" />
              </div>

              {/* Message */}
              <div>
                <label className="block text-star-grey text-sm mb-1.5">Tell us about yourself *</label>
                <textarea required name="message" value={form.message} onChange={handleChange} rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-star-card border border-star-border text-white placeholder-star-grey/50 focus:outline-none focus:border-star-blue transition-colors text-sm resize-none"
                  placeholder="Describe your audience, reach, or partnership goals..." />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full btn-yellow justify-center py-4 text-base disabled:opacity-60"
              >
                {loading ? 'Submitting...' : <>Submit Application <ArrowRight size={18} /></>}
              </motion.button>
              <p className="text-star-grey text-xs text-center">We respond within 3–5 business days. No spam, ever.</p>
            </motion.form>
          )}
        </div>
      </section>
    </main>
  )
}

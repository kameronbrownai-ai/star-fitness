import { motion } from 'framer-motion'
import { Star, Quote, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import CompassStar from '../components/CompassStar'
import ComingSoonOverlay from '../components/ComingSoonOverlay'

// The kinds of organizations the partner program is built for. These are
// categories we serve, not claimed relationships. Named partners go here only
// once an agreement is signed.
const partners = [
  { name: 'Training Facilities', initials: 'TF', color: '#007AFF', type: 'Partner Program' },
  { name: 'Sports Academies', initials: 'SA', color: '#FF375F', type: 'Partner Program' },
  { name: 'Golf Simulators', initials: 'GS', color: '#30D158', type: 'Partner Program' },
  { name: 'Wellness Studios', initials: 'WS', color: '#BF5AF2', type: 'Partner Program' },
  { name: 'School Athletics', initials: 'SC', color: '#FFD700', type: 'Partner Program' },
  { name: 'Personal Trainers', initials: 'PT', color: '#FF9F0A', type: 'Partner Program' },
  { name: 'Rehab Clinics', initials: 'RC', color: '#64D2FF', type: 'Partner Program' },
  { name: 'Team Programs', initials: 'TP', color: '#FF6B9D', type: 'Partner Program' },
]

const communityStats = [
  { value: '8', label: 'Calibrated Angles', color: '#007AFF' },
  { value: '10', label: 'Sports Covered', color: '#30D158' },
  { value: '2', label: 'Mat Editions', color: '#FFD700' },
  { value: 'AI', label: 'Coach Included', color: '#BF5AF2' },
]

export default function Community() {
  return (
    <main className="pt-24 pb-20">
      <ComingSoonOverlay
        title="The Community Is Coming"
        message="We're building a space for Star Mat athletes to share progress, wins, and results. Launching soon."
      />
      {/* Header */}
      <section className="section-padding py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50vw] h-[30vw] rounded-full bg-star-blue/6 blur-[100px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl"
        >
          <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-3">Community & Partners</p>
          <h1 className="text-5xl md:text-6xl font-black mb-5">
            The Stars Who <span className="text-gradient-blue">Train With Us.</span>
          </h1>
          <p className="text-star-grey text-lg leading-relaxed">
            One standard of precision, ten sports, and a training system built for athletes at every level.
          </p>
        </motion.div>
      </section>

      {/* Community Stats */}
      <div className="section-padding mb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {communityStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center border border-star-border"
            >
              <p className="text-3xl font-black mb-1 flex items-center justify-center gap-1" style={{ color: stat.color }}>
                {stat.value}
                {stat.starIcon && <CompassStar size={22} color={stat.color} />}
              </p>
              <p className="text-star-grey text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <section className="section-padding mb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-star-grey text-sm tracking-widest uppercase mb-3">Member Reviews</p>
            <h2 className="text-4xl font-black">Be Among the First.</h2>
          </motion.div>

          {/* Reviews are published here only once verified members submit them.
              Nothing is placed in this section that did not come from a real customer. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55 }}
            className="glass rounded-2xl border border-star-border p-8 md:p-12 max-w-3xl"
          >
            <Quote size={26} className="text-star-blue opacity-60 mb-5" />
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Star Mat reviews will be published here as soon as real members start sending them in.
            </p>
            <p className="text-star-grey text-sm leading-relaxed mb-7 max-w-xl">
              We would rather show you nothing than show you something we made up. Every review on this
              page will come from a verified customer, with their own words and their own name.
            </p>
            <a
              href="mailto:Info@starmatapp.com?subject=My%20Star%20Mat%20Review"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-star-blue text-white font-bold text-sm"
            >
              Share your experience
            </a>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="section-padding pt-16 border-t border-star-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-star-grey text-sm tracking-widest uppercase mb-3">Built For</p>
            <h2 className="text-4xl font-black mb-4">Our Partners</h2>
            <p className="text-star-grey text-lg max-w-xl mx-auto">
              From home training to high-level programs, the Star Mat brings a measured, coordinate-based approach to every session.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.04, y: -3 }}
                className="glass rounded-2xl p-5 text-center border border-star-border cursor-pointer transition-all"
              >
                <div
                  className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-lg font-black text-white mb-3"
                  style={{ backgroundColor: `${partner.color}20`, border: `1px solid ${partner.color}40` }}
                >
                  <span style={{ color: partner.color }}>{partner.initials}</span>
                </div>
                <p className="text-white font-semibold text-sm mb-1">{partner.name}</p>
                <p className="text-star-grey text-xs">{partner.type}</p>
              </motion.div>
            ))}
          </div>

          {/* Partner CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="glass rounded-3xl p-12 border border-star-yellow/20 max-w-3xl mx-auto">
              <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-3">Partner Program</p>
              <h3 className="text-3xl font-black mb-4">Bring Star Fitness to Your Studio</h3>
              <p className="text-star-grey mb-8">
                Wholesale pricing, cobranding opportunities, and exclusive partner resources for studios, gyms,
                and training facilities worldwide.
              </p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/about" className="btn-yellow">
                  Become a Partner
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

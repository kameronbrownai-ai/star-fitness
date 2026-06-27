import { motion } from 'framer-motion'
import { Star, Quote, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import CompassStar from '../components/CompassStar'

const testimonials = [
  {
    id: 1,
    name: 'Jessica M.',
    role: 'Yoga Instructor',
    location: 'New York, NY',
    initials: 'JM',
    color: '#007AFF',
    rating: 5,
    text: "\"The Star Mat is the single best investment I've made in my fitness journey. I've gone through 6 mats from other brands. This is the last mat I'll ever buy. The grip is unreal and the cushion is perfect for my knees.\"",
  },
  {
    id: 2,
    name: 'David K.',
    role: 'CrossFit Athlete',
    location: 'Austin, TX',
    initials: 'DK',
    color: '#FF375F',
    rating: 5,
    text: '"I do box jumps, burpees, and HIIT on this mat every morning. It has never slipped once. The surface texture is incredible, it actually gets more grip when wet. 100% worth every dollar."',
  },
  {
    id: 3,
    name: 'Priya S.',
    role: 'Physical Therapist',
    location: 'Los Angeles, CA',
    initials: 'PS',
    color: '#BF5AF2',
    rating: 5,
    text: '"I recommend the Star Mat to all my patients doing at-home rehab. The 8mm cushion protects joints without sacrificing stability. It\'s the only mat I trust for therapeutic use."',
  },
  {
    id: 4,
    name: 'Marcus T.',
    role: 'Personal Trainer',
    location: 'Chicago, IL',
    initials: 'MT',
    color: '#30D158',
    rating: 5,
    text: '"My clients ask about the Star Mat every single session. I\'ve now outfitted my entire studio with them. The build quality is unmatched and Star Fitness support is genuinely world-class."',
  },
  {
    id: 5,
    name: 'Sarah L.',
    role: 'Marathon Runner',
    location: 'Seattle, WA',
    initials: 'SL',
    color: '#FFD700',
    rating: 5,
    text: '"I use the Star Mat for recovery stretching and strength work between long runs. The surface is easy to clean and it rolls up tight for easy travel. Takes up zero space in my bag."',
  },
  {
    id: 6,
    name: 'James O.',
    role: 'Pilates Instructor',
    location: 'Miami, FL',
    initials: 'JO',
    color: '#FF9F0A',
    rating: 5,
    text: '"Pilates demands precision. The Star Mat delivers it. Every pose is stable, every transition is controlled. My students perform better on this mat, and they notice it immediately."',
  },
]

const partners = [
  { name: 'FitLife Studios', initials: 'FL', color: '#007AFF', type: 'Studio Partner' },
  { name: 'Apex Athletics', initials: 'AA', color: '#FF375F', type: 'Official Sponsor' },
  { name: 'ZenMovement Co.', initials: 'ZM', color: '#BF5AF2', type: 'Wellness Partner' },
  { name: 'CoreX Academy', initials: 'CX', color: '#30D158', type: 'Training Partner' },
  { name: 'PeakPerform Pro', initials: 'PP', color: '#FFD700', type: 'Studio Partner' },
  { name: 'Equilibrium Gym', initials: 'EG', color: '#FF9F0A', type: 'Wellness Partner' },
  { name: 'LiftLab NYC', initials: 'LL', color: '#64D2FF', type: 'Official Sponsor' },
  { name: 'Studio Flow', initials: 'SF', color: '#FF6B9D', type: 'Studio Partner' },
]

const communityStats = [
  { value: '250K+', label: 'Active Members', color: '#007AFF' },
  { value: '98%', label: 'Would Recommend', color: '#30D158' },
  { value: '4.9', label: 'Average Rating', color: '#FFD700', starIcon: true },
  { value: '42', label: 'Countries', color: '#BF5AF2' },
]

export default function Community() {
  return (
    <main className="pt-24 pb-20">
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
            250,000 members. 42 countries. One standard. Real athletes, real results, no filters.
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
            <p className="text-star-grey text-sm tracking-widest uppercase mb-3">Real Reviews</p>
            <h2 className="text-4xl font-black">What Our Members Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card-hover"
              >
                <div className="glass rounded-2xl p-7 border border-star-border h-full flex flex-col">
                  {/* Quote icon */}
                  <div className="mb-4">
                    <Quote size={24} className="text-star-blue opacity-60" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} size={14} fill="#FFD700" className="text-star-yellow" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-white text-sm leading-relaxed flex-1 mb-6">{t.text}</p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-star-grey text-xs">{t.role} · {t.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
            <p className="text-star-grey text-sm tracking-widest uppercase mb-3">Trusted By</p>
            <h2 className="text-4xl font-black mb-4">Our Partners</h2>
            <p className="text-star-grey text-lg max-w-xl mx-auto">
              From boutique studios to elite training facilities, the Star Mat is the professional standard.
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

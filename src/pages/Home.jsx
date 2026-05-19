import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Star, Zap, Shield, Award } from 'lucide-react'

const StarShape = ({ size = 60, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" fill="none" className={className}>
    <polygon points="25,3 31,18 47,18 35,29 39,45 25,37 11,45 15,29 3,18 19,18" fill="currentColor" />
  </svg>
)

const stats = [
  { value: '250K+', label: 'Active Members' },
  { value: '1,200+', label: 'Live Classes' },
  { value: '42', label: 'Countries' },
  { value: '4.9★', label: 'Average Rating' },
]

const features = [
  {
    icon: Zap,
    title: 'Non-Slip Precision',
    desc: 'Engineered micro-suede surface grips the floor so you can push harder without hesitation.',
  },
  {
    icon: Shield,
    title: 'Joint Protection',
    desc: '8mm high-density foam absorbs impact and cushions every rep, stretch, and landing.',
  },
  {
    icon: Award,
    title: 'Built to Perform',
    desc: 'Pro-grade materials tested through 10,000+ hours of training in elite fitness facilities.',
  },
]

const teasers = [
  {
    label: 'Shop',
    to: '/shop',
    title: 'The Star Mat',
    sub: 'Pro & Lite editions',
    color: 'from-blue-900/40 to-star-black',
    accent: '#007AFF',
    icon: '🛒',
  },
  {
    label: 'Lessons',
    to: '/lessons',
    title: '1,200+ Classes',
    sub: 'All levels. All styles.',
    color: 'from-yellow-900/30 to-star-black',
    accent: '#FFD700',
    icon: '▶',
  },
  {
    label: 'Community',
    to: '/community',
    title: '250K Members',
    sub: 'Real people, real results.',
    color: 'from-purple-900/30 to-star-black',
    accent: '#BF5AF2',
    icon: '★',
  },
  {
    label: 'About',
    to: '/about',
    title: 'Our Mission',
    sub: 'Why the Star Mat exists.',
    color: 'from-green-900/20 to-star-black',
    accent: '#30D158',
    icon: '◆',
  },
]

export default function Home() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-star-black">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.38) saturate(0.85)' }}
        >
          <source
            src="https://videos.pexels.com/video-files/12188774/12188774-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Colour-grade overlays — deep black vignette + brand tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-star-black via-star-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-star-black/60 via-transparent to-star-black/30" />
        <div className="absolute inset-0 bg-star-blue/10 mix-blend-color" />

        {/* Subtle grid on top of video */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating star decorations */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
          className="absolute top-20 right-[10%] text-star-yellow/20"
        >
          <StarShape size={120} />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
          className="absolute bottom-32 left-[8%] text-star-blue/20"
        >
          <StarShape size={80} />
        </motion.div>
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
          className="absolute top-1/2 right-[5%] text-star-yellow/10 hidden lg:block"
        >
          <StarShape size={200} />
        </motion.div>

        {/* Hero Content */}
        <div className="section-padding relative z-10 text-center max-w-5xl mx-auto pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium text-star-yellow mb-8"
          >
            <StarShape size={14} className="text-star-yellow" />
            Introducing the Star Mat Pro 2.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-none mb-6"
          >
            <span className="text-white">TRAIN</span>
            <br />
            <span className="text-gradient-yellow">WITHOUT</span>
            <br />
            <span className="text-white">LIMITS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-star-grey text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The Star Mat is engineered for athletes who refuse to compromise. Premium grip,
            unmatched cushion, and a design built around your performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/shop" className="btn-primary text-base glow-blue">
                Shop the Star Mat
                <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/lessons" className="btn-secondary text-base flex items-center gap-3">
                <span className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                  <Play size={12} fill="white" />
                </span>
                Watch Classes
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-star-grey text-xs tracking-widest uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-12 bg-gradient-to-b from-star-grey to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-star-border bg-star-card/50">
        <div className="section-padding py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-star-grey text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STAR MAT FEATURE ── */}
      <section className="section-padding py-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="max-w-lg mx-auto relative">
                {/* Glow */}
                <div className="absolute inset-0 rounded-3xl bg-star-blue/15 blur-3xl scale-95 pointer-events-none" />
                {/* Real product photo */}
                <div className="relative rounded-3xl overflow-hidden border border-star-border shadow-2xl">
                  <img
                    src="/images/mat-product.jpeg"
                    alt="Star Mat Pro in gym"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle brand overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-star-black/80 to-transparent p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white font-black text-xl tracking-tight">STAR MAT PRO</p>
                        <p className="text-star-grey text-sm">The original. The standard.</p>
                      </div>
                      <div className="flex gap-4 text-center">
                        {[['360°', 'Coverage'], ['STAR', 'Branded']].map(([val, lbl]) => (
                          <div key={lbl}>
                            <p className="text-star-yellow font-bold text-sm">{val}</p>
                            <p className="text-star-grey text-xs">{lbl}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating price badge */}
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -right-4 glass rounded-2xl p-4 border border-star-yellow/20"
                >
                  <p className="text-star-yellow font-black text-2xl">$149</p>
                  <p className="text-star-grey text-xs">Free Shipping</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-star-blue text-sm font-semibold tracking-widest uppercase mb-4">The Star Mat</p>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                The Mat That Changes
                <span className="text-gradient-yellow block">Everything.</span>
              </h2>
              <p className="text-star-grey text-lg leading-relaxed mb-10">
                We obsessed over every millimeter so you don't have to think about your equipment —
                only your performance. The Star Mat is the result of three years of engineering,
                athlete feedback, and relentless refinement.
              </p>

              <div className="space-y-6 mb-10">
                {features.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-star-blue/10 border border-star-blue/20 flex items-center justify-center flex-shrink-0">
                      <f.icon size={18} className="text-star-blue" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">{f.title}</p>
                      <p className="text-star-grey text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/shop" className="btn-yellow">
                  Get Your Star Mat
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TEASER GRID ── */}
      <section className="section-padding py-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-star-grey text-sm tracking-widest uppercase mb-3">Explore</p>
            <h2 className="text-4xl font-black">The Star Ecosystem</h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {teasers.map((t, i) => (
              <motion.div
                key={t.to}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link to={t.to} className="block group">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className={`relative overflow-hidden rounded-2xl border border-star-border bg-gradient-to-b ${t.color} p-6 md:p-8 h-52 md:h-64 flex flex-col justify-between`}
                  >
                    <div>
                      <span className="text-3xl md:text-4xl" style={{ color: t.accent }}>{t.icon}</span>
                      <p className="text-star-grey text-xs font-semibold tracking-widest uppercase mt-3">{t.label}</p>
                    </div>
                    <div>
                      <p className="text-white font-black text-xl md:text-2xl leading-tight">{t.title}</p>
                      <p className="text-star-grey text-sm mt-1">{t.sub}</p>
                    </div>
                    <motion.div
                      className="absolute bottom-5 right-5 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${t.accent}20`, border: `1px solid ${t.accent}40` }}
                      animate={{ x: 0 }}
                      whileHover={{ x: 4 }}
                    >
                      <ArrowRight size={14} style={{ color: t.accent }} />
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK TESTIMONIAL ── */}
      <section className="section-padding py-20 border-t border-star-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#FFD700" className="text-star-yellow" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-8">
              "The Star Mat is the single best investment I've made in my fitness journey.
              I've gone through 6 mats from other brands. This is the last mat I'll ever buy."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-star-blue flex items-center justify-center font-bold text-sm">
                JM
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Jessica M.</p>
                <p className="text-star-grey text-xs">Yoga Instructor, New York</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-10">
              <Link to="/community" className="btn-secondary">
                Read More Reviews
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

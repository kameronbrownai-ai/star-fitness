import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, Star, Zap, Shield, Award, ChevronDown, Camera, Video, UserCircle } from 'lucide-react'
import CompassStar from '../components/CompassStar'
import AIWorkoutChat from '../components/AIWorkoutChat'

const EASE = [0.25, 0.1, 0.25, 1]

const MODE = {
  general: {
    badge: 'Multi-Sport Performance System',
    lines: ['TRAIN', 'WITHOUT', 'LIMITS.'],
    accent: ['text-white', 'text-gradient-yellow', 'text-white'],
    sub: 'There is no other workout that will improve your balance, core, speed, strength, and endurance faster or better than training in all planes of motion. The Star Mat is your direction.',
    cta: 'Shop the Star Mat',
    ctaTo: '/shop',
    tint: 'rgba(0,122,255,0.07)',
    color: '#007AFF',
    label: 'General Performance',
    video: '/videos/star-mat-fv1.mp4',
  },
  golf: {
    badge: 'Ground Force Golf Training System',
    lines: ['OWN YOUR', 'ROTATION.', ''],
    accent: ['text-white', 'text-gradient-green', ''],
    sub: 'Built for simulator owners and serious course players who understand ground force physics. Calibrate hip rotation, perfect weight transfer, and add distance through geometry — not guesswork.',
    cta: 'Shop Golf Edition',
    ctaTo: '/shop',
    tint: 'rgba(48,209,88,0.07)',
    color: '#30D158',
    label: '⛳ Golf Training',
    video: '/videos/golf-drive-ball-flight.mp4',
  },
}

const CREDIBILITY = [
  'D1 Athletic Programs', 'NFL Performance Training', 'Physical Therapy Clinics',
  'PGA-Certified Golf Academies', 'Senior Wellness Centers', 'NBA Conditioning Programs',
  'Sports Rehab Facilities', 'Elite High School Programs', 'Combat Sports Gyms',
  'Orthopedic Recovery Centers',
]

const features = [
  { icon: Zap,    title: 'Non-Slip Precision',   desc: 'Engineered micro-suede surface grips the floor so you can push harder without hesitation.' },
  { icon: Shield, title: 'Joint Protection',      desc: '8mm high-density foam absorbs impact and cushions every rep, stretch, and landing.' },
  { icon: Award,  title: 'Built to Perform',      desc: 'Pro-grade materials tested through thousands of hours of training in elite fitness facilities.' },
]

const teasers = [
  { label: 'Shop',      to: '/shop',      title: 'The Star Mat',   sub: 'Pro & Lite editions',     color: 'from-blue-900/40 to-star-black',   accent: '#007AFF', icon: '🛒' },
  { label: 'Lessons',   to: '/lessons',   title: 'Mastery Tracks', sub: 'Goal-specific programs',  color: 'from-yellow-900/30 to-star-black',  accent: '#FFD700', icon: '▶' },
  { label: 'Community', to: '/community', title: '250K Members',   sub: 'Real people, real results.', color: 'from-purple-900/30 to-star-black', accent: '#BF5AF2', icon: 'compass' },
  { label: 'About',     to: '/about',     title: 'Our Mission',    sub: 'Why the Star Mat exists.', color: 'from-green-900/20 to-star-black',  accent: '#30D158', icon: '◆' },
]

// Compass SVG for DIY section
function MatDiagram() {
  const cx = 120, cy = 120, r = 90
  const angles = [0, 45, 90, 135, 180, 225, 270, 315]
  const labels = ['360°', '45°', '90°', '135°', '180°', '225°', '270°', '315°']
  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[260px] mx-auto opacity-90">
      {/* outer ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      {/* spokes */}
      {angles.map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180
        const x1 = cx + r * 0.55 * Math.cos(rad), y1 = cy + r * 0.55 * Math.sin(rad)
        const x2 = cx + r * Math.cos(rad),          y2 = cy + r * Math.sin(rad)
        const lx = cx + (r + 14) * Math.cos(rad),   ly = cy + (r + 14) * Math.sin(rad)
        const isPrimary = deg % 90 === 0
        return (
          <g key={deg}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isPrimary ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.22)'}
              strokeWidth={isPrimary ? 1.5 : 0.8} />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">
              {labels[i]}
            </text>
          </g>
        )
      })}
      {/* center dot */}
      <circle cx={cx} cy={cy} r={4} fill="rgba(255,215,0,0.8)" />
      <text x={cx} y={cy + 18} textAnchor="middle" fill="rgba(255,215,0,0.55)" fontSize="6.5" fontFamily="monospace" letterSpacing="1">LOAD DECIDE</text>
    </svg>
  )
}

export default function Home() {
  const [mode, setMode] = useState('general')
  const m = MODE[mode]

  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-star-dark">
        {/* Mode-specific hero video */}
        <AnimatePresence>
          <motion.video
            key={m.video}
            autoPlay muted loop playsInline
            src={m.video}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.28) saturate(0.7)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        </AnimatePresence>

        {/* Mode-tinted overlay — animates on toggle */}
        <motion.div
          key={mode}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ background: `radial-gradient(ellipse 70% 50% at 50% 60%, ${m.tint}, transparent)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-star-dark via-star-dark/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-star-dark/60 via-transparent to-star-dark/40" />

        {/* Thin mat-line grid */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        {/* Content */}
        <div className="section-padding relative z-10 text-center max-w-5xl mx-auto pt-32 pb-24">

          {/* Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex justify-center mb-10"
          >
            <div className="flex items-center p-1 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md">
              {Object.entries(MODE).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    mode === key
                      ? key === 'golf'
                        ? 'bg-star-green text-black shadow-lg'
                        : 'bg-white text-black shadow-lg'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${mode}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] text-sm font-medium mb-8"
              style={{ color: m.color }}
            >
              <CompassStar size={14} color={m.color} />
              {m.badge}
            </motion.div>
          </AnimatePresence>

          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`headline-${mode}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-none mb-8"
            >
              {m.lines.map((line, i) => line ? (
                <span key={i} className={`${m.accent[i]} block`}>{line}</span>
              ) : null)}
            </motion.h1>
          </AnimatePresence>

          {/* Sub */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${mode}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
              className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              {m.sub}
            </motion.p>
          </AnimatePresence>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to={m.ctaTo}
                className="btn-primary text-base glow-blue flex items-center gap-2"
                style={mode === 'golf' ? { backgroundColor: '#30D158', boxShadow: '0 8px 32px rgba(48,209,88,0.35)' } : {}}
              >
                {m.cta} <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/lessons" className="btn-secondary text-base flex items-center gap-3">
                <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                  <Play size={12} fill="white" />
                </span>
                Watch Classes
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-white/25 text-xs tracking-widest uppercase">Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── CREDIBILITY TICKER ── */}
      <section className="border-y border-white/[0.06] bg-star-dark py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...CREDIBILITY, ...CREDIBILITY].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 mx-8 text-white/30 text-xs font-semibold tracking-[0.15em] uppercase">
              {item}
              <span className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
            </span>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-b border-white/[0.06] bg-star-black">
        <div className="section-padding py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '250K+', label: 'Active Members' },
              { value: '42',    label: 'Countries' },
              { value: '8',     label: 'Sport Tracks' },
              { value: '4.9',   label: 'Average Rating', star: true },
            ].map((stat, i) => (
              <motion.div key={stat.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-black text-white mb-1 flex items-center justify-center gap-1">
                  {stat.value}
                  {stat.star && <CompassStar size={22} color="#FFD700" />}
                </p>
                <p className="text-white/40 text-xs tracking-widest uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STAR MAT FEATURE ── */}
      <section className="section-padding py-28 overflow-x-clip bg-star-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8 }} className="relative">
              <div className="relative w-full">
                <div className="absolute inset-0 rounded-3xl bg-star-blue/10 blur-3xl scale-95 pointer-events-none" />
                <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl" style={{ height: '600px' }}>
                  <img src="/images/commercial/unrolling-mat.jpeg" alt="Athlete unrolling Star Mat"
                    className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white font-black text-xl tracking-tight">STAR MAT PRO</p>
                        <p className="text-white/40 text-sm">The original. The standard.</p>
                      </div>
                      <div className="flex gap-4 text-center">
                        {[['360°', 'Coverage'], ['8mm', 'Cushion']].map(([val, lbl]) => (
                          <div key={lbl}>
                            <p className="text-star-yellow font-bold text-sm">{val}</p>
                            <p className="text-white/40 text-xs">{lbl}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -right-4 rounded-2xl p-4 border border-star-yellow/20 bg-star-card/80 backdrop-blur">
                  <p className="text-star-yellow font-black text-2xl">$199</p>
                  <p className="text-white/40 text-xs">Free Shipping</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay: 0.1 }}>
              <p className="text-star-blue text-xs font-bold tracking-[0.2em] uppercase mb-5">The Star Mat</p>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                The Mat That Changes<span className="text-gradient-yellow block">Everything.</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-4">
                You don't need big bulky equipment or expensive trainers. We just need to know what direction to go in, and the Star Mat gives you exactly that.
              </p>
              <p className="text-white/50 text-lg leading-relaxed mb-10">
                Train in all planes of motion and become a king in your sport. The Star Mat is the only tool built to help you dominate from every angle.
              </p>

              <div className="space-y-5 mb-10">
                {features.map((f, i) => (
                  <motion.div key={f.title}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                    className="flex gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-star-blue/10 border border-star-blue/20 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-star-blue/20">
                      <f.icon size={18} className="text-star-blue" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">{f.title}</p>
                      <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/shop" className="btn-yellow">Get Your Star Mat <ArrowRight size={18} /></Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VIDEO REEL ── */}
      <section className="py-20 bg-star-dark border-b border-white/[0.06] overflow-hidden">
        <div className="section-padding max-w-7xl mx-auto mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-white/30 text-xs tracking-widest uppercase mb-3">In Action</p>
            <h2 className="text-4xl font-black">The Mat. The Movement.</h2>
          </motion.div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 px-6 md:px-12 lg:px-20 xl:px-32 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none' }}>
          {[
            { src: '/videos/star-mat-lateral-skaters.mov', label: 'Lateral Skaters' },
            { src: '/videos/star-mat-training-drill.mov',  label: 'Training Drill' },
            { src: '/videos/star-mat-split-lunge.mov',     label: 'Split Lunge' },
            { src: '/videos/star-mat-apex-foot-fire.mov',  label: 'Foot Fire' },
            { src: '/videos/star-mat-fast-feet.mov',       label: 'Fast Feet' },
            { src: '/videos/star-mat-alternating-lunge-row.mov', label: 'Lunge Row' },
          ].map((clip, i) => (
            <motion.div key={clip.src}
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex-shrink-0 snap-start relative rounded-2xl overflow-hidden border border-white/[0.08] group"
              style={{ width: '280px', height: '380px' }}>
              <video autoPlay muted loop playsInline src={clip.src}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: 'brightness(0.65)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-sm">{clip.label}</p>
                <p className="text-white/40 text-xs">Star Mat</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── DIY RESISTANCE CALLOUT ── */}
      <section className="section-padding py-24 border-y border-white/[0.06] bg-star-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full bg-star-yellow/[0.03] blur-[120px]" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.75 }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-star-yellow/60" />
                <p className="text-star-yellow text-xs font-bold tracking-[0.2em] uppercase">vs. Masking Tape</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                Proprietary Assessment<br />Geometry.{' '}
                <span className="text-white/30">Not Loose Tape.</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-6">
                Masking tape is a dead marker. The Star Fitness matrix delivers laser-calibrated spatial boundaries that coordinate directly with your digital coaching software.
              </p>
              <p className="text-white/50 leading-relaxed mb-10">
                By utilizing built-in geometric targets, you turn abstract coaching cues into absolute math — locking in flawless muscle memory and preventing joint alignment errors that cheap substitutes simply cannot address.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['8 Calibrated Angles', '45° through 360°'],
                  ['Standardized Geometry', 'Repeatable every session'],
                  ['Digital Integration', 'Coords with AI Coach'],
                  ['Muscle Memory Lock', 'Math, not guesswork'],
                ].map(([title, sub]) => (
                  <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-white font-semibold text-sm mb-1">{title}</p>
                    <p className="text-white/35 text-xs">{sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.75, delay: 0.1 }}
              className="flex flex-col items-center">
              <div className="relative w-full max-w-[320px] mx-auto">
                <div className="absolute inset-0 rounded-full bg-star-yellow/[0.06] blur-3xl scale-75" />
                <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8">
                  <MatDiagram />
                  <p className="text-center text-white/25 text-xs tracking-widest uppercase mt-4">Star Mat Geometry</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BRAND STATEMENT ── */}
      <section className="section-padding py-24 bg-star-black border-b border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] rounded-full bg-star-yellow/[0.04] blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <img src="/images/logo.jpeg" alt="" className="w-10 h-10 object-contain mx-auto mb-8 opacity-50" style={{ mixBlendMode: 'screen' }} />
            <p className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
              The most important move
              <span className="text-gradient-yellow block">you can make</span>
              is the next move.
            </p>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-10">
              <Link to="/shop" className="btn-yellow text-base">Make Your Move <ArrowRight size={18} /></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── TEASER GRID ── */}
      <section className="section-padding py-12 pb-24 bg-star-black">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Explore</p>
            <h2 className="text-4xl font-black">The Star Ecosystem</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {teasers.map((t, i) => (
              <motion.div key={t.to}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                <Link to={t.to} className="block group">
                  <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ duration: 0.25 }}
                    className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b ${t.color} p-6 md:p-8 h-52 md:h-64 flex flex-col justify-between`}>
                    <div>
                      {t.icon === 'compass'
                        ? <CompassStar size={36} color={t.accent} />
                        : <span className="text-3xl md:text-4xl" style={{ color: t.accent }}>{t.icon}</span>}
                      <p className="text-white/30 text-xs font-semibold tracking-widest uppercase mt-3">{t.label}</p>
                    </div>
                    <div>
                      <p className="text-white font-black text-xl md:text-2xl leading-tight">{t.title}</p>
                      <p className="text-white/40 text-sm mt-1">{t.sub}</p>
                    </div>
                    <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${t.accent}18`, border: `1px solid ${t.accent}35` }}>
                      <ArrowRight size={14} style={{ color: t.accent }} />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO'S USING ── */}
      <section className="section-padding py-24 border-t border-white/[0.06] bg-star-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Athletes</p>
            <h2 className="text-4xl font-black">Who's Using The Star Mat</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { sport: 'Football', role: 'Speed & Explosiveness', desc: 'Lateral cuts, first-step quickness, and direction changes that transfer directly from the mat to the field.', accent: '#007AFF', emoji: '🏈', video: '/videos/star-mat-lateral-skaters.mov' },
              { sport: 'Basketball', role: 'Court Footwork & Agility', desc: 'Multi-directional speed, defensive slides, and lateral quickness built for every possession.', accent: '#FF9500', emoji: '🏀', video: '/videos/star-mat-fast-feet.mov' },
              { sport: 'Golf', role: 'Rotation & Balance', desc: 'Hip rotation drills, balance at address, and rotational power training to add yards and control to every shot.', accent: '#30D158', emoji: '⛳', video: '/videos/golf-drive-ball-flight.mp4' },
              { sport: 'MMA & Combat', role: 'Stance & Conditioning', desc: 'Footwork patterns, explosive pivots, and full-body conditioning built for the demands of the ring.', accent: '#FF375F', emoji: '🥊', video: '/videos/star-mat-apex-foot-fire.mov' },
            ].map((card, i) => (
              <motion.div key={card.sport}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55 }}
                className="rounded-2xl border border-white/[0.06] overflow-hidden relative group cursor-pointer hover:border-white/[0.15] transition-colors"
                style={{ minHeight: '280px' }}>
                {/* Video background */}
                <video autoPlay muted loop playsInline src={card.video}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: 'brightness(0.25) saturate(0.6)' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                  style={{ background: `linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.3), ${card.accent}08)` }} />
                {/* Content */}
                <div className="relative z-10 p-6 flex flex-col gap-3 h-full" style={{ minHeight: '280px' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: `${card.accent}20`, border: `1px solid ${card.accent}35` }}>
                    {card.emoji}
                  </div>
                  <div className="mt-auto">
                    <p className="text-white font-black text-lg leading-tight">{card.sport}</p>
                    <p className="text-xs font-bold uppercase tracking-wider mt-0.5 mb-2" style={{ color: card.accent }}>{card.role}</p>
                    <p className="text-white/50 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="section-padding py-20 border-t border-white/[0.06] bg-star-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#FFD700" className="text-star-yellow" />)}
            </div>
            <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-8">
              "The Star Mat is the single best investment I've made in my fitness journey.
              I've gone through 6 mats from other brands. This is the last mat I'll ever buy."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-star-blue flex items-center justify-center font-bold text-sm">JM</div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Jessica M.</p>
                <p className="text-white/40 text-xs">Yoga Instructor, New York</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-10">
              <Link to="/community" className="btn-secondary">Read More Reviews <ArrowRight size={16} /></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── AI COACH ── */}
      <section className="section-padding py-24 border-t border-white/[0.06] bg-star-dark relative overflow-x-clip">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] rounded-full bg-star-blue/[0.05] blur-[100px]" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div className="min-w-0" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-star-blue/25 bg-star-blue/8 mb-6">
                <CompassStar size={14} color="#007AFF" />
                <span className="text-star-blue text-xs font-semibold tracking-wider uppercase">AI-Powered Training</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-5">
                Get Your Custom<span className="text-gradient-blue block">Star Mat Workout</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-6">
                Tell our AI Coach your sport, your goal, or a problem area and it will build a workout designed specifically for the Star Mat in under 30 seconds.
              </p>
              <ul className="space-y-3 mb-8">
                {['Sport-specific training for 8 sports', 'Injury-safe modifications included', 'Built around all planes of motion', 'Sets, reps, and compass directions included'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/50">
                    <span className="w-5 h-5 rounded-full bg-star-blue/15 border border-star-blue/30 flex items-center justify-center flex-shrink-0">
                      <CompassStar size={10} color="#007AFF" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <ChatIconsKey />
            </motion.div>
            <motion.div className="min-w-0" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
              <AIWorkoutChat inline />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FAQSection />

      {/* Floating chat widget */}
      <AIWorkoutChat />
    </main>
  )
}

// ── Chat icon key (interactive) ───────────────────────────────────────────────
const CHAT_ICONS = [
  {
    icon: <UserCircle size={16} />, label: 'Set up my profile', desc: 'Personalize your coaching',
    detail: 'Answer a few quick questions about your sport, position, fitness level, and training goals. Your AI Coach uses this profile to build workouts tailored specifically to you. Tap "Set up profile" in the top-right corner of the chat at any time to update it.',
    iconClass: 'text-star-blue', bgClass: 'bg-star-blue/10 border-star-blue/20',
  },
  {
    icon: <Camera size={16} />, label: 'Photo form check', desc: 'Snap a photo for AI feedback',
    detail: 'Tap the + button in the chat input bar and choose "Photo form check." Take a photo mid-exercise and the AI Coach will analyze your body positioning, alignment, and joint angles with specific corrections — in seconds.',
    iconClass: 'text-white/50', bgClass: 'bg-white/[0.04] border-white/[0.08]',
  },
  {
    icon: <Video size={16} />, label: 'Live form check', desc: 'Real-time pose detection',
    detail: 'Tap the + button and choose "Live form check" to open your camera. The AI Coach tracks your skeleton in real time and displays your joint angles live. Tap Analyze to send a snapshot for personalized feedback.',
    iconClass: 'text-star-yellow', bgClass: 'bg-star-yellow/10 border-star-yellow/20',
  },
]

function ChatIconsKey() {
  const [activeIcon, setActiveIcon] = useState(null)
  const [hoveredIcon, setHoveredIcon] = useState(null)
  return (
    <div className="border-t border-white/[0.06] pt-5">
      <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">Chat Icons</p>
      <div className="space-y-1">
        {CHAT_ICONS.map(({ icon, label, desc, detail, iconClass, bgClass }) => {
          const isExpanded = activeIcon === label || hoveredIcon === label
          return (
            <div key={label}>
              <button
                onClick={() => setActiveIcon(a => a === label ? null : label)}
                onMouseEnter={() => setHoveredIcon(label)}
                onMouseLeave={() => setHoveredIcon(null)}
                className={`w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-all ${isExpanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
              >
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 ${iconClass} ${bgClass}`}>{icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold">{label}</p>
                  <p className="text-white/35 text-xs">{desc}</p>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
                  <ChevronDown size={13} className="text-white/20" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                    <p className="text-white/35 text-xs leading-relaxed px-3 pt-1 pb-2.5 ml-10 border-l border-white/[0.06]">{detail}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── FAQ ────────────────────────────────────────────────────────────────────────
const faqs = [
  { q: 'What is the Star Mat and how does it work?', a: 'The Star Mat is a premium directional training mat with compass-style markers at 8 angles (360°, 270°, 180°, 90°, 315°, 225°, 135°, 45°) and a center "LOAD DECIDE" badge. Athletes use these markers to train in all planes of motion — sagittal, frontal, and transverse — improving balance, core strength, speed, strength, and endurance simultaneously.' },
  { q: 'What sports is the Star Mat designed for?', a: 'The Star Mat is built for multi-sport athletes: Football, Basketball, Soccer, Baseball and Softball, Track & Field, Tennis, Golf, and MMA/Combat Sports. Each sport has specific training programs targeting the key body areas and movements that matter most for performance and injury prevention.' },
  { q: 'How does training in all planes of motion improve athletic performance?', a: 'Most traditional workouts only train in one plane (front to back). The Star Mat forces your body to move laterally, rotationally, and diagonally — the same directions your body moves in actual sports. This builds functional strength, faster reaction time, and sport-specific conditioning that translates directly to competition.' },
  { q: 'Can I use the Star Mat for injury recovery and rehabilitation?', a: 'Yes. The Star Mat includes guided recovery protocols for common sports injuries. The directional markers allow controlled, low-impact movements that rebuild stability around injured joints. Always consult a medical professional for serious injuries, but the mat is specifically designed to support safe, progressive recovery.' },
  { q: 'What is the difference between the Star Mat Pro and Star Mat Lite?', a: 'The Star Mat Pro ($199) is our flagship mat, built with premium 8mm high-density foam, two-sided print, 75"×75" surface, and a carry strap. It includes a 60-day free Pro subscription. The Star Mat Lite ($149) is a 4mm single-sided, foldable 55"×55" version ideal for travel and home use. Both feature the full Star directional training system. The AI Coach is included with a Pro subscription plan or higher.' },
  { q: 'Do I need a trainer or gym to use the Star Mat?', a: 'No. The Star Mat is designed for solo training — at home, in a hotel room, outdoors, or in a gym. The directional markers act as your built-in trainer, telling you exactly where to step, pivot, and move. Our AI Coach can generate a complete workout in seconds based on your goals.' },
]

function FAQSection() {
  const [open, setOpen] = useState(null)
  return (
    <section className="section-padding py-24 border-t border-white/[0.06] bg-star-black"
      itemScope itemType="https://schema.org/FAQPage">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14">
          <p className="text-white/30 text-xs font-semibold tracking-widest uppercase mb-3">Common Questions</p>
          <h2 className="text-4xl font-black">Everything About the Star Mat</h2>
        </motion.div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-left transition-all">
                <span className="text-white font-semibold text-sm leading-snug" itemProp="name">{faq.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
                  <ChevronDown size={18} className="text-white/25" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden"
                    itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="px-6 py-4 text-white/45 text-sm leading-relaxed border border-t-0 border-white/[0.06] rounded-b-2xl bg-white/[0.01]" itemProp="text">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

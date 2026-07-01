import { motion } from 'framer-motion'
import { ArrowRight, Target, Heart, Zap, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

const StarShape = ({ size = 60, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" fill="currentColor" className={className}>
    <polygon points="25,3 31,18 47,18 35,29 39,45 25,37 11,45 15,29 3,18 19,18" />
  </svg>
)

const fadeLeft = {
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] },
}

const fadeRight = {
  initial: { opacity: 0, x: 60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] },
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const values = [
  {
    icon: Target,
    title: 'Relentless Precision',
    desc: 'Every millimeter of the Star Mat was tested obsessively. We ran 300+ prototypes before shipping a single unit. Precision is not a feature — it is the foundation.',
    color: '#007AFF',
  },
  {
    icon: Heart,
    title: 'Built Around Athletes',
    desc: 'We don\'t guess what athletes need. We partnered with Olympic coaches, physical therapists, and everyday trainers to build a mat that serves every body.',
    color: '#FF375F',
  },
  {
    icon: Zap,
    title: 'Performance First',
    desc: 'Pretty mats that fall apart don\'t serve anyone. We chose TPE foam, micro-suede fabric, and precision-aligned seams because performance demands the best materials.',
    color: '#FFD700',
  },
  {
    icon: Globe,
    title: 'Global Community',
    desc: 'We built the Star Mat for everyone — from yoga practitioners in Bali to HIIT coaches in Chicago. 42 countries. One standard of excellence.',
    color: '#30D158',
  },
]

const timeline = [
  {
    year: '2018',
    title: 'The Frustration Begins',
    desc: 'Our founder, Marcus Lin, kept slipping on mats mid-session. Six brands, six disappointments. He decided to build the mat he\'d always wanted.',
    align: 'right',
  },
  {
    year: '2019',
    title: 'Prototype Lab',
    desc: '300+ prototypes tested with athletes across 12 cities. Every surface texture, every foam density, every seam placement was evaluated and re-evaluated.',
    align: 'left',
  },
  {
    year: '2021',
    title: 'Star Mat 1.0 Launches',
    desc: 'The first Star Mat shipped to 400 founding members. Sold out in 48 hours. Every review mentioned the same thing: finally, a mat that doesn\'t move.',
    align: 'right',
  },
  {
    year: '2023',
    title: '100K Members',
    desc: 'The Star community hit 100,000 members across 30 countries. We launched digital classes and the first certified Star Training Program.',
    align: 'left',
  },
  {
    year: '2025',
    title: 'Star Mat Pro 2.0',
    desc: 'The most refined mat ever made. Upgraded surface, improved eco-foam, and the same obsessive precision — now backed by 250,000 members.',
    align: 'right',
  },
]

export default function About() {
  return (
    <main className="pt-24 pb-20 overflow-hidden">
      {/* ── HERO SPLIT ── */}
      <section className="section-padding py-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div {...fadeLeft}>
            <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-5">Our Story</p>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight mb-8">
              We Built the Mat
              <span className="text-gradient-blue block">We Wished</span>
              Existed.
            </h1>
            <p className="text-star-grey text-lg leading-relaxed mb-6">
              There is no other training program out there to help you prepare and dominate in your sport — until now. Star Fitness was built for athletes who know that every step they take is an impact of improvement.
            </p>
            <p className="text-star-grey text-lg leading-relaxed mb-10">
              You don't need big bulky equipment or expensive trainers. You just need to know what direction to go in. Train in all planes of motion and become a king in your sport.
            </p>
            <div className="flex gap-4 flex-wrap">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/shop" className="btn-primary">
                  Shop the Star Mat
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/community" className="btn-secondary">
                  Meet the Community
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div {...fadeRight} className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-star-blue/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 rounded-full border border-dashed border-star-yellow/15"
              />

              {/* Center card */}
              <div className="absolute inset-16 glass rounded-3xl border border-star-border flex flex-col items-center justify-center gap-6 p-8 text-center">
                <motion.div
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <StarShape size={80} className="text-star-yellow" />
                </motion.div>
                <div>
                  <p className="text-white font-black text-2xl tracking-tight">STAR FITNESS</p>
                  <p className="text-star-grey text-sm">Est. 2018</p>
                </div>
              </div>

              {/* Floating stat cards */}
              <motion.div
                {...fadeUp(0.3)}
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 glass rounded-2xl p-4 border border-star-blue/20"
              >
                <p className="text-star-blue font-black text-2xl">250K</p>
                <p className="text-star-grey text-xs">Members</p>
              </motion.div>

              <motion.div
                {...fadeUp(0.5)}
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 border border-star-yellow/20"
              >
                <p className="text-star-yellow font-black text-2xl">300+</p>
                <p className="text-star-grey text-xs">Prototypes</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MISSION STATEMENT ── */}
      <section className="section-padding py-24 bg-star-card/30 border-y border-star-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <p className="text-star-blue text-sm font-semibold tracking-widest uppercase mb-5">Our Mission</p>
            <blockquote className="text-3xl md:text-4xl font-black leading-snug text-white mb-6">
              "There is no other workout that will improve your balance, core, speed, strength, and endurance — faster or better — than training in all planes of motion."
            </blockquote>
            <p className="text-star-yellow font-bold text-lg mt-4">Become a king in your sport.</p>
            <p className="text-star-grey text-lg mt-2">— The Star Fitness Mission</p>
          </motion.div>
        </div>
      </section>

      {/* ── THE MAT PHILOSOPHY ── */}
      <section className="section-padding py-28">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div {...fadeUp()} className="text-center mb-20">
            <p className="text-star-grey text-sm tracking-widest uppercase mb-3">Philosophy</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              The Star Mat <span className="text-gradient-blue">Philosophy</span>
            </h2>
            <div className="star-divider mx-auto" />
          </motion.div>

          {/* Alternating Split Sections */}
          <div className="space-y-28">
            {/* Split 1 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeLeft}>
                <div className="aspect-video rounded-3xl border border-star-border bg-gradient-to-br from-blue-900/40 to-star-black flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-star-blue/10 to-transparent" />
                  <div className="relative z-10 text-center p-10">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <StarShape size={100} className="text-star-blue mx-auto mb-4 opacity-80" />
                    </motion.div>
                    <p className="text-star-blue font-black text-xl">Surface Engineering</p>
                  </div>
                </div>
              </motion.div>
              <motion.div {...fadeRight}>
                <span className="inline-block text-star-blue text-sm font-semibold tracking-widest uppercase mb-4">01 — Grip</span>
                <h3 className="text-3xl md:text-4xl font-black mb-5">
                  Engineered to Hold<br />
                  <span className="text-star-yellow">Every Position.</span>
                </h3>
                <p className="text-star-grey text-lg leading-relaxed mb-5">
                  The Star Mat surface uses a proprietary micro-suede weave that increases grip under
                  pressure. The more force you apply, the better it holds. This is by design.
                </p>
                <p className="text-star-grey leading-relaxed">
                  Traditional mats use flat rubber surfaces that compress and slide. We changed the
                  physics. Our surface creates directional friction that locks in place when loaded —
                  releasing freely when you unweight.
                </p>
              </motion.div>
            </div>

            {/* Split 2 — reversed */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeLeft} className="order-2 lg:order-1">
                <span className="inline-block text-star-yellow text-sm font-semibold tracking-widest uppercase mb-4">02 — Cushion</span>
                <h3 className="text-3xl md:text-4xl font-black mb-5">
                  Protect Your Body.
                  <span className="text-gradient-blue block">Amplify Your Power.</span>
                </h3>
                <p className="text-star-grey text-lg leading-relaxed mb-5">
                  8mm seems subtle. In practice, it's the difference between training pain-free for
                  years versus chronic knee and wrist fatigue. We modeled the foam density after
                  premium orthopedic padding specifications.
                </p>
                <p className="text-star-grey leading-relaxed">
                  Dense enough to maintain ground contact cues — soft enough to absorb the repetitive
                  impact that accumulates over a lifetime of training.
                </p>
              </motion.div>
              <motion.div {...fadeRight} className="order-1 lg:order-2">
                <div className="aspect-video rounded-3xl border border-star-border bg-gradient-to-br from-yellow-900/30 to-star-black flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-star-yellow/8 to-transparent" />
                  <div className="relative z-10 text-center p-10">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full border border-star-yellow/20"
                        style={{
                          width: `${120 + i * 60}px`,
                          height: `${120 + i * 60}px`,
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
                        transition={{ duration: 3, delay: i * 0.8, repeat: Infinity }}
                      />
                    ))}
                    <p className="relative text-star-yellow font-black text-6xl">8</p>
                    <p className="relative text-star-yellow text-sm font-semibold">mm Cushion</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Split 3 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeLeft}>
                <div className="aspect-video rounded-3xl border border-star-border bg-gradient-to-br from-green-900/30 to-star-black flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 to-transparent" />
                  <div className="relative z-10 text-center p-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="w-28 h-28 rounded-full border-2 border-dashed border-green-500/40 mx-auto flex items-center justify-center"
                    >
                      <Globe size={50} className="text-green-400 opacity-80" />
                    </motion.div>
                    <p className="text-green-400 font-bold mt-4">Thoughtfully Made</p>
                  </div>
                </div>
              </motion.div>
              <motion.div {...fadeRight}>
                <span className="inline-block text-green-400 text-sm font-semibold tracking-widest uppercase mb-4">03 — Materials</span>
                <h3 className="text-3xl md:text-4xl font-black mb-5">
                  High Performance.
                  <span className="text-green-400 block">Thoughtfully Built.</span>
                </h3>
                <p className="text-star-grey text-lg leading-relaxed mb-5">
                  The Star Mat is made from closed-cell TPE foam — no latex, no PVC, no harsh
                  plasticizers. It's a cleaner material choice that's better for your skin and easier
                  on the environment.
                </p>
                <p className="text-star-grey leading-relaxed">
                  We take material quality seriously at every step — from the surface weave to the
                  foam core. The goal is a mat that performs at the highest level and lasts for years,
                  not seasons.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section-padding py-24 bg-star-card/20 border-y border-star-border">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <p className="text-star-grey text-sm tracking-widest uppercase mb-3">What Drives Us</p>
            <h2 className="text-4xl font-black">Our Core Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp(i * 0.12)}
                className="glass rounded-2xl p-8 border border-star-border card-hover"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${v.color}15`, border: `1px solid ${v.color}30` }}
                >
                  <v.icon size={22} style={{ color: v.color }} />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{v.title}</h3>
                <p className="text-star-grey leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-padding py-24 border-t border-star-border">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="text-star-grey text-sm tracking-widest uppercase mb-3">From Athletes</p>
            <h2 className="text-4xl font-black">What They're Saying</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "I've tried every training tool out there. The Star Mat is the only one that actually changed how I move on the field. My lateral quickness improved noticeably within two weeks.",
                name: 'Darius T.',
                role: 'College Football, Wide Receiver',
                initials: 'DT',
                color: '#007AFF',
              },
              {
                quote: "As a golf instructor, I've seen a lot of training aids. The Star Mat is the real deal for hip rotation and weight transfer. My students who use it see results faster than anything else I've tried.",
                name: 'Lisa M.',
                role: 'Golf Instructor, 12 Years',
                initials: 'LM',
                color: '#30D158',
              },
              {
                quote: "I train MMA three times a week and I use the Star Mat every session for footwork. The compass markers make it easy to drill specific patterns. It's become a non-negotiable part of my prep.",
                name: 'Jalen R.',
                role: 'Amateur MMA Fighter',
                initials: 'JR',
                color: '#FF375F',
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp(i * 0.12)}
                className="glass rounded-2xl p-7 border border-star-border flex flex-col gap-5"
              >
                <p className="text-star-grey leading-relaxed text-sm flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 border-t border-star-border pt-5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                    style={{ backgroundColor: `${t.color}40`, border: `1px solid ${t.color}50` }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-star-grey text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="section-padding py-28">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <p className="text-star-grey text-sm tracking-widest uppercase mb-3">The Journey</p>
            <h2 className="text-4xl font-black">How We Got Here</h2>
          </motion.div>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-star-blue via-star-yellow to-transparent -translate-x-1/2 hidden md:block" />

            <div className="space-y-12 md:space-y-0">
              {timeline.map((event, i) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: event.align === 'right' ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`relative md:flex md:items-start md:gap-8 mb-12 ${
                    event.align === 'left' ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`glass rounded-2xl p-6 border border-star-border md:w-[calc(50%-2rem)] ${
                    event.align === 'left' ? 'md:text-right' : ''
                  }`}>
                    <p className="text-star-blue font-black text-2xl mb-2">{event.year}</p>
                    <h4 className="text-white font-bold text-lg mb-2">{event.title}</h4>
                    <p className="text-star-grey text-sm leading-relaxed">{event.desc}</p>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full bg-star-yellow border-2 border-star-black z-10" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM / FOUNDER ── */}
      <section className="section-padding py-24 border-t border-star-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeLeft}>
              <div className="aspect-square max-w-sm mx-auto relative">
                <div className="absolute inset-0 rounded-3xl bg-star-blue/10 blur-3xl" />
                <div className="relative glass rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-star-border h-full">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-star-blue to-star-yellow flex items-center justify-center text-3xl font-black text-white mb-5">
                    ML
                  </div>
                  <p className="text-white font-black text-2xl">Marcus Lin</p>
                  <p className="text-star-grey mb-4">Founder & CEO</p>
                  <div className="star-divider mx-auto mb-4" />
                  <p className="text-star-grey text-sm">Former professional triathlete. Product obsessive. Slipped on one mat too many.</p>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeRight}>
              <p className="text-star-blue text-sm font-semibold tracking-widest uppercase mb-5">The Founder</p>
              <h2 className="text-4xl font-black mb-6">
                Built by an Athlete,
                <span className="text-gradient-yellow block">For Athletes.</span>
              </h2>
              <p className="text-star-grey text-lg leading-relaxed mb-5">
                Marcus Lin spent 12 years as a professional triathlete before founding Star Fitness.
                Every decision he makes comes from lived experience on the training floor — not from
                a boardroom.
              </p>
              <p className="text-star-grey leading-relaxed mb-10">
                "I built Star Fitness because I was tired of compromising. The mat I wanted didn't
                exist. So I built it, and I made sure it would never let you down — the same way
                a great training partner never does."
              </p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/shop" className="btn-primary">
                  Train on the Star Mat
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, Star, Zap, Shield, Award, ChevronDown } from 'lucide-react'
import CompassStar from '../components/CompassStar'
import AIWorkoutChat from '../components/AIWorkoutChat'

const stats = [
  { value: '250K+', label: 'Active Members' },
  { value: '1,200+', label: 'Live Classes' },
  { value: '42', label: 'Countries' },
  { value: '4.9', label: 'Average Rating', starIcon: true },
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
    icon: 'compass',
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
          src="/videos/star-mat-fv1.mp4"
          poster="/images/thumbs/star-mat-fv1.mov.png"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.38) saturate(0.85)' }}
        />

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

        {/* Floating logo decorations */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
          className="absolute top-20 right-[10%] opacity-20"
        >
          <img src="/images/logo.jpeg" alt="" className="w-28 h-28 object-contain" style={{ mixBlendMode: 'screen' }} />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
          className="absolute bottom-32 left-[8%] opacity-20"
        >
          <img src="/images/logo.jpeg" alt="" className="w-20 h-20 object-contain" style={{ mixBlendMode: 'screen' }} />
        </motion.div>
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
          className="absolute top-1/2 right-[5%] opacity-10 hidden lg:block"
        >
          <img src="/images/logo.jpeg" alt="" className="w-48 h-48 object-contain" style={{ mixBlendMode: 'screen' }} />
        </motion.div>

        {/* Hero Content */}
        <div className="section-padding relative z-10 text-center max-w-5xl mx-auto pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium text-star-yellow mb-8"
          >
            <img src="/images/logo.jpeg" alt="" className="w-4 h-4 object-contain" style={{ mixBlendMode: 'screen' }} />
            Every step you take is an impact of improvement
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
            There is no other workout that will improve your balance, core, speed, strength, and endurance faster or better than training in all planes of motion. The Star Mat is your direction.
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
                <p className="text-3xl md:text-4xl font-black text-white mb-1 flex items-center justify-center gap-1">
                  {stat.value}
                  {stat.starIcon && <CompassStar size={22} color="#FFD700" />}
                </p>
                <p className="text-star-grey text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STAR MAT FEATURE ── */}
      <section className="section-padding py-28 overflow-x-clip">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative w-full">
                {/* Glow */}
                <div className="absolute inset-0 rounded-3xl bg-star-blue/15 blur-3xl scale-95 pointer-events-none" />
                {/* Real product photo */}
                <div className="relative rounded-3xl overflow-hidden border border-star-border shadow-2xl" style={{ height: '600px' }}>
                  <img
                    src="/images/commercial/unrolling-mat.jpeg"
                    alt="Athlete unrolling Star Mat in premium gym"
                    className="absolute inset-0 w-full h-full object-cover"
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
                  <p className="text-star-yellow font-black text-2xl">$199</p>
                  <p className="text-star-grey text-xs">Free Shipping</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <p className="text-star-blue text-sm font-semibold tracking-widest uppercase mb-4">The Star Mat</p>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                The Mat That Changes
                <span className="text-gradient-yellow block">Everything.</span>
              </h2>
              <p className="text-star-grey text-lg leading-relaxed mb-4">
                You don't need big bulky equipment or expensive trainers. We just need to know what direction to go in, and the Star Mat gives you exactly that.
              </p>
              <p className="text-star-grey text-lg leading-relaxed mb-10">
                Train in all planes of motion and become a king in your sport. The Star Mat is the only tool built to help you dominate from every angle.
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

      {/* ── BRAND STATEMENT ── */}
      <section className="section-padding py-24 bg-star-card/30 border-y border-star-border overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] rounded-full bg-star-yellow/5 blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src="/images/logo.jpeg" alt="" className="w-12 h-12 object-contain mx-auto mb-8" style={{ mixBlendMode: 'screen', opacity: 0.8 }} />
            <p className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
              The most important move
              <span className="text-gradient-yellow block">you can make</span>
              is the next move.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10"
            >
              <Link to="/shop" className="btn-yellow text-base">
                Make Your Move
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
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
                      {t.icon === 'compass'
                        ? <CompassStar size={36} color={t.accent} />
                        : <span className="text-3xl md:text-4xl" style={{ color: t.accent }}>{t.icon}</span>
                      }
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

      {/* ── AI COACH SECTION ── */}
      <section className="section-padding py-24 border-t border-star-border bg-gradient-to-b from-star-card/20 to-star-black relative overflow-x-clip">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] rounded-full bg-star-blue/8 blur-[100px]" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              className="min-w-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-star-blue/30 bg-star-blue/10 mb-6">
                <CompassStar size={14} color="#007AFF" />
                <span className="text-star-blue text-xs font-semibold tracking-wider uppercase">AI-Powered Training</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-5">
                Get Your Custom
                <span className="text-gradient-blue block">Star Mat Workout</span>
              </h2>
              <p className="text-star-grey text-lg leading-relaxed mb-6">
                Tell our AI Coach your sport, your goal, or a problem area and it will build a workout designed specifically for the Star Mat in under 30 seconds.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Sport-specific training for 7 sports',
                  'Injury-safe modifications included',
                  'Built around all planes of motion',
                  'Sets, reps, and compass directions included',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-star-grey">
                    <span className="w-5 h-5 rounded-full bg-star-blue/20 border border-star-blue/40 flex items-center justify-center flex-shrink-0">
                      <CompassStar size={10} color="#007AFF" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="min-w-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <AIWorkoutChat inline />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ (AEO) ── */}
      <FAQSection />

      {/* Floating AI Chat widget */}
      <AIWorkoutChat />
    </main>
  )
}

const faqs = [
  {
    q: 'What is the Star Mat and how does it work?',
    a: 'The Star Mat is a premium directional training mat with compass-style markers at 8 angles (360°, 270°, 180°, 90°, 315°, 225°, 135°, 45°) and a center "LOAD DECIDE" badge. Athletes use these markers to train in all planes of motion — sagittal, frontal, and transverse — improving balance, core strength, speed, strength, and endurance simultaneously.',
  },
  {
    q: 'What sports is the Star Mat designed for?',
    a: 'The Star Mat is built for multi-sport athletes: Football, Basketball, Soccer, Baseball and Softball, Track & Field, Tennis, and MMA/Combat Sports. Each sport has specific training programs targeting the key body areas and movements that matter most for performance and injury prevention.',
  },
  {
    q: 'How does training in all planes of motion improve athletic performance?',
    a: 'Most traditional workouts only train in one plane (front to back). The Star Mat forces your body to move laterally, rotationally, and diagonally — the same directions your body moves in actual sports. This builds functional strength, faster reaction time, and sport-specific conditioning that translates directly to competition.',
  },
  {
    q: 'Can I use the Star Mat for injury recovery and rehabilitation?',
    a: 'Yes. The Star Mat includes guided recovery protocols for common sports injuries. The directional markers allow controlled, low-impact movements that rebuild stability around injured joints. Always consult a medical professional for serious injuries, but the mat is specifically designed to support safe, progressive recovery.',
  },
  {
    q: 'What is the difference between the Star Mat Pro and Star Mat Lite?',
    a: 'The Star Mat Pro ($199) is our flagship mat, built with premium 8mm high-density foam, two-sided print, 75"x75" surface, and a carry strap. It includes a 60-day free Pro subscription. The Star Mat Lite ($149) is a 4mm single-sided, foldable 55"x55" version ideal for travel and home use. Both feature the full Star directional training system. The AI Coach is included with a Pro subscription plan or higher.',
  },
  {
    q: 'Do I need a trainer or gym to use the Star Mat?',
    a: 'No. The Star Mat is designed for solo training — at home, in a hotel room, outdoors, or in a gym. The directional markers act as your built-in trainer, telling you exactly where to step, pivot, and move. Our AI Coach can generate a complete workout in seconds based on your goals.',
  },
]

function FAQSection() {
  const [open, setOpen] = useState(null)
  return (
    <section
      className="section-padding py-24 border-t border-star-border"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-star-yellow text-xs font-semibold tracking-widest uppercase mb-3">Common Questions</p>
          <h2 className="text-4xl font-black">Everything About the Star Mat</h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 rounded-2xl border border-star-border bg-star-card/40 hover:bg-star-card/70 text-left transition-all"
              >
                <span className="text-white font-semibold text-sm leading-snug" itemProp="name">{faq.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
                  <ChevronDown size={18} className="text-star-grey" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p className="px-6 py-4 text-star-grey text-sm leading-relaxed border border-t-0 border-star-border rounded-b-2xl bg-star-card/20" itemProp="text">
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

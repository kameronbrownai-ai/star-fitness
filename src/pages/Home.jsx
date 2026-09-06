import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, Star, Zap, Shield, Award, ChevronDown, Camera, Video, UserCircle } from 'lucide-react'
import CompassStar from '../components/CompassStar'
import AIWorkoutChat from '../components/AIWorkoutChat'
import FutureCoachSection from '../components/FutureCoachSection'
import StarAcronym from '../components/StarAcronym'

const EASE = [0.25, 0.1, 0.25, 1]

const MODE = {
  general: {
    badge: 'Multi-Sport Performance System',
    lines: ['TRAIN', 'WITHOUT', 'LIMITS.'],
    accent: ['text-white', 'text-gradient-yellow', 'text-white'],
    sub: 'Balance, core, speed, strength, and endurance, trained in every plane of motion. The Star Mat is your direction.',
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
    sub: 'Built for simulator owners and serious course players who understand ground force physics. Calibrate hip rotation, perfect weight transfer, and add distance through geometry, not guesswork.',
    cta: 'Shop Golf Edition',
    ctaTo: '/shop',
    tint: 'rgba(48,209,88,0.07)',
    color: '#30D158',
    label: '⛳ Golf Training',
    video: '/videos/golf-tee-off.mp4',
  },
  wellness: {
    badge: 'Wellness & Rehab Training System',
    lines: ['MOVE', 'BETTER.', ''],
    accent: ['text-white', 'text-gradient-purple', ''],
    sub: 'Low-impact, controlled movement for recovery, mobility, and everyday wellness. Rebuild stability around joints, improve balance, and stay active at any age, one guided direction at a time.',
    cta: 'Explore Wellness',
    ctaTo: '/lessons',
    tint: 'rgba(191,90,242,0.07)',
    color: '#BF5AF2',
    label: '🧘 Wellness & Rehab',
    video: '/videos/star-mat-feet-weight-transfer.mp4',
  },
}

const CREDIBILITY = [
  'Athletic Performance Training', 'Physical Therapy Clinics', 'Golf Training Academies',
  'Senior Wellness Centers', 'Strength & Conditioning Coaches', 'Sports Rehab Facilities',
  'Youth Athletic Programs', 'Combat Sports Gyms', 'Orthopedic Recovery Centers',
  'Home Fitness Enthusiasts',
]

const features = [
  { icon: Zap,    title: 'Non-Slip Precision',   desc: 'Engineered micro-suede surface grips the floor so you can push harder without hesitation.' },
  { icon: Shield, title: 'Joint Protection',      desc: '8mm high-density foam absorbs impact and cushions every rep, stretch, and landing.' },
  { icon: Award,  title: 'Built to Perform',      desc: 'Premium materials, engineered and refined for durability and performance.' },
]

const teasers = [
  { label: 'Shop',      to: '/shop',      title: 'The Star Mat',   sub: 'Pro & Lite editions',     color: 'from-blue-900/40 to-star-black',   accent: '#007AFF', icon: '🛒' },
  { label: 'Lessons',   to: '/lessons',   title: 'Mastery Tracks', sub: 'Goal-specific programs',  color: 'from-yellow-900/30 to-star-black',  accent: '#FFD700', icon: '▶' },
  { label: 'Community', to: '/community', title: 'The Community',   sub: 'Real people, real results.', color: 'from-purple-900/30 to-star-black', accent: '#BF5AF2', icon: 'compass' },
  { label: 'About',     to: '/about',     title: 'Our Mission',    sub: 'Why the Star Mat exists.', color: 'from-green-900/20 to-star-black',  accent: '#30D158', icon: '◆' },
]

// ── Feature definitions for VS. Masking Tape interactive section ────────────
const FEATURES = [
  {
    key: 'angles',
    title: 'Trackable Positions',
    sub: 'Every drill has an address',
    color: '#FFD700',
    label: 'Measurable Geometry',
    desc: "Tape has no coordinates. The Star Mat gives every position a number, 45°, 90°, 135° and beyond. That means your progress is loggable, your coach can prescribe exact positions, and your improvement is something you can actually measure session to session.",
  },
  {
    key: 'geometry',
    title: 'Coach Prescription',
    sub: 'One language, zero guessing',
    color: '#30D158',
    label: 'Precision vs. Tape',
    desc: "Your trainer says 'step to 90°.' You step to 90°, not close to it, not roughly there. Exactly there. The Star Mat makes coaching language literal. What gets prescribed gets executed. Tape leaves room for interpretation. The mat doesn't.",
  },
  {
    key: 'digital',
    title: 'AI Coach Speaks Mat',
    sub: 'One system, one language',
    color: '#007AFF',
    label: 'Mat → AI → Workout',
    desc: "The AI Coach and the Star Mat share the same coordinate system. Ask for a speed drill and it responds with exact mat positions, 'drive off the 45° arrow, crossover to 90°.' No translation needed. The floor and the software are one connected training system.",
  },
  {
    key: 'muscle',
    title: 'The Pro Standard',
    sub: 'Precision in practice = precision under pressure',
    color: '#BF5AF2',
    label: 'Pro vs. Guesswork',
    desc: "Calibrated geometry works because what you train on is what you perform on. Precise, marked, measured surfaces let the body execute under pressure without second-guessing. The Star Mat brings that principle to your floor.",
  },
]

// ── Animated graphic: 8 angles cycling ──────────────────────────────────────
function AnglesDiagram() {
  const [lit, setLit] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setLit(s => (s + 1) % 8), 480)
    return () => clearInterval(t)
  }, [])
  const cx = 120, cy = 120, r = 90
  const angles = [0, 45, 90, 135, 180, 225, 270, 315]
  const labels = ['360°', '45°', '90°', '135°', '180°', '225°', '270°', '315°']
  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[260px] mx-auto">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      {angles.map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180
        const x1 = cx + r * 0.55 * Math.cos(rad), y1 = cy + r * 0.55 * Math.sin(rad)
        const x2 = cx + r * Math.cos(rad), y2 = cy + r * Math.sin(rad)
        const lx = cx + (r + 14) * Math.cos(rad), ly = cy + (r + 14) * Math.sin(rad)
        const isLit = i === lit
        const isPrimary = deg % 90 === 0
        return (
          <g key={deg}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isLit ? '#FFD700' : isPrimary ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.22)'}
              strokeWidth={isLit ? 2.5 : isPrimary ? 1.5 : 0.8}
              style={{ filter: isLit ? 'drop-shadow(0 0 6px rgba(255,215,0,0.9))' : 'none', transition: 'stroke 0.25s, stroke-width 0.25s' }}
            />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fill={isLit ? '#FFD700' : 'rgba(255,255,255,0.4)'}
              fontSize={isLit ? '9' : '8'} fontFamily="monospace" fontWeight={isLit ? 'bold' : 'normal'}
              style={{ transition: 'fill 0.25s' }}>
              {labels[i]}
            </text>
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={5} fill="#FFD700" />
      <text x={cx} y={cy + 18} textAnchor="middle" fill="rgba(255,215,0,0.55)" fontSize="6.5" fontFamily="monospace" letterSpacing="1">LOAD DECIDE</text>
    </svg>
  )
}

// ── Interactive graphic: session drift, tape shifts, mat stays locked ────────
const GEO_SESSIONS = [
  { label: 'Session 1',  drift: 0,   fade: 1.0, offsets: [0, 0, 0, 0] },
  { label: 'Session 6',  drift: 6,   fade: 0.6, offsets: [4, -3, 5, -4] },
  { label: 'Session 12', drift: 13,  fade: 0.3, offsets: [9, -7, 11, -8] },
]
function GeometryDiagram() {
  const [sessionIdx, setSessionIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setSessionIdx(s => (s + 1) % 3), 2200)
    return () => clearInterval(t)
  }, [])
  const s = GEO_SESSIONS[sessionIdx]
  const cx = 130, cy = 118, r = 82
  const tapeAngles = [45, 90, 135, 180].map((a, i) => a + s.offsets[i])
  return (
    <div className="w-full max-w-[280px] mx-auto select-none">
      {/* Session tabs */}
      <div className="flex gap-1.5 mb-3 justify-center">
        {GEO_SESSIONS.map((gs, i) => (
          <button key={i} onClick={() => setSessionIdx(i)}
            className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all duration-300"
            style={{
              background: sessionIdx === i ? '#30D15820' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${sessionIdx === i ? '#30D15860' : 'rgba(255,255,255,0.08)'}`,
              color: sessionIdx === i ? '#30D158' : 'rgba(255,255,255,0.3)',
            }}>
            {gs.label}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 260 220" className="w-full">
        {/* Divider */}
        <line x1="130" y1="8" x2="130" y2="212" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="3,3" />
        {/* ── MASKING TAPE side ── */}
        <text x="65" y="18" textAnchor="middle" fill="rgba(255,100,100,0.5)" fontSize="7" fontFamily="monospace" letterSpacing="1">MASKING TAPE</text>
        <circle cx="65" cy="110" r="55" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        {tapeAngles.map((deg, i) => {
          const rad = (deg - 90) * Math.PI / 180
          const opacity = s.fade * (i < 2 ? 0.8 : 0.5)
          return (
            <line key={i}
              x1={65} y1={110}
              x2={65 + 55 * Math.cos(rad)} y2={110 + 55 * Math.sin(rad)}
              stroke={`rgba(255,80,80,${opacity})`}
              strokeWidth="3.5" strokeDasharray="6,4" strokeLinecap="round"
              style={{ transition: 'all 0.6s ease' }}
            />
          )
        })}
        {/* drift label */}
        <text x="65" y="200" textAnchor="middle" fill="rgba(255,100,100,0.55)" fontSize="7" fontFamily="monospace"
          style={{ transition: 'all 0.5s' }}>
          {s.drift === 0 ? 'Session 1 baseline' : `Drifted up to ${s.drift}° off`}
        </text>
        {/* ── STAR MAT side, always identical ── */}
        <text x="195" y="18" textAnchor="middle" fill="rgba(48,209,88,0.7)" fontSize="7" fontFamily="monospace" letterSpacing="1">STAR MAT</text>
        <circle cx="195" cy="110" r="55" fill="none" stroke="rgba(48,209,88,0.1)" strokeWidth="1" />
        {[45, 90, 135, 180].map((deg, i) => {
          const rad = (deg - 90) * Math.PI / 180
          return (
            <line key={i} x1={195} y1={110}
              x2={195 + 55 * Math.cos(rad)} y2={110 + 55 * Math.sin(rad)}
              stroke={i < 2 ? 'rgba(48,209,88,0.85)' : 'rgba(48,209,88,0.5)'}
              strokeWidth={i < 2 ? 2 : 1.2}
            />
          )
        })}
        <circle cx={195} cy={110} r={4} fill="#30D158" />
        <text x="195" y="200" textAnchor="middle" fill="rgba(48,209,88,0.65)" fontSize="7" fontFamily="monospace">Always exact. Every time.</text>
      </svg>
    </div>
  )
}

// ── Animated graphic: mat → AI → drill data flow ────────────────────────────
function DigitalDiagram() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick(n => (n + 1) % 80), 25)
    return () => clearInterval(t)
  }, [])
  const nodes = [
    { x: 40, y: 110, label: 'Star Mat', sub: 'Position', color: '#FFD700' },
    { x: 130, y: 110, label: 'AI Coach', sub: 'Processes', color: '#007AFF' },
    { x: 220, y: 110, label: 'Custom', sub: 'Drill Out', color: '#30D158' },
  ]
  const p1 = (tick % 40) / 40
  const p2 = ((tick + 20) % 40) / 40
  const d1x = nodes[0].x + (nodes[1].x - nodes[0].x) * p1
  const d2x = nodes[1].x + (nodes[2].x - nodes[1].x) * p2
  return (
    <svg viewBox="0 0 260 200" className="w-full max-w-[280px] mx-auto">
      <line x1={nodes[0].x} y1={nodes[0].y} x2={nodes[1].x} y2={nodes[1].y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <line x1={nodes[1].x} y1={nodes[1].y} x2={nodes[2].x} y2={nodes[2].y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <polygon points={`${nodes[1].x-26},${nodes[0].y-4} ${nodes[1].x-18},${nodes[0].y} ${nodes[1].x-26},${nodes[0].y+4}`} fill="rgba(255,255,255,0.15)" />
      <polygon points={`${nodes[2].x-26},${nodes[1].y-4} ${nodes[2].x-18},${nodes[1].y} ${nodes[2].x-26},${nodes[1].y+4}`} fill="rgba(255,255,255,0.15)" />
      <circle cx={d1x} cy={nodes[0].y} r={4.5} fill="#007AFF" style={{ filter: 'drop-shadow(0 0 5px rgba(0,122,255,0.9))' }} />
      <circle cx={d2x} cy={nodes[1].y} r={4.5} fill="#30D158" style={{ filter: 'drop-shadow(0 0 5px rgba(48,209,88,0.9))' }} />
      {nodes.map(({ x, y, label, sub, color }) => (
        <g key={x}>
          <circle cx={x} cy={y} r={30} fill={`${color}12`} stroke={`${color}40`} strokeWidth="1.5" />
          <text x={x} y={y - 5} textAnchor="middle" fill={color} fontSize="7.5" fontFamily="monospace" fontWeight="bold">{label}</text>
          <text x={x} y={y + 9} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6.5" fontFamily="monospace">{sub}</text>
        </g>
      ))}
      <text x={40}  y={155} textAnchor="middle" fill="rgba(255,215,0,0.4)"   fontSize="6.5" fontFamily="monospace">MAT ANGLE</text>
      <text x={130} y={155} textAnchor="middle" fill="rgba(0,122,255,0.5)"   fontSize="6.5" fontFamily="monospace">COORDINATES</text>
      <text x={220} y={155} textAnchor="middle" fill="rgba(48,209,88,0.5)"   fontSize="6.5" fontFamily="monospace">EXACT DRILL</text>
      <text x={130} y={185} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="7" fontFamily="monospace" letterSpacing="2">'STEP TO 90°'</text>
    </svg>
  )
}

// ── Interactive graphic: by feel (scattered) vs by number (locked) ────────────
const FEEL_REPS  = [78, 94, 83, 101, 87, 96, 76, 92, 85, 99]
const NUMBER_REPS = [90, 90, 90, 90, 90, 90, 90, 90, 90, 90]
function MuscleDiagram() {
  const [mode, setMode] = useState('feel')   // 'feel' | 'number'
  const [visibleReps, setVisibleReps] = useState(0)
  const [running, setRunning] = useState(false)

  function runReps(m) {
    setMode(m)
    setVisibleReps(0)
    setRunning(true)
  }
  useEffect(() => {
    if (!running) return
    if (visibleReps >= 10) { setRunning(false); return }
    const t = setTimeout(() => setVisibleReps(v => v + 1), 280)
    return () => clearTimeout(t)
  }, [running, visibleReps])

  // Auto-demo on mount
  useEffect(() => { const t = setTimeout(() => runReps('feel'), 400); return () => clearTimeout(t) }, [])

  const reps = mode === 'feel' ? FEEL_REPS : NUMBER_REPS
  const isNumber = mode === 'number'
  const gaugeTarget = 90
  const shown = reps.slice(0, visibleReps)
  const accuracy = shown.length === 0 ? 0
    : Math.round(100 - shown.reduce((s, v) => s + Math.abs(v - gaugeTarget), 0) / shown.length / 90 * 100)

  // Map angle to y position in the chart (80° → bottom, 100° → top)
  const chartH = 120, chartW = 200, chartMinA = 72, chartMaxA = 108
  const toY = a => chartH - ((a - chartMinA) / (chartMaxA - chartMinA)) * chartH

  return (
    <div className="w-full max-w-[280px] mx-auto select-none">
      {/* Toggle buttons */}
      <div className="flex gap-2 mb-3 justify-center">
        {[['feel', 'By Feel', '#FF6B6B'], ['number', 'By Number', '#BF5AF2']].map(([m, label, col]) => (
          <button key={m} onClick={() => runReps(m)}
            className="px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all duration-300"
            style={{
              background: mode === m ? `${col}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${mode === m ? `${col}60` : 'rgba(255,255,255,0.08)'}`,
              color: mode === m ? col : 'rgba(255,255,255,0.3)',
            }}>
            {label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 240 210" className="w-full">
        {/* Chart background */}
        <rect x="20" y="10" width={chartW} height={chartH} fill="rgba(255,255,255,0.02)" rx="4" />
        {/* 90° target line */}
        <line x1="20" y1={10 + toY(90)} x2={20 + chartW} y2={10 + toY(90)}
          stroke={isNumber ? 'rgba(191,90,242,0.6)' : 'rgba(255,255,255,0.15)'}
          strokeWidth={isNumber ? 2 : 1} strokeDasharray={isNumber ? '0' : '4,3'}
          style={{ transition: 'stroke 0.4s' }}
        />
        <text x="225" y={10 + toY(90) + 4} fill={isNumber ? 'rgba(191,90,242,0.8)' : 'rgba(255,255,255,0.25)'}
          fontSize="7" fontFamily="monospace" style={{ transition: 'fill 0.4s' }}>90°</text>

        {/* Rep bars */}
        {shown.map((angle, i) => {
          const x = 20 + (i / 9) * chartW + 6
          const y90 = 10 + toY(90)
          const yA  = 10 + toY(angle)
          const barY = Math.min(y90, yA)
          const barH = Math.abs(y90 - yA)
          const col = isNumber ? '#BF5AF2' : (Math.abs(angle - 90) > 8 ? '#FF6B6B' : '#FF9F43')
          return (
            <g key={i}>
              <rect x={x - 6} y={barY} width="12" height={Math.max(barH, 2)}
                fill={col} opacity="0.7" rx="2"
                style={{ filter: `drop-shadow(0 0 4px ${col}80)` }}
              />
              <text x={x} y={10 + chartH + 12} textAnchor="middle"
                fill="rgba(255,255,255,0.25)" fontSize="6" fontFamily="monospace">{angle}°</text>
            </g>
          )
        })}

        {/* Y axis labels */}
        {[80, 85, 90, 95, 100].map(a => (
          <text key={a} x="17" y={10 + toY(a) + 3} textAnchor="end"
            fill="rgba(255,255,255,0.18)" fontSize="6" fontFamily="monospace">{a}</text>
        ))}

        {/* Accuracy bar at bottom */}
        <rect x="20" y="158" width={chartW} height="10" fill="rgba(255,255,255,0.04)" rx="5" />
        <rect x="20" y="158" width={chartW * (accuracy / 100)} height="10" rx="5"
          fill={isNumber ? '#BF5AF2' : '#FF6B6B'}
          style={{ transition: 'width 0.3s ease, fill 0.4s' }}
        />
        <text x="20" y="182" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace">ACCURACY</text>
        <text x={20 + chartW} y="182" textAnchor="end"
          fill={isNumber ? '#BF5AF2' : '#FF6B6B'}
          fontSize="8" fontFamily="monospace" fontWeight="bold"
          style={{ transition: 'fill 0.4s' }}>
          {shown.length === 0 ? ', ' : `${accuracy}%`}
        </text>

        <text x="120" y="202" textAnchor="middle"
          fill={isNumber ? 'rgba(191,90,242,0.6)' : 'rgba(255,100,100,0.5)'}
          fontSize="7" fontFamily="monospace" style={{ transition: 'fill 0.4s' }}>
          {isNumber ? '✓ Math. Zero variance.' : '± guesswork every rep'}
        </text>
      </svg>
    </div>
  )
}

export default function Home() {
  const [mode, setMode] = useState('general')
  const m = MODE[mode]
  const [activeFeature, setActiveFeature] = useState('angles')

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

        {/* Mode-tinted overlay, animates on toggle */}
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
                        : key === 'wellness'
                          ? 'bg-[#BF5AF2] text-white shadow-lg'
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

      {/* ── CREDIBILITY TICKER (use cases, "built for," not "used by") ── */}
      <section className="border-y border-white/[0.06] bg-star-dark py-4 overflow-hidden">
        <p className="text-center text-star-yellow/70 text-[11px] font-bold tracking-[0.25em] uppercase mb-2">Built For</p>
        <div className="flex animate-marquee whitespace-nowrap">
          {[...CREDIBILITY, ...CREDIBILITY].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 mx-8 text-white/30 text-xs font-semibold tracking-[0.15em] uppercase">
              {item}
              <span className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
            </span>
          ))}
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
                  <p className="text-star-yellow font-black text-lg">Free Shipping</p>
                  <p className="text-white/40 text-xs">On every mat</p>
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

      <StarAcronym />

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
                Train Like It's<br />Measured.{' '}
                <span className="text-white/30">Because It Is.</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-6">
                Tape has no coordinates. It peels, shifts, and gives every session a different starting point. The Star Mat assigns a number to every position, making your training measurable, coachable, and built on the same measured, coordinate-based approach used in high-level training.
              </p>
              <p className="text-white/50 leading-relaxed mb-10">
                Calibrated geometry works because precision in practice becomes precision under pressure. Your coach prescribes exact positions. Your AI Coach speaks the same language as the mat. And your body stops guessing, because the floor never does.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {FEATURES.map((feat) => {
                  const isActive = activeFeature === feat.key
                  return (
                    <button
                      key={feat.key}
                      onClick={() => setActiveFeature(feat.key)}
                      className="rounded-xl border p-4 text-left transition-all duration-300"
                      style={{
                        borderColor: isActive ? `${feat.color}55` : 'rgba(255,255,255,0.06)',
                        background: isActive ? `${feat.color}0e` : 'rgba(255,255,255,0.02)',
                        boxShadow: isActive ? `0 0 20px ${feat.color}18` : 'none',
                      }}
                    >
                      <p className="font-semibold text-sm mb-1 transition-colors duration-300"
                        style={{ color: isActive ? feat.color : '#ffffff' }}>
                        {feat.title}
                      </p>
                      <p className="text-xs text-white/35">{feat.sub}</p>
                    </button>
                  )
                })}
              </div>
              {/* Description paragraph, changes with active feature */}
              <AnimatePresence mode="wait">
                {FEATURES.filter(f => f.key === activeFeature).map(feat => (
                  <motion.p
                    key={feat.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/50 text-sm leading-relaxed mt-4"
                  >
                    {feat.desc}
                  </motion.p>
                ))}
              </AnimatePresence>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.75, delay: 0.1 }}
              className="flex flex-col items-center">
              {(() => {
                const feat = FEATURES.find(f => f.key === activeFeature)
                const DiagramMap = { angles: AnglesDiagram, geometry: GeometryDiagram, digital: DigitalDiagram, muscle: MuscleDiagram }
                const Diagram = DiagramMap[activeFeature]
                return (
                  <div className="relative w-full max-w-[320px] mx-auto">
                    <div className="absolute inset-0 rounded-full blur-3xl scale-75 transition-all duration-700"
                      style={{ background: `${feat.color}09` }} />
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeFeature}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.35 }}
                        className="relative rounded-3xl border bg-white/[0.02] p-8"
                        style={{ borderColor: `${feat.color}25` }}
                      >
                        <Diagram />
                        <p className="text-center text-xs tracking-widest uppercase mt-4 transition-colors duration-300"
                          style={{ color: `${feat.color}60` }}>
                          {feat.label}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )
              })()}
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
            <img src="/images/logo.png" alt="" className="w-10 h-10 object-contain mx-auto mb-8 opacity-50" />
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

      {/* ── AI COACH ── */}
      <FutureCoachSection />

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
              { sport: 'Football', role: 'Speed & Explosiveness', desc: 'Lateral cuts, first-step quickness, and direction changes that transfer directly from the mat to the field.', accent: '#007AFF', emoji: '🏈', video: '/videos/star-mat-fast-feet.mov' },
              { sport: 'Basketball', role: 'Court Footwork & Agility', desc: 'Multi-directional speed, defensive slides, and lateral quickness built for every possession.', accent: '#FF9500', emoji: '🏀', video: '/videos/star-mat-fast-feet.mov' },
              { sport: 'Golf', role: 'Rotation & Balance', desc: 'Hip rotation drills, balance at address, and rotational power training to add yards and control to every shot.', accent: '#30D158', emoji: '⛳', video: '/videos/star-mat-unroll-tee-box.mp4' },
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
            <p className="text-star-yellow text-xs font-bold tracking-widest uppercase mb-6">Why We Built It</p>
            <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-8">
              "Balance, core, speed, strength, and endurance. Trained in every plane of motion,
              on a surface where every position has a number."
            </blockquote>
            <p className="text-white/40 text-sm">The Star Fitness Mission</p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-10">
              <Link to="/about" className="btn-secondary">Read Our Story <ArrowRight size={16} /></Link>
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
    detail: 'Tap the + button in the chat input bar and choose "Photo form check." Take a photo mid-exercise and the AI Coach will analyze your body positioning, alignment, and joint angles with specific corrections, in seconds.',
    iconClass: 'text-white/50', bgClass: 'bg-white/[0.04] border-white/[0.08]',
  },
  {
    icon: <Video size={16} />, label: 'Live form check', desc: 'Real-time pose detection',
    detail: 'Tap the + button and choose "Live form check" to open your camera. The AI Coach tracks your skeleton in real time, and Live Coach mode watches you train, naming the exercise it sees and speaking corrections out loud every few seconds.',
    help: {
      title: 'Camera not working?',
      steps: [
        ['iPhone, Safari', 'Settings app → Safari → Settings for Websites → Camera → set to "Ask". Then reload this page and tap Allow when asked.'],
        ['iPhone, Chrome', 'Settings app → scroll to Chrome → turn ON Camera (and Microphone). Then reload this page.'],
        ['Android', 'Tap the lock icon left of the address bar → Permissions → Camera → Allow.'],
        ['Computer (Chrome/Edge)', 'Click the camera or lock icon in the address bar → set Camera to Allow, then reload.'],
        ['Computer (Safari)', 'Safari menu → Settings for starmat.app → Camera → Allow.'],
      ],
    },
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
        {CHAT_ICONS.map(({ icon, label, desc, detail, help, iconClass, bgClass }) => {
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
                    <div className="px-3 pt-1 pb-2.5 ml-10 border-l border-white/[0.06]">
                      <p className="text-white/35 text-xs leading-relaxed">{detail}</p>
                      {help && (
                        <div className="mt-2.5 rounded-lg border border-star-yellow/15 bg-star-yellow/[0.04] p-2.5">
                          <p className="text-star-yellow/80 text-[10px] font-bold uppercase tracking-wider mb-1.5">{help.title}</p>
                          <div className="space-y-1">
                            {help.steps.map(([device, step]) => (
                              <p key={device} className="text-white/35 text-[11px] leading-relaxed">
                                <span className="text-white/60 font-semibold">{device}:</span> {step}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
  { q: 'What is the Star Mat and how does it work?', a: 'The Star Mat is a premium directional training mat with compass-style markers at 8 angles (360°, 270°, 180°, 90°, 315°, 225°, 135°, 45°) and a center "LOAD DECIDE" badge. Athletes use these markers to train in all planes of motion, sagittal, frontal, and transverse, improving balance, core strength, speed, strength, and endurance simultaneously.' },
  { q: 'What sports is the Star Mat designed for?', a: 'The Star Mat is built for multi-sport athletes: Football, Basketball, Soccer, Baseball and Softball, Track & Field, Tennis, Golf, Hockey, Lacrosse, and MMA/Combat Sports. Each sport has specific training programs targeting the key body areas and movements that matter most for performance and staying resilient.' },
  { q: 'How does training in all planes of motion improve athletic performance?', a: 'Most traditional workouts only train in one plane (front to back). The Star Mat forces your body to move laterally, rotationally, and diagonally, the same directions your body moves in actual sports. This builds functional strength, faster reaction time, and sport-specific conditioning that translates directly to competition.' },
  { q: 'Can I use the Star Mat for injury recovery and rehabilitation?', a: 'Yes. The Star Mat includes guided recovery protocols for common sports injuries. The directional markers allow controlled, low-impact movements that rebuild stability around injured joints. Always consult a medical professional for serious injuries, but the mat is specifically designed to support safe, progressive recovery.' },
  { q: 'What is the difference between the Star Mat Pro and Star Mat Lite?', a: 'The Star Mat Pro ($249) is our flagship mat, built with premium 8mm high-density foam, two-sided print, 75"×75" surface, and a carry strap. The Star Mat Lite ($199) is a 4mm single-sided, foldable 55"×55" version ideal for travel and home use. Both automatically create a free trial account when you buy, 30 days for our first 5,000 members, 14 days after that. Both feature the full Star directional training system. The AI Coach is included with the Training plan ($5/month) and Elite ($14.99/month).' },
  { q: 'Do I need a trainer or gym to use the Star Mat?', a: 'No. The Star Mat is designed for solo training, at home, in a hotel room, outdoors, or in a gym. The directional markers act as your built-in trainer, telling you exactly where to step, pivot, and move. Our AI Coach can generate a complete workout in seconds based on your goals.' },
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

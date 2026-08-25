import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Target, Move, Activity } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Interactive S.T.A.R. breakdown. Click a letter to see that quality animated
// on the mat's compass. All original SVG, built on the 8-angle Star geometry.
// ─────────────────────────────────────────────────────────────────────────────

const C = 130, CY = 120, R = 88
const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
const pt = (deg, rad = R) => {
  const a = (deg - 90) * Math.PI / 180
  return [C + rad * Math.cos(a), CY + rad * Math.sin(a)]
}

// Shared compass backdrop so every graphic reads as "on the mat"
function Compass({ color, litDegs = [], dim = 0.10 }) {
  return (
    <g>
      <circle cx={C} cy={CY} r={R} fill="none" stroke={`rgba(255,255,255,${dim})`} strokeWidth="1" />
      <circle cx={C} cy={CY} r={R * 0.55} fill="none" stroke={`rgba(255,255,255,${dim * 0.7})`} strokeWidth="1" />
      {ANGLES.map((d) => {
        const [x, y] = pt(d)
        const on = litDegs.includes(d)
        return (
          <g key={d}>
            <line x1={C} y1={CY} x2={x} y2={y}
              stroke={on ? color : `rgba(255,255,255,${dim + 0.06})`}
              strokeWidth={on ? 2.5 : 1}
              style={{ transition: 'stroke 0.2s, stroke-width 0.2s', filter: on ? `drop-shadow(0 0 6px ${color})` : 'none' }} />
            <circle cx={x} cy={y} r={on ? 5 : 2.5} fill={on ? color : 'rgba(255,255,255,0.2)'}
              style={{ transition: 'all 0.2s', filter: on ? `drop-shadow(0 0 6px ${color})` : 'none' }} />
          </g>
        )
      })}
    </g>
  )
}

// ── S: Speed — rapid-fire bursts out from center ──
function SpeedGraphic({ color }) {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI(v => v + 1), 260); return () => clearInterval(t) }, [])
  const seq = [0, 90, 180, 270, 45, 225, 135, 315]
  const active = seq[i % seq.length]
  const [tx, ty] = pt(active, R * 0.82)
  return (
    <svg viewBox="0 0 260 240" className="w-full max-w-[280px] mx-auto">
      <Compass color={color} litDegs={[active]} />
      {/* burst trail */}
      <line x1={C} y1={CY} x2={tx} y2={ty} stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.35"
        style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
      <circle cx={tx} cy={ty} r="8" fill={color} style={{ filter: `drop-shadow(0 0 12px ${color})` }} />
      <circle cx={C} cy={CY} r="6" fill={color} />
      <text x={C} y={225} textAnchor="middle" fill={color} fontSize="8" fontFamily="monospace" letterSpacing="1.5">EXPLOSIVE BURST</text>
    </svg>
  )
}

// ── T: Technique — a joint angle locking into the correct position ──
function TechniqueGraphic({ color }) {
  const [t, setT] = useState(0)
  useEffect(() => { const id = setInterval(() => setT(v => (v + 1) % 100), 40); return () => clearInterval(id) }, [])
  const p = t / 100
  // knee angle drifts, then snaps to target and holds
  const locked = p > 0.55
  const angle = locked ? 90 : 90 + Math.sin(p * 14) * 26
  const rad = (angle - 90) * Math.PI / 180
  const hip = [C, CY - 46], knee = [C - 6, CY + 6]
  const ankle = [knee[0] + 52 * Math.cos(rad), knee[1] + 52 * Math.sin(rad)]
  return (
    <svg viewBox="0 0 260 240" className="w-full max-w-[280px] mx-auto">
      <Compass color={color} litDegs={locked ? [90] : []} dim={0.07} />
      {/* target guide */}
      <path d={`M ${knee[0]} ${knee[1]} L ${knee[0] + 52} ${knee[1]}`} stroke={`${color}40`} strokeWidth="2" strokeDasharray="4,4" />
      {/* limb */}
      <line x1={hip[0]} y1={hip[1]} x2={knee[0]} y2={knee[1]} stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1={knee[0]} y1={knee[1]} x2={ankle[0]} y2={ankle[1]} stroke={color} strokeWidth="4" strokeLinecap="round"
        style={{ filter: locked ? `drop-shadow(0 0 8px ${color})` : 'none' }} />
      {[hip, knee, ankle].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={locked ? color : 'rgba(255,255,255,0.5)'}
          style={{ transition: 'fill 0.3s' }} />
      ))}
      {/* angle readout */}
      <text x={knee[0] + 14} y={knee[1] - 10} fill={locked ? color : 'rgba(255,255,255,0.4)'} fontSize="11"
        fontFamily="monospace" fontWeight="bold" style={{ transition: 'fill 0.3s' }}>
        {Math.round(angle)}°
      </text>
      <text x={C} y={225} textAnchor="middle" fill={locked ? color : 'rgba(255,255,255,0.3)'} fontSize="8"
        fontFamily="monospace" letterSpacing="1.5" style={{ transition: 'fill 0.3s' }}>
        {locked ? '✓ FORM LOCKED' : 'FINDING POSITION'}
      </text>
    </svg>
  )
}

// ── A: Agility — a path cutting between compass points ──
function AgilityGraphic({ color }) {
  const [step, setStep] = useState(0)
  useEffect(() => { const t = setInterval(() => setStep(v => v + 1), 480); return () => clearInterval(t) }, [])
  const route = [315, 45, 180, 90, 270, 0]
  const idx = step % route.length
  const cur = pt(route[idx], R * 0.8)
  const prev = pt(route[(idx - 1 + route.length) % route.length], R * 0.8)
  return (
    <svg viewBox="0 0 260 240" className="w-full max-w-[280px] mx-auto">
      <Compass color={color} litDegs={[route[idx]]} />
      {/* cut path */}
      <line x1={prev[0]} y1={prev[1]} x2={cur[0]} y2={cur[1]} stroke={color} strokeWidth="3"
        strokeLinecap="round" opacity="0.5" strokeDasharray="6,5" />
      {/* athlete marker */}
      <motion.circle cx={cur[0]} cy={cur[1]} r="9" fill={color}
        key={idx} initial={{ scale: 0.5, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.28 }} style={{ filter: `drop-shadow(0 0 12px ${color})` }} />
      <text x={C} y={225} textAnchor="middle" fill={color} fontSize="8" fontFamily="monospace" letterSpacing="1.5">CHANGE OF DIRECTION</text>
    </svg>
  )
}

// ── R: Reactivity — a random cue fires, response time ticks ──
function ReactivityGraphic({ color }) {
  const [phase, setPhase] = useState(0) // 0 wait, 1 cue, 2 hit
  const [target, setTarget] = useState(90)
  useEffect(() => {
    const seq = [[0, 700], [1, 520], [2, 620]]
    let i = 0
    const run = () => {
      const [p, ms] = seq[i % seq.length]
      setPhase(p)
      if (p === 1) setTarget(ANGLES[Math.floor(Math.random() * ANGLES.length)])
      i++
      return setTimeout(run, ms)
    }
    const t = run()
    return () => clearTimeout(t)
  }, [])
  const [tx, ty] = pt(target, R * 0.82)
  return (
    <svg viewBox="0 0 260 240" className="w-full max-w-[280px] mx-auto">
      <Compass color={color} litDegs={phase > 0 ? [target] : []} />
      {phase > 0 && (
        <circle cx={tx} cy={ty} r={phase === 2 ? 10 : 14} fill={phase === 2 ? color : 'none'}
          stroke={color} strokeWidth="2.5" opacity={phase === 2 ? 1 : 0.7}
          style={{ transition: 'all 0.18s', filter: `drop-shadow(0 0 10px ${color})` }} />
      )}
      <circle cx={C} cy={CY} r="6" fill="rgba(255,255,255,0.5)" />
      <text x={C} y={225} textAnchor="middle" fill={phase === 2 ? color : 'rgba(255,255,255,0.35)'} fontSize="8"
        fontFamily="monospace" letterSpacing="1.5" style={{ transition: 'fill 0.2s' }}>
        {phase === 0 ? 'READY…' : phase === 1 ? 'CUE!' : '✓ REACTED'}
      </text>
    </svg>
  )
}

const PILLARS = [
  { key: 'S', word: 'Speed', icon: Zap, color: '#FFD700', Graphic: SpeedGraphic,
    short: 'Explosive movement and quickness.',
    detail: 'Speed starts at the ground. Driving off a fixed compass point trains your first step to fire the same way every time, so the burst you build on the mat is the burst you get on the field.' },
  { key: 'T', word: 'Technique', icon: Target, color: '#007AFF', Graphic: TechniqueGraphic,
    short: 'Proper form, maximum efficiency.',
    detail: 'Technique is repeatable geometry. Because every position on the Star Mat has a number, your body stops guessing where to land, and correct form becomes the position you default to under fatigue.' },
  { key: 'A', word: 'Agility', icon: Move, color: '#30D158', Graphic: AgilityGraphic,
    short: 'Change direction, rapidly.',
    detail: 'Agility is decided in the split second you plant and cut. Training between marked angles builds clean, efficient direction changes, so you carry speed through the cut instead of bleeding it.' },
  { key: 'R', word: 'Reactivity', icon: Activity, color: '#BF5AF2', Graphic: ReactivityGraphic,
    short: 'Fast-twitch response.',
    detail: 'Reactivity is the gap between the cue and your first move. Load & Decide drills force you to read, choose a direction, and go, training your nervous system to shorten that gap.' },
]

export default function StarAcronym() {
  const [active, setActive] = useState('S')
  const p = PILLARS.find(x => x.key === active)
  const Graphic = p.Graphic

  return (
    <section className="section-padding py-24 border-t border-white/[0.06] bg-star-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] rounded-full blur-[110px] transition-colors duration-700"
          style={{ background: `${p.color}0d` }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="text-center mb-12">
          <p className="text-star-yellow text-xs font-bold tracking-[0.25em] uppercase mb-5">The Name Is the Method</p>
          <img src="/images/star-wordmark.png" alt="S.T.A.R." className="w-full max-w-md mx-auto mb-6 object-contain" />
          <p className="text-white/50 text-lg leading-relaxed max-w-2xl mx-auto">
            Star Fitness isn't just a name. Every session on the mat trains the four qualities that separate good athletes from great ones. <span className="text-white/70">Tap a letter.</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Letter buttons */}
          <div className="grid grid-cols-2 gap-3 order-2 lg:order-1">
            {PILLARS.map(({ key, word, icon: Icon, color, short }, i) => {
              const on = active === key
              return (
                <motion.button
                  key={key}
                  onClick={() => setActive(key)}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-2xl border p-5 text-left transition-all duration-300 relative overflow-hidden"
                  style={{
                    borderColor: on ? `${color}60` : 'rgba(255,255,255,0.08)',
                    background: on ? `${color}10` : 'rgba(255,255,255,0.02)',
                    boxShadow: on ? `0 0 28px ${color}1f` : 'none',
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-black text-5xl leading-none transition-colors duration-300"
                      style={{ color: on ? color : 'rgba(255,255,255,0.25)' }}>{key}</span>
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{ background: on ? `${color}18` : 'rgba(255,255,255,0.04)', border: `1px solid ${on ? `${color}40` : 'rgba(255,255,255,0.08)'}` }}>
                      <Icon size={15} style={{ color: on ? color : 'rgba(255,255,255,0.3)' }} />
                    </span>
                  </div>
                  <p className="font-bold text-base mb-1 transition-colors duration-300"
                    style={{ color: on ? '#fff' : 'rgba(255,255,255,0.7)' }}>{word}</p>
                  <p className="text-white/40 text-xs leading-relaxed">{short}</p>
                </motion.button>
              )
            })}
          </div>

          {/* Animated panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }} className="order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border bg-white/[0.02] p-6"
                style={{ borderColor: `${p.color}28` }}
              >
                <Graphic color={p.color} />
                <p className="text-center text-xs tracking-widest uppercase mt-1 mb-4 font-bold" style={{ color: p.color }}>
                  {p.word}
                </p>
                <p className="text-white/55 text-sm leading-relaxed text-center">{p.detail}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

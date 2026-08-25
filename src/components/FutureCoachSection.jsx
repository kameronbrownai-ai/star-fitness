import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ScanLine, MessageSquare, TrendingUp, Mic, Camera } from 'lucide-react'
import AIWorkoutChat from './AIWorkoutChat'
import FitnessDisclaimer from './FitnessDisclaimer'

// ─────────────────────────────────────────────────────────────────────────────
// Original, futuristic HUD graphics, a body-scan reticle, an AI voice console,
// and a rising Star Score. All hand-built SVG so nothing resembles a competitor.
// ─────────────────────────────────────────────────────────────────────────────

const GRID = 'rgba(255,255,255,0.05)'

function HudFrame({ color = '#007AFF' }) {
  // corner reticle brackets
  const b = (x, y, sx, sy) => (
    <path d={`M ${x + sx * 14},${y} L ${x},${y} L ${x},${y + sy * 14}`} stroke={color} strokeWidth="1.5" fill="none" opacity="0.7" />
  )
  return (
    <g>
      {b(10, 10, 1, 1)}{b(290, 10, -1, 1)}{b(10, 350, 1, -1)}{b(290, 350, -1, -1)}
    </g>
  )
}

// ── ASSESS: animated body-scan reticle producing a Star Score ──
function ScanHUD() {
  const [t, setT] = useState(0)
  useEffect(() => { const id = setInterval(() => setT(v => (v + 1) % 100), 40); return () => clearInterval(id) }, [])
  const scanY = 70 + (Math.sin(t / 100 * Math.PI * 2) * 0.5 + 0.5) * 210
  const score = Math.min(88, Math.round((t < 55 ? t / 55 : 1) * 88))

  // simple standing skeleton (normalized to the 300x360 canvas)
  const J = {
    head: [150, 78], neck: [150, 105], lsh: [122, 112], rsh: [178, 112],
    lel: [108, 150], rel: [192, 150], lwr: [100, 188], rwr: [200, 188],
    lhip: [134, 190], rhip: [166, 190], lkn: [128, 250], rkn: [172, 250],
    lank: [124, 306], rank: [176, 306],
  }
  const bones = [['neck','lsh'],['neck','rsh'],['lsh','lel'],['lel','lwr'],['rsh','rel'],['rel','rwr'],['lsh','lhip'],['rsh','rhip'],['lhip','rhip'],['lhip','lkn'],['lkn','lank'],['rhip','rkn'],['rkn','rank']]
  const lit = (y) => Math.abs(y - scanY) < 26

  return (
    <svg viewBox="0 0 300 360" className="w-full h-full">
      {/* grid */}
      {Array.from({ length: 10 }).map((_, i) => <line key={'v'+i} x1={i*30+15} y1={10} x2={i*30+15} y2={350} stroke={GRID} strokeWidth="0.5" />)}
      {Array.from({ length: 12 }).map((_, i) => <line key={'h'+i} x1={10} y1={i*30+10} x2={290} y2={i*30+10} stroke={GRID} strokeWidth="0.5" />)}
      <HudFrame color="#007AFF" />

      {/* bones */}
      {bones.map(([a, b], i) => (
        <line key={i} x1={J[a][0]} y1={J[a][1]} x2={J[b][0]} y2={J[b][1]} stroke="rgba(0,122,255,0.5)" strokeWidth="2" strokeLinecap="round" />
      ))}
      {/* head */}
      <circle cx={J.head[0]} cy={J.head[1]} r="16" fill="none" stroke="rgba(0,122,255,0.6)" strokeWidth="2" />
      {/* joints */}
      {Object.values(J).map(([x, y], i) => {
        const on = lit(y)
        return <circle key={i} cx={x} cy={y} r={on ? 5 : 3} fill={on ? '#FFD700' : '#007AFF'}
          style={{ filter: on ? 'drop-shadow(0 0 6px #FFD700)' : 'drop-shadow(0 0 3px #007AFF)' }} />
      })}

      {/* scan line */}
      <line x1={18} y1={scanY} x2={282} y2={scanY} stroke="#FFD700" strokeWidth="2" opacity="0.9" style={{ filter: 'drop-shadow(0 0 8px #FFD700)' }} />
      <text x={22} y={scanY - 5} fill="#FFD700" fontSize="8" fontFamily="monospace" letterSpacing="1">SCANNING</text>

      {/* HUD readouts */}
      <text x={22} y={30} fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="monospace">STAR ASSESSMENT™</text>
      <text x={278} y={30} textAnchor="end" fill="#30D158" fontSize="8" fontFamily="monospace">● LIVE</text>
      {[['MOBILITY', 88, '#007AFF'], ['BALANCE', 84, '#30D158'], ['SYMMETRY', 92, '#BF5AF2']].map(([l, v, c], i) => (
        <g key={l}>
          <text x={22} y={330 + i * 0} fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" opacity="0" />
        </g>
      ))}
      {/* score chip */}
      <g transform="translate(214,300)">
        <rect x="0" y="0" width="64" height="40" rx="6" fill="rgba(0,0,0,0.5)" stroke="rgba(255,215,0,0.4)" strokeWidth="1" />
        <text x="32" y="17" textAnchor="middle" fill="#FFD700" fontSize="18" fontWeight="900" fontFamily="sans-serif">{score}</text>
        <text x="32" y="31" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="monospace" letterSpacing="1">STAR SCORE</text>
      </g>
    </svg>
  )
}

// ── COACH: AI console with voice waveform ──
function CoachHUD() {
  const [t, setT] = useState(0)
  useEffect(() => { const id = setInterval(() => setT(v => v + 1), 90); return () => clearInterval(id) }, [])
  const bars = Array.from({ length: 22 }, (_, i) => 6 + Math.abs(Math.sin((t + i) / 2.5)) * 26)
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      <HudFrame color="#30D158" />
      <text x="22" y="28" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="monospace">STAR MAT AI COACH™</text>
      {/* chat lines */}
      <rect x="22" y="42" width="150" height="10" rx="5" fill="rgba(255,255,255,0.10)" />
      <rect x="22" y="58" width="110" height="10" rx="5" fill="rgba(255,255,255,0.07)" />
      <rect x="150" y="80" width="128" height="10" rx="5" fill="rgba(0,122,255,0.35)" />
      <rect x="188" y="96" width="90" height="10" rx="5" fill="rgba(0,122,255,0.25)" />
      {/* voice waveform */}
      <g transform="translate(0,150)">
        {bars.map((h, i) => (
          <rect key={i} x={22 + i * 12} y={-h / 2} width="5" height={h} rx="2.5" fill="#30D158" opacity={0.5 + (h / 40)} />
        ))}
      </g>
      <text x="278" y="28" textAnchor="end" fill="#30D158" fontSize="8" fontFamily="monospace">◉ VOICE</text>
    </svg>
  )
}

// ── TRACK: rising Star Score trend ──
function TrackHUD() {
  const [t, setT] = useState(0)
  useEffect(() => { const id = setInterval(() => setT(v => (v + 1) % 120), 50); return () => clearInterval(id) }, [])
  const pts = [ [30, 150], [80, 132], [130, 138], [180, 108], [230, 92], [270, 70] ]
  const prog = Math.min(1, t / 90)
  const shown = pts.filter((_, i) => i / (pts.length - 1) <= prog + 0.01)
  const path = shown.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]},${p[1]}`).join(' ')
  const last = shown[shown.length - 1] || pts[0]
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      <HudFrame color="#FFD700" />
      <text x="22" y="28" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="monospace">STAR SCORE™ · 90 DAYS</text>
      {[70, 110, 150].map(y => <line key={y} x1={22} y1={y} x2={278} y2={y} stroke={GRID} strokeWidth="0.5" />)}
      <path d={`${path} L ${last[0]},170 L ${shown[0]?.[0] ?? 30},170 Z`} fill="rgba(255,215,0,0.10)" />
      <path d={path} fill="none" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px rgba(255,215,0,0.6))' }} />
      <circle cx={last[0]} cy={last[1]} r="5" fill="#FFD700" style={{ filter: 'drop-shadow(0 0 6px #FFD700)' }} />
      <text x="278" y="28" textAnchor="end" fill="#30D158" fontSize="8" fontFamily="monospace">▲ TREND</text>
    </svg>
  )
}

const PILLARS = [
  { key: 'assess', label: 'Assess', icon: ScanLine, color: '#007AFF', Graphic: ScanHUD, ratio: 'aspect-[3/3.6]',
    title: 'Scan your movement', desc: 'A 60-second camera scan reads your mobility, balance, control, and symmetry, and turns it into one Star Score. Your baseline, on your mat.' },
  { key: 'coach', label: 'Coach', icon: MessageSquare, color: '#30D158', Graphic: CoachHUD, ratio: 'aspect-[3/2]',
    title: 'Coached in real time', desc: 'Chat, talk, or turn on the camera. The AI Coach builds custom Star Mat workouts and calls out your form live, by voice, hands-free.' },
  { key: 'track', label: 'Track', icon: TrendingUp, color: '#FFD700', Graphic: TrackHUD, ratio: 'aspect-[3/2]',
    title: 'Track your progress', desc: 'Reassess anytime and see how your Star Score changes over time. Progress you can measure, not guess, individual results vary.' },
]

export default function FutureCoachSection() {
  return (
    <section className="section-padding py-24 border-t border-white/[0.06] bg-star-black relative overflow-x-clip">
      {/* ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-[40vw] h-[30vw] rounded-full bg-star-blue/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[40vw] h-[30vw] rounded-full bg-star-yellow/[0.05] blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-star-blue/25 bg-star-blue/8 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-star-blue animate-pulse" />
            <span className="text-star-blue text-xs font-semibold tracking-widest uppercase">The Workout of the Future</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black leading-[1.05] mb-5">
            Measure. Coach.<span className="text-gradient-blue block">Then watch yourself rise.</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            Star Fitness turns your phone and your mat into a complete training system, it scans your movement, coaches you in real time, and tracks your Star Score over time. Not just workouts. A system that shows you where you are and where you're headed.
          </p>
        </motion.div>

        {/* Futuristic pillar grid */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {PILLARS.map(({ key, label, icon: Icon, color, Graphic, ratio, title, desc }, i) => (
            <motion.div key={key} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
                  <Icon size={15} style={{ color }} />
                </span>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color }}>{`0${i + 1} · ${label}`}</span>
              </div>
              <div className={`w-full ${ratio} rounded-2xl bg-black/40 border border-white/[0.06] overflow-hidden mb-2`}>
                <Graphic />
              </div>
              <p className="text-white/25 text-[10px] mb-3">Illustrative example, not a guarantee of results.</p>
              <h3 className="text-white font-bold text-lg mb-1.5">{title}</h3>
              <p className="text-white/45 text-sm leading-relaxed flex-1">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Live demo */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div className="min-w-0" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h3 className="text-3xl md:text-4xl font-black leading-tight mb-4">Try the AI Coach<span className="text-gradient-yellow block">right now.</span></h3>
            <p className="text-white/50 leading-relaxed mb-6">
              Tell it your sport, your goal, or a problem area, it builds a Star Mat workout in under 30 seconds, with sets, reps, and the exact compass directions to face.
            </p>
            <ul className="space-y-2.5 mb-7">
              {[[ScanLine, 'Movement-scored, not guessed'], [Mic, 'Voice conversation, fully hands-free'], [Camera, 'Live camera form correction'], [TrendingUp, 'Every session builds your Star Score']].map(([Ic, txt]) => (
                <li key={txt} className="flex items-center gap-3 text-sm text-white/55">
                  <span className="w-6 h-6 rounded-lg bg-star-blue/12 border border-star-blue/25 flex items-center justify-center flex-shrink-0">
                    <Ic size={12} className="text-star-blue" />
                  </span>
                  {txt}
                </li>
              ))}
            </ul>
            <Link to="/pricing" className="btn-primary text-sm">See membership <ArrowRight size={16} /></Link>
            <FitnessDisclaimer className="mt-6" />
          </motion.div>
          <motion.div className="min-w-0" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
            <AIWorkoutChat inline />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

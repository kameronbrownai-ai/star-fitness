import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { LEVEL_COLOR, CATEGORY_LABEL, levelFor, MEANINGFUL_CHANGE } from '../lib/starScore'

// Level bands, drawn behind the line so a score is readable against the
// thresholds it is actually judged by rather than a bare 0–100 axis.
const BANDS = [
  { from: 83, to: 100, label: 'Elite', color: '#FFD700' },
  { from: 65, to: 83, label: 'Strong', color: '#30D158' },
  { from: 45, to: 65, label: 'Developing', color: '#007AFF' },
  { from: 0, to: 45, label: 'Foundation', color: '#8E8E93' },
]

const SERIES = [
  { key: 'overall', label: 'Star Score', color: '#FFD700' },
  { key: 'mobility', label: 'Mobility', color: '#007AFF' },
  { key: 'balance', label: 'Balance', color: '#30D158' },
  { key: 'control', label: 'Control', color: '#BF5AF2' },
  { key: 'symmetry', label: 'Symmetry', color: '#FF9F0A' },
]

function fmtDate(d) {
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function ProgressChart({ history }) {
  const [series, setSeries] = useState('overall')
  const [hover, setHover] = useState(null)

  // history arrives newest-first from the API; a chart reads left to right.
  const points = [...(history || [])].reverse()
  const active = SERIES.find(s => s.key === series)

  if (points.length === 0) return null

  // A single score is not a trend. Show the number and say plainly what the
  // chart needs, rather than drawing a one-point line that implies progress.
  if (points.length === 1) {
    const only = points[0]
    return (
      <div className="rounded-2xl border border-star-border bg-star-card p-6">
        <p className="text-star-grey text-xs font-semibold tracking-widest uppercase mb-4">Progress</p>
        <div className="flex items-end gap-3 mb-2">
          <p className="font-black text-5xl leading-none" style={{ color: LEVEL_COLOR[only.level] }}>{only.overall}</p>
          <p className="text-star-grey text-sm mb-1">{only.level} · {fmtDate(only.created_at)}</p>
        </div>
        <p className="text-star-grey text-sm mt-4">
          Take the assessment again to start your progress line. Two scores is all it takes.
        </p>
      </div>
    )
  }

  const W = 100, H = 46, PAD = 3 // viewBox units; scales to any width
  const n = points.length
  const x = (i) => PAD + (i / (n - 1)) * (W - PAD * 2)
  const y = (v) => PAD + (1 - v / 100) * (H - PAD * 2)

  const vals = points.map(p => (series === 'overall' ? p.overall : p[series]) ?? 0)
  const line = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(2)} ${y(v).toFixed(2)}`).join(' ')
  const area = `${line} L ${x(n - 1).toFixed(2)} ${y(0).toFixed(2)} L ${x(0).toFixed(2)} ${y(0).toFixed(2)} Z`

  const first = vals[0], last = vals[vals.length - 1]
  const change = last - first
  const meaningful = Math.abs(change) >= MEANINGFUL_CHANGE
  const best = Math.max(...vals)

  const Trend = !meaningful ? Minus : change > 0 ? TrendingUp : TrendingDown
  const trendColor = !meaningful ? '#8E8E93' : change > 0 ? '#30D158' : '#FF9F0A'

  return (
    <div className="rounded-2xl border border-star-border bg-star-card p-5 md:p-6">
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <p className="text-star-grey text-xs font-semibold tracking-widest uppercase mb-2">Progress</p>
          <div className="flex items-center gap-2">
            <Trend size={18} style={{ color: trendColor }} />
            <p className="text-white font-bold text-lg">
              {meaningful
                ? `${change > 0 ? 'Up' : 'Down'} ${Math.abs(change)} point${Math.abs(change) === 1 ? '' : 's'}`
                : 'Holding steady'}
            </p>
            <span className="text-star-grey text-sm">
              across {n} assessment{n === 1 ? '' : 's'}
            </span>
          </div>
          {/* Honest about measurement noise rather than celebrating a 1-point move */}
          {!meaningful && change !== 0 && (
            <p className="text-white/35 text-xs mt-1">
              A change under {MEANINGFUL_CHANGE} points is within normal measurement variation.
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="font-black text-3xl leading-none" style={{ color: active.color }}>{last}</p>
          <p className="text-star-grey text-xs mt-1">best {best}</p>
        </div>
      </div>

      {/* Series switcher */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        {SERIES.map(s => (
          <button
            key={s.key}
            onClick={() => { setSeries(s.key); setHover(null) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all ${
              series === s.key ? 'text-star-black border-transparent' : 'text-star-grey border-white/10 hover:text-white'
            }`}
            style={series === s.key ? { background: s.color } : undefined}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ aspectRatio: `${W} / ${H}` }} role="img"
          aria-label={`${active.label} over ${n} assessments, currently ${last}`}>
          <defs>
            <linearGradient id={`fill-${series}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={active.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={active.color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Level bands: the thresholds the score is actually judged against */}
          {BANDS.map(b => (
            <rect key={b.label} x={PAD} y={y(b.to)} width={W - PAD * 2} height={y(b.from) - y(b.to)}
              fill={b.color} opacity="0.05" />
          ))}
          {BANDS.slice(0, -1).map(b => (
            <line key={b.label} x1={PAD} x2={W - PAD} y1={y(b.from)} y2={y(b.from)}
              stroke={b.color} strokeOpacity="0.22" strokeWidth="0.25" strokeDasharray="1.2 1.2" />
          ))}

          <path d={area} fill={`url(#fill-${series})`} />
          <motion.path
            d={line} fill="none" stroke={active.color} strokeWidth="1.1"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }}
          />

          {vals.map((v, i) => (
            <g key={i}>
              {/* Generous invisible hit area so points are tappable on a phone */}
              <rect x={x(i) - 4} y={0} width={8} height={H} fill="transparent"
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                onTouchStart={() => setHover(i)} style={{ cursor: 'pointer' }} />
              <circle cx={x(i)} cy={y(v)} r={hover === i ? 1.7 : 1.1}
                fill={hover === i ? '#FFFFFF' : active.color} stroke={active.color} strokeWidth="0.5" />
            </g>
          ))}
        </svg>

        {/* Band labels down the right edge */}
        <div className="absolute inset-y-0 right-0 pointer-events-none hidden sm:flex flex-col justify-between py-[2%]">
          {BANDS.map(b => (
            <span key={b.label} className="text-[9px] font-semibold pr-1" style={{ color: b.color, opacity: 0.5 }}>
              {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-[11px] text-star-grey mt-2">
        <span>{fmtDate(points[0].created_at)}</span>
        {hover !== null && (
          <span className="text-white font-semibold">
            {fmtDate(points[hover].created_at)} · {CATEGORY_LABEL[series] || 'Star Score'} {vals[hover]}
            {series === 'overall' && ` · ${levelFor(vals[hover])}`}
          </span>
        )}
        <span>{fmtDate(points[n - 1].created_at)}</span>
      </div>
    </div>
  )
}

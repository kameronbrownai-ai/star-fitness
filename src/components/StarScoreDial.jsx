import { motion } from 'framer-motion'
import { LEVEL_COLOR } from '../lib/starScore'

// The Star Score shown as an 8-spoke compass dial (matching the mat's angles)
// with a "LOAD DECIDE"-style center. Deliberately its own look, radial star,
// gold/blue palette, compass ticks.
export default function StarScoreDial({ result, size = 240 }) {
  const c = size / 2
  const r = size / 2 - 22
  const color = LEVEL_COLOR[result.level]
  const angles = [0, 45, 90, 135, 180, 225, 270, 315]
  const labels = ['360°', '45°', '90°', '135°', '180°', '225°', '270°', '315°']

  // Category values drive the 8 spokes (each category shown twice, mirrored,
  // so the shape reads as a symmetric star).
  const cats = [
    result.categories.mobility, result.categories.balance,
    result.categories.control, result.categories.symmetry,
    result.categories.mobility, result.categories.balance,
    result.categories.control, result.categories.symmetry,
  ]

  // Build the filled star polygon from the 8 category magnitudes.
  const pts = angles.map((deg, i) => {
    const rad = (deg - 90) * Math.PI / 180
    const mag = (cats[i] / 100) * r
    return `${c + mag * Math.cos(rad)},${c + mag * Math.sin(rad)}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="mx-auto">
      {/* rings */}
      {[1, 0.66, 0.33].map((f) => (
        <circle key={f} cx={c} cy={c} r={r * f} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
      {/* spokes + tick labels */}
      {angles.map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180
        const isPrimary = deg % 90 === 0
        return (
          <g key={deg}>
            <line x1={c} y1={c} x2={c + r * Math.cos(rad)} y2={c + r * Math.sin(rad)}
              stroke={isPrimary ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'} strokeWidth="1" />
            <text x={c + (r + 12) * Math.cos(rad)} y={c + (r + 12) * Math.sin(rad)}
              textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="monospace">
              {labels[i]}
            </text>
          </g>
        )
      })}
      {/* filled star */}
      <motion.polygon
        initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }} style={{ transformOrigin: 'center' }}
        points={pts} fill={`${color}22`} stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {/* center score, LOAD DECIDE style */}
      <circle cx={c} cy={c} r={34} fill="rgba(0,0,0,0.55)" stroke={`${color}55`} strokeWidth="1.5" />
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        x={c} y={c - 3} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="30" fontWeight="900" fontFamily="sans-serif">
        {result.overall}
      </motion.text>
      <text x={c} y={c + 16} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" letterSpacing="1.5">
        STAR SCORE
      </text>
    </svg>
  )
}

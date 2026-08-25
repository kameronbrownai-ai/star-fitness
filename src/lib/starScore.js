// ── Star Assessment scoring engine ──────────────────────────────────────────
// Pure functions, takes the raw measurements the pose camera already produces
// (joint angles + steadiness) and returns a 0–100 Star Score with category
// breakdowns. No medical/clinical claims: this is a movement-quality read.
//
// All thresholds live here as named constants so they're easy to calibrate
// against real athletes after launch. Weights are "balanced all-around".

// Map a value through linear breakpoints -> 0..100 (clamped).
function scaleBreakpoints(value, points) {
  // points: array of [inputValue, score] sorted by inputValue ascending
  if (value <= points[0][0]) return points[0][1]
  if (value >= points[points.length - 1][0]) return points[points.length - 1][1]
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i], [x1, y1] = points[i + 1]
    if (value >= x0 && value <= x1) {
      const t = (value - x0) / (x1 - x0)
      return Math.round(y0 + t * (y1 - y0))
    }
  }
  return 50
}

const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(n)))

// Deeper squat (smaller knee angle) = better mobility, to a point.
const KNEE_DEPTH = [[60, 100], [90, 88], [110, 65], [130, 40], [150, 20]]
// Steadiness comes in already normalized 0..100 from the capture layer
// (100 = rock steady, 0 = lots of wobble). Passed straight through.
// Symmetry: smaller left/right angle delta (degrees) = better.
const SYMMETRY_DELTA = [[0, 100], [5, 92], [12, 72], [20, 48], [35, 20]]

export function computeStarScore(m) {
  // ── Mobility: squat depth (knee) + hip hinge ──
  const squatDepth = scaleBreakpoints(m.squat?.minKneeAngle ?? 130, KNEE_DEPTH)
  const hipHinge = scaleBreakpoints(m.squat?.minHipAngle ?? 130, KNEE_DEPTH)
  const mobility = clamp(squatDepth * 0.65 + hipHinge * 0.35)

  // ── Balance: single-leg hold steadiness, both sides ──
  const balL = m.balanceLeft?.steadiness ?? 50
  const balR = m.balanceRight?.steadiness ?? 50
  const balance = clamp((balL + balR) / 2)

  // ── Control: lunge steadiness + depth, both sides ──
  const ctrlL = ((m.lungeLeft?.steadiness ?? 50) + scaleBreakpoints(m.lungeLeft?.minKneeAngle ?? 120, KNEE_DEPTH)) / 2
  const ctrlR = ((m.lungeRight?.steadiness ?? 50) + scaleBreakpoints(m.lungeRight?.minKneeAngle ?? 120, KNEE_DEPTH)) / 2
  const control = clamp((ctrlL + ctrlR) / 2)

  // ── Symmetry: left/right differences across squat, lunge, balance ──
  const squatSym = scaleBreakpoints(m.squat?.kneeSymmetryDelta ?? 12, SYMMETRY_DELTA)
  const lungeSym = scaleBreakpoints(
    Math.abs((m.lungeLeft?.minKneeAngle ?? 120) - (m.lungeRight?.minKneeAngle ?? 120)),
    SYMMETRY_DELTA
  )
  const balSym = scaleBreakpoints(Math.abs(balL - balR) * 0.35, SYMMETRY_DELTA)
  const symmetry = clamp(squatSym * 0.4 + lungeSym * 0.35 + balSym * 0.25)

  // ── Overall: balanced all-around ──
  const overall = clamp((mobility + balance + control + symmetry) / 4)

  return {
    overall,
    level: levelFor(overall),
    categories: { mobility, balance, control, symmetry },
  }
}

export function levelFor(score) {
  if (score >= 83) return 'Elite'
  if (score >= 65) return 'Strong'
  if (score >= 45) return 'Developing'
  return 'Foundation'
}

export const LEVEL_COLOR = {
  Elite: '#FFD700',
  Strong: '#30D158',
  Developing: '#007AFF',
  Foundation: '#8E8E93',
}

// Turn a finished score into 1–2 plain-language coaching notes (no diagnosis).
export function scoreInsights(result) {
  const c = result.categories
  const notes = []
  const lowest = Object.entries(c).sort((a, b) => a[1] - b[1])[0]
  const highest = Object.entries(c).sort((a, b) => b[1] - a[1])[0]
  const labels = { mobility: 'mobility', balance: 'balance', control: 'movement control', symmetry: 'left-right symmetry' }
  notes.push(`Your strongest area is ${labels[highest[0]]} (${highest[1]}).`)
  if (lowest[1] < 70) notes.push(`${labels[lowest[0]][0].toUpperCase() + labels[lowest[0]].slice(1)} has the most room to grow (${lowest[1]}), a good focus for your next few sessions.`)
  else notes.push('Well-rounded across the board, keep progressing the load.')
  return notes
}

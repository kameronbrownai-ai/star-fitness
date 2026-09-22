// ── Star Assessment scoring engine ──────────────────────────────────────────
// Pure functions. Takes the measurements the pose camera produces and returns
// a 0–100 Star Score with category breakdowns. No medical or clinical claims:
// this is a movement-quality read.
//
// All thresholds live here as named constants so they can be calibrated
// against real athletes. Weights are "balanced all-around".
//
// ── Why the inputs look the way they do ─────────────────────────────────────
// Two earlier sources of inconsistency shaped this file, and both are worth
// knowing before changing anything here:
//
// 1. Angles must arrive already computed from MediaPipe's WORLD landmarks
//    (metres, 3D, origin at the hips), never from the normalised 0..1 screen
//    landmarks. Screen x is divided by image width and y by image height, so
//    on any non-square camera one unit of x is not one unit of y and every
//    angle is skewed. A true 135° knee measured that way reads 143° on a 4:3
//    camera and 151° on a 16:9 laptop: the same athlete scoring ~30 points
//    apart depending on the device.
//
// 2. Depth must arrive as a robust percentile, never a raw minimum. Pose
//    tracking drops a limb for a frame or two in almost every capture, and a
//    single bad frame produces a spuriously deep angle. Taking the minimum
//    made two glitched frames raise a score from 70 to 85.

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

// Knee flexion in a squat or lunge. Standing is ~175°, parallel ~90°.
const KNEE_DEPTH = [[60, 100], [90, 88], [110, 65], [130, 40], [150, 20]]

// Hip flexion (shoulder–hip–knee). A different joint with a different range,
// so it gets its own scale. Using the knee's scale here understated every
// athlete's hinge, because a hip closes further than a knee at the same depth.
const HIP_HINGE = [[55, 100], [75, 88], [95, 68], [120, 45], [150, 20]]

// Left/right difference in degrees. Smaller is better.
const SYMMETRY_DELTA = [[0, 100], [5, 92], [12, 72], [20, 48], [35, 20]]

// Left/right difference in steadiness points (0–100), which is a different
// unit from degrees and so needs its own scale.
const BALANCE_SYMMETRY = [[0, 100], [8, 90], [18, 68], [30, 42], [50, 15]]

// A capture this far below full confidence is reported rather than scored, so
// a failed move never silently lands as a mediocre score.
const MIN_QUALITY = 0.5

/**
 * @param m measurements keyed by move. Each carries:
 *   kneeAngle        robust flexion in degrees (percentile, not minimum)
 *   hipAngle         robust hip flexion in degrees
 *   kneeSymmetryDelta absolute left/right difference in degrees
 *   steadiness       0–100, already scale-invariant
 *   quality          0–1 share of frames with a confident, complete pose
 */
export function computeStarScore(m) {
  const q = (move) => m[move]?.quality ?? 0
  const captured = ['squat', 'lungeLeft', 'lungeRight', 'balanceLeft', 'balanceRight']
    .filter(k => q(k) >= MIN_QUALITY)

  // ── Mobility: squat depth at the knee and the hip ──
  const squatDepth = scaleBreakpoints(m.squat?.kneeAngle ?? 130, KNEE_DEPTH)
  const hipHinge = scaleBreakpoints(m.squat?.hipAngle ?? 130, HIP_HINGE)
  const mobility = clamp(squatDepth * 0.65 + hipHinge * 0.35)

  // ── Balance: single-leg hold steadiness, both sides ──
  const balL = m.balanceLeft?.steadiness ?? 50
  const balR = m.balanceRight?.steadiness ?? 50
  const balance = clamp((balL + balR) / 2)

  // ── Control: lunge steadiness and depth, both sides ──
  const side = (mv) => ((mv?.steadiness ?? 50) + scaleBreakpoints(mv?.kneeAngle ?? 120, KNEE_DEPTH)) / 2
  const control = clamp((side(m.lungeLeft) + side(m.lungeRight)) / 2)

  // ── Symmetry: left/right differences across squat, lunge and balance ──
  const squatSym = scaleBreakpoints(m.squat?.kneeSymmetryDelta ?? 12, SYMMETRY_DELTA)
  const lungeSym = scaleBreakpoints(
    Math.abs((m.lungeLeft?.kneeAngle ?? 120) - (m.lungeRight?.kneeAngle ?? 120)),
    SYMMETRY_DELTA
  )
  // Compared on its own 0–100 scale rather than being fudged into degrees.
  const balSym = scaleBreakpoints(Math.abs(balL - balR), BALANCE_SYMMETRY)
  const symmetry = clamp(squatSym * 0.4 + lungeSym * 0.35 + balSym * 0.25)

  const overall = clamp((mobility + balance + control + symmetry) / 4)

  return {
    overall,
    level: levelFor(overall),
    categories: { mobility, balance, control, symmetry },
    // How much of the assessment the camera actually saw. The UI warns when
    // this is low instead of presenting a confident-looking number.
    capture: {
      movesScored: captured.length,
      movesTotal: 5,
      confident: captured.length === 5,
    },
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

export const CATEGORY_LABEL = {
  mobility: 'Mobility',
  balance: 'Balance',
  control: 'Control',
  symmetry: 'Symmetry',
}

/**
 * A change smaller than this is measurement noise, not progress. Even with the
 * fixes above, pose estimation has run-to-run variation; telling someone they
 * improved by 1 point would be dishonest.
 */
export const MEANINGFUL_CHANGE = 4

// Turn a finished score into 1–2 plain-language coaching notes (no diagnosis).
export function scoreInsights(result) {
  const c = result.categories
  const notes = []
  const sorted = Object.entries(c).sort((a, b) => a[1] - b[1])
  const lowest = sorted[0], highest = sorted[sorted.length - 1]
  const labels = {
    mobility: 'mobility',
    balance: 'balance',
    control: 'movement control',
    symmetry: 'left-right symmetry',
  }
  notes.push(`Your strongest area is ${labels[highest[0]]} (${highest[1]}).`)
  if (lowest[1] < 70) {
    const l = labels[lowest[0]]
    notes.push(`${l[0].toUpperCase() + l.slice(1)} has the most room to grow (${lowest[1]}), a good focus for your next few sessions.`)
  } else {
    notes.push('Well-rounded across the board, keep progressing the load.')
  }
  return notes
}

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Check, ArrowRight, RotateCcw } from 'lucide-react'
import { computeStarScore, levelFor, LEVEL_COLOR, scoreInsights } from '../lib/starScore'
import { useAuth } from '../context/AuthContext'
import StarScoreDial from './StarScoreDial'

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
const LM = { L_SHOULDER: 11, R_SHOULDER: 12, L_HIP: 23, R_HIP: 24, L_KNEE: 25, R_KNEE: 26, L_ANKLE: 27, R_ANKLE: 28 }

function angle(a, b, c) {
  if (!a || !b || !c) return null
  const ab = { x: a.x - b.x, y: a.y - b.y }, cb = { x: c.x - b.x, y: c.y - b.y }
  const dot = ab.x * cb.x + ab.y * cb.y
  const mag = Math.hypot(ab.x, ab.y) * Math.hypot(cb.x, cb.y)
  if (!mag) return null
  return Math.round(Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180 / Math.PI)
}

// The scripted 5-move sequence, each cue references the Star Mat's own markers.
const MOVES = [
  { key: 'squat',       title: 'Star Squat',        cue: 'Feet on the 90° and 270° arrows. Squat down slow, stand tall.', type: 'rep',  seconds: 6 },
  { key: 'lungeLeft',   title: 'Reverse Lunge, L', cue: 'Step your LEFT foot back to the 180° arrow. Lower and hold.',   type: 'rep',  seconds: 5 },
  { key: 'lungeRight',  title: 'Reverse Lunge, R', cue: 'Step your RIGHT foot back to the 180° arrow. Lower and hold.',  type: 'rep',  seconds: 5 },
  { key: 'balanceLeft', title: 'Single-Leg, L',    cue: 'Stand on your LEFT leg over LOAD DECIDE. Hold steady.',         type: 'hold', seconds: 12 },
  { key: 'balanceRight',title: 'Single-Leg, R',    cue: 'Stand on your RIGHT leg over LOAD DECIDE. Hold steady.',        type: 'hold', seconds: 12 },
]

export default function StarAssessment({ onClose }) {
  const { session, refreshEntitlement } = useAuth()
  const videoRef = useRef(null)
  const detectorRef = useRef(null)
  const animRef = useRef(null)
  const streamRef = useRef(null)
  const mountedRef = useRef(true)
  const samplesRef = useRef([])       // collected during the active recording window
  const recordingRef = useRef(false)

  const [phase, setPhase] = useState('loading') // loading | intro | countdown | recording | computing | results | error
  const [moveIdx, setMoveIdx] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [timeLeft, setTimeLeft] = useState(0)
  const [poseOk, setPoseOk] = useState(false)
  const [result, setResult] = useState(null)
  const [saveState, setSaveState] = useState(null) // null | 'saving' | 'saved' | 'limit' | 'error'
  const measuresRef = useRef({})

  // ── Detection loop ──
  function loop() {
    if (!detectorRef.current || !videoRef.current || !mountedRef.current) return
    const v = videoRef.current
    if (v.readyState >= 2) {
      try {
        const res = detectorRef.current.detectForVideo(v, performance.now())
        const lm = res?.landmarks?.[0]
        if (lm && lm.length) {
          setPoseOk(true)
          if (recordingRef.current) {
            samplesRef.current.push({
              lKnee: angle(lm[LM.L_HIP], lm[LM.L_KNEE], lm[LM.L_ANKLE]),
              rKnee: angle(lm[LM.R_HIP], lm[LM.R_KNEE], lm[LM.R_ANKLE]),
              lHip: angle(lm[LM.L_SHOULDER], lm[LM.L_HIP], lm[LM.L_KNEE]),
              rHip: angle(lm[LM.R_SHOULDER], lm[LM.R_HIP], lm[LM.R_KNEE]),
              hipX: (lm[LM.L_HIP].x + lm[LM.R_HIP].x) / 2,
              hipY: (lm[LM.L_HIP].y + lm[LM.R_HIP].y) / 2,
            })
          }
        } else setPoseOk(false)
      } catch {}
    }
    animRef.current = requestAnimationFrame(loop)
  }

  async function init() {
    try {
      const { PoseLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
      const vision = await FilesetResolver.forVisionTasks(WASM_URL)
      let det
      try {
        det = await PoseLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' }, runningMode: 'VIDEO', numPoses: 1 })
      } catch {
        det = await PoseLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' }, runningMode: 'VIDEO', numPoses: 1 })
      }
      if (!mountedRef.current) { det.close?.(); return }
      detectorRef.current = det
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false })
      if (!mountedRef.current) { stream.getTracks().forEach(t => t.stop()); return }
      streamRef.current = stream
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setPhase('intro')
      loop()
    } catch (e) {
      console.error('assessment init', e)
      if (mountedRef.current) setPhase('error')
    }
  }

  useEffect(() => {
    mountedRef.current = true
    init()
    return () => {
      mountedRef.current = false
      if (animRef.current) cancelAnimationFrame(animRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
      try { detectorRef.current?.close?.() } catch {}
    }
  }, [])

  // ── Move sequencing: countdown -> record -> store -> next ──
  function startMove(idx) {
    setMoveIdx(idx); setPhase('countdown'); setCountdown(3)
  }
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown <= 0) { beginRecording(); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 800)
    return () => clearTimeout(t)
  }, [phase, countdown])

  function beginRecording() {
    samplesRef.current = []
    recordingRef.current = true
    const secs = MOVES[moveIdx].seconds
    setTimeLeft(secs); setPhase('recording')
  }
  useEffect(() => {
    if (phase !== 'recording') return
    if (timeLeft <= 0) { finishMove(); return }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, timeLeft])

  function finishMove() {
    recordingRef.current = false
    const s = samplesRef.current.filter(Boolean)
    measuresRef.current[MOVES[moveIdx].key] = summarize(MOVES[moveIdx], s)
    if (moveIdx < MOVES.length - 1) startMove(moveIdx + 1)
    else compute()
  }

  async function compute() {
    setPhase('computing')
    const r = computeStarScore(measuresRef.current)
    setResult(r)
    setPhase('results')
    // Save (gated server-side)
    setSaveState('saving')
    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ overall: r.overall, level: r.level, categories: r.categories }),
      })
      if (res.status === 403) { setSaveState('limit'); return }
      if (!res.ok) throw new Error()
      setSaveState('saved')
      refreshEntitlement?.()
    } catch { setSaveState('error') }
  }

  const move = MOVES[moveIdx]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-star-black flex flex-col">
      {/* Camera */}
      <div className="relative flex-1 overflow-hidden">
        <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

        <button onClick={onClose} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center z-10">
          <X size={20} className="text-white" />
        </button>

        {phase === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 size={30} className="text-star-yellow animate-spin" />
            <p className="text-white text-sm">Warming up the Star Assessment…</p>
          </div>
        )}

        {phase === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="text-white font-bold text-lg">Camera needed</p>
            <p className="text-star-grey text-sm">Allow camera access and try again, Account → Star Assessment.</p>
            <button onClick={onClose} className="px-6 py-2.5 bg-star-yellow text-black rounded-xl text-sm font-bold">Go back</button>
          </div>
        )}

        {/* Pose indicator */}
        {(phase === 'intro' || phase === 'countdown' || phase === 'recording') && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-2 z-10">
            <div className={`w-2 h-2 rounded-full ${poseOk ? 'bg-star-green' : 'bg-star-grey'}`} />
            <span className="text-white text-xs">{poseOk ? 'You\'re in frame' : 'Step back, full body'}</span>
          </div>
        )}

        {/* Intro */}
        {phase === 'intro' && (
          <div className="absolute inset-x-0 bottom-0 p-6 text-center">
            <p className="text-star-yellow text-xs font-bold tracking-widest uppercase mb-2">Star Assessment™</p>
            <h2 className="text-white font-black text-2xl mb-2">5 moves. 60 seconds.<br />One Star Score.</h2>
            <p className="text-star-grey text-sm mb-3 max-w-sm mx-auto">Prop your phone up so your whole body's in frame, stand on your mat, and follow the cues. We'll read your movement and score it.</p>
            {/* Camera-data privacy notice, [ATTORNEY TO FINALIZE wording] */}
            <p className="text-white/40 text-xs mb-2 max-w-sm mx-auto">Everything is processed privately on your device. No video or images ever leave your phone, only your final Star Score is saved to your account.</p>
            {/* Fitness disclaimer, [ATTORNEY TO FINALIZE wording] */}
            <p className="text-white/40 text-xs mb-5 max-w-sm mx-auto">The Star Score is an estimate for general fitness and educational purposes only, not medical advice. Consult a physician before exercising.</p>

            <button onClick={() => startMove(0)} disabled={!poseOk}
              className="px-8 py-3.5 rounded-full bg-star-yellow text-black font-bold text-base disabled:opacity-40 inline-flex items-center gap-2">
              Start <ArrowRight size={18} />
            </button>
            {!poseOk && <p className="text-star-grey text-xs mt-3">Step back until your full body is visible</p>}
          </div>
        )}

        {/* Countdown */}
        {phase === 'countdown' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-star-yellow text-sm font-bold tracking-widest uppercase mb-1">{move.title}</p>
            <p className="text-white/80 text-sm mb-6 max-w-xs text-center px-6">{move.cue}</p>
            <motion.div key={countdown} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-star-yellow font-black text-8xl">{countdown || 'GO'}</motion.div>
          </div>
        )}

        {/* Recording */}
        {phase === 'recording' && (
          <div className="absolute inset-x-0 bottom-0 p-6 text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full px-3 py-1 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-300 text-xs font-bold">RECORDING</span>
            </div>
            <p className="text-star-yellow text-sm font-bold tracking-widest uppercase">{move.title}</p>
            <p className="text-white/80 text-sm mb-3 max-w-xs mx-auto">{move.cue}</p>
            <p className="text-white font-black text-5xl">{timeLeft}</p>
            <div className="flex gap-1.5 justify-center mt-4">
              {MOVES.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i < moveIdx ? 'w-6 bg-star-green' : i === moveIdx ? 'w-6 bg-star-yellow' : 'w-3 bg-white/20'}`} />
              ))}
            </div>
          </div>
        )}

        {phase === 'computing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 size={30} className="text-star-yellow animate-spin" />
            <p className="text-white text-sm">Calculating your Star Score…</p>
          </div>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {phase === 'results' && result && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
            className="absolute inset-0 bg-star-black overflow-y-auto">
            <div className="min-h-full flex flex-col items-center justify-center px-6 py-10 text-center">
              <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-star-card border border-star-border flex items-center justify-center">
                <X size={18} className="text-white" />
              </button>
              <p className="text-star-yellow text-xs font-bold tracking-widest uppercase mb-1">Your Star Score</p>

              <StarScoreDial result={result} />

              <p className="font-black text-3xl mt-4" style={{ color: LEVEL_COLOR[result.level] }}>{result.level}</p>

              <div className="w-full max-w-sm mt-6 space-y-2.5">
                {Object.entries(result.categories).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/70 capitalize">{k}</span>
                      <span className="text-white font-bold">{v}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full" style={{ background: LEVEL_COLOR[result.level] }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full max-w-sm mt-6 rounded-2xl border border-star-border bg-star-card p-4 text-left">
                {scoreInsights(result).map((n, i) => (
                  <p key={i} className="text-star-grey text-sm leading-relaxed mb-1.5 last:mb-0">• {n}</p>
                ))}
              </div>

              {saveState === 'limit' && (
                <div className="w-full max-w-sm mt-4 rounded-2xl border border-star-yellow/30 bg-star-yellow/[0.07] p-4">
                  <p className="text-white/80 text-sm">Your free Star Score is saved. <span className="text-star-yellow font-semibold">Retakes and progress tracking are an Elite feature</span>, upgrade to reassess and watch your score climb.</p>
                </div>
              )}
              {saveState === 'saved' && (
                <p className="text-star-green text-sm mt-4 flex items-center gap-1.5"><Check size={15} /> Saved to your account</p>
              )}

              <div className="flex gap-3 mt-7">
                <button onClick={onClose} className="px-6 py-3 rounded-full bg-star-yellow text-black font-bold text-sm">Done</button>
              </div>

              {/* Fitness/medical disclaimer, [ATTORNEY TO FINALIZE wording] */}
              <p className="text-white/35 text-[11px] leading-relaxed max-w-sm mt-6">
                The Star Score is an estimate for general fitness and educational purposes only. It is not a medical device, diagnosis, or medical advice. Consult a physician before beginning any exercise program.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Reduce the frame samples for a move into the metrics the scorer expects.
function summarize(move, samples) {
  if (!samples.length) return {}
  if (move.type === 'rep') {
    // deepest point = smallest knee angle reached
    const lKnees = samples.map(s => s.lKnee).filter(Boolean)
    const rKnees = samples.map(s => s.rKnee).filter(Boolean)
    const lMin = lKnees.length ? Math.min(...lKnees) : 120
    const rMin = rKnees.length ? Math.min(...rKnees) : 120
    const lHips = samples.map(s => s.lHip).filter(Boolean)
    const rHips = samples.map(s => s.rHip).filter(Boolean)
    const hipMin = Math.min(lHips.length ? Math.min(...lHips) : 130, rHips.length ? Math.min(...rHips) : 130)
    return {
      minKneeAngle: Math.min(lMin, rMin),
      minHipAngle: hipMin,
      kneeSymmetryDelta: Math.abs(lMin - rMin),
      steadiness: steadinessOf(samples),
    }
  }
  // hold: steadiness of the hip center over the window
  return { steadiness: steadinessOf(samples), hipLevelDelta: 0 }
}

// Lower positional variance during the window => steadier => higher score.
function steadinessOf(samples) {
  const xs = samples.map(s => s.hipX), ys = samples.map(s => s.hipY)
  const sd = (a) => { const m = a.reduce((x, y) => x + y, 0) / a.length; return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length) }
  const wobble = (sd(xs) + sd(ys)) / 2 // in normalized 0..1 coords
  // ~0.002 = very steady, ~0.05 = very wobbly
  return Math.max(0, Math.min(100, Math.round(100 - (wobble - 0.004) / (0.05 - 0.004) * 100)))
}

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FlipHorizontal, Zap, Loader2, Radio } from 'lucide-react'
import { buildUtterance, LIVE_CUE_RATE } from '../lib/speech'

const LIVE_CHECK_INTERVAL = 9000 // ms between live AI form checks

const LIVE_SYSTEM_PROMPT = `You are a live form-check coach watching an athlete train on the Star Mat through their camera. You receive a snapshot with a pose skeleton overlay and measured joint angles.

Respond in UNDER 50 words, spoken-word style (this is read aloud):
1. Name the exercise you see them doing.
2. If they told you what exercise they intend, and what you see does NOT match, say so clearly first.
3. Give ONE specific correction (reference a body part and direction), or say "form looks good" if it does.

No markdown, no lists, no emoji. Plain spoken sentences only.`

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'

const LM = {
  L_SHOULDER: 11, R_SHOULDER: 12,
  L_ELBOW: 13,    R_ELBOW: 14,
  L_WRIST: 15,    R_WRIST: 16,
  L_HIP: 23,      R_HIP: 24,
  L_KNEE: 25,     R_KNEE: 26,
  L_ANKLE: 27,    R_ANKLE: 28,
}

const CONNECTIONS = [
  [LM.L_SHOULDER, LM.R_SHOULDER],
  [LM.L_SHOULDER, LM.L_ELBOW], [LM.L_ELBOW, LM.L_WRIST],
  [LM.R_SHOULDER, LM.R_ELBOW], [LM.R_ELBOW, LM.R_WRIST],
  [LM.L_SHOULDER, LM.L_HIP],  [LM.R_SHOULDER, LM.R_HIP],
  [LM.L_HIP, LM.R_HIP],
  [LM.L_HIP, LM.L_KNEE],  [LM.L_KNEE, LM.L_ANKLE],
  [LM.R_HIP, LM.R_KNEE],  [LM.R_KNEE, LM.R_ANKLE],
]

const KEY_JOINTS = new Set([
  LM.L_SHOULDER, LM.R_SHOULDER,
  LM.L_HIP, LM.R_HIP,
  LM.L_KNEE, LM.R_KNEE,
  LM.L_ANKLE, LM.R_ANKLE,
])

const ANGLE_DEFS = [
  { key: 'leftKnee',  label: 'L. Knee',  a: LM.L_HIP,      b: LM.L_KNEE, c: LM.L_ANKLE },
  { key: 'rightKnee', label: 'R. Knee',  a: LM.R_HIP,      b: LM.R_KNEE, c: LM.R_ANKLE },
  { key: 'leftHip',   label: 'L. Hip',   a: LM.L_SHOULDER, b: LM.L_HIP,  c: LM.L_KNEE  },
  { key: 'rightHip',  label: 'R. Hip',   a: LM.R_SHOULDER, b: LM.R_HIP,  c: LM.R_KNEE  },
]

function calcAngle(a, b, c) {
  if (!a || !b || !c) return null
  const ab = { x: a.x - b.x, y: a.y - b.y }
  const cb = { x: c.x - b.x, y: c.y - b.y }
  const dot = ab.x * cb.x + ab.y * cb.y
  const mag = Math.sqrt(ab.x ** 2 + ab.y ** 2) * Math.sqrt(cb.x ** 2 + cb.y ** 2)
  if (mag === 0) return null
  return Math.round(Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180 / Math.PI)
}

export default function PoseCamera({ onAnalyze, onClose }) {
  const videoRef       = useRef(null)
  const canvasRef      = useRef(null)
  const detectorRef    = useRef(null)
  const animRef        = useRef(null)
  const streamRef      = useRef(null)
  const facingRef      = useRef('user')
  const anglesRef      = useRef({})
  const isMountedRef   = useRef(true)

  const [status, setStatus]           = useState('loading')
  const [facingMode, setFacingMode]   = useState('user')
  const [poseDetected, setPoseDetected] = useState(false)
  const [angles, setAngles]           = useState({})
  const [loadingMsg, setLoadingMsg]   = useState('Loading pose detector…')

  // Live Coach mode
  const [liveMode, setLiveMode]       = useState(false)
  const [liveBusy, setLiveBusy]       = useState(false)
  const [liveFeedback, setLiveFeedback] = useState(null)
  const [exercise, setExercise]       = useState('')
  const liveModeRef  = useRef(false)
  const liveBusyRef  = useRef(false)
  const liveTimerRef = useRef(null)
  const exerciseRef  = useRef('')
  const poseDetectedRef = useRef(false)

  function drawSkeleton(lm) {
    const canvas = canvasRef.current
    if (!canvas || !lm) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    const isFront = facingRef.current === 'user'
    const px = l => (isFront ? 1 - l.x : l.x) * w
    const py = l => l.y * h
    const vis = l => (l.visibility ?? 1) >= 0.4

    // Bones
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    for (const [ai, bi] of CONNECTIONS) {
      const la = lm[ai], lb = lm[bi]
      if (!la || !lb || !vis(la) || !vis(lb)) continue
      ctx.strokeStyle = '#007AFF'
      ctx.beginPath()
      ctx.moveTo(px(la), py(la))
      ctx.lineTo(px(lb), py(lb))
      ctx.stroke()
    }

    // Joints
    for (let i = 0; i < lm.length; i++) {
      const l = lm[i]
      if (!l || !vis(l)) continue
      const isKey = KEY_JOINTS.has(i)
      ctx.beginPath()
      ctx.arc(px(l), py(l), isKey ? 7 : 4, 0, Math.PI * 2)
      ctx.fillStyle = isKey ? '#FFD700' : 'rgba(255,255,255,0.6)'
      ctx.fill()
      if (isKey) {
        ctx.strokeStyle = 'rgba(0,0,0,0.45)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }
  }

  function runLoop() {
    if (!detectorRef.current || !videoRef.current || !isMountedRef.current) return
    const video = videoRef.current
    if (video.readyState >= 2) {
      try {
        const result = detectorRef.current.detectForVideo(video, performance.now())
        const lm = result?.landmarks?.[0]
        if (lm && lm.length > 0) {
          poseDetectedRef.current = true
          if (isMountedRef.current) setPoseDetected(true)
          const a = {}
          for (const { key, a: ai, b: bi, c: ci } of ANGLE_DEFS) {
            a[key] = calcAngle(lm[ai], lm[bi], lm[ci])
          }
          anglesRef.current = a
          if (isMountedRef.current) setAngles({ ...a })
          drawSkeleton(lm)
        } else {
          poseDetectedRef.current = false
          if (isMountedRef.current) setPoseDetected(false)
          const canvas = canvasRef.current
          if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        }
      } catch {}
    }
    animRef.current = requestAnimationFrame(runLoop)
  }

  async function startCamera(mode) {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: mode, width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false,
    })
    if (!isMountedRef.current) { stream.getTracks().forEach(t => t.stop()); return }
    streamRef.current = stream
    const video = videoRef.current
    if (!video) return
    video.srcObject = stream
    await video.play()
    await new Promise(resolve => {
      const sync = () => {
        const canvas = canvasRef.current
        if (canvas) {
          canvas.width  = video.videoWidth  || 640
          canvas.height = video.videoHeight || 480
        }
        resolve()
      }
      if (video.readyState >= 1) sync()
      else video.onloadedmetadata = sync
    })
  }

  async function init() {
    try {
      if (isMountedRef.current) setLoadingMsg('Loading pose detector…')
      const { PoseLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
      if (!isMountedRef.current) return
      const vision = await FilesetResolver.forVisionTasks(WASM_URL)
      if (!isMountedRef.current) return
      let detector
      try {
        detector = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })
      } catch {
        // GPU not available, fall back to CPU
        detector = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.4,
          minPosePresenceConfidence: 0.4,
          minTrackingConfidence: 0.4,
        })
      }
      if (!isMountedRef.current) { detector.close(); return }
      detectorRef.current = detector
      if (isMountedRef.current) setLoadingMsg('Starting camera…')
      await startCamera(facingRef.current)
      if (!isMountedRef.current) return
      if (isMountedRef.current) setStatus('ready')
      runLoop()
    } catch (err) {
      console.error('PoseCamera init error:', err)
      if (isMountedRef.current) setStatus('error')
    }
  }

  async function handleFlip() {
    const next = facingRef.current === 'user' ? 'environment' : 'user'
    facingRef.current = next
    setFacingMode(next)
    await startCamera(next)
  }

  function captureFrame() {
    const video  = videoRef.current
    const skeleton = canvasRef.current
    if (!video) return null

    const combined = document.createElement('canvas')
    combined.width  = video.videoWidth  || 640
    combined.height = video.videoHeight || 480
    const ctx = combined.getContext('2d')

    if (facingRef.current === 'user') {
      ctx.save()
      ctx.translate(combined.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(video, 0, 0)
      ctx.restore()
    } else {
      ctx.drawImage(video, 0, 0)
    }
    if (skeleton) ctx.drawImage(skeleton, 0, 0)

    const dataUrl = combined.toDataURL('image/jpeg', 0.85)
    const a = anglesRef.current
    const angleText = ANGLE_DEFS
      .filter(({ key }) => a[key] != null)
      .map(({ key, label }) => `${label}: ${a[key]}°`)
      .join(', ')

    return { dataUrl, angleText }
  }

  function handleAnalyze() {
    const frame = captureFrame()
    if (!frame) return
    onAnalyze({
      imageUrl:    frame.dataUrl,
      imageBase64: frame.dataUrl.split(',')[1],
      imageMime:   'image/jpeg',
      text: frame.angleText
        ? `[Form Check] Joint angles, ${frame.angleText}. Please analyze my form.`
        : '[Form Check] Please analyze my form in this image.',
    })
  }

  // ── Live Coach: periodic AI form check with spoken feedback ────────────────
  async function runLiveCheck() {
    if (!liveModeRef.current || liveBusyRef.current || !poseDetectedRef.current || !isMountedRef.current) return
    const frame = captureFrame()
    if (!frame) return

    liveBusyRef.current = true
    if (isMountedRef.current) setLiveBusy(true)
    try {
      const intent = exerciseRef.current.trim()
      const userText =
        (intent ? `I am trying to do: ${intent}. ` : '') +
        (frame.angleText ? `Measured joint angles, ${frame.angleText}.` : '') +
        ' Check my form.'

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: frame.dataUrl.split(',')[1] } },
              { type: 'text', text: userText },
            ],
          }],
          system: LIVE_SYSTEM_PROMPT,
          hasVision: true,
        }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      const feedback = data.content?.[0]?.text || data.reply
      if (feedback && liveModeRef.current && isMountedRef.current) {
        setLiveFeedback(feedback)
        // Speak it aloud
        const synth = window.speechSynthesis
        if (synth) {
          synth.cancel()
          synth.speak(buildUtterance(feedback, { rate: LIVE_CUE_RATE }))
        }
      }
    } catch {
      // Silent, next interval will retry
    } finally {
      liveBusyRef.current = false
      if (isMountedRef.current) setLiveBusy(false)
    }
  }

  function toggleLiveMode() {
    if (liveMode) {
      liveModeRef.current = false
      setLiveMode(false)
      setLiveFeedback(null)
      if (liveTimerRef.current) clearInterval(liveTimerRef.current)
      window.speechSynthesis?.cancel()
      return
    }
    liveModeRef.current = true
    setLiveMode(true)
    setLiveFeedback(null)
    runLiveCheck() // first check right away
    liveTimerRef.current = setInterval(runLiveCheck, LIVE_CHECK_INTERVAL)
  }

  useEffect(() => { exerciseRef.current = exercise }, [exercise])

  useEffect(() => {
    isMountedRef.current = true
    init()
    return () => {
      isMountedRef.current = false
      liveModeRef.current = false
      if (liveTimerRef.current) clearInterval(liveTimerRef.current)
      window.speechSynthesis?.cancel()
      if (animRef.current) cancelAnimationFrame(animRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      if (detectorRef.current) { try { detectorRef.current.close() } catch {} }
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      {/* Camera feed + skeleton */}
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={facingMode === 'user' ? { transform: 'scaleX(-1)' } : undefined}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Loading */}
        {status === 'loading' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="text-star-blue animate-spin" />
            <p className="text-white text-sm font-medium">{loadingMsg}</p>
            <p className="text-star-grey text-xs">First load downloads the pose model (~7 MB)</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center px-6 overflow-y-auto py-8">
            <p className="text-white font-bold text-lg mb-1">Camera Access Needed</p>
            <p className="text-star-grey text-sm mb-5 text-center">
              Your browser blocked the camera. Here's how to allow it, it only takes a second and you only do it once:
            </p>

            <div className="w-full max-w-sm space-y-3 mb-6">
              <div className="bg-star-card border border-star-border rounded-xl p-4">
                <p className="text-star-yellow text-xs font-bold uppercase tracking-wider mb-1.5">📱 iPhone / iPad (Safari)</p>
                <p className="text-star-grey text-xs leading-relaxed">
                  Open the <span className="text-white font-semibold">Settings</span> app → <span className="text-white font-semibold">Safari</span> → <span className="text-white font-semibold">Settings for Websites</span> → <span className="text-white font-semibold">Camera</span> → set to <span className="text-white font-semibold">"Ask"</span>. Come back, tap Try Again, and tap <span className="text-white font-semibold">Allow</span> when asked.
                </p>
              </div>

              <div className="bg-star-card border border-star-border rounded-xl p-4">
                <p className="text-star-yellow text-xs font-bold uppercase tracking-wider mb-1.5">📱 iPhone / iPad (Chrome)</p>
                <p className="text-star-grey text-xs leading-relaxed">
                  Open the <span className="text-white font-semibold">Settings</span> app → scroll to <span className="text-white font-semibold">Chrome</span> → turn ON <span className="text-white font-semibold">Camera</span> and <span className="text-white font-semibold">Microphone</span>. Come back and tap Try Again.
                </p>
              </div>

              <div className="bg-star-card border border-star-border rounded-xl p-4">
                <p className="text-star-yellow text-xs font-bold uppercase tracking-wider mb-1.5">🤖 Android (Chrome)</p>
                <p className="text-star-grey text-xs leading-relaxed">
                  Tap the <span className="text-white font-semibold">lock icon</span> left of the address bar → <span className="text-white font-semibold">Permissions</span> → <span className="text-white font-semibold">Camera</span> → <span className="text-white font-semibold">Allow</span>.
                </p>
              </div>

              <div className="bg-star-card border border-star-border rounded-xl p-4">
                <p className="text-star-yellow text-xs font-bold uppercase tracking-wider mb-1.5">💻 Computer (Chrome / Edge)</p>
                <p className="text-star-grey text-xs leading-relaxed">
                  Click the <span className="text-white font-semibold">camera icon</span> or <span className="text-white font-semibold">lock icon</span> in the address bar → set Camera to <span className="text-white font-semibold">Allow</span>. On Mac, also check System Settings → Privacy &amp; Security → Camera → make sure your browser is on.
                </p>
              </div>

              <div className="bg-star-card border border-star-border rounded-xl p-4">
                <p className="text-star-yellow text-xs font-bold uppercase tracking-wider mb-1.5">💻 Computer (Safari)</p>
                <p className="text-star-grey text-xs leading-relaxed">
                  Safari menu → <span className="text-white font-semibold">Settings for starmat.app</span> → <span className="text-white font-semibold">Camera</span> → <span className="text-white font-semibold">Allow</span>.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setStatus('loading'); init() }}
                className="px-6 py-2.5 bg-star-blue text-white rounded-xl text-sm font-bold"
              >
                Try Again
              </button>
              <button onClick={onClose} className="px-6 py-2.5 bg-star-card border border-star-border text-white rounded-xl text-sm font-bold">
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* No pose prompt */}
        {status === 'ready' && !poseDetected && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-center">
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
              <p className="text-white text-sm font-medium">Step back so your full body is visible</p>
            </div>
          </div>
        )}

        {/* Live Coach feedback caption */}
        <AnimatePresence>
          {liveMode && liveFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="absolute inset-x-4 bottom-4 flex justify-center"
            >
              <div className="bg-black/75 backdrop-blur-md rounded-2xl px-5 py-3.5 max-w-md border border-star-blue/30">
                <p className="text-star-blue text-[10px] font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Live Coach
                </p>
                <p className="text-white text-sm leading-snug">{liveFeedback}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top controls */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 py-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <X size={20} className="text-white" />
          </button>

          <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full transition-colors ${poseDetected ? 'bg-green-400' : 'bg-star-grey'}`} />
            <span className="text-white text-xs font-medium">
              {status === 'loading' ? 'Loading…' : poseDetected ? 'Pose detected' : 'No pose'}
            </span>
          </div>

          <button
            onClick={handleFlip}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <FlipHorizontal size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Bottom panel */}
      <div className="bg-star-black border-t border-star-border px-4 pt-4 pb-8 safe-bottom">
        {/* Angle readouts */}
        {status === 'ready' && poseDetected && (
          <div className="flex gap-2 flex-wrap justify-center mb-4">
            {ANGLE_DEFS.map(({ key, label }) =>
              angles[key] != null ? (
                <div key={key} className="bg-star-card border border-star-border rounded-full px-3 py-1 flex items-center gap-1.5">
                  <span className="text-star-grey text-xs">{label}</span>
                  <span className="text-star-yellow font-bold text-sm">{angles[key]}°</span>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Exercise intent for Live Coach */}
        <input
          type="text"
          value={exercise}
          onChange={e => setExercise(e.target.value)}
          placeholder="What exercise are you doing? (optional, helps the coach)"
          className="w-full mb-3 bg-star-card border border-star-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-star-grey/50 focus:outline-none focus:border-star-blue/50"
        />

        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAnalyze}
            disabled={status !== 'ready' || !poseDetected}
            className="flex-1 py-4 rounded-2xl bg-star-blue text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Zap size={18} />
            Analyze Once
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={toggleLiveMode}
            disabled={status !== 'ready'}
            className={`flex-1 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border ${
              liveMode
                ? 'bg-red-500/20 border-red-500 text-red-400'
                : 'bg-star-card border-star-border text-white'
            }`}
          >
            {liveBusy
              ? <Loader2 size={18} className="animate-spin" />
              : <Radio size={18} className={liveMode ? 'animate-pulse' : ''} />
            }
            {liveMode ? 'Stop Coach' : 'Live Coach'}
          </motion.button>
        </div>
        <p className="text-star-grey text-xs text-center mt-2">
          {liveMode
            ? 'Coach is watching, feedback every few seconds, spoken aloud'
            : 'Analyze Once for a single check, or Live Coach for continuous feedback'}
        </p>
      </div>
    </motion.div>
  )
}

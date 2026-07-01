import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { X, FlipHorizontal, Zap, Loader2 } from 'lucide-react'

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
          if (isMountedRef.current) setPoseDetected(true)
          const a = {}
          for (const { key, a: ai, b: bi, c: ci } of ANGLE_DEFS) {
            a[key] = calcAngle(lm[ai], lm[bi], lm[ci])
          }
          anglesRef.current = a
          if (isMountedRef.current) setAngles({ ...a })
          drawSkeleton(lm)
        } else {
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
      const detector = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })
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

  function handleAnalyze() {
    const video  = videoRef.current
    const skeleton = canvasRef.current
    if (!video) return

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

    onAnalyze({
      imageUrl:    dataUrl,
      imageBase64: dataUrl.split(',')[1],
      imageMime:   'image/jpeg',
      text: angleText
        ? `[Form Check] Joint angles — ${angleText}. Please analyze my form.`
        : '[Form Check] Please analyze my form in this image.',
    })
  }

  useEffect(() => {
    isMountedRef.current = true
    init()
    return () => {
      isMountedRef.current = false
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
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="text-white font-bold text-lg">Camera Unavailable</p>
            <p className="text-star-grey text-sm">Allow camera access in your browser settings and try again.</p>
            <button onClick={onClose} className="px-6 py-2.5 bg-star-blue text-white rounded-xl text-sm font-bold">
              Go Back
            </button>
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

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAnalyze}
          disabled={status !== 'ready' || !poseDetected}
          className="w-full py-4 rounded-2xl bg-star-blue text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap size={18} />
          Analyze My Form
        </motion.button>
        <p className="text-star-grey text-xs text-center mt-2">Hold your position, then tap Analyze</p>
      </div>
    </motion.div>
  )
}

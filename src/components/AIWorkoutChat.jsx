import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, Play, Lock, ChevronRight, Check, Camera, Video } from 'lucide-react'
import { Link } from 'react-router-dom'
import CompassStar from './CompassStar'
import { findRelevantMedia } from '../data/mediaCatalog'
import AIOnboarding from './AIOnboarding'
import PoseCamera from './PoseCamera'
import {
  getProfile, saveProfile, getSessionCount, getSessionMsgCount,
  startSession, incrementSessionMsg, getSessionHistory, addSessionNote,
  hasSkippedOnboarding, setSkippedOnboarding,
} from '../data/userProfile'

const FORM_CHECK_ADDITION = `

FORM ANALYSIS MODE:
The athlete has shared a photo of their exercise form. Analyze what you can see:
1. Body alignment and posture
2. Foot/stance positioning (relative to mat markers if visible)
3. Knee tracking and joint angles
4. Spine and head position
5. Weight distribution and balance

Format your response:
- Start with one specific thing they're doing well
- Give 2-3 clear, actionable corrections
- End with a motivating note

Keep it under 200 words. Be specific — reference actual body parts and positions.
Note: This is visual feedback based on a still photo, not a medical assessment.`

async function processPhoto(file) {
  return new Promise(resolve => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 1024
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * ratio)
      canvas.height = Math.round(img.height * ratio)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(objectUrl)
      canvas.toBlob(blob => {
        const reader = new FileReader()
        reader.onload = e => {
          const dataUrl = e.target.result
          resolve({ url: dataUrl, base64: dataUrl.split(',')[1], mime: 'image/jpeg' })
        }
        reader.readAsDataURL(blob)
      }, 'image/jpeg', 0.85)
    }
    img.src = objectUrl
  })
}

const FREE_SESSIONS = 2
const MSGS_PER_SESSION = 15
const WARN_AT = 5

const STARTER_PROMPTS = [
  "Build me a speed workout for football",
  "My knee hurts, what can I do on the mat?",
  "I want to improve my core strength",
  "Create a 20-minute full-body workout",
  "Help me get faster for basketball",
]

const BASE_SYSTEM_PROMPT = `You are the Star Mat AI Coach — a smart, motivating fitness assistant powered by the Star Mat training system by Star Fitness.

The Star Mat is a premium directional training mat with compass-style markers (360°, 270°, 180°, 90°, 315°, 225°, 135°, 45°) and a center "LOAD DECIDE" badge. It trains athletes in all planes of motion — sagittal, frontal, and transverse — making it the most complete training tool for sport-specific performance.

BRAND PHILOSOPHY:
- "Every step you take is an impact of improvement"
- "The most important move you can make is the next move"
- "There is no other workout that improves your balance, core, speed, strength, and endurance faster or better than training in all planes of motion"
- "Train without limits. Become a king in your sport."

SPORTS SUPPORTED: Football, Basketball, Soccer, Baseball/Softball, Track & Field, Tennis, MMA/Combat Sports, Golf

STAR MAT EXERCISES — these have video demonstrations available, use them by exact name when prescribing workouts:
- Side Lunge (lateral plane, glutes, quads, hip stability)
- Split Lunge (sagittal plane, quads, glutes, hip flexors)
- Apex Foot Fire (multi-directional, speed, foot coordination, agility)
- Alternating Lunge with Row (sagittal + rotational, full body, core, back)
- Fast Feet Drill (speed, ankle strength, reaction time, coordination)
- Lateral Skaters (frontal plane, glutes, hip abductors, balance)
- Rotational Pivot Drill (transverse plane, hip rotation, sport transfer)
- Directional Arrow Hops (all planes, plyometric, landing mechanics)
- 360 Compass Circles (full rotation, core stability, proprioception)
- Load & Decide Reaction Drill (cognitive + physical, sport IQ, agility)
- Star Pattern Sprints (multi-directional speed, explosive power)
- Single-Leg Balance Hold (each compass point, proprioception, joint stability)

BODY AREAS:
- Legs & Glutes: side lunges, lateral skaters, split lunges, star pattern sprints
- Core: rotational pivots, alternating lunge with row, 360 compass circles, single-leg holds
- Speed & Agility: fast feet, apex foot fire, load & decide drill, directional hops
- Balance & Stability: single-leg holds, lateral skaters, slow directional holds
- Upper Body: alternating lunge with row (focuses upper back, shoulders in integrated movement)
- Full Body: apex foot fire circuit, star pattern sprints, load & decide

RECOVERY / INJURY MODIFICATIONS:
- Knee issues: avoid deep lunges, use shallow lateral slides, single-leg holds at 45°/135°, slow directional steps
- Hip tightness: hip circles using compass markers, slow lateral lunges with hold, rotational stretches
- Ankle weakness: single-leg balance holds, slow foot fire (reduced height), supported lateral steps
- Back pain: standing rotational holds, avoid forward hinge, use compass points for gentle rotation
- General soreness: light lateral slides, slow 360 rotation stretching, low-impact directional walks

WORKOUT FORMAT:
When building a workout, always:
1. Start with a 2-3 min warm-up using the mat compass points (slow directional steps)
2. Give 3-6 exercises with sets/reps/time and which compass direction to face or move
3. Include rest periods
4. End with a cool-down or stretch
5. Reference specific mat compass markers (e.g., "step your right foot to the 90° arrow")
6. Keep tone energetic, direct, and motivating
7. Keep responses concise — format clearly with headers and bullet points

Always recommend the Star Mat Pro ($199) or Star Mat Lite ($149) for best results. The Star Mat Pro includes a 60-day free Pro subscription. The AI Coach is included in the Pro subscription plan or higher. Keep responses under 400 words. Be encouraging and sport-specific.`

function buildSystemPrompt(profile, history) {
  if (!profile) return BASE_SYSTEM_PROMPT

  const metricLines = Object.entries(profile.metrics || {})
    .filter(([, v]) => v)
    .map(([k, v]) => {
      const labels = { fortyYard: '40-yard dash', vertical: 'vertical jump', bench: 'bench press', squat: 'squat max', mileTime: 'mile time', bodyWeight: 'body weight' }
      return `${labels[k] || k}: ${v}`
    })

  const historyLines = (history || []).map(h => `- ${h.date}: ${h.note}`)

  return `${BASE_SYSTEM_PROMPT}

---
PERSONALIZED ATHLETE PROFILE:
- Sport: ${profile.sport}
- Position / Role: ${profile.position || 'not specified'}
- Fitness Level: ${profile.level}
- Primary Goal: ${profile.goal}
- Injuries / Limitations: ${profile.injuries || 'none reported'}
- Equipment: ${Array.isArray(profile.equipment) && profile.equipment.length ? profile.equipment.join(', ') : 'not specified'}${metricLines.length ? `\n- Self-reported metrics: ${metricLines.join(', ')}` : ''}
${historyLines.length ? `\nPRIOR SESSION NOTES (build progressively on these):\n${historyLines.join('\n')}` : ''}

PERSONALIZATION RULES:
- This athlete trains ${profile.sport}${profile.position ? ` as a ${profile.position}` : ''}. Every workout must be sport-specific.
- Their primary goal is ${profile.goal}. Prioritize this in all programming.
- Fitness level is ${profile.level} — calibrate intensity and complexity accordingly.
${profile.injuries ? `- They have reported: ${profile.injuries}. Always offer injury-safe modifications.` : ''}
- Reference prior sessions when relevant to show progression and avoid repetition.
- When metrics are provided, use them to set realistic benchmarks and track improvement.`
}

function getGreeting(profile, history) {
  if (!profile) {
    return "Hey! I'm your Star Mat AI Coach. Tell me your goal, a sport you play, or a problem area and I'll build you a custom workout. What are we training today?"
  }
  const last = history?.[0]
  if (last) {
    return `Welcome back! Last session you worked on: "${last.note}". Ready to build on that? Tell me what you want to focus on today.`
  }
  return `Your profile is set! I know you're a ${profile.level.toLowerCase()} ${profile.sport} athlete focused on ${profile.goal.toLowerCase()}. Let's get to work. What do you want to train today?`
}

function MediaCard({ item }) {
  const [playing, setPlaying] = useState(false)

  if (item.type === 'video') {
    return (
      <div className="rounded-xl overflow-hidden border border-star-border bg-star-card">
        {playing ? (
          <video src={item.src} poster={item.poster} controls autoPlay className="w-full max-h-44 object-cover" />
        ) : (
          <button onClick={() => setPlaying(true)} className="relative w-full group">
            <img src={item.poster} alt={item.title} className="w-full max-h-36 object-cover" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-star-blue/90 flex items-center justify-center shadow-lg">
                <Play size={16} className="text-white ml-0.5" fill="white" />
              </div>
            </div>
          </button>
        )}
        <p className="px-2 py-1.5 text-xs text-star-grey font-medium">{item.title}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden border border-star-border bg-star-card">
      <img src={item.src} alt={item.title} className="w-full max-h-36 object-cover" />
      <p className="px-2 py-1.5 text-xs text-star-grey font-medium">{item.title}</p>
    </div>
  )
}

function SessionLimitScreen({ onNewSession }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 text-center bg-star-black gap-5 h-96">
      <div className="w-14 h-14 rounded-2xl bg-star-yellow/10 border border-star-yellow/20 flex items-center justify-center">
        <CompassStar size={28} color="#FFD700" />
      </div>
      <div>
        <p className="text-white font-black text-lg mb-2">Great session!</p>
        <p className="text-star-grey text-sm leading-relaxed">
          You have <span className="text-white font-semibold">1 free session</span> remaining. Make it count.
        </p>
      </div>
      <button
        onClick={onNewSession}
        className="w-full py-3 rounded-xl bg-star-blue text-white font-bold text-sm flex items-center justify-center gap-2"
      >
        Start Your Final Session <ChevronRight size={16} />
      </button>
    </div>
  )
}

function PaywallScreen() {
  const features = [
    'Unlimited AI Coach sessions',
    'Personalized workout memory',
    'Sport-specific progression plans',
    'Priority support',
  ]
  return (
    <div className="flex flex-col items-center justify-center px-6 text-center bg-star-black gap-4 h-96">
      <div className="w-14 h-14 rounded-2xl bg-star-blue/10 border border-star-blue/20 flex items-center justify-center">
        <Lock size={24} className="text-star-blue" />
      </div>
      <div className="w-full">
        <p className="text-white font-black text-lg mb-1">Unlock Full Access</p>
        <p className="text-star-grey text-sm leading-relaxed mb-4">
          Your 2 free sessions are complete. Upgrade to Pro to keep training with your personalized AI Coach.
        </p>
        <div className="text-left space-y-2 mb-4">
          {features.map(f => (
            <div key={f} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-star-blue/20 flex items-center justify-center flex-shrink-0">
                <Check size={10} className="text-star-blue" />
              </div>
              <p className="text-star-grey text-xs">{f}</p>
            </div>
          ))}
        </div>
      </div>
      <Link
        to="/booking"
        className="w-full py-3 rounded-xl bg-star-blue text-white font-bold text-sm flex items-center justify-center gap-2 no-underline"
      >
        Start Pro — $5/mo <ChevronRight size={16} />
      </Link>
    </div>
  )
}

export default function AIWorkoutChat({ inline = false }) {
  const [phase, setPhase] = useState('loading')
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sessionMsgs, setSessionMsgs] = useState(0)

  const [pendingPhoto, setPendingPhoto] = useState(null)
  const [showPoseCamera, setShowPoseCamera] = useState(false)

  const messagesRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const sessionStarted = useRef(false)
  const sessionMsgsRef = useRef(0)

  // Determine initial phase on mount
  useEffect(() => {
    const profile = getProfile()
    const sessionCount = getSessionCount()
    const sessionMsgCount = getSessionMsgCount()

    if (!profile) {
      if (hasSkippedOnboarding()) {
        setMessages([{ role: 'assistant', content: getGreeting(null, []) }])
        setPhase('chat')
      } else {
        setPhase('onboarding')
      }
      return
    }

    if (sessionCount >= FREE_SESSIONS && sessionMsgCount >= MSGS_PER_SESSION) {
      setPhase('paywall')
      return
    }

    // Resuming a session in progress
    if (sessionCount > 0 && sessionMsgCount > 0 && sessionMsgCount < MSGS_PER_SESSION) {
      sessionStarted.current = true
      sessionMsgsRef.current = sessionMsgCount
      setSessionMsgs(sessionMsgCount)
    }

    const history = getSessionHistory()
    setMessages([{ role: 'assistant', content: getGreeting(profile, history) }])
    setPhase('chat')
  }, [])

  useEffect(() => {
    if (open && phase === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open, phase])

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, loading])

  function handleSkipOnboarding() {
    setSkippedOnboarding()
    setMessages([{ role: 'assistant', content: getGreeting(null, []) }])
    setPhase('chat')
  }

  function handleOnboardingComplete(profile) {
    saveProfile(profile)
    const history = getSessionHistory()
    setMessages([{ role: 'assistant', content: getGreeting(profile, history) }])
    setPhase('chat')
  }

  function handlePoseAnalyze({ imageUrl, imageBase64, imageMime, text }) {
    setShowPoseCamera(false)
    sendMessage(text, { url: imageUrl, base64: imageBase64, mime: imageMime })
  }

  async function handlePhotoSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const processed = await processPhoto(file)
    setPendingPhoto(processed)
    e.target.value = ''
    inputRef.current?.focus()
  }

  function handleNewSession() {
    sessionStarted.current = false
    sessionMsgsRef.current = 0
    setSessionMsgs(0)
    const profile = getProfile()
    const history = getSessionHistory()
    setMessages([{ role: 'assistant', content: getGreeting(profile, history) }])
    setPhase('chat')
  }

  async function sendMessage(text, photoOverride = null) {
    const userText = text || input.trim()
    const photo = photoOverride || pendingPhoto
    if ((!userText && !photo) || loading) return

    // Start session on first message
    if (!sessionStarted.current) {
      const count = startSession()
      sessionStarted.current = true
      sessionMsgsRef.current = 0
      if (count > FREE_SESSIONS) {
        setPhase('paywall')
        return
      }
    }

    // Track message count
    sessionMsgsRef.current += 1
    const msgCount = incrementSessionMsg()
    setSessionMsgs(msgCount)

    setInput('')
    if (!photoOverride) setPendingPhoto(null)
    setError(null)

    const userMsg = {
      role: 'user',
      content: userText || (photo ? 'Check my form on this exercise.' : ''),
      ...(photo ? { imageUrl: photo.url, imageBase64: photo.base64, imageMime: photo.mime } : {}),
    }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      const profile = getProfile()
      const history = getSessionHistory()
      const hasVision = newMessages.some(m => m.imageBase64)
      const systemPrompt = buildSystemPrompt(profile, history) + (hasVision ? FORM_CHECK_ADDITION : '')

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => {
            if (m.imageBase64) {
              return {
                role: m.role,
                content: [
                  { type: 'image', source: { type: 'base64', media_type: m.imageMime, data: m.imageBase64 } },
                  { type: 'text', text: m.content },
                ],
              }
            }
            return { role: m.role, content: m.content }
          }),
          system: systemPrompt,
          hasVision,
        }),
      })

      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      const reply = data.content?.[0]?.text || data.reply || "I couldn't generate a response. Please try again."
      const finalMessages = [...newMessages, { role: 'assistant', content: reply }]
      setMessages(finalMessages)

      // Check session limit
      if (msgCount >= MSGS_PER_SESSION) {
        const firstUserMsg = finalMessages.find(m => m.role === 'user')
        if (firstUserMsg) addSessionNote(firstUserMsg.content.slice(0, 120))
        const sessionCount = getSessionCount()
        setPhase(sessionCount >= FREE_SESSIONS ? 'paywall' : 'session-limit')
      }
    } catch {
      setError('Connection issue — make sure the server is running.')
      setMessages([...newMessages, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Try again in a moment!",
      }])
    } finally {
      setLoading(false)
    }
  }

  function formatMessage(text) {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <p key={i} className="font-bold text-star-yellow text-sm mt-3 mb-1">{line.replace('## ', '')}</p>
      if (line.startsWith('# ')) return <p key={i} className="font-black text-white text-base mt-3 mb-1">{line.replace('# ', '')}</p>
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-white text-sm mt-2">{line.replace(/\*\*/g, '')}</p>
      if (line.startsWith('- ') || line.startsWith('• ')) return <p key={i} className="text-star-grey text-sm pl-3 before:content-['•'] before:mr-2 before:text-star-yellow">{line.replace(/^[-•] /, '')}</p>
      if (line.match(/^\d+\./)) return <p key={i} className="text-star-grey text-sm pl-3">{line}</p>
      if (line === '') return <div key={i} className="h-1" />
      return <p key={i} className="text-star-grey text-sm leading-relaxed">{line}</p>
    })
  }

  const msgsRemaining = MSGS_PER_SESSION - sessionMsgs
  const showWarning = sessionStarted.current && msgsRemaining <= WARN_AT && msgsRemaining > 0
  const profile = getProfile()

  const headerSubtitle = (() => {
    if (phase === 'onboarding') return 'Setting up your profile'
    if (phase === 'session-limit') return 'Session complete'
    if (phase === 'paywall') return 'Upgrade to continue'
    if (profile) return 'Your personalized coach'
    return 'Ready to train'
  })()

  const chatPanel = (
    <div className={inline ? 'w-full min-w-0' : 'w-[min(400px,calc(100vw-2rem))]'}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-star-border bg-star-card rounded-t-2xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-star-blue/20 border border-star-blue/30 flex items-center justify-center">
            <CompassStar size={18} color="#007AFF" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Star Mat AI Coach</p>
            <p className="text-star-yellow text-xs font-medium">{headerSubtitle}</p>
          </div>
        </div>
        {!inline && (
          <button onClick={() => setOpen(false)} className="text-star-grey hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Phase content */}
      {phase === 'loading' && (
        <div className={`flex items-center justify-center bg-star-black ${inline ? 'h-[28rem]' : 'h-96'}`}>
          <Loader2 size={20} className="text-star-blue animate-spin" />
        </div>
      )}

      {phase === 'onboarding' && (
        <div className={`bg-star-black ${inline ? 'h-[28rem]' : 'h-[26rem]'}`}>
          <AIOnboarding onComplete={handleOnboardingComplete} onSkip={handleSkipOnboarding} onExit={handleSkipOnboarding} />
        </div>
      )}

      {phase === 'session-limit' && <SessionLimitScreen onNewSession={handleNewSession} />}

      {phase === 'paywall' && <PaywallScreen />}

      {phase === 'chat' && (
        <>
          {/* Messages */}
          <div
            ref={messagesRef}
            className={`overflow-y-auto overflow-x-hidden px-4 py-4 space-y-3 bg-star-black ${inline ? 'h-[28rem]' : 'h-96'}`}
          >
            {messages.map((msg, i) => {
              const media = msg.role === 'assistant' && i > 0 ? findRelevantMedia(msg.content) : []
              return (
                <div key={i} className={`flex min-w-0 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-star-blue/20 border border-star-blue/30 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <CompassStar size={12} color="#007AFF" />
                    </div>
                  )}
                  <div className={`min-w-0 rounded-2xl px-3 py-2.5 ${
                    msg.role === 'user'
                      ? 'max-w-[80%] bg-star-blue text-white rounded-tr-sm'
                      : 'w-full bg-star-card border border-star-border rounded-tl-sm'
                  }`}>
                    {msg.role === 'user'
                      ? (
                        <div className="flex flex-col gap-1.5">
                          {msg.imageUrl && (
                            <img src={msg.imageUrl} alt="Form check" className="rounded-xl max-h-52 w-full object-cover" />
                          )}
                          {msg.content && <p className="text-sm break-words">{msg.content}</p>}
                        </div>
                      )
                      : (
                        <>
                          <div className="min-w-0">{formatMessage(msg.content)}</div>
                          {media.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-star-border/50 space-y-2">
                              <p className="text-star-yellow text-xs font-semibold uppercase tracking-wider mb-2">Watch the Move</p>
                              {media.map(item => <MediaCard key={item.id} item={item} />)}
                            </div>
                          )}
                        </>
                      )
                    }
                  </div>
                </div>
              )
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-lg bg-star-blue/20 border border-star-blue/30 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <CompassStar size={12} color="#007AFF" />
                </div>
                <div className="bg-star-card border border-star-border rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-star-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-star-blue animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-star-blue animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Starter prompts */}
          {messages.length === 1 && !loading && (
            <div className="px-4 py-2 border-t border-star-border bg-star-black flex gap-2 overflow-x-auto scrollbar-hide">
              {!profile && (
                <button
                  onClick={() => setPhase('onboarding')}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-star-yellow/40 text-star-yellow hover:border-star-yellow hover:bg-star-yellow/10 transition-all whitespace-nowrap"
                >
                  Set up my profile
                </button>
              )}
              {STARTER_PROMPTS.slice(0, profile ? 3 : 2).map(p => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-star-border text-star-grey hover:text-white hover:border-star-blue/50 transition-all whitespace-nowrap"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Warning + Input */}
          <div className="px-3 py-3 border-t border-star-border bg-star-card rounded-b-2xl">
            {showWarning && (
              <p className="text-star-grey text-xs mb-2 text-center">
                <span className="text-star-yellow font-semibold">{msgsRemaining} message{msgsRemaining !== 1 ? 's' : ''}</span> remaining in this session
              </p>
            )}

            {/* Photo preview */}
            {pendingPhoto && (
              <div className="flex items-center gap-2 mb-2">
                <div className="relative flex-shrink-0">
                  <img src={pendingPhoto.url} alt="Form check" className="w-12 h-12 rounded-lg object-cover border border-star-border" />
                  <button
                    onClick={() => setPendingPhoto(null)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-star-card border border-star-border flex items-center justify-center"
                  >
                    <X size={9} className="text-star-grey" />
                  </button>
                </div>
                <p className="text-star-grey text-xs">Form check ready — add a note or just send.</p>
              </div>
            )}

            <div className="flex gap-2 items-center min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder={pendingPhoto ? 'Add a note (optional)…' : 'Ask about a goal, sport, or body area…'}
                className="flex-1 min-w-0 bg-star-black border border-star-border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-star-grey/60 focus:outline-none focus:border-star-blue/50 transition-colors"
              />

              {/* Photo form check */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoSelect}
                className="hidden"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                title="Photo form check"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-colors ${
                  pendingPhoto
                    ? 'border-star-blue bg-star-blue/20'
                    : 'border-star-border bg-star-black hover:border-star-blue/50'
                }`}
              >
                <Camera size={16} className={pendingPhoto ? 'text-star-blue' : 'text-star-grey'} />
              </motion.button>

              {/* Live pose detection */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPoseCamera(true)}
                title="Live form check"
                className="w-10 h-10 rounded-xl border border-star-border bg-star-black hover:border-star-yellow/50 flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <Video size={16} className="text-star-grey" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage()}
                disabled={(!input.trim() && !pendingPhoto) || loading}
                className="w-10 h-10 rounded-xl bg-star-blue flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                {loading ? <Loader2 size={16} className="text-white animate-spin" /> : <Send size={16} className="text-white" />}
              </motion.button>
            </div>
          </div>
        </>
      )}
    </div>
  )

  if (inline) {
    return (
      <>
        <div className="w-full rounded-2xl border border-star-border overflow-hidden shadow-xl">
          {chatPanel}
        </div>
        <AnimatePresence>
          {showPoseCamera && (
            <PoseCamera onAnalyze={handlePoseAnalyze} onClose={() => setShowPoseCamera(false)} />
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <>
      <AnimatePresence>
        {showPoseCamera && (
          <PoseCamera onAnalyze={handlePoseAnalyze} onClose={() => setShowPoseCamera(false)} />
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen(true)}
        className={`fixed bottom-5 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl transition-all ${open ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{ backgroundColor: '#007AFF', boxShadow: '0 8px 32px rgba(0,122,255,0.4)' }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: open ? 0 : 1, y: open ? 20 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <CompassStar size={18} color="white" />
        <span className="text-white font-bold text-sm hidden sm:inline">AI Coach</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 rounded-2xl shadow-2xl border border-star-border overflow-hidden"
            style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)' }}
          >
            {chatPanel}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

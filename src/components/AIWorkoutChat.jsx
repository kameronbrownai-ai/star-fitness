import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, ChevronDown } from 'lucide-react'
import CompassStar from './CompassStar'

const STARTER_PROMPTS = [
  "Build me a speed workout for football",
  "My knee hurts — what can I do on the mat?",
  "I want to improve my core strength",
  "Create a 20-minute full-body workout",
  "Help me get faster for basketball",
]

const SYSTEM_PROMPT = `You are the Star Mat AI Coach — a smart, motivating fitness assistant powered by the Star Mat training system by Star Fitness.

The Star Mat is a premium directional training mat with compass-style markers (360°, 270°, 180°, 90°, 315°, 225°, 135°, 45°) and a center "LOAD DECIDE" badge. It trains athletes in all planes of motion — sagittal, frontal, and transverse — making it the most complete training tool for sport-specific performance.

BRAND PHILOSOPHY:
- "Every step you take is an impact of improvement"
- "The most important move you can make is the next move"
- "There is no other workout that improves your balance, core, speed, strength, and endurance faster or better than training in all planes of motion"
- "Train without limits. Become a king in your sport."

SPORTS SUPPORTED: Football, Basketball, Soccer, Baseball/Softball, Track & Field, Tennis, MMA/Combat Sports

STAR MAT EXERCISES (use these when building workouts):
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

Always recommend the Star Mat Pro ($149) or Star Mat Lite for best results. Keep responses under 400 words. Be encouraging and sport-specific.`

export default function AIWorkoutChat({ inline = false }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! I'm your Star Mat AI Coach. Tell me your goal, a sport you play, or a problem area — and I'll build you a custom workout on the mat. What are we training today?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, loading])

  async function sendMessage(text) {
    const userText = text || input.trim()
    if (!userText || loading) return
    setInput('')
    setError(null)

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          system: SYSTEM_PROMPT,
        }),
      })

      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      const reply = data.content?.[0]?.text || data.reply || "I couldn't generate a response. Please try again."
      setMessages([...newMessages, { role: 'assistant', content: reply }])
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
    // Convert markdown-like formatting to JSX
    const lines = text.split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('## ')) return <p key={i} className="font-bold text-star-yellow text-sm mt-3 mb-1">{line.replace('## ', '')}</p>
      if (line.startsWith('# ')) return <p key={i} className="font-black text-white text-base mt-3 mb-1">{line.replace('# ', '')}</p>
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-white text-sm mt-2">{line.replace(/\*\*/g, '')}</p>
      if (line.startsWith('- ') || line.startsWith('• ')) return <p key={i} className="text-star-grey text-sm pl-3 before:content-['•'] before:mr-2 before:text-star-yellow">{line.replace(/^[-•] /, '')}</p>
      if (line.match(/^\d+\./)) return <p key={i} className="text-star-grey text-sm pl-3">{line}</p>
      if (line === '') return <div key={i} className="h-1" />
      return <p key={i} className="text-star-grey text-sm leading-relaxed">{line}</p>
    })
  }

  const chatPanel = (
    <div className={inline ? 'w-full min-w-0' : 'w-[min(400px,calc(100vw-2rem))]'}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-star-border bg-star-card rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-star-blue/20 border border-star-blue/30 flex items-center justify-center">
            <CompassStar size={18} color="#007AFF" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Star Mat AI Coach</p>
            <p className="text-star-yellow text-xs font-medium">Ready to train</p>
          </div>
        </div>
        {!inline && (
          <button onClick={() => setOpen(false)} className="text-star-grey hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={messagesRef} className={`overflow-y-auto overflow-x-hidden px-4 py-4 space-y-3 bg-star-black ${inline ? 'h-64' : 'h-72'}`}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex min-w-0 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-lg bg-star-blue/20 border border-star-blue/30 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <CompassStar size={12} color="#007AFF" />
              </div>
            )}
            <div
              className={`max-w-[80%] min-w-0 rounded-2xl px-3 py-2.5 ${
                msg.role === 'user'
                  ? 'bg-star-blue text-white rounded-tr-sm'
                  : 'bg-star-card border border-star-border rounded-tl-sm'
              }`}
            >
              {msg.role === 'user'
                ? <p className="text-sm break-words">{msg.content}</p>
                : <div className="min-w-0">{formatMessage(msg.content)}</div>
              }
            </div>
          </div>
        ))}

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

      {/* Starter prompts (only show when just the intro message) */}
      {messages.length === 1 && !loading && (
        <div className="px-4 py-2 border-t border-star-border bg-star-black flex gap-2 overflow-x-auto scrollbar-hide">
          {STARTER_PROMPTS.slice(0, 3).map((p) => (
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

      {/* Input */}
      <div className="px-3 py-3 border-t border-star-border bg-star-card rounded-b-2xl">
        <div className="flex gap-2 items-center min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Ask about a goal, sport, or body area…"
            className="flex-1 min-w-0 bg-star-black border border-star-border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-star-grey/60 focus:outline-none focus:border-star-blue/50 transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-star-blue flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            {loading ? <Loader2 size={16} className="text-white animate-spin" /> : <Send size={16} className="text-white" />}
          </motion.button>
        </div>
      </div>
    </div>
  )

  if (inline) {
    return (
      <div className="w-full rounded-2xl border border-star-border overflow-hidden shadow-xl">
        {chatPanel}
      </div>
    )
  }

  return (
    <>
      {/* Floating trigger button */}
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

      {/* Chat Panel */}
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

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Check, Loader2, Calendar } from 'lucide-react'
import { getStats, logWorkout, localToday } from '../lib/progress'

// Thirty little day-dots, most recent on the right, so a streak reads as a
// solid run of gold and a missed day reads as a gap. Compass-angle framing
// keeps it on brand without another chart library.
function DayGrid({ last30, today }) {
  const days = []
  const t = new Date(today + 'T00:00:00')
  for (let i = 29; i >= 0; i--) {
    const d = new Date(t); d.setDate(t.getDate() - i)
    const pad = n => String(n).padStart(2, '0')
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    days.push({ key, trained: last30.includes(key), isToday: key === today })
  }
  return (
    <div className="grid grid-cols-10 gap-1.5" aria-label="Last 30 days of training">
      {days.map(d => (
        <div
          key={d.key}
          title={d.key + (d.trained ? ' · trained' : '')}
          className={`aspect-square rounded-[5px] transition-colors ${
            d.trained ? 'bg-star-yellow' : 'bg-white/[0.06]'
          } ${d.isToday ? 'ring-2 ring-star-yellow/60 ring-offset-2 ring-offset-star-black' : ''}`}
        />
      ))}
    </div>
  )
}

export default function ConsistencyCard() {
  const [stats, setStats] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    try { setStats(await getStats()) }
    catch (e) { setError(e.message) }
  }
  useEffect(() => { load() }, [])

  async function checkIn() {
    setBusy(true)
    const ok = await logWorkout('manual', 'check-in')
    if (ok) await load()
    setBusy(false)
  }

  if (error) return null
  if (!stats) {
    return (
      <div className="glass rounded-2xl border border-star-border p-6 flex items-center gap-3 text-star-grey text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading your progress…
      </div>
    )
  }

  const today = localToday()
  const streakLabel = stats.streak === 1 ? 'day' : 'days'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl border border-star-border p-6 md:p-7"
    >
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-star-grey text-xs font-semibold tracking-widest uppercase mb-2">Consistency</p>
          <div className="flex items-end gap-2">
            <Flame size={30} className={stats.streak > 0 ? 'text-star-yellow' : 'text-white/20'} fill={stats.streak > 0 ? '#FFD700' : 'none'} />
            <p className="text-white font-black text-5xl leading-none">{stats.streak}</p>
            <p className="text-star-grey text-sm mb-1">{streakLabel} streak</p>
          </div>
        </div>

        <button
          onClick={checkIn}
          disabled={busy || stats.trainedToday}
          className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
            stats.trainedToday
              ? 'bg-star-green/15 text-star-green border border-star-green/30 cursor-default'
              : 'bg-star-yellow text-star-black hover:brightness-110'
          }`}
        >
          {busy ? <Loader2 size={16} className="animate-spin" />
            : stats.trainedToday ? <><Check size={16} strokeWidth={3} /> Trained today</>
            : 'I trained today'}
        </button>
      </div>

      <DayGrid last30={stats.last30} today={today} />

      <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/[0.06]">
        <div>
          <p className="text-white font-black text-2xl">{stats.thisWeek}<span className="text-star-grey text-sm font-medium">/7</span></p>
          <p className="text-star-grey text-xs">This week</p>
        </div>
        <div>
          <p className="text-white font-black text-2xl">{stats.longestStreak}</p>
          <p className="text-star-grey text-xs">Longest streak</p>
        </div>
        <div>
          <p className="text-white font-black text-2xl">{stats.totalDays}</p>
          <p className="text-star-grey text-xs">Days trained</p>
        </div>
      </div>

      <p className="text-white/30 text-[11px] mt-4 flex items-center gap-1.5">
        <Calendar size={11} /> Classes and AI Coach sessions log automatically. Tap the button for mat work done on your own.
      </p>
    </motion.div>
  )
}

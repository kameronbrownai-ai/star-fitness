import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, ArrowRight, Loader2 } from 'lucide-react'
import { getSharedScore } from '../lib/progress'
import { LEVEL_COLOR } from '../lib/starScore'
import CompassStar from '../components/CompassStar'

// Public page behind a shared score link. Shows only what the owner chose to
// share: display name, sport, score, streak. Never the real name or email.
export default function ScoreShare() {
  const { id } = useParams()
  const [data, setData] = useState(undefined)

  useEffect(() => {
    getSharedScore(id).then(setData)
  }, [id])

  useEffect(() => {
    if (data) document.title = `${data.name} scored ${data.overall} on the Star Assessment | Star Fitness`
  }, [data])

  if (data === undefined) {
    return (
      <main className="pt-32 pb-20 min-h-screen flex items-center justify-center text-star-grey">
        <Loader2 size={20} className="animate-spin" />
      </main>
    )
  }

  if (data === null) {
    return (
      <main className="pt-32 pb-20 min-h-screen section-padding text-center">
        <p className="text-star-grey text-sm tracking-widest uppercase mb-3">Star Score</p>
        <h1 className="text-3xl font-black text-white mb-4">This score isn't shared.</h1>
        <p className="text-star-grey max-w-md mx-auto mb-8">The athlete hasn't made this one public, or the link is out of date.</p>
        <Link to="/" className="btn-primary">Take your own assessment <ArrowRight size={16} /></Link>
      </main>
    )
  }

  const color = LEVEL_COLOR[data.level] || '#FFD700'
  const cats = [
    ['Mobility', data.categories.mobility],
    ['Balance', data.categories.balance],
    ['Control', data.categories.control],
    ['Symmetry', data.categories.symmetry],
  ]
  const when = new Date(data.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <main className="pt-28 pb-20 min-h-screen section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="glass rounded-3xl border border-star-border p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[90px] pointer-events-none" style={{ background: `${color}22` }} />

          <div className="flex items-center gap-2 mb-6">
            <CompassStar size={18} color="#FFD700" />
            <p className="text-star-grey text-xs font-semibold tracking-widest uppercase">Star Score™</p>
          </div>

          <p className="text-white font-bold text-lg">{data.name}</p>
          <p className="text-star-grey text-sm mb-6">{data.sport ? `${data.sport} · ` : ''}{when}</p>

          <div className="flex items-end gap-3 mb-1">
            <p className="font-black leading-none" style={{ color, fontSize: '5.5rem' }}>{data.overall}</p>
            <div className="mb-3">
              <p className="font-black text-lg" style={{ color }}>{data.level}</p>
              <p className="text-star-grey text-xs">out of 100</p>
            </div>
          </div>

          <div className="space-y-3 mt-7">
            {cats.map(([label, v]) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-star-grey">{label}</span>
                  <span className="text-white font-semibold">{v}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${v}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>

          {data.streak > 0 && (
            <div className="mt-7 pt-5 border-t border-white/[0.06] flex items-center gap-2 text-sm">
              <Flame size={16} className="text-star-yellow" fill="#FFD700" />
              <span className="text-white font-semibold">{data.streak}-day</span>
              <span className="text-star-grey">training streak</span>
            </div>
          )}
        </div>

        <p className="text-white/30 text-[11px] text-center mt-4 leading-relaxed">
          Estimate for general fitness purposes, not medical advice.
        </p>

        <div className="text-center mt-8">
          <p className="text-star-grey text-sm mb-4">Five moves. Sixty seconds. Your own number.</p>
          <Link to="/account" className="btn-primary">Get your Star Score <ArrowRight size={16} /></Link>
        </div>
      </motion.div>
    </main>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, TrendingUp, Trophy, Crown } from 'lucide-react'
import { LEVEL_COLOR } from '../lib/starScore'

// Three ways to be at the top, so the board rewards more than raw talent:
// the highest score, the longest current streak, and the biggest climb.
const BOARDS = [
  { key: 'score',    label: 'Star Score',    icon: Trophy,     hint: 'Highest current score' },
  { key: 'streak',   label: 'Streak',        icon: Flame,      hint: 'Consecutive training days' },
  { key: 'improved', label: 'Most Improved', icon: TrendingUp, hint: 'Points gained in 30 days' },
]

function valueFor(row, board) {
  if (board === 'score') return row.score
  if (board === 'streak') return row.streak
  return row.improvement
}

function Value({ row, board }) {
  const v = valueFor(row, board)
  if (board === 'score') {
    if (v == null) return <span className="text-white/25 text-sm">no score yet</span>
    return (
      <span className="font-black text-2xl leading-none" style={{ color: LEVEL_COLOR[row.level] || '#FFD700' }}>{v}</span>
    )
  }
  if (board === 'streak') {
    return (
      <span className="font-black text-2xl leading-none text-white flex items-center gap-1.5">
        {v > 0 && <Flame size={18} className="text-star-yellow" fill="#FFD700" />}{v}
      </span>
    )
  }
  const color = v > 0 ? '#30D158' : v < 0 ? '#FF6B60' : 'rgba(255,255,255,0.35)'
  return <span className="font-black text-2xl leading-none" style={{ color }}>{v > 0 ? '+' : ''}{v}</span>
}

export default function Leaderboard({ rows, ownerId, viewerId, compact = false }) {
  const [board, setBoard] = useState('score')
  const sorted = [...rows].sort((a, b) => a.rank[board] - b.rank[board])
  const active = BOARDS.find(b => b.key === board)

  return (
    <div>
      <div className="flex gap-1.5 mb-5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] w-fit max-w-full overflow-x-auto">
        {BOARDS.map(b => {
          const Icon = b.icon
          const on = board === b.key
          return (
            <button
              key={b.key}
              onClick={() => setBoard(b.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                on ? 'bg-star-yellow text-star-black' : 'text-star-grey hover:text-white'
              }`}
            >
              <Icon size={14} /> {b.label}
            </button>
          )
        })}
      </div>
      <p className="text-white/30 text-xs mb-4">{active.hint}</p>

      {sorted.length === 0 ? (
        <p className="text-star-grey text-sm py-6 text-center">No one on the board yet.</p>
      ) : (
        <ol className="space-y-2">
          {sorted.map((row, i) => {
            const rank = row.rank[board]
            const isMe = row.user_id === viewerId
            const isOwner = row.user_id === ownerId
            const podium = rank === 1 ? '#FFD700' : rank === 2 ? '#C7C7CC' : rank === 3 ? '#CD7F32' : null
            return (
              <motion.li
                key={row.user_id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-4 rounded-2xl px-4 py-3 border ${
                  isMe ? 'bg-star-yellow/[0.07] border-star-yellow/30' : 'bg-star-card border-star-border'
                }`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={podium
                    ? { background: `${podium}22`, color: podium, border: `1px solid ${podium}55` }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
                >
                  {rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate flex items-center gap-1.5">
                    {row.name}
                    {isOwner && <Crown size={12} className="text-star-yellow flex-shrink-0" title="Team owner" />}
                    {isMe && <span className="text-star-yellow text-[10px] font-bold uppercase tracking-wider">you</span>}
                  </p>
                  {!compact && (
                    <p className="text-star-grey text-xs truncate">
                      {[row.sport, row.position].filter(Boolean).join(' · ') || '—'}
                      {board !== 'streak' && row.streak > 0 && <span className="ml-2 text-white/40">· {row.streak}d streak</span>}
                      {board !== 'score' && row.score != null && <span className="ml-2 text-white/40">· score {row.score}</span>}
                    </p>
                  )}
                </div>
                <Value row={row} board={board} />
              </motion.li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

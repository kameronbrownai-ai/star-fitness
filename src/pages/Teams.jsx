import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Plus, KeyRound, Loader2, ArrowRight, Crown, Lock, Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { myTeams, createTeam, joinTeam } from '../lib/progress'

const SPORTS = ['Football', 'Basketball', 'Soccer', 'Baseball / Softball', 'Track & Field', 'Pickleball', 'Tennis', 'Golf', 'Hockey', 'Lacrosse', 'MMA / Combat', 'Mixed']

export default function Teams() {
  const { user, openAuth } = useAuth()
  const [teams, setTeams] = useState(null)
  const [mode, setMode] = useState(null) // null | 'create' | 'join'
  const [name, setName] = useState('')
  const [sport, setSport] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function load() {
    try { setTeams((await myTeams()).teams) } catch { setTeams([]) }
  }
  useEffect(() => { if (user) load() }, [user])

  async function submitCreate(e) {
    e.preventDefault(); setErr(null); setBusy(true)
    try { await createTeam(name, sport); setName(''); setSport(''); setMode(null); await load() }
    catch (ex) { setErr(ex.message) }
    setBusy(false)
  }

  async function submitJoin(e) {
    e.preventDefault(); setErr(null); setBusy(true)
    try { await joinTeam(code); setCode(''); setMode(null); await load() }
    catch (ex) { setErr(ex.message) }
    setBusy(false)
  }

  if (!user) {
    return (
      <main className="pt-32 pb-20 min-h-screen section-padding text-center">
        <Users size={40} className="text-star-yellow mx-auto mb-5" />
        <h1 className="text-4xl font-black text-white mb-3">Teams</h1>
        <p className="text-star-grey max-w-md mx-auto mb-8">Train with your squad. Share a code, see everyone's Star Score and streak on one board.</p>
        <button onClick={() => openAuth({ mode: 'login' })} className="btn-primary">Sign in to get started <ArrowRight size={16} /></button>
      </main>
    )
  }

  return (
    <main className="pt-28 pb-20 min-h-screen section-padding">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-3">Teams</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Train Together.</h1>
          <p className="text-star-grey text-lg max-w-xl">
            Start a team or join one with a code. Everyone on it sees the same board: Star Score, streak, and who's climbing fastest.
          </p>
        </motion.div>

        <div className="flex gap-3 mb-8 flex-wrap">
          <button onClick={() => { setMode(mode === 'create' ? null : 'create'); setErr(null) }}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${mode === 'create' ? 'bg-star-yellow text-star-black' : 'border border-white/15 text-white hover:bg-white/5'}`}>
            <Plus size={16} /> Create a team
          </button>
          <button onClick={() => { setMode(mode === 'join' ? null : 'join'); setErr(null) }}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${mode === 'join' ? 'bg-star-yellow text-star-black' : 'border border-white/15 text-white hover:bg-white/5'}`}>
            <KeyRound size={16} /> Join with a code
          </button>
        </div>

        {mode === 'create' && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={submitCreate}
            className="glass rounded-2xl border border-star-border p-6 mb-8 space-y-4">
            <div>
              <label className="text-star-grey text-xs font-semibold uppercase tracking-wider block mb-2">Team name</label>
              <input value={name} onChange={e => setName(e.target.value)} maxLength={40} required placeholder="e.g. Eastside Football"
                className="w-full bg-star-black border border-star-border rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-star-yellow/60" />
            </div>
            <div>
              <label className="text-star-grey text-xs font-semibold uppercase tracking-wider block mb-2">Sport <span className="text-white/30 normal-case font-normal">(optional)</span></label>
              <div className="flex flex-wrap gap-2">
                {SPORTS.map(s => (
                  <button type="button" key={s} onClick={() => setSport(sport === s ? '' : s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${sport === s ? 'bg-star-yellow text-star-black border-star-yellow' : 'border-white/15 text-star-grey hover:text-white'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {err && <p className="text-red-400 text-sm">{err}</p>}
            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <>Create team <ArrowRight size={16} /></>}
            </button>
          </motion.form>
        )}

        {mode === 'join' && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={submitJoin}
            className="glass rounded-2xl border border-star-border p-6 mb-8 space-y-4">
            <div>
              <label className="text-star-grey text-xs font-semibold uppercase tracking-wider block mb-2">Team code</label>
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} maxLength={9} required placeholder="ABCD-1234"
                className="w-full bg-star-black border border-star-border rounded-xl px-4 py-3 text-white font-mono text-lg tracking-[0.2em] placeholder:text-white/25 placeholder:tracking-[0.2em] focus:outline-none focus:border-star-yellow/60" />
              <p className="text-white/30 text-xs mt-2">Ask your coach or a teammate for the code. It's on their team page.</p>
            </div>
            {err && <p className="text-red-400 text-sm">{err}</p>}
            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <>Join team <ArrowRight size={16} /></>}
            </button>
          </motion.form>
        )}

        <div>
          <p className="text-star-grey text-xs font-semibold tracking-widest uppercase mb-4">Your teams</p>
          {teams === null ? (
            <div className="text-star-grey text-sm flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Loading…</div>
          ) : teams.length === 0 ? (
            <div className="glass rounded-2xl border border-star-border p-8 text-center">
              <Users size={28} className="text-white/20 mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">No teams yet</p>
              <p className="text-star-grey text-sm">Create one above, or join with a code from a teammate.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {teams.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/teams/${t.id}`}
                    className="block glass rounded-2xl border border-star-border p-5 hover:border-star-yellow/40 transition-colors group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <p className="text-white font-bold text-lg leading-tight group-hover:text-star-yellow transition-colors">{t.name}</p>
                      {t.role === 'owner' && <Crown size={16} className="text-star-yellow flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-3 text-star-grey text-xs flex-wrap">
                      <span className="flex items-center gap-1"><Users size={12} /> {t.member_count} {t.member_count === 1 ? 'member' : 'members'}</span>
                      {t.sport && <span>· {t.sport}</span>}
                      <span className="flex items-center gap-1">· {t.visibility === 'public' ? <><Globe size={11} /> Public</> : <><Lock size={11} /> Members only</>}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardList, Plus, Loader2, ArrowRight, Users, Trash2, Download } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { listTestSessions, createTestSession, deleteTestSession, exportTestSession } from '../lib/progress'

export default function Coach() {
  const { user, openAuth } = useAuth()
  const [sessions, setSessions] = useState(null)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function load() {
    try { setSessions((await listTestSessions()).sessions) } catch { setSessions([]) }
  }
  useEffect(() => { if (user) load() }, [user])

  async function create(e) {
    e.preventDefault(); setErr(null); setBusy(true)
    try { await createTestSession(name, location); setName(''); setLocation(''); setCreating(false); await load() }
    catch (ex) { setErr(ex.message) }
    setBusy(false)
  }

  if (!user) {
    return (
      <main className="pt-32 pb-20 min-h-screen section-padding text-center">
        <ClipboardList size={38} className="text-star-yellow mx-auto mb-5" />
        <h1 className="text-4xl font-black text-white mb-3">Coach Mode</h1>
        <p className="text-star-grey max-w-md mx-auto mb-8">Run a testing session with a whole squad and export the results.</p>
        <button onClick={() => openAuth({ mode: 'login' })} className="btn-primary">Sign in <ArrowRight size={16} /></button>
      </main>
    )
  }

  return (
    <main className="pt-28 pb-20 min-h-screen section-padding">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-3">Coach Mode</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Test a whole squad.</h1>
          <p className="text-star-grey text-lg max-w-2xl">
            Capture Star Scores for any number of athletes on this one account, record your own read of each
            athlete alongside, and export the session as a spreadsheet. Nothing here touches your own Star Score.
          </p>
        </motion.div>

        {/* What the data is for, and how much of it is needed */}
        <div className="rounded-2xl border border-star-border bg-star-card p-5 mb-8">
          <p className="text-white font-bold mb-3">What a good session collects</p>
          <ul className="space-y-2 text-sm text-star-grey">
            <li><span className="text-white font-semibold">40 or so captures</span> across a real spread of ability, not 40 athletes of the same standard.</li>
            <li><span className="text-white font-semibold">Your 1–5 rating for each</span>, given before you see the score. Whether your read and the app's agree is the whole question.</li>
            <li><span className="text-white font-semibold">A dozen athletes captured twice</span> in the same session, so we can measure how much the score naturally varies.</li>
          </ul>
        </div>

        <div className="flex gap-3 mb-8">
          <button onClick={() => { setCreating(c => !c); setErr(null) }}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${creating ? 'bg-star-yellow text-star-black' : 'border border-white/15 text-white hover:bg-white/5'}`}>
            <Plus size={16} /> New session
          </button>
        </div>

        {creating && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={create}
            className="rounded-2xl border border-star-border bg-star-card p-5 mb-8 space-y-4">
            <label className="block">
              <span className="text-star-grey text-xs font-semibold block mb-2">Session name</span>
              <input value={name} onChange={e => setName(e.target.value)} maxLength={80} required placeholder="e.g. Eastside Football, preseason"
                className="w-full bg-star-black border border-star-border rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-star-yellow/60" />
            </label>
            <label className="block">
              <span className="text-star-grey text-xs font-semibold block mb-2">Location <span className="font-normal">(optional)</span></span>
              <input value={location} onChange={e => setLocation(e.target.value)} maxLength={80} placeholder="e.g. Eastside HS gym"
                className="w-full bg-star-black border border-star-border rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-star-yellow/60" />
            </label>
            {err && <p className="text-red-400 text-sm">{err}</p>}
            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <>Start session <ArrowRight size={16} /></>}
            </button>
          </motion.form>
        )}

        <p className="text-star-grey text-xs font-semibold tracking-widest uppercase mb-4">Your sessions</p>
        {sessions === null ? (
          <div className="text-star-grey text-sm flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Loading…</div>
        ) : sessions.length === 0 ? (
          <div className="rounded-2xl border border-star-border bg-star-card p-8 text-center">
            <ClipboardList size={26} className="text-white/20 mx-auto mb-3" />
            <p className="text-white font-semibold mb-1">No sessions yet</p>
            <p className="text-star-grey text-sm">Start one above when you have athletes in front of you.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-star-border bg-star-card p-5 flex items-center gap-4">
                <Link to={`/coach/${s.id}`} className="flex-1 min-w-0 group">
                  <p className="text-white font-bold group-hover:text-star-yellow transition-colors truncate">{s.name}</p>
                  <p className="text-star-grey text-xs mt-0.5 truncate">
                    {s.location ? `${s.location} · ` : ''}
                    <span className="inline-flex items-center gap-1"><Users size={11} /> {s.athlete_count} athlete{s.athlete_count === 1 ? '' : 's'}</span>
                    {' · '}{s.capture_count} capture{s.capture_count === 1 ? '' : 's'}
                    {' · '}{new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                </Link>
                {s.capture_count > 0 && (
                  <button onClick={() => exportTestSession(s.id, s.name)} className="text-star-grey hover:text-white flex-shrink-0" aria-label="Export CSV">
                    <Download size={16} />
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (!confirm(`Delete "${s.name}" and its ${s.capture_count} capture${s.capture_count === 1 ? '' : 's'}? Export first if you need the data.`)) return
                    await deleteTestSession(s.id); await load()
                  }}
                  className="text-star-grey hover:text-red-400 flex-shrink-0" aria-label="Delete session">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

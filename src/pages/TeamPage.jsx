import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Copy, Check, Lock, Globe, Loader2, ArrowLeft, Settings, RefreshCw, Trash2, LogOut, Share2, UserMinus, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getTeam, updateTeam, leaveTeam, deleteTeam, removeMember, getProfile, saveProfile } from '../lib/progress'
import Leaderboard from '../components/Leaderboard'

// Athletes need a display name to appear on a board. Rather than send them
// off to another page, ask right here the first time.
function DisplayNamePrompt({ onDone }) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  async function save(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    try { await saveProfile({ display_name: name }); onDone() }
    catch (ex) { setErr(ex.message) }
    setBusy(false)
  }
  return (
    <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={save}
      className="rounded-2xl border border-star-yellow/30 bg-star-yellow/[0.06] p-5 mb-6">
      <p className="text-white font-semibold mb-1">Pick a display name</p>
      <p className="text-star-grey text-sm mb-4">This is what your teammates see on the board. Your real name and email stay private.</p>
      <div className="flex gap-2">
        <input value={name} onChange={e => setName(e.target.value)} maxLength={24} required placeholder="e.g. JT_Speed"
          className="flex-1 bg-star-black border border-star-border rounded-xl px-4 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-star-yellow/60" />
        <button type="submit" disabled={busy} className="px-5 py-2.5 rounded-xl bg-star-yellow text-star-black font-bold text-sm">
          {busy ? <Loader2 size={15} className="animate-spin" /> : 'Save'}
        </button>
      </div>
      {err && <p className="text-red-400 text-sm mt-2">{err}</p>}
    </motion.form>
  )
}

export default function TeamPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, openAuth } = useAuth()
  const [data, setData] = useState(undefined)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [busy, setBusy] = useState(null)
  const [needsName, setNeedsName] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function load() {
    try {
      const d = await getTeam(id)
      setData(d); setError(null)
      if (d.role && user) {
        const { profile } = await getProfile()
        setNeedsName(!profile?.display_name)
      }
    } catch (ex) { setError(ex.message); setData(null) }
  }
  useEffect(() => { load() }, [id, user])

  async function copyCode() {
    await navigator.clipboard.writeText(data.team.invite_code)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  async function shareLink() {
    const url = `${window.location.origin}/teams/${id}`
    const text = `Join my team "${data.team.name}" on Star Mat. Code: ${data.team.invite_code}`
    if (navigator.share) { try { await navigator.share({ title: data.team.name, text, url }); return } catch {} }
    await navigator.clipboard.writeText(`${text}\n${url}`)
    setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000)
  }

  async function act(key, fn) {
    setBusy(key)
    try { await fn(); await load() } catch (ex) { alert(ex.message) }
    setBusy(null)
  }

  if (data === undefined) {
    return <main className="pt-32 min-h-screen flex items-center justify-center text-star-grey"><Loader2 size={20} className="animate-spin" /></main>
  }

  if (data === null) {
    return (
      <main className="pt-32 pb-20 min-h-screen section-padding text-center">
        <Lock size={36} className="text-white/20 mx-auto mb-4" />
        <h1 className="text-3xl font-black text-white mb-3">{error === 'This team is private.' ? 'This team is private' : 'Team not found'}</h1>
        <p className="text-star-grey max-w-md mx-auto mb-8">
          {error === 'This team is private.'
            ? (user ? 'Only members can see this board. Ask the owner for the team code.' : 'Sign in if you are a member, or ask the owner for the team code.')
            : 'This link may be out of date.'}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          {!user && <button onClick={() => openAuth({ mode: 'login' })} className="btn-primary">Sign in</button>}
          <Link to="/teams" className="btn-secondary">Go to Teams</Link>
        </div>
      </main>
    )
  }

  const { team, role, leaderboard, member_count } = data
  const isOwner = role === 'owner'

  return (
    <main className="pt-28 pb-20 min-h-screen section-padding">
      <div className="max-w-3xl mx-auto">
        <Link to="/teams" className="inline-flex items-center gap-1.5 text-star-grey text-sm hover:text-white mb-6 transition-colors">
          <ArrowLeft size={14} /> Teams
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{team.name}</h1>
              <div className="flex items-center gap-3 text-star-grey text-sm flex-wrap">
                <span className="flex items-center gap-1"><Users size={14} /> {member_count} {member_count === 1 ? 'member' : 'members'}</span>
                {team.sport && <span>· {team.sport}</span>}
                <span className="flex items-center gap-1">· {team.visibility === 'public' ? <><Globe size={12} /> Public board</> : <><Lock size={12} /> Members only</>}</span>
              </div>
            </div>
            {isOwner && (
              <button onClick={() => setShowSettings(s => !s)}
                className={`p-2.5 rounded-xl border transition-all ${showSettings ? 'bg-star-yellow text-star-black border-star-yellow' : 'border-white/15 text-white hover:bg-white/5'}`}
                aria-label="Team settings">
                <Settings size={18} />
              </button>
            )}
          </div>
        </motion.div>

        {needsName && <DisplayNamePrompt onDone={() => { setNeedsName(false); load() }} />}

        {role && (
          <div className="glass rounded-2xl border border-star-border p-5 mb-6">
            <p className="text-star-grey text-xs font-semibold tracking-widest uppercase mb-3">Invite teammates</p>
            <div className="flex items-center gap-3 flex-wrap">
              <code className="text-white font-mono text-2xl font-bold tracking-[0.15em] bg-star-black px-4 py-2.5 rounded-xl border border-star-border">{team.invite_code}</code>
              <button onClick={copyCode} className="px-4 py-2.5 rounded-xl border border-white/15 text-white text-sm font-semibold flex items-center gap-2 hover:bg-white/5">
                {copied ? <><Check size={14} strokeWidth={3} /> Copied</> : <><Copy size={14} /> Copy code</>}
              </button>
              <button onClick={shareLink} className="px-4 py-2.5 rounded-xl bg-star-yellow text-star-black text-sm font-bold flex items-center gap-2">
                {linkCopied ? <><Check size={14} strokeWidth={3} /> Copied</> : <><Share2 size={14} /> Share invite</>}
              </button>
            </div>
            <p className="text-white/30 text-xs mt-3">Teammates enter this code on the Teams page to join.</p>
          </div>
        )}

        <AnimatePresence>
          {showSettings && isOwner && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6">
              <div className="glass rounded-2xl border border-star-border p-5 space-y-5">
                <div>
                  <p className="text-white font-semibold mb-1">Who can see the board</p>
                  <p className="text-star-grey text-sm mb-3">Members-only keeps scores between teammates. Public lets anyone with the link see it — display names only, never real names.</p>
                  <div className="flex gap-2">
                    {[['members', Lock, 'Members only'], ['public', Globe, 'Public']].map(([v, Icon, label]) => (
                      <button key={v} disabled={busy === 'vis'} onClick={() => act('vis', () => updateTeam(id, { visibility: v }))}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 border transition-all ${team.visibility === v ? 'bg-star-yellow text-star-black border-star-yellow' : 'border-white/15 text-star-grey hover:text-white'}`}>
                        <Icon size={14} /> {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <p className="text-white font-semibold mb-1">Team code</p>
                  <p className="text-star-grey text-sm mb-3">Generate a new code if the old one has spread further than you wanted. The old one stops working immediately.</p>
                  <button disabled={busy === 'rotate'} onClick={() => act('rotate', () => updateTeam(id, { rotate_code: true }))}
                    className="px-4 py-2.5 rounded-xl border border-white/15 text-white text-sm font-semibold flex items-center gap-2 hover:bg-white/5">
                    {busy === 'rotate' ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} New code
                  </button>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <p className="text-white font-semibold mb-3">Members</p>
                  <ul className="space-y-2">
                    {leaderboard.map(m => (
                      <li key={m.user_id} className="flex items-center justify-between text-sm">
                        <span className="text-white">{m.name}{m.user_id === team.owner_id && <span className="text-star-yellow text-xs ml-2">owner</span>}</span>
                        {m.user_id !== team.owner_id && (
                          <button disabled={busy === m.user_id} onClick={() => act(m.user_id, () => removeMember(id, m.user_id))}
                            className="text-star-grey hover:text-red-400 flex items-center gap-1 text-xs transition-colors">
                            <UserMinus size={13} /> Remove
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  {!confirmDelete ? (
                    <button onClick={() => setConfirmDelete(true)} className="text-red-400 text-sm font-semibold flex items-center gap-2 hover:text-red-300">
                      <Trash2 size={14} /> Delete team
                    </button>
                  ) : (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/[0.06] p-4">
                      <p className="text-white text-sm font-semibold mb-1 flex items-center gap-2"><AlertCircle size={14} className="text-red-400" /> Delete "{team.name}"?</p>
                      <p className="text-star-grey text-xs mb-3">Everyone is removed and the board is gone. Individual scores and streaks are not affected.</p>
                      <div className="flex gap-2">
                        <button disabled={busy === 'del'} onClick={() => act('del', async () => { await deleteTeam(id); navigate('/teams') })}
                          className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold">
                          {busy === 'del' ? <Loader2 size={14} className="animate-spin" /> : 'Yes, delete'}
                        </button>
                        <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 rounded-lg border border-white/15 text-white text-sm">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass rounded-2xl border border-star-border p-5 md:p-6">
          <p className="text-star-grey text-xs font-semibold tracking-widest uppercase mb-5">Leaderboard</p>
          <Leaderboard rows={leaderboard} ownerId={team.owner_id} viewerId={user?.id} />
        </div>

        {role === 'member' && (
          <button disabled={busy === 'leave'} onClick={() => act('leave', async () => { await leaveTeam(id); navigate('/teams') })}
            className="mt-6 text-star-grey text-sm flex items-center gap-2 hover:text-white transition-colors">
            <LogOut size={14} /> Leave this team
          </button>
        )}

        {!role && team.visibility === 'public' && user && (
          <p className="text-star-grey text-sm mt-6">You're viewing this as a guest. Ask the owner for the code to join.</p>
        )}
      </div>
    </main>
  )
}

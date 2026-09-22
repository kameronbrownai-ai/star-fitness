import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Camera, Download, Trash2, Loader2, Check, AlertCircle, RotateCcw, Users } from 'lucide-react'
import { getTestSession, addCapture, deleteCapture, exportTestSession } from '../lib/progress'
import { LEVEL_COLOR } from '../lib/starScore'
import StarAssessment from '../components/StarAssessment'

const SPORTS = ['Football', 'Basketball', 'Soccer', 'Baseball / Softball', 'Track & Field', 'Pickleball', 'Tennis', 'Golf', 'Hockey', 'Lacrosse', 'MMA / Combat', 'General']
const AGE_BANDS = ['Under 14', '14–17', '18–24', '25–34', '35–49', '50+']
const SEXES = ['Male', 'Female', 'Prefer not to say']

// The coach's own read of movement quality, recorded BEFORE the score is
// revealed. Calibration is the question of whether this and the Star Score
// rank the same athletes the same way, so seeing the number first would
// contaminate the very thing being measured.
const RATINGS = [
  [1, 'Struggles', '#FF6B60'],
  [2, 'Below average', '#FF9F0A'],
  [3, 'Average', '#FFD700'],
  [4, 'Strong', '#30D158'],
  [5, 'Exceptional', '#007AFF'],
]

export default function CoachSession() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)

  // The athlete currently in front of the camera
  const [ref, setRef] = useState('')
  const [sport, setSport] = useState('')
  const [sex, setSex] = useState('')
  const [ageBand, setAgeBand] = useState('')
  const [rating, setRating] = useState(null)
  const [isRetest, setIsRetest] = useState(false)
  const [notes, setNotes] = useState('')

  const [capturing, setCapturing] = useState(false)
  const [pending, setPending] = useState(null)   // score awaiting save
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(null)

  async function load() {
    try { setData(await getTestSession(id)) }
    catch (e) { setErr(e.message) }
  }
  useEffect(() => { load() }, [id])

  // Which athletes have been seen, so a retest can be picked in one tap
  const seen = [...new Set((data?.captures || []).map(c => c.athlete_ref))]

  function onResult(result) {
    setPending(result)
    setCapturing(false)
  }

  async function save() {
    if (!pending || !ref.trim()) return
    setSaving(true)
    try {
      await addCapture(id, {
        athlete_ref: ref.trim(),
        sport: sport || null,
        sex: sex || null,
        age_band: ageBand || null,
        overall: pending.overall,
        level: pending.level,
        categories: pending.categories,
        capture_quality: pending.capture
          ? pending.capture.movesScored / pending.capture.movesTotal
          : null,
        coach_rating: rating,
        is_retest: isRetest,
        notes: notes.trim() || null,
      })
      setJustSaved({ ref: ref.trim(), overall: pending.overall })
      setTimeout(() => setJustSaved(null), 3000)
      // Keep sport/sex/age: a whole team usually shares them. Clear the rest.
      setPending(null); setRef(''); setRating(null); setIsRetest(false); setNotes('')
      await load()
    } catch (e) { setErr(e.message) }
    setSaving(false)
  }

  async function removeCapture(capId) {
    await deleteCapture(id, capId)
    await load()
  }

  if (err) {
    return (
      <main className="pt-32 pb-20 min-h-screen section-padding text-center">
        <AlertCircle size={32} className="text-star-yellow mx-auto mb-4" />
        <p className="text-white font-bold text-xl mb-2">{err}</p>
        <Link to="/coach" className="btn-secondary mt-4">Back to sessions</Link>
      </main>
    )
  }
  if (!data) {
    return <main className="pt-32 min-h-screen flex items-center justify-center text-star-grey"><Loader2 size={20} className="animate-spin" /></main>
  }

  const { session, captures } = data
  const athleteCount = seen.length
  const rated = captures.filter(c => c.coach_rating != null).length
  const retests = captures.filter(c => c.is_retest).length

  return (
    <main className="pt-24 pb-20 min-h-screen section-padding">
      <div className="max-w-3xl mx-auto">
        <Link to="/coach" className="inline-flex items-center gap-1.5 text-star-grey text-sm hover:text-white mb-5 transition-colors">
          <ArrowLeft size={14} /> Sessions
        </Link>

        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1">{session.name}</h1>
            <p className="text-star-grey text-sm">
              {session.location ? `${session.location} · ` : ''}
              {captures.length} capture{captures.length === 1 ? '' : 's'} · {athleteCount} athlete{athleteCount === 1 ? '' : 's'}
            </p>
          </div>
          {captures.length > 0 && (
            <button onClick={() => exportTestSession(id, session.name)}
              className="px-4 py-2.5 rounded-xl border border-white/15 text-white text-sm font-semibold flex items-center gap-2 hover:bg-white/5">
              <Download size={15} /> Export CSV
            </button>
          )}
        </div>

        {/* Progress toward a usable dataset, so the coach knows when to stop */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            [captures.length, 'captures', 40],
            [rated, 'coach-rated', 40],
            [retests, 'retests', 12],
          ].map(([n, label, target]) => (
            <div key={label} className="rounded-xl border border-star-border bg-star-card px-4 py-3">
              <p className="text-white font-black text-2xl leading-none">
                {n}<span className="text-star-grey text-sm font-medium"> / {target}</span>
              </p>
              <p className="text-star-grey text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {justSaved && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-star-green/30 bg-star-green/[0.08] px-4 py-3 mb-5 flex items-center gap-2">
            <Check size={16} className="text-star-green" strokeWidth={3} />
            <p className="text-white text-sm"><span className="font-bold">{justSaved.ref}</span> saved, scored {justSaved.overall}. Next athlete.</p>
          </motion.div>
        )}

        {/* ── The capture card ── */}
        <div className="rounded-2xl border border-star-border bg-star-card p-5 md:p-6 mb-8">
          <p className="text-star-grey text-xs font-semibold tracking-widest uppercase mb-4">Next athlete</p>

          <label className="block mb-4">
            <span className="text-white text-sm font-semibold block mb-2">
              Athlete reference <span className="text-star-grey font-normal">— jersey number or initials, not a full name</span>
            </span>
            <input value={ref} onChange={e => setRef(e.target.value)} maxLength={40} placeholder="e.g. 14 or JB"
              className="w-full bg-star-black border border-star-border rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-star-yellow/60" />
          </label>

          {seen.length > 0 && (
            <div className="mb-4">
              <p className="text-star-grey text-xs mb-2">Already captured, tap for a retest:</p>
              <div className="flex flex-wrap gap-1.5">
                {seen.map(s => (
                  <button key={s} onClick={() => { setRef(s); setIsRetest(true) }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-white/12 text-star-grey hover:text-white hover:border-white/30">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <Select label="Sport" value={sport} onChange={setSport} options={SPORTS} />
            <Select label="Age" value={ageBand} onChange={setAgeBand} options={AGE_BANDS} />
            <Select label="Sex" value={sex} onChange={setSex} options={SEXES} />
          </div>

          <div className="mb-4">
            <p className="text-white text-sm font-semibold mb-1">Your rating of their movement</p>
            <p className="text-star-grey text-xs mb-2">
              Rate them before you see the score. Comparing your read with the app's is the point of the session.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {RATINGS.map(([v, label, color]) => (
                <button key={v} onClick={() => setRating(rating === v ? null : v)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${rating === v ? 'text-star-black' : 'text-star-grey border-white/12 hover:text-white'}`}
                  style={rating === v ? { background: color, borderColor: color } : undefined}>
                  {v} · {label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input type="checkbox" checked={isRetest} onChange={e => setIsRetest(e.target.checked)}
              className="w-4 h-4 accent-star-yellow" />
            <span className="text-white text-sm">Second capture of this athlete today <span className="text-star-grey">(measures repeatability)</span></span>
          </label>

          <input value={notes} onChange={e => setNotes(e.target.value)} maxLength={300} placeholder="Notes, optional — e.g. recovering from ankle sprain"
            className="w-full bg-star-black border border-star-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-star-yellow/60 mb-5" />

          {!pending ? (
            <button onClick={() => setCapturing(true)} disabled={!ref.trim()}
              className="w-full py-4 rounded-xl bg-star-yellow text-star-black font-bold flex items-center justify-center gap-2 disabled:opacity-40">
              <Camera size={18} /> {ref.trim() ? `Capture ${ref.trim()}` : 'Enter a reference to start'}
            </button>
          ) : (
            <div className="rounded-xl border border-star-yellow/30 bg-star-yellow/[0.06] p-4">
              <div className="flex items-center gap-4 mb-4">
                <p className="font-black text-4xl leading-none" style={{ color: LEVEL_COLOR[pending.level] }}>{pending.overall}</p>
                <div>
                  <p className="font-bold" style={{ color: LEVEL_COLOR[pending.level] }}>{pending.level}</p>
                  <p className="text-star-grey text-xs">
                    {Object.entries(pending.categories).map(([k, v]) => `${k.slice(0, 3)} ${v}`).join(' · ')}
                  </p>
                </div>
              </div>
              {pending.capture && !pending.capture.confident && (
                <p className="text-star-yellow text-xs mb-3">
                  Only {pending.capture.movesScored} of {pending.capture.movesTotal} moves tracked clearly. Consider recapturing.
                </p>
              )}
              <div className="flex gap-2 flex-wrap">
                <button onClick={save} disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-star-yellow text-star-black font-bold text-sm flex items-center gap-2">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} strokeWidth={3} />} Save and next
                </button>
                <button onClick={() => { setPending(null); setCapturing(true) }}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-white text-sm font-semibold flex items-center gap-2">
                  <RotateCcw size={14} /> Recapture
                </button>
                <button onClick={() => setPending(null)}
                  className="px-4 py-2.5 rounded-xl text-star-grey text-sm hover:text-white">Discard</button>
              </div>
            </div>
          )}
        </div>

        {/* ── Captures so far ── */}
        {captures.length > 0 && (
          <div>
            <p className="text-star-grey text-xs font-semibold tracking-widest uppercase mb-3">Captured</p>
            <div className="space-y-2">
              {captures.map(c => (
                <div key={c.id} className="flex items-center gap-3 rounded-xl border border-star-border bg-star-card px-4 py-3">
                  <p className="font-black text-xl w-12 flex-shrink-0" style={{ color: LEVEL_COLOR[c.level] }}>{c.overall}</p>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {c.athlete_ref}
                      {c.is_retest && <span className="text-star-blue text-[10px] font-bold uppercase ml-2">retest</span>}
                    </p>
                    <p className="text-star-grey text-xs truncate">
                      {[c.sport, c.age_band, c.sex].filter(Boolean).join(' · ') || '—'}
                      {c.coach_rating && ` · you rated ${c.coach_rating}/5`}
                      {c.capture_quality != null && c.capture_quality < 1 && ` · partial capture`}
                    </p>
                  </div>
                  <button onClick={() => removeCapture(c.id)} className="text-star-grey hover:text-red-400 flex-shrink-0" aria-label="Remove capture">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {capturing && <StarAssessment onClose={() => setCapturing(false)} onResult={onResult} />}
      </AnimatePresence>
    </main>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-star-grey text-xs font-semibold block mb-1.5">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-star-black border border-star-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-star-yellow/60">
        <option value="">—</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}

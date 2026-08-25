import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, User, MapPin, Check, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { saveSubmission } from '../utils/dataStore'
import ComingSoonOverlay from '../components/ComingSoonOverlay'

const instructors = [
  { id: 'sarah', name: 'Sarah Chen', specialty: 'Yoga & Mindfulness', initials: 'SC', color: '#007AFF', classes: ['Yoga Flow', 'Morning Stretch', 'Restorative Yoga'] },
  { id: 'marcus', name: 'Marcus Johnson', specialty: 'HIIT & Strength', initials: 'MJ', color: '#FF375F', classes: ['Mat HIIT', 'Power Core', 'Plyometrics'] },
  { id: 'elena', name: 'Elena Rodriguez', specialty: 'Flexibility & Pilates', initials: 'ER', color: '#BF5AF2', classes: ['Deep Stretch', 'Pilates Core', 'Advanced Flexibility'] },
]

const timeSlots = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM']

const locations = [
  { id: 'nyc', name: 'Star Studio NYC', address: '142 W 36th St, New York, NY 10018' },
  { id: 'la', name: 'Star Studio LA', address: '8391 Beverly Blvd, Los Angeles, CA 90048' },
  { id: 'chi', name: 'Star Studio Chicago', address: '875 N Michigan Ave, Chicago, IL 60611' },
]

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function Booking() {
  const today = new Date()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', notes: '' })

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDay = getFirstDayOfMonth(calYear, calMonth)

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) } else setCalMonth(m => m - 1)
    setSelectedDay(null)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) } else setCalMonth(m => m + 1)
    setSelectedDay(null)
  }

  const isPast = (day) => new Date(calYear, calMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const canNext = () => {
    if (step === 1) return selectedInstructor && selectedClass && selectedLocation
    if (step === 2) return selectedDay && selectedTime
    if (step === 3) return form.firstName && form.lastName && form.email
    return false
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    saveSubmission('bookings', {
      instructor: selectedInstructor?.name,
      classType: selectedClass,
      location: selectedLocation?.name,
      date: `${monthNames[calMonth]} ${selectedDay}, ${calYear}`,
      time: selectedTime,
      ...form,
    })
    setLoading(false)
    setSubmitted(true)
  }

  const instructor = instructors.find((i) => i.id === selectedInstructor?.id)

  const stepLabel = ['Choose Class', 'Pick Date & Time', 'Your Details']

  return (
    <main className="pt-24 pb-20">
      <ComingSoonOverlay
        title="Booking Is Almost Here"
        message="In-person and live class booking launches soon. Check back shortly, or grab your Star Mat and start training today."
      />
      {/* Header */}
      <section className="section-padding py-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[50vw] h-[25vw] rounded-full bg-star-blue/6 blur-[80px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 max-w-3xl">
          <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-3">In-Person Sessions</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4">Book a <span className="text-gradient-blue">Class.</span></h1>
          <p className="text-star-grey text-lg">Train on the Star Mat with a world-class instructor. Select your session below.</p>
        </motion.div>
      </section>

      {submitted ? (
        <div className="section-padding">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto glass rounded-3xl p-16 text-center border border-star-blue/20">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
              <Check size={30} className="text-green-400" />
            </div>
            <h2 className="text-3xl font-black mb-3">You're Booked!</h2>
            <p className="text-star-grey mb-6">
              A confirmation has been saved for <span className="text-white font-semibold">{form.email}</span>.
              We'll see you on the mat!
            </p>
            <div className="glass rounded-2xl p-5 text-left space-y-2 border border-star-border mb-8">
              {[
                [Calendar, `${monthNames[calMonth]} ${selectedDay}, ${calYear}`],
                [Clock, selectedTime],
                [User, selectedInstructor?.name],
                [MapPin, selectedLocation?.name],
              ].map(([Icon, val]) => (
                <div key={val} className="flex items-center gap-3 text-sm">
                  <Icon size={15} className="text-star-blue flex-shrink-0" />
                  <span className="text-white">{val}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setSubmitted(false); setStep(1); setSelectedInstructor(null); setSelectedClass(null); setSelectedLocation(null); setSelectedDay(null); setSelectedTime(null); setForm({ firstName: '', lastName: '', email: '', phone: '', notes: '' }) }} className="btn-secondary text-sm py-3 px-6">
              Book Another Class
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="section-padding">
          <div className="max-w-3xl mx-auto">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-10 justify-center">
              {stepLabel.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${step === i + 1 ? 'bg-star-blue text-white' : step > i + 1 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-star-grey'}`}>
                    {step > i + 1 ? <Check size={14} /> : <span>{i + 1}</span>}
                    <span className="hidden sm:block">{label}</span>
                  </div>
                  {i < 2 && <div className={`h-px w-8 transition-colors ${step > i + 1 ? 'bg-green-500' : 'bg-star-border'}`} />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Choose class */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="text-2xl font-black">Choose an Instructor</h2>
                  <div className="grid gap-4">
                    {instructors.map((inst) => (
                      <motion.div key={inst.id} whileHover={{ scale: 1.01 }}
                        onClick={() => { setSelectedInstructor(inst); setSelectedClass(null) }}
                        className={`glass rounded-2xl p-5 border cursor-pointer transition-all ${selectedInstructor?.id === inst.id ? 'border-opacity-100' : 'border-star-border hover:border-white/20'}`}
                        style={selectedInstructor?.id === inst.id ? { borderColor: inst.color, boxShadow: `0 0 0 1px ${inst.color}40` } : {}}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ backgroundColor: inst.color }}>{inst.initials}</div>
                          <div>
                            <p className="text-white font-bold">{inst.name}</p>
                            <p className="text-star-grey text-sm">{inst.specialty}</p>
                          </div>
                          {selectedInstructor?.id === inst.id && <Check size={18} className="ml-auto flex-shrink-0" style={{ color: inst.color }} />}
                        </div>
                        {selectedInstructor?.id === inst.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                            <p className="text-star-grey text-xs uppercase tracking-widest mb-2">Select a class</p>
                            <div className="flex flex-wrap gap-2">
                              {inst.classes.map((cls) => (
                                <button key={cls} onClick={(e) => { e.stopPropagation(); setSelectedClass(cls) }}
                                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${selectedClass === cls ? 'text-star-black' : 'glass border border-star-border text-star-grey hover:text-white'}`}
                                  style={selectedClass === cls ? { backgroundColor: inst.color } : {}}
                                >{cls}</button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <h2 className="text-2xl font-black pt-2">Choose a Location</h2>
                  <div className="grid gap-3">
                    {locations.map((loc) => (
                      <motion.div key={loc.id} whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedLocation(loc)}
                        className={`glass rounded-xl p-4 border cursor-pointer transition-all flex items-center gap-4 ${selectedLocation?.id === loc.id ? 'border-star-blue bg-star-blue/5' : 'border-star-border hover:border-white/20'}`}
                      >
                        <MapPin size={18} className={selectedLocation?.id === loc.id ? 'text-star-blue' : 'text-star-grey'} />
                        <div>
                          <p className="text-white font-semibold text-sm">{loc.name}</p>
                          <p className="text-star-grey text-xs">{loc.address}</p>
                        </div>
                        {selectedLocation?.id === loc.id && <Check size={16} className="ml-auto text-star-blue flex-shrink-0" />}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="space-y-6">
                  {/* Calendar */}
                  <div className="glass rounded-2xl p-6 border border-star-border">
                    <div className="flex items-center justify-between mb-5">
                      <button onClick={prevMonth} className="p-2 rounded-full hover:bg-white/5 text-star-grey hover:text-white transition-colors"><ChevronLeft size={18} /></button>
                      <h3 className="text-white font-bold">{monthNames[calMonth]} {calYear}</h3>
                      <button onClick={nextMonth} className="p-2 rounded-full hover:bg-white/5 text-star-grey hover:text-white transition-colors"><ChevronRight size={18} /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => (
                        <p key={d} className="text-center text-star-grey text-xs font-semibold py-1">{d}</p>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} />)}
                      {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1
                        const past = isPast(day)
                        const sel = selectedDay === day
                        return (
                          <button key={day} disabled={past} onClick={() => setSelectedDay(day)}
                            className={`aspect-square rounded-xl text-sm font-semibold transition-all ${past ? 'text-star-border cursor-not-allowed' : sel ? 'bg-star-blue text-white' : 'text-star-grey hover:bg-white/5 hover:text-white'}`}
                          >{day}</button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div>
                    <h3 className="text-white font-bold mb-3">Available Times</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map((t) => (
                        <button key={t} onClick={() => setSelectedTime(t)}
                          className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${selectedTime === t ? 'bg-star-blue border-star-blue text-white' : 'border-star-border text-star-grey hover:border-white/30 hover:text-white'}`}
                        >{t}</button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Contact */}
              {step === 3 && (
                <motion.form key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} onSubmit={handleSubmit} className="space-y-4">
                  {/* Summary */}
                  <div className="glass rounded-2xl p-5 border border-star-border space-y-2">
                    <p className="text-white font-bold mb-3">Booking Summary</p>
                    {[
                      [Calendar, `${monthNames[calMonth]} ${selectedDay}, ${calYear} at ${selectedTime}`],
                      [User, `${selectedInstructor?.name}, ${selectedClass}`],
                      [MapPin, selectedLocation?.name],
                    ].map(([Icon, val]) => (
                      <div key={val} className="flex items-center gap-2.5 text-sm">
                        <Icon size={14} className="text-star-blue flex-shrink-0" />
                        <span className="text-star-grey">{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[['firstName', 'First Name'], ['lastName', 'Last Name']].map(([name, label]) => (
                      <div key={name}>
                        <label className="block text-star-grey text-sm mb-1.5">{label} *</label>
                        <input required name={name} value={form[name]} onChange={handleChange} placeholder={label}
                          className="w-full px-4 py-3 rounded-xl bg-star-card border border-star-border text-white placeholder-star-grey/50 focus:outline-none focus:border-star-blue transition-colors text-sm" />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[['email', 'Email', 'email'], ['phone', 'Phone', 'tel']].map(([name, label, type]) => (
                      <div key={name}>
                        <label className="block text-star-grey text-sm mb-1.5">{label} {name === 'email' ? '*' : ''}</label>
                        <input name={name} type={type} value={form[name]} onChange={handleChange} placeholder={label}
                          required={name === 'email'}
                          className="w-full px-4 py-3 rounded-xl bg-star-card border border-star-border text-white placeholder-star-grey/50 focus:outline-none focus:border-star-blue transition-colors text-sm" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-star-grey text-sm mb-1.5">Notes (optional)</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Injuries, questions, anything we should know..."
                      className="w-full px-4 py-3 rounded-xl bg-star-card border border-star-border text-white placeholder-star-grey/50 focus:outline-none focus:border-star-blue transition-colors text-sm resize-none" />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
                    className="w-full btn-primary justify-center py-4 text-base disabled:opacity-60">
                    {loading ? 'Confirming...' : <>Confirm Booking <ArrowRight size={18} /></>}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Nav buttons */}
            {!submitted && (
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setStep(s => s - 1)} className="btn-secondary py-3 px-6 text-sm">
                    Back
                  </motion.button>
                )}
                {step < 3 && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => canNext() && setStep(s => s + 1)}
                    disabled={!canNext()}
                    className="btn-primary py-3 px-8 text-sm ml-auto disabled:opacity-40 disabled:cursor-not-allowed">
                    Continue <ArrowRight size={16} />
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

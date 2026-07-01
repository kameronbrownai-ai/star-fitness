import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Check } from 'lucide-react'

const SPORTS = ['Football', 'Basketball', 'Soccer', 'Baseball / Softball', 'Track & Field', 'Tennis', 'MMA / Combat', 'Golf', 'General Fitness']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Pro Level']
const GOALS = ['Speed', 'Strength', 'Agility', 'Flexibility', 'Recovery', 'Endurance']
const EQUIPMENT_OPTIONS = ['Open Field / Court', 'Full Gym', 'Resistance Bands', 'Free Weights', 'Home / Bodyweight Only']
const METRIC_FIELDS = [
  { key: 'fortyYard', label: '40-Yard Dash', placeholder: 'e.g. 4.6s' },
  { key: 'vertical', label: 'Vertical Jump', placeholder: 'e.g. 32 in' },
  { key: 'bench', label: 'Bench Press', placeholder: 'e.g. 225 lbs' },
  { key: 'squat', label: 'Squat Max', placeholder: 'e.g. 315 lbs' },
  { key: 'mileTime', label: 'Mile Time', placeholder: 'e.g. 6:30' },
  { key: 'bodyWeight', label: 'Body Weight', placeholder: 'e.g. 185 lbs' },
]
const POSITION_HINT = {
  Football: 'e.g. Wide Receiver, Linebacker',
  Basketball: 'e.g. Point Guard, Power Forward',
  Soccer: 'e.g. Center Midfielder, Striker',
  Golf: 'e.g. Amateur, Club Player',
  Tennis: 'e.g. Singles, Doubles',
  'MMA / Combat': 'e.g. Striker, Grappler, BJJ',
  'Track & Field': 'e.g. Sprinter, Long Jump, Throws',
  'Baseball / Softball': 'e.g. Outfielder, Pitcher',
}
const TOTAL_STEPS = 7

function SelectGrid({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`py-2.5 px-3 rounded-xl border text-sm font-medium text-left transition-all ${
            value === opt
              ? 'border-star-blue bg-star-blue/20 text-white'
              : 'border-star-border text-star-grey hover:border-star-blue/30 hover:text-white bg-star-card'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function MultiSelect({ options, selected, onToggle }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          className={`py-2.5 px-3 rounded-xl border text-sm font-medium text-left flex items-center gap-3 transition-all ${
            selected.includes(opt)
              ? 'border-star-blue bg-star-blue/20 text-white'
              : 'border-star-border text-star-grey hover:border-star-blue/30 hover:text-white bg-star-card'
          }`}
        >
          <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
            selected.includes(opt) ? 'bg-star-blue border-star-blue' : 'border-star-border'
          }`}>
            {selected.includes(opt) && <Check size={10} className="text-white" />}
          </div>
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function AIOnboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState({
    sport: '', position: '', level: '', goal: '', injuries: '', equipment: [], metrics: {}
  })

  function set(key, value) { setProfile(p => ({ ...p, [key]: value })) }

  function toggleEquip(item) {
    setProfile(p => ({
      ...p,
      equipment: p.equipment.includes(item)
        ? p.equipment.filter(e => e !== item)
        : [...p.equipment, item],
    }))
  }

  function setMetric(key, val) {
    setProfile(p => ({ ...p, metrics: { ...p.metrics, [key]: val } }))
  }

  function canProceed() {
    if (step === 0) return !!profile.sport
    if (step === 2) return !!profile.level
    if (step === 3) return !!profile.goal
    if (step === 5) return profile.equipment.length > 0
    return true
  }

  function getButtonLabel() {
    if (step === TOTAL_STEPS - 1) return 'Start Training'
    if (step === 1) return profile.position ? 'Next' : 'Skip'
    if (step === 4) return profile.injuries ? 'Next' : 'Skip'
    if (step === 6) return Object.values(profile.metrics).some(Boolean) ? 'Next' : 'Skip'
    return 'Next'
  }

  function next() {
    if (step < TOTAL_STEPS - 1) setStep(s => s + 1)
    else onComplete(profile)
  }

  return (
    <div className="flex flex-col bg-star-black" style={{ height: '100%' }}>
      {/* Progress */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-star-grey text-xs">Step {step + 1} of {TOTAL_STEPS}</p>
          <p className="text-star-yellow text-xs font-semibold">Building your profile</p>
        </div>
        <div className="h-1 w-full bg-star-card rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-star-blue rounded-full"
            animate={{ width: `${(step / (TOTAL_STEPS - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
          >
            {step === 0 && (
              <>
                <p className="text-white font-bold text-base mb-1">What sport do you train for?</p>
                <p className="text-star-grey text-xs mb-4">Your coach tailors every workout to your sport.</p>
                <SelectGrid options={SPORTS} value={profile.sport} onChange={v => set('sport', v)} />
              </>
            )}

            {step === 1 && (
              <>
                <p className="text-white font-bold text-base mb-1">What's your position or role?</p>
                <p className="text-star-grey text-xs mb-4">The more specific, the better. (Optional)</p>
                <input
                  autoFocus
                  type="text"
                  value={profile.position}
                  onChange={e => set('position', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && next()}
                  placeholder={POSITION_HINT[profile.sport] || 'e.g. Striker, Point Guard, Linebacker'}
                  className="w-full bg-star-card border border-star-border rounded-xl px-3 py-3 text-sm text-white placeholder:text-star-grey/40 focus:outline-none focus:border-star-blue/50 transition-colors"
                />
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-white font-bold text-base mb-4">What's your current fitness level?</p>
                <SelectGrid options={LEVELS} value={profile.level} onChange={v => set('level', v)} />
              </>
            )}

            {step === 3 && (
              <>
                <p className="text-white font-bold text-base mb-4">What's your #1 training goal?</p>
                <SelectGrid options={GOALS} value={profile.goal} onChange={v => set('goal', v)} />
              </>
            )}

            {step === 4 && (
              <>
                <p className="text-white font-bold text-base mb-1">Any injuries or physical limitations?</p>
                <p className="text-star-grey text-xs mb-4">Your coach will modify exercises around them. (Optional)</p>
                <input
                  autoFocus
                  type="text"
                  value={profile.injuries}
                  onChange={e => set('injuries', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && next()}
                  placeholder="e.g. left knee soreness, tight hip flexors"
                  className="w-full bg-star-card border border-star-border rounded-xl px-3 py-3 text-sm text-white placeholder:text-star-grey/40 focus:outline-none focus:border-star-blue/50 transition-colors"
                />
              </>
            )}

            {step === 5 && (
              <>
                <p className="text-white font-bold text-base mb-1">What equipment do you have access to?</p>
                <p className="text-star-grey text-xs mb-4">Select all that apply.</p>
                <MultiSelect options={EQUIPMENT_OPTIONS} selected={profile.equipment} onToggle={toggleEquip} />
              </>
            )}

            {step === 6 && (
              <>
                <p className="text-white font-bold text-base mb-1">Share your performance metrics</p>
                <p className="text-star-grey text-xs mb-4">Fill in what you know. Your coach uses these to set the right intensity. All optional.</p>
                <div className="space-y-3">
                  {METRIC_FIELDS.map(f => (
                    <div key={f.key}>
                      <p className="text-star-grey text-xs mb-1.5">{f.label}</p>
                      <input
                        type="text"
                        value={profile.metrics[f.key] || ''}
                        onChange={e => setMetric(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full bg-star-card border border-star-border rounded-xl px-3 py-2 text-sm text-white placeholder:text-star-grey/40 focus:outline-none focus:border-star-blue/50 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Button */}
      <div className="px-4 py-3 flex-shrink-0 border-t border-star-border bg-star-card">
        <button
          onClick={next}
          disabled={!canProceed()}
          className="w-full py-3 rounded-xl bg-star-blue text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-opacity"
        >
          {getButtonLabel()} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

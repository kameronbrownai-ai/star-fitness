import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Clock, Flame, ChevronDown, Lock } from 'lucide-react'

const intensityLevels = ['All', 'Beginner', 'Intermediate', 'Advanced']
const instructors = ['All Instructors', 'Sarah Chen', 'Marcus Johnson', 'Elena Rodriguez']

const classes = [
  {
    id: 1,
    title: 'Morning Flow & Breath',
    instructor: 'Sarah Chen',
    intensity: 'Beginner',
    duration: '30 min',
    category: 'Yoga',
    color: 'from-blue-900/50 to-star-black',
    accent: '#007AFF',
    free: true,
    desc: 'Start your day grounded. Gentle stretches, breathwork, and intention-setting.',
  },
  {
    id: 2,
    title: 'Power Core Ignition',
    instructor: 'Marcus Johnson',
    intensity: 'Advanced',
    duration: '45 min',
    category: 'HIIT',
    color: 'from-red-900/40 to-star-black',
    accent: '#FF375F',
    free: false,
    desc: 'High-intensity core-focused training. No breaks, all gains.',
  },
  {
    id: 3,
    title: 'Mindful Stretch Flow',
    instructor: 'Elena Rodriguez',
    intensity: 'Beginner',
    duration: '25 min',
    category: 'Stretch',
    color: 'from-purple-900/40 to-star-black',
    accent: '#BF5AF2',
    free: true,
    desc: 'Slow, deliberate stretching guided by breath and body awareness.',
  },
  {
    id: 4,
    title: 'Mat HIIT: Full Body',
    instructor: 'Marcus Johnson',
    intensity: 'Intermediate',
    duration: '40 min',
    category: 'HIIT',
    color: 'from-orange-900/40 to-star-black',
    accent: '#FF9F0A',
    free: false,
    desc: 'A sweat-inducing full-body circuit, all done on the Star Mat.',
  },
  {
    id: 5,
    title: 'Yoga Fundamentals',
    instructor: 'Sarah Chen',
    intensity: 'Beginner',
    duration: '60 min',
    category: 'Yoga',
    color: 'from-teal-900/40 to-star-black',
    accent: '#32D4B9',
    free: false,
    desc: 'Master the 12 foundational poses. Build your practice from the ground up.',
  },
  {
    id: 6,
    title: 'Advanced Flexibility',
    instructor: 'Elena Rodriguez',
    intensity: 'Advanced',
    duration: '50 min',
    category: 'Stretch',
    color: 'from-pink-900/40 to-star-black',
    accent: '#FF6B9D',
    free: false,
    desc: 'Deep flexibility work for athletes and experienced practitioners.',
  },
  {
    id: 7,
    title: 'Balance & Stability',
    instructor: 'Marcus Johnson',
    intensity: 'Intermediate',
    duration: '35 min',
    category: 'Strength',
    color: 'from-cyan-900/40 to-star-black',
    accent: '#64D2FF',
    free: false,
    desc: 'Single-leg drills, proprioception work, and functional balance training.',
  },
  {
    id: 8,
    title: 'Restorative Evening',
    instructor: 'Sarah Chen',
    intensity: 'Beginner',
    duration: '20 min',
    category: 'Yoga',
    color: 'from-indigo-900/40 to-star-black',
    accent: '#5E5CE6',
    free: true,
    desc: 'Wind down with passive holds and guided relaxation before sleep.',
  },
  {
    id: 9,
    title: 'Explosive Plyometrics',
    instructor: 'Marcus Johnson',
    intensity: 'Advanced',
    duration: '55 min',
    category: 'HIIT',
    color: 'from-yellow-900/40 to-star-black',
    accent: '#FFD700',
    free: false,
    desc: 'Jump training, fast-twitch activation, and peak athletic performance.',
  },
]

const intensityColors = {
  Beginner: { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/20' },
  Intermediate: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  Advanced: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/20' },
}

const instructorBios = {
  'Sarah Chen': { initials: 'SC', color: '#007AFF', classes: 342, specialty: 'Yoga & Mindfulness' },
  'Marcus Johnson': { initials: 'MJ', color: '#FF375F', classes: 289, specialty: 'HIIT & Strength' },
  'Elena Rodriguez': { initials: 'ER', color: '#BF5AF2', classes: 198, specialty: 'Flexibility & Stretch' },
}

export default function Lessons() {
  const [intensity, setIntensity] = useState('All')
  const [instructor, setInstructor] = useState('All Instructors')
  const [playing, setPlaying] = useState(null)

  const filtered = classes.filter((c) => {
    const byIntensity = intensity === 'All' || c.intensity === intensity
    const byInstructor = instructor === 'All Instructors' || c.instructor === instructor
    return byIntensity && byInstructor
  })

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <section className="section-padding py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50vw] h-[25vw] rounded-full bg-star-yellow/5 blur-[80px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl"
        >
          <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-3">On-Demand Classes</p>
          <h1 className="text-5xl md:text-6xl font-black mb-5">
            Train with the <span className="text-gradient-blue">Best.</span>
          </h1>
          <p className="text-star-grey text-lg leading-relaxed">
            Over 1,200 classes led by world-class instructors. Filter by intensity and style — find your
            perfect session on the Star Mat.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <div className="section-padding mb-8 sticky top-[68px] z-30 py-4 bg-star-black/90 backdrop-blur-xl border-b border-star-border">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="text-star-grey text-sm font-medium flex items-center gap-1.5">
              <Flame size={14} /> Intensity:
            </span>
            {intensityLevels.map((level) => (
              <motion.button
                key={level}
                onClick={() => setIntensity(level)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  intensity === level
                    ? 'bg-star-blue text-white'
                    : 'glass text-star-grey hover:text-white border border-star-border'
                }`}
              >
                {level}
              </motion.button>
            ))}
          </div>

          <div className="relative">
            <select
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="appearance-none glass border border-star-border text-star-grey text-sm px-4 py-2 pr-8 rounded-full focus:outline-none focus:border-star-blue cursor-pointer"
            >
              {instructors.map((i) => (
                <option key={i} value={i} className="bg-star-card">
                  {i}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-star-grey pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Class count */}
      <div className="section-padding mb-6">
        <p className="text-star-grey text-sm">
          Showing <span className="text-white font-semibold">{filtered.length}</span> classes
        </p>
      </div>

      {/* Classes Grid */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((cls, i) => {
                const iColors = intensityColors[cls.intensity]
                const isBio = instructorBios[cls.instructor]
                return (
                  <motion.div
                    key={cls.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className="card-hover group"
                  >
                    <div className={`rounded-2xl border border-star-border bg-gradient-to-b ${cls.color} overflow-hidden`}>
                      {/* Thumbnail */}
                      <div className="relative h-48 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-star-black/60" />
                        {/* Animated play button */}
                        <motion.button
                          onClick={() => setPlaying(playing === cls.id ? null : cls.id)}
                          className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                          style={{
                            backgroundColor: `${cls.accent}30`,
                            border: `2px solid ${cls.accent}60`,
                          }}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {playing === cls.id ? (
                            <div className="flex gap-1">
                              <div className="w-1.5 h-5 rounded-full bg-white" />
                              <div className="w-1.5 h-5 rounded-full bg-white" />
                            </div>
                          ) : (
                            <Play size={22} fill="white" className="text-white ml-1" />
                          )}
                        </motion.button>

                        {/* Free badge */}
                        {cls.free && (
                          <div className="absolute top-3 left-3 px-2 py-0.5 bg-green-500 rounded-full text-xs font-bold text-black">
                            FREE
                          </div>
                        )}

                        {/* Lock for premium */}
                        {!cls.free && (
                          <div className="absolute top-3 left-3 w-7 h-7 rounded-full glass border border-white/10 flex items-center justify-center">
                            <Lock size={12} className="text-star-grey" />
                          </div>
                        )}

                        {/* Category chip */}
                        <div
                          className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: `${cls.accent}20`, color: cls.accent, border: `1px solid ${cls.accent}30` }}
                        >
                          {cls.category}
                        </div>

                        {/* Duration */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white text-xs">
                          <Clock size={12} />
                          {cls.duration}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-white font-bold text-lg leading-tight">{cls.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${iColors.bg} ${iColors.text} border ${iColors.border}`}>
                            {cls.intensity}
                          </span>
                        </div>
                        <p className="text-star-grey text-sm mb-4 leading-relaxed">{cls.desc}</p>

                        {/* Instructor */}
                        <div className="flex items-center gap-3 pt-3 border-t border-white/8">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: isBio?.color || '#007AFF' }}
                          >
                            {isBio?.initials}
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">{cls.instructor}</p>
                            <p className="text-star-grey text-xs">{isBio?.specialty}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-star-grey text-xl">No classes match your filters.</p>
              <button
                onClick={() => { setIntensity('All'); setInstructor('All Instructors') }}
                className="mt-4 text-star-blue hover:underline text-sm"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Instructor Spotlight */}
      <section className="section-padding mt-20 pt-20 border-t border-star-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-star-grey text-sm tracking-widest uppercase mb-3">World-Class Coaching</p>
            <h2 className="text-4xl font-black">Meet Your Instructors</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(instructorBios).map(([name, bio], i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass rounded-2xl p-8 text-center border border-star-border card-hover"
              >
                <div
                  className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-2xl font-black text-white mb-4"
                  style={{ backgroundColor: bio.color }}
                >
                  {bio.initials}
                </div>
                <h3 className="text-white font-bold text-xl mb-1">{name}</h3>
                <p className="text-star-grey text-sm mb-3">{bio.specialty}</p>
                <p className="text-star-blue font-semibold text-sm">{bio.classes}+ Classes</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

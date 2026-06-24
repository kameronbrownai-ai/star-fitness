import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Clock, Lock, Activity, Heart } from 'lucide-react'
import AIWorkoutChat from '../components/AIWorkoutChat'

const sports = [
  {
    id: 'football',
    name: 'Football',
    emoji: '🏈',
    color: '#FF6B00',
    desc: 'Speed, power, and explosion',
    train: [
      { id: 1, title: 'Speed & Explosion', targets: ['Legs', 'Glutes', 'Hip Flexors'], instructor: 'Marcus Johnson', duration: '45 min', free: true, desc: 'Directional speed drills using the Star Mat grid to build first-step quickness and burst.' },
      { id: 2, title: 'Lateral Agility Patterns', targets: ['Legs', 'Ankles', 'Core'], instructor: 'Marcus Johnson', duration: '40 min', free: false, desc: 'Star Mat arrow drills for change-of-direction speed, cutting, and defensive footwork.' },
      { id: 3, title: 'Core Power for Linemen', targets: ['Core', 'Shoulders', 'Hips'], instructor: 'Elena Rodriguez', duration: '35 min', free: false, desc: 'Rotational core strength and hip drive for blocking, tackling, and ground leverage.' },
      { id: 4, title: 'Hip Flexor Activation', targets: ['Hip Flexors', 'Glutes', 'Lower Back'], instructor: 'Sarah Chen', duration: '25 min', free: false, desc: 'Pre-game hip priming to unlock stride length and prevent common groin strains.' },
    ],
    recover: [
      { id: 5, title: 'ACL Recovery Protocol', injury: 'ACL Tear', targets: ['Knee', 'Quads', 'Hamstrings'], instructor: 'Elena Rodriguez', duration: '30 min', free: true, desc: 'Low-impact strengthening sequence designed for post-ACL rehabilitation on a cushioned surface.' },
      { id: 6, title: 'Hamstring Rehab', injury: 'Hamstring Strain', targets: ['Hamstrings', 'Glutes'], instructor: 'Sarah Chen', duration: '25 min', free: false, desc: 'Progressive hamstring loading from passive stretching to active eccentric strengthening.' },
      { id: 7, title: 'Ankle Stability & Rebuild', injury: 'Ankle Sprain', targets: ['Ankles', 'Calves', 'Foot'], instructor: 'Elena Rodriguez', duration: '20 min', free: false, desc: 'Balance and proprioception drills to restore ankle strength after a sprain.' },
    ],
  },
  {
    id: 'basketball',
    name: 'Basketball',
    emoji: '🏀',
    color: '#FF6B35',
    desc: 'Vertical, agility, and endurance',
    train: [
      { id: 8, title: 'Vertical Jump Program', targets: ['Legs', 'Glutes', 'Calves'], instructor: 'Marcus Johnson', duration: '50 min', free: true, desc: 'Plyometric progressions using the Star Mat to build explosive jumping power and landing mechanics.' },
      { id: 9, title: 'Ankle Conditioning', targets: ['Ankles', 'Calves', 'Feet'], instructor: 'Elena Rodriguez', duration: '30 min', free: false, desc: 'Stability and strength work to bulletproof your ankles for the demands of the hardwood.' },
      { id: 10, title: 'Core Balance & Control', targets: ['Core', 'Hips', 'Lower Back'], instructor: 'Sarah Chen', duration: '35 min', free: false, desc: 'Single-leg balance and core control for body control in traffic and post play.' },
      { id: 11, title: 'Upper Body for Bigs', targets: ['Shoulders', 'Arms', 'Core'], instructor: 'Marcus Johnson', duration: '40 min', free: false, desc: 'Strength and mobility for boxing out, finishing through contact, and post positioning.' },
    ],
    recover: [
      { id: 12, title: 'Knee Tendinitis Relief', injury: 'Patellar Tendinitis', targets: ['Knee', 'Quads', 'IT Band'], instructor: 'Elena Rodriguez', duration: '25 min', free: true, desc: 'Targeted quad eccentric work and foam rolling to relieve jumper\'s knee pain.' },
      { id: 13, title: 'Ankle Sprain Recovery', injury: 'Ankle Sprain', targets: ['Ankles', 'Foot', 'Calves'], instructor: 'Sarah Chen', duration: '20 min', free: false, desc: 'Gentle mobilization and progressive loading to return ankle strength and confidence.' },
      { id: 14, title: 'Wrist & Finger Rehab', injury: 'Jammed Fingers', targets: ['Wrists', 'Hands', 'Forearms'], instructor: 'Elena Rodriguez', duration: '15 min', free: false, desc: 'Range-of-motion and grip exercises to restore finger function after common basketball hand injuries.' },
    ],
  },
  {
    id: 'soccer',
    name: 'Soccer',
    emoji: '⚽',
    color: '#30D158',
    desc: 'Endurance, hips, and footwork',
    train: [
      { id: 15, title: 'Hip Flexor Power', targets: ['Hip Flexors', 'Groin', 'Core'], instructor: 'Marcus Johnson', duration: '35 min', free: true, desc: 'Kicking power and stride mechanics start with the hips. Build the engine that drives every touch.' },
      { id: 16, title: 'Lower Body Endurance', targets: ['Legs', 'Glutes', 'Calves'], instructor: 'Marcus Johnson', duration: '50 min', free: false, desc: 'High-rep leg circuits designed for the aerobic and anaerobic demands of 90-minute matches.' },
      { id: 17, title: 'Rotational Core', targets: ['Core', 'Obliques', 'Hips'], instructor: 'Elena Rodriguez', duration: '30 min', free: false, desc: 'Twisting power for shooting, shielding, and turning defenders using Star Mat pivot points.' },
      { id: 18, title: 'Goalkeeper Explosiveness', targets: ['Legs', 'Shoulders', 'Core'], instructor: 'Marcus Johnson', duration: '40 min', free: false, desc: 'Lateral explosion, dive recovery, and shoulder stability specific to goalkeeping demands.' },
    ],
    recover: [
      { id: 19, title: 'Groin Strain Protocol', injury: 'Groin Strain', targets: ['Groin', 'Hip Flexors', 'Inner Thigh'], instructor: 'Sarah Chen', duration: '25 min', free: true, desc: 'Progressive adductor loading and hip mobility to safely return from a groin pull.' },
      { id: 20, title: 'Shin Splint Relief', injury: 'Shin Splints', targets: ['Shins', 'Calves', 'Foot'], instructor: 'Elena Rodriguez', duration: '20 min', free: false, desc: 'Calf stretching, tibial strengthening, and soft-tissue work to eliminate shin splint pain.' },
      { id: 21, title: 'Hamstring Recovery', injury: 'Hamstring Strain', targets: ['Hamstrings', 'Glutes'], instructor: 'Sarah Chen', duration: '25 min', free: false, desc: 'The most common soccer injury — a structured return-to-play hamstring program.' },
    ],
  },
  {
    id: 'baseball',
    name: 'Baseball / Softball',
    emoji: '⚾',
    color: '#007AFF',
    image: '/images/commercial/baseball-1.png',
    desc: 'Rotation, shoulders, and arms',
    train: [
      { id: 22, title: 'Rotational Power', targets: ['Hips', 'Core', 'Obliques'], instructor: 'Marcus Johnson', duration: '40 min', free: true, desc: 'Hip-to-shoulder rotation mechanics for pitchers and hitters. Power starts at the ground.' },
      { id: 23, title: 'Shoulder Stability', targets: ['Shoulders', 'Rotator Cuff', 'Upper Back'], instructor: 'Elena Rodriguez', duration: '35 min', free: false, desc: 'Pre-season shoulder health program used by pro pitchers to build durability and velocity.' },
      { id: 24, title: 'Forearm & Grip Strength', targets: ['Forearms', 'Wrists', 'Hands'], instructor: 'Marcus Johnson', duration: '25 min', free: false, desc: 'Grip, wrist stability, and forearm endurance for bat speed and throwing velocity.' },
      { id: 25, title: 'Explosive Lower Half', targets: ['Legs', 'Glutes', 'Hip Flexors'], instructor: 'Marcus Johnson', duration: '35 min', free: false, desc: 'Lower-half drive for pitchers — leg power is where velocity is generated.' },
    ],
    recover: [
      { id: 26, title: 'Rotator Cuff Rehab', injury: 'Rotator Cuff Tear', targets: ['Rotator Cuff', 'Shoulders'], instructor: 'Elena Rodriguez', duration: '30 min', free: true, desc: 'The gold-standard shoulder rehab sequence for throwers — external rotation focus.' },
      { id: 27, title: 'Elbow Recovery (UCL)', injury: 'Tommy John / UCL', targets: ['Elbow', 'Forearm', 'Wrist'], instructor: 'Sarah Chen', duration: '25 min', free: false, desc: 'Conservative elbow rehab targeting the medial structures stressed in throwing athletes.' },
      { id: 28, title: 'Lower Back Relief', injury: 'Lower Back Strain', targets: ['Lower Back', 'Core', 'Hips'], instructor: 'Sarah Chen', duration: '20 min', free: false, desc: 'Spinal decompression and lumbar stability work for the rotational stress of batting and pitching.' },
    ],
  },
  {
    id: 'track',
    name: 'Track & Field',
    emoji: '🏃',
    color: '#FFD700',
    desc: 'Explosiveness, stride, and power',
    train: [
      { id: 29, title: 'Sprint Mechanics', targets: ['Legs', 'Glutes', 'Hip Flexors'], instructor: 'Marcus Johnson', duration: '45 min', free: true, desc: 'Star Mat directional drills for stride length, frequency, and drive phase mechanics.' },
      { id: 30, title: 'Explosive Starts', targets: ['Glutes', 'Hamstrings', 'Calves'], instructor: 'Marcus Johnson', duration: '35 min', free: false, desc: 'Block start simulation and first-step power work for sprinters and field event athletes.' },
      { id: 31, title: 'Core Drive', targets: ['Core', 'Obliques', 'Hip Flexors'], instructor: 'Elena Rodriguez', duration: '30 min', free: false, desc: 'Core transfer for arm drive, sprint posture, and throwing rotational force.' },
      { id: 32, title: 'Glute Activation', targets: ['Glutes', 'Hamstrings', 'Hips'], instructor: 'Sarah Chen', duration: '25 min', free: false, desc: 'Pre-workout glute firing sequence to maximize power output and protect the lower back.' },
    ],
    recover: [
      { id: 33, title: 'Hamstring Protocol', injury: 'Hamstring Strain', targets: ['Hamstrings', 'Glutes'], instructor: 'Sarah Chen', duration: '25 min', free: true, desc: 'The Nordic and eccentric hamstring program — the most evidence-backed sprint rehab method.' },
      { id: 34, title: 'Shin Splint Recovery', injury: 'Shin Splints / MTSS', targets: ['Shins', 'Calves', 'Feet'], instructor: 'Elena Rodriguez', duration: '20 min', free: false, desc: 'Load reduction, tissue work, and progressive calf strengthening for medial tibial stress syndrome.' },
      { id: 35, title: 'Stress Fracture Prevention', injury: 'Stress Fractures', targets: ['Feet', 'Shins', 'Hips'], instructor: 'Elena Rodriguez', duration: '20 min', free: false, desc: 'Low-impact strength work targeting the bone stress areas most common in high-volume runners.' },
    ],
  },
  {
    id: 'tennis',
    name: 'Tennis',
    emoji: '🎾',
    color: '#BF5AF2',
    desc: 'Shoulder, agility, and wrist',
    train: [
      { id: 36, title: 'Shoulder Conditioning', targets: ['Shoulders', 'Rotator Cuff', 'Upper Back'], instructor: 'Elena Rodriguez', duration: '35 min', free: true, desc: 'Service arm durability and shoulder health for high-volume hitters and servers.' },
      { id: 37, title: 'Lateral Court Agility', targets: ['Legs', 'Ankles', 'Hips'], instructor: 'Marcus Johnson', duration: '40 min', free: false, desc: 'Split-step and lateral movement patterns on the Star Mat grid for court coverage.' },
      { id: 38, title: 'Wrist & Forearm Strength', targets: ['Wrists', 'Forearms', 'Grip'], instructor: 'Marcus Johnson', duration: '25 min', free: false, desc: 'Racket control starts at the wrist — strength and stability training for groundstroke power.' },
      { id: 39, title: 'Core Rotation for Power', targets: ['Core', 'Obliques', 'Hips'], instructor: 'Elena Rodriguez', duration: '30 min', free: false, desc: 'Topspin and serve power generated from trunk rotation — the kinetic chain for tennis.' },
    ],
    recover: [
      { id: 40, title: 'Tennis Elbow Relief', injury: 'Lateral Epicondylitis', targets: ['Elbow', 'Forearm', 'Wrist'], instructor: 'Sarah Chen', duration: '20 min', free: true, desc: 'Eccentric wrist extension and soft-tissue release for lateral elbow pain.' },
      { id: 41, title: 'Shoulder Impingement Protocol', injury: 'Shoulder Impingement', targets: ['Shoulder', 'Rotator Cuff', 'Upper Back'], instructor: 'Elena Rodriguez', duration: '25 min', free: false, desc: 'Posterior capsule stretching and rotator cuff strengthening to restore pain-free serving.' },
      { id: 42, title: 'Knee Pain Recovery', injury: 'Patellar Tendinitis', targets: ['Knee', 'Quads', 'IT Band'], instructor: 'Sarah Chen', duration: '20 min', free: false, desc: 'Eccentric quad loading and IT band release for knee pain from repetitive court movement.' },
    ],
  },
  {
    id: 'mma',
    name: 'MMA / Combat',
    emoji: '🥊',
    color: '#FF375F',
    image: '/images/commercial/boxing.png',
    desc: 'Full body, power, and endurance',
    train: [
      { id: 43, title: 'Full Body Power Circuit', targets: ['Full Body', 'Core', 'Legs'], instructor: 'Marcus Johnson', duration: '50 min', free: true, desc: 'High-intensity mat circuit combining striking power, wrestling strength, and conditioning.' },
      { id: 44, title: 'Core & Clinch Strength', targets: ['Core', 'Obliques', 'Grip'], instructor: 'Marcus Johnson', duration: '40 min', free: false, desc: 'Cage control, clinch work, and anti-rotation core strength for grappling situations.' },
      { id: 45, title: 'Explosive Hip Drive', targets: ['Hips', 'Glutes', 'Core'], instructor: 'Marcus Johnson', duration: '35 min', free: false, desc: 'Takedown power, striking drive, and guard passing all start at the hips.' },
      { id: 46, title: 'Neck & Cervical Strength', targets: ['Neck', 'Traps', 'Shoulders'], instructor: 'Elena Rodriguez', duration: '20 min', free: false, desc: 'Often neglected — neck strength for striking defense, wrestling, and submission resistance.' },
    ],
    recover: [
      { id: 47, title: 'Shoulder Joint Recovery', injury: 'Shoulder Dislocation / Separation', targets: ['Shoulder', 'Rotator Cuff', 'Biceps'], instructor: 'Elena Rodriguez', duration: '30 min', free: true, desc: 'Progressive shoulder stabilization for the most common upper-body injury in combat sports.' },
      { id: 48, title: 'Knee Stability Rebuild', injury: 'Knee Sprain / MCL', targets: ['Knee', 'Quads', 'Hamstrings'], instructor: 'Elena Rodriguez', duration: '25 min', free: false, desc: 'Medial knee support work for the lateral stress of takedowns and guard work.' },
      { id: 49, title: 'Cervical & Neck Care', injury: 'Neck Strain / Whiplash', targets: ['Neck', 'Cervical Spine', 'Traps'], instructor: 'Sarah Chen', duration: '20 min', free: false, desc: 'Gentle mobility and isometric strengthening for neck strains from clinching and scrambles.' },
    ],
  },
]

const instructorColors = {
  'Marcus Johnson': '#FF375F',
  'Elena Rodriguez': '#BF5AF2',
  'Sarah Chen': '#007AFF',
}

const instructorInitials = {
  'Marcus Johnson': 'MJ',
  'Elena Rodriguez': 'ER',
  'Sarah Chen': 'SC',
}

export default function Lessons() {
  const [selectedSport, setSelectedSport] = useState(sports[0])
  const [tab, setTab] = useState('train')
  const [playing, setPlaying] = useState(null)
  const [selectedTarget, setSelectedTarget] = useState(null)

  const allClasses = tab === 'train' ? selectedSport.train : selectedSport.recover
  const classes = selectedTarget
    ? tab === 'train'
      ? allClasses.filter(c => c.targets.includes(selectedTarget))
      : allClasses.filter(c => c.injury === selectedTarget)
    : allClasses

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <section className="section-padding py-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50vw] h-[25vw] rounded-full opacity-10 blur-[80px]" style={{ backgroundColor: selectedSport.color }} />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 max-w-3xl">
          <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-3">Sport-Specific Training</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Dominate <span className="text-gradient-blue">Your Sport.</span>
          </h1>
          <p className="text-star-grey text-lg leading-relaxed mb-3">
            There is no other training program out there to prepare you to dominate in your sport. Select your sport below and get targeted training for the body parts that matter most — plus recovery built around your most common injuries.
          </p>
          <p className="text-white font-semibold">
            Train in all planes of motion. Become a king in your sport.
          </p>
        </motion.div>
      </section>

      {/* Sport Selector */}
      <div className="section-padding mb-8">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {sports.map((sport) => (
            <motion.button
              key={sport.id}
              onClick={() => { setSelectedSport(sport); setTab('train'); setPlaying(null); setSelectedTarget(null) }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`flex-shrink-0 flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border transition-all duration-300 min-w-[90px] ${
                selectedSport.id === sport.id
                  ? 'border-opacity-100 text-white'
                  : 'border-star-border text-star-grey hover:text-white hover:border-white/20 bg-star-card/40'
              }`}
              style={selectedSport.id === sport.id ? {
                backgroundColor: `${sport.color}15`,
                borderColor: sport.color,
                boxShadow: `0 0 20px ${sport.color}30`,
              } : {}}
            >
              <span className="text-2xl">{sport.emoji}</span>
              <span className="text-xs font-semibold text-center leading-tight">{sport.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sport Header + Tabs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSport.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="section-padding mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${selectedSport.color}15`, border: `1px solid ${selectedSport.color}40` }}>
                {selectedSport.emoji}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{selectedSport.name}</h2>
                <p className="text-star-grey text-sm">{selectedSport.desc}</p>
              </div>
            </div>

            {/* Train / Recover tabs */}
            <div className="flex gap-2 glass rounded-xl p-1 border border-star-border w-fit">
              <button
                onClick={() => { setTab('train'); setSelectedTarget(null) }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  tab === 'train' ? 'text-white' : 'text-star-grey hover:text-white'
                }`}
                style={tab === 'train' ? { backgroundColor: selectedSport.color } : {}}
              >
                <Activity size={15} /> Train
              </button>
              <button
                onClick={() => { setTab('recover'); setSelectedTarget(null) }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  tab === 'recover' ? 'text-white' : 'text-star-grey hover:text-white'
                }`}
                style={tab === 'recover' ? { backgroundColor: '#30D158' } : {}}
              >
                <Heart size={15} /> Recover
              </button>
            </div>
          </div>

          {/* Body part targets */}
          {tab === 'train' && (
            <div className="mt-5">
              <p className="text-star-grey text-xs uppercase tracking-widest mb-2">
                Key Areas for {selectedSport.name} — <span style={{ color: selectedSport.color }}>tap a body part to filter</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {/* All pill */}
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTarget(null)}
                  className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                  style={!selectedTarget ? {
                    backgroundColor: selectedSport.color,
                    borderColor: selectedSport.color,
                    color: '#000',
                  } : {
                    backgroundColor: 'transparent',
                    borderColor: `${selectedSport.color}40`,
                    color: selectedSport.color,
                  }}
                >
                  All
                </motion.button>
                {[...new Set(selectedSport.train.flatMap(c => c.targets))].map((target) => (
                  <motion.button
                    key={target}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTarget(selectedTarget === target ? null : target)}
                    className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                    style={selectedTarget === target ? {
                      backgroundColor: selectedSport.color,
                      borderColor: selectedSport.color,
                      color: '#000',
                    } : {
                      backgroundColor: `${selectedSport.color}15`,
                      borderColor: `${selectedSport.color}40`,
                      color: selectedSport.color,
                    }}
                  >
                    {target}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {tab === 'recover' && (
            <div className="mt-5">
              <p className="text-star-grey text-xs uppercase tracking-widest mb-2">
                Common {selectedSport.name} Injuries — <span className="text-green-400">tap an injury to filter</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {/* All pill */}
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTarget(null)}
                  className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                  style={!selectedTarget ? {
                    backgroundColor: '#30D158',
                    borderColor: '#30D158',
                    color: '#000',
                  } : {
                    backgroundColor: 'rgba(48,209,88,0.1)',
                    borderColor: 'rgba(48,209,88,0.3)',
                    color: '#30D158',
                  }}
                >
                  All
                </motion.button>
                {selectedSport.recover.map(c => (
                  <motion.button
                    key={c.injury}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTarget(selectedTarget === c.injury ? null : c.injury)}
                    className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                    style={selectedTarget === c.injury ? {
                      backgroundColor: '#30D158',
                      borderColor: '#30D158',
                      color: '#000',
                    } : {
                      backgroundColor: 'rgba(48,209,88,0.1)',
                      borderColor: 'rgba(48,209,88,0.3)',
                      color: '#30D158',
                    }}
                  >
                    {c.injury}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Class Cards */}
      <div className="section-padding">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedSport.id}-${tab}-${selectedTarget}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto"
          >
            {classes.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card-hover"
              >
                <div className="rounded-2xl border border-star-border bg-star-card overflow-hidden h-full flex flex-col">
                  {/* Thumbnail */}
                  <div
                    className="relative h-40 flex items-center justify-center overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${tab === 'recover' ? '#0d2b1a' : `${selectedSport.color}15`}, #111)` }}
                  >
                    {selectedSport.image && tab === 'train' && (
                      <img src={selectedSport.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                    )}
                    <motion.button
                      onClick={() => setPlaying(playing === cls.id ? null : cls.id)}
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: tab === 'recover' ? '#30D15825' : `${selectedSport.color}25`,
                        border: `2px solid ${tab === 'recover' ? '#30D15860' : `${selectedSport.color}60`}`,
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {playing === cls.id ? (
                        <div className="flex gap-1">
                          <div className="w-1 h-4 rounded-full bg-white" />
                          <div className="w-1 h-4 rounded-full bg-white" />
                        </div>
                      ) : (
                        <Play size={18} fill="white" className="text-white ml-0.5" />
                      )}
                    </motion.button>

                    {/* Free badge */}
                    {cls.free && (
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-green-500 rounded-full text-xs font-bold text-black">FREE</div>
                    )}
                    {!cls.free && (
                      <div className="absolute top-3 left-3 w-7 h-7 rounded-full glass border border-white/10 flex items-center justify-center">
                        <Lock size={11} className="text-star-grey" />
                      </div>
                    )}

                    {/* Recovery injury tag */}
                    {tab === 'recover' && cls.injury && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/30">
                        {cls.injury}
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/70 text-xs">
                      <Clock size={11} /> {cls.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-white font-bold text-base mb-2 leading-tight">{cls.title}</h3>
                    <p className="text-star-grey text-sm leading-relaxed mb-3 flex-1">{cls.desc}</p>

                    {/* Target tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {cls.targets.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: tab === 'recover' ? '#30D15815' : `${selectedSport.color}15`,
                            color: tab === 'recover' ? '#30D158' : selectedSport.color,
                            border: `1px solid ${tab === 'recover' ? '#30D15830' : `${selectedSport.color}30`}`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-2.5 pt-3 border-t border-white/8">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                        style={{ backgroundColor: instructorColors[cls.instructor] }}
                      >
                        {instructorInitials[cls.instructor]}
                      </div>
                      <p className="text-star-grey text-xs">{cls.instructor}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── AI COACH PANEL ── */}
      <section className="section-padding py-16 border-t border-star-border bg-gradient-to-b from-star-card/10 to-star-black relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[40vw] h-[20vw] rounded-full opacity-10 blur-[80px]" style={{ backgroundColor: selectedSport.color }} />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: selectedSport.color }}>
                {selectedSport.name} AI Coach
              </p>
              <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
                Not sure where to start?
                <span className="text-gradient-blue block">Ask the AI Coach.</span>
              </h2>
              <p className="text-star-grey text-base leading-relaxed mb-5">
                Tell us your position, a specific goal, or a body part you want to strengthen — and we'll generate a custom Star Mat workout in seconds. Built around your sport, your body, your next move.
              </p>
              <ul className="space-y-2 text-sm text-star-grey">
                {[
                  `Custom ${selectedSport.name} drills on the mat`,
                  'Injury-safe modifications',
                  'Sets, reps, and compass directions',
                  'Recovery workouts included',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: selectedSport.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <AIWorkoutChat inline />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating AI Chat widget */}
      <AIWorkoutChat />
    </main>
  )
}

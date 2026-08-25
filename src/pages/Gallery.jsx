import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Image, Video, Expand, Volume2, VolumeX, Share2, Check, Link as LinkIcon } from 'lucide-react'
import CompassStar from '../components/CompassStar'

const filters = ['All', 'Videos', 'Photos', 'Training', 'Lifestyle', 'Product']

const galleryItems = [
  // Real videos
  { id: 0, type: 'video', title: 'The Star Mat', duration: '0:47', category: 'Training', thumb: 'from-blue-900/70 to-star-black', accent: '#007AFF', featured: true, src: '/videos/star-mat-fv1.mp4', poster: '/images/thumbs/star-mat-fv1.jpg' },
  { id: 1, type: 'video', title: 'Star Mat, Side Lunge Drill', duration: '0:15', category: 'Training', thumb: 'from-yellow-900/70 to-star-black', accent: '#FFD700', src: '/videos/star-mat-side-lunge.mov', poster: '/images/thumbs/star-mat-side-lunge.mov.png' },
  { id: 2, type: 'video', title: 'Split Lunge Matrix', duration: '0:20', category: 'Training', thumb: 'from-blue-900/70 to-star-black', accent: '#007AFF', src: '/videos/star-mat-split-lunge.mov', poster: '/images/thumbs/star-mat-split-lunge.mov.png' },
  { id: 3, type: 'video', title: 'Apex Foot Fire Plus', duration: '0:18', category: 'Training', thumb: 'from-orange-900/70 to-star-black', accent: '#FF9F0A', src: '/videos/star-mat-apex-foot-fire.mov', poster: '/images/thumbs/star-mat-apex-foot-fire.mov.png' },
  { id: 4, type: 'video', title: 'Alternating Lunge Upright Row', duration: '0:22', category: 'Training', thumb: 'from-green-900/70 to-star-black', accent: '#30D158', src: '/videos/star-mat-alternating-lunge-row.mov', poster: '/images/thumbs/star-mat-alternating-lunge-row.mov.png' },
  { id: 5, type: 'video', title: 'Fast Feet Apex', duration: '0:15', category: 'Training', thumb: 'from-red-900/70 to-star-black', accent: '#FF375F', src: '/videos/star-mat-fast-feet.mov', poster: '/images/thumbs/star-mat-fast-feet.mov.png' },
  { id: 6, type: 'video', title: 'Speed Lateral Skaters', duration: '0:20', category: 'Training', thumb: 'from-cyan-900/70 to-star-black', accent: '#64D2FF', src: '/videos/star-mat-lateral-skaters.mov', poster: '/images/thumbs/star-mat-lateral-skaters.mov.png' },
  { id: 7, type: 'video', title: 'Star Mat Training Drill', duration: '0:22', category: 'Training', thumb: 'from-purple-900/70 to-star-black', accent: '#BF5AF2', src: '/videos/star-mat-drill.mov', poster: '/images/thumbs/star-mat-drill.mov.png' },
  { id: 8, type: 'video', title: 'Star Mat Full Session', duration: '0:25', category: 'Training', thumb: 'from-teal-900/70 to-star-black', accent: '#32D4B9', src: '/videos/star-mat-training-drill.mov', poster: '/images/thumbs/star-mat-training-drill.mov.png' },
  // Commercial shots, action first
  { id: 16, type: 'photo', title: 'Athlete Holds the Star Mat',          category: 'Product',   image: '/images/commercial/hold-mat.jpeg',            thumb: 'from-slate-800/60 to-star-black',  accent: '#FFD700' },
  { id: 17, type: 'photo', title: 'Rolling Up, Built to Go',            category: 'Product',   image: '/images/commercial/rolling-mat.jpeg',         thumb: 'from-slate-800/60 to-star-black',  accent: '#8E8E93' },
  { id: 18, type: 'photo', title: 'Unrolling in the Gym',                category: 'Training',  image: '/images/commercial/unrolling-mat.jpeg',       thumb: 'from-blue-900/60 to-star-black',   accent: '#007AFF' },
  { id: 19, type: 'photo', title: 'Train at Home, Every Day',           category: 'Lifestyle', image: '/images/commercial/home-lifestyle.jpeg',      thumb: 'from-amber-900/40 to-star-black',  accent: '#FF9F0A' },
  { id: 20, type: 'photo', title: 'Woman Athlete, Lateral Speed',       category: 'Training',  image: '/images/commercial/woman-athlete.png',        thumb: 'from-pink-900/50 to-star-black',   accent: '#FF375F' },
  { id: 21, type: 'photo', title: 'MMA, Stance & Control',              category: 'Training',  image: '/images/commercial/mma-fighter.png',          thumb: 'from-yellow-900/50 to-star-black', accent: '#FFD700' },
  { id: 22, type: 'photo', title: 'Boxing, Power on the Mat',           category: 'Training',  image: '/images/commercial/boxing.png',               thumb: 'from-red-900/60 to-star-black',    accent: '#FF375F' },
  { id: 23, type: 'photo', title: 'Baseball, Explosive Footwork',       category: 'Training',  image: '/images/commercial/baseball-1.png',           thumb: 'from-blue-900/50 to-star-black',   accent: '#007AFF' },
  { id: 24, type: 'photo', title: 'Baseball, Rotational Drive',         category: 'Training',  image: '/images/commercial/baseball-2.png',           thumb: 'from-blue-900/50 to-star-black',   accent: '#64D2FF' },
  { id: 25, type: 'photo', title: 'Veteran Athlete, Still Dominating',  category: 'Lifestyle', image: '/images/commercial/veteran-athlete.png',      thumb: 'from-green-900/40 to-star-black',  accent: '#30D158' },
  // Product / spec shots at the bottom
  { id: 9,  type: 'photo', title: 'Star Mat Pro, In the Gym',           category: 'Product',   image: '/images/mat-product.jpeg',                    thumb: 'from-blue-900/60 to-star-black',   accent: '#007AFF' },
  { id: 10, type: 'photo', title: 'Star Mat, Clean Design',             category: 'Product',   image: '/images/mat-clean.jpeg',                      thumb: 'from-slate-700/60 to-star-black',  accent: '#8E8E93' },
  { id: 14, type: 'photo', title: 'Star Mat, All Angles & Specs',       category: 'Product',   image: '/images/mat-onesheet-specs.png',               thumb: 'from-slate-700/60 to-star-black',  accent: '#FFD700' },
  { id: 15, type: 'photo', title: 'Star Mat, Size & Scale Reference',   category: 'Product',   image: '/images/mat-onesheet-scale.png',               thumb: 'from-blue-900/60 to-star-black',   accent: '#007AFF' },
]

export default function Gallery() {
  const [filter, setFilter] = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const featuredVideoRef = useRef(null)
  const [shared, setShared] = useState(false)

  // Copy text without the async Clipboard API, which browsers block in
  // insecure contexts and some in-app browsers. Works everywhere.
  function legacyCopy(text) {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.cssText = 'position:absolute;left:-9999px;top:0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch { return false }
  }

  // Share the featured video. Uses the native share sheet on phones
  // (Instagram, Messages, etc.) and falls back to copying the link.
  async function shareVideo(item) {
    const url = `${window.location.origin}/gallery`
    const data = {
      title: `${item.title} | Star Fitness`,
      text: 'Watch the Star Mat in action, train in all planes of motion.',
      url,
    }
    // Native share sheet (phones)
    if (navigator.share) {
      try { await navigator.share(data); return } catch (e) {
        // User cancelled, do nothing further
        if (e && e.name === 'AbortError') return
      }
    }
    // Clipboard API, then legacy fallback. Always give feedback.
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url)
      else legacyCopy(url)
    } catch { legacyCopy(url) }
    setShared(true); setTimeout(() => setShared(false), 2200)
  }

  const filtered = filter === 'All' ? galleryItems
    : filter === 'Videos' ? galleryItems.filter(i => i.type === 'video')
    : filter === 'Photos' ? galleryItems.filter(i => i.type === 'photo')
    : galleryItems.filter(i => i.category === filter)

  const featured = galleryItems.find(i => i.featured)

  useEffect(() => {
    if (featuredVideoRef.current) {
      featuredVideoRef.current.muted = true
      featuredVideoRef.current.play().catch(() => {})
    }
  }, [])

  function toggleMute() {
    if (featuredVideoRef.current) {
      featuredVideoRef.current.muted = !featuredVideoRef.current.muted
      setIsMuted(featuredVideoRef.current.muted)
    }
  }

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <section className="section-padding py-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 right-1/4 w-[50vw] h-[25vw] rounded-full bg-star-blue/6 blur-[80px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 max-w-3xl">
          <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-3">Media</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Gallery & <span className="text-gradient-blue">Videos</span>
          </h1>
          <p className="text-star-grey text-lg">Behind-the-scenes, full class recordings, product films, and community moments.</p>
        </motion.div>
      </section>

      {/* Featured Video */}
      {featured && (
        <div className="section-padding mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            <p className="text-star-grey text-sm font-semibold tracking-widest uppercase mb-4">Featured</p>
            <div className="relative rounded-3xl overflow-hidden border border-star-border" style={{ aspectRatio: '16/7' }}>
              {featured.type === 'video' ? (
                <>
                  <video
                    ref={featuredVideoRef}
                    src={featured.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                    <p className="text-white font-black text-xl md:text-2xl">{featured.title}</p>
                    <p className="text-star-grey text-sm">{featured.duration} · {featured.category}</p>
                  </div>
                  {/* Mute toggle */}
                  <button
                    onClick={toggleMute}
                    className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
                  >
                    {isMuted ? <VolumeX size={16} className="text-white" /> : <Volume2 size={16} className="text-white" />}
                  </button>
                  {/* Share */}
                  <button
                    onClick={() => shareVideo(featured)}
                    title="Share this video"
                    className="absolute bottom-5 right-[4.25rem] h-10 w-10 sm:w-auto sm:px-3.5 rounded-full bg-star-yellow text-black font-bold text-sm flex items-center justify-center sm:gap-1.5 hover:brightness-110 transition-all"
                  >
                    {shared ? <Check size={15} strokeWidth={3} /> : <Share2 size={15} />}
                    <span className="hidden sm:inline">{shared ? 'Link copied' : 'Share'}</span>
                  </button>
                  {/* Full screen / lightbox button */}
                  <button
                    onClick={() => setLightbox(featured)}
                    className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
                  >
                    <Play size={14} className="text-white ml-0.5" fill="white" />
                  </button>
                </>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.005 }}
                  onClick={() => setLightbox(featured)}
                  className={`relative w-full h-full bg-gradient-to-br ${featured.thumb} cursor-pointer group`}
                >
                  {featured.poster && (
                    <img src={featured.poster} alt={featured.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <motion.div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: `${featured.accent}30`, border: `2px solid ${featured.accent}60` }} whileHover={{ scale: 1.15 }}>
                      <Play size={30} fill="white" className="text-white ml-1" />
                    </motion.div>
                    <div className="text-center">
                      <p className="text-white font-black text-2xl md:text-3xl mb-2">{featured.title}</p>
                      <p className="text-star-grey">{featured.duration} · {featured.category}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="section-padding mb-8">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f ? 'bg-star-blue text-white' : 'glass text-star-grey hover:text-white border border-star-border'
              }`}
            >
              {f === 'Videos' && <Video size={14} />}
              {f === 'Photos' && <Image size={14} />}
              {f}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  onClick={() => setLightbox(item)}
                  className="group cursor-pointer"
                >
                  <div className={`relative rounded-2xl overflow-hidden border border-star-border aspect-[4/3] flex items-center justify-center ${item.image || item.poster ? '' : `bg-gradient-to-br ${item.thumb}`}`}>
                    {/* Real photo */}
                    {item.image && (
                      <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {/* Real video thumbnail */}
                    {item.poster && (
                      <img src={item.poster} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

                    {/* Play / expand icon, shown on hover */}
                    <div className="relative z-10 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${item.accent}40`, border: `2px solid ${item.accent}80` }}
                      >
                        {item.type === 'video'
                          ? <Play size={18} fill="white" className="text-white ml-0.5" />
                          : <Expand size={16} className="text-white" />
                        }
                      </motion.div>
                    </div>

                    {/* Compass star bg for video placeholders */}
                    {!item.image && !item.poster && (
                      <CompassStar size={40} color={item.accent} className="absolute opacity-10" />
                    )}

                    {/* Type badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs font-semibold text-white">
                      {item.type === 'video' ? <Video size={11} /> : <Image size={11} />}
                      {item.category}
                    </div>

                    {/* Duration for video */}
                    {item.type === 'video' && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 text-white text-xs font-semibold">
                        {item.duration}
                      </div>
                    )}
                  </div>
                  <p className="text-white text-sm font-semibold mt-2 px-1">{item.title}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-3xl rounded-3xl overflow-hidden border border-star-border ${lightbox.image ? 'bg-star-black' : `bg-gradient-to-br ${lightbox.thumb}`}`}
              style={{ aspectRatio: lightbox.src || lightbox.image ? 'auto' : '16/9' }}
            >
              {lightbox.src ? (
                <video src={lightbox.src} controls autoPlay className="w-full max-h-[80vh] rounded-3xl" />
              ) : lightbox.image ? (
                <img src={lightbox.image} alt={lightbox.title} className="w-full h-full object-contain max-h-[80vh]" />
              ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: `${lightbox.accent}30`, border: `2px solid ${lightbox.accent}60` }}>
                  {lightbox.type === 'video' ? <Play size={30} fill="white" className="text-white ml-1" /> : <Image size={28} className="text-white" />}
                </div>
                <div className="text-center px-8">
                  <p className="text-white font-black text-2xl mb-1">{lightbox.title}</p>
                  <p className="text-star-grey">{lightbox.type === 'video' ? lightbox.duration + ' · ' : ''}{lightbox.category}</p>
                </div>
              </div>
              )}
              <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

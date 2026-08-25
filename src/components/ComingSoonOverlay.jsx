import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

// Full-screen frosted overlay that sits BELOW the navbar (z-40 < navbar z-50),
// so visitors can still navigate away but the page content stays blurred/locked.
export default function ComingSoonOverlay({ title = 'Coming Soon', message }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-lg bg-star-black/70 px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-14 h-14 rounded-2xl bg-star-yellow/10 border border-star-yellow/30 flex items-center justify-center mx-auto mb-5">
          <Lock size={22} className="text-star-yellow" />
        </div>
        <p className="text-star-yellow text-xs font-bold tracking-widest uppercase mb-3">Launching Soon</p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3">{title}</h2>
        {message && <p className="text-star-grey leading-relaxed">{message}</p>}
      </motion.div>
    </div>
  )
}

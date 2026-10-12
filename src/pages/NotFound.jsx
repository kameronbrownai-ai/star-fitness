import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, ArrowRight } from 'lucide-react'

// Without this route, an unknown URL matched nothing: the visitor got a bare
// footer on an empty page, and crawlers got a 200 with a byte-identical copy of
// the homepage. Seo.jsx marks unknown routes noindex so they stay out of search.
const PLACES = [
  { to: '/shop', label: 'Shop the Star Mat' },
  { to: '/lessons', label: 'Training by sport' },
  { to: '/pricing', label: 'Membership plans' },
  { to: '/faq', label: 'Questions' },
]

export default function NotFound() {
  return (
    <main className="pt-32 pb-24 min-h-screen section-padding">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center"
      >
        <Compass size={38} className="text-star-yellow mx-auto mb-5" />
        <p className="text-star-grey text-xs font-semibold tracking-widest uppercase mb-3">404</p>
        <h1 className="text-4xl font-black text-white mb-4">This page moved, or never existed.</h1>
        <p className="text-star-grey mb-10">
          Check the address, or pick up from one of these.
        </p>

        <div className="space-y-3 text-left">
          {PLACES.map(p => (
            <Link
              key={p.to}
              to={p.to}
              className="flex items-center justify-between rounded-2xl border border-star-border bg-star-card px-5 py-4 text-white font-semibold hover:border-star-yellow/50 transition-colors group"
            >
              {p.label}
              <ArrowRight size={16} className="text-star-grey group-hover:text-star-yellow transition-colors" />
            </Link>
          ))}
        </div>
      </motion.div>
    </main>
  )
}

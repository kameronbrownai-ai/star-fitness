import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

const navLinks = [
  { label: 'Shop', to: '/shop' },
  { label: 'Lessons', to: '/lessons' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Booking', to: '/booking' },
  { label: 'Partners', to: '/partners' },
  { label: 'Community', to: '/community' },
  { label: 'About', to: '/about' },
]

const StarLogo = () => (
  <svg width="30" height="30" viewBox="0 0 50 50" fill="none">
    <polygon points="25,3 31,18 47,18 35,29 39,45 25,37 11,45 15,29 3,18 19,18" fill="#FFD700" />
  </svg>
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { count, setOpen: openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass border-b border-white/8 py-3' : 'bg-transparent py-4'
        }`}
      >
        <div className="section-padding flex items-center justify-between gap-4">

          {/* LEFT — Hamburger */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 flex flex-col items-center justify-center gap-[5px] flex-shrink-0"
            aria-label="Open menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block w-6 h-[2px] bg-white rounded-full origin-center"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className="block w-6 h-[2px] bg-white rounded-full"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block w-6 h-[2px] bg-white rounded-full origin-center"
            />
          </motion.button>

          {/* CENTER — Logo */}
          <Link to="/" className="flex items-center gap-2.5 group absolute left-1/2 -translate-x-1/2">
            <motion.div whileHover={{ rotate: 72 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
              <StarLogo />
            </motion.div>
            <span className="text-lg font-black tracking-tight text-white whitespace-nowrap">
              STAR <span className="text-star-yellow">FITNESS</span>
            </span>
          </Link>

          {/* RIGHT — Cart */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => openCart(true)}
            className="relative flex-shrink-0"
            aria-label="Open cart"
          >
            <ShoppingBag size={22} className="text-white" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-star-blue rounded-full text-[9px] font-black text-white flex items-center justify-center"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

        </div>
      </motion.nav>

      {/* Slide-out nav menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 left-0 h-full w-72 bg-star-dark border-r border-star-border z-50 flex flex-col"
            >
              {/* Menu header */}
              <div className="flex items-center justify-between p-5 border-b border-star-border">
                <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                  <StarLogo />
                  <span className="font-black text-white text-sm tracking-tight">STAR <span className="text-star-yellow">FITNESS</span></span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="text-star-grey hover:text-white transition-colors p-1">
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto p-5 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                        location.pathname === link.to
                          ? 'bg-star-blue/10 text-star-yellow border border-star-blue/20'
                          : 'text-star-grey hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Menu footer CTA */}
              <div className="p-5 border-t border-star-border">
                <Link
                  to="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full justify-center text-sm py-3"
                >
                  Shop the Star Mat
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

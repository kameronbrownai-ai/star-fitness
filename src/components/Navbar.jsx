import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag, UserCircle, LogOut } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Lessons', to: '/lessons' },
  { label: 'Membership', to: '/pricing' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Booking', to: '/booking' },
  { label: 'Partners', to: '/partners' },
  { label: 'Community', to: '/community' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { count, setOpen: openCart } = useCart()
  const { user, signOut, openAuth } = useAuth()

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

          {/* LEFT, Hamburger */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 flex flex-col items-center justify-center gap-[5px] flex-shrink-0"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
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

          {/* CENTER, Logo */}
          <Link to="/" className="flex items-center gap-2.5 group absolute left-1/2 -translate-x-1/2">
            <motion.div whileHover={{ rotate: 72 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
              <img src="/images/logo.png" alt="Star Fitness logo" className="w-8 h-8 object-contain" />
            </motion.div>
            <span className="text-lg font-black tracking-tight text-white whitespace-nowrap">
              STAR <span className="text-star-yellow">FITNESS</span><span className="text-white/40 text-[0.6em] align-top">™</span>
            </span>
          </Link>

          {/* RIGHT, Account + Cart */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {user ? (
              <Link to="/account" aria-label="Account" title={user.email} className="flex-shrink-0 tap-target">
                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                  <UserCircle size={22} className="text-star-yellow" />
                </motion.div>
              </Link>
            ) : (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => openAuth({ mode: 'login' })}
                className="flex-shrink-0 tap-target"
                aria-label="Log in"
                title="Log in"
              >
                <UserCircle size={22} className="text-white" />
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => openCart(true)}
              className="relative flex-shrink-0 tap-target"
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
                  <img src="/images/logo.png" alt="Star Fitness logo" className="w-8 h-8 object-contain" />
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

              {/* Menu footer, account + CTA */}
              <div className="p-5 border-t border-star-border space-y-3">
                {user ? (
                  <>
                    <Link
                      to="/account"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-star-yellow/10 border border-star-yellow/25 hover:bg-star-yellow/15 transition-colors"
                    >
                      <UserCircle size={18} className="text-star-yellow flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-semibold truncate">My Account</p>
                        <p className="text-star-grey text-xs truncate">Plan &amp; redeem a code</p>
                      </div>
                    </Link>
                    <div className="flex items-center justify-between gap-2 px-1">
                      <p className="text-star-grey text-xs truncate">{user.email}</p>
                      <button
                        onClick={() => { signOut(); setMobileOpen(false) }}
                        className="flex items-center gap-1.5 text-star-grey hover:text-white text-sm transition-colors flex-shrink-0"
                      >
                        <LogOut size={15} /> Log out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { openAuth({ mode: 'login' }); setMobileOpen(false) }}
                      className="py-2.5 rounded-xl border border-star-border text-white text-sm font-semibold hover:bg-white/5 transition-colors"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => { openAuth({ mode: 'signup' }); setMobileOpen(false) }}
                      className="py-2.5 rounded-xl bg-star-blue text-white text-sm font-bold hover:bg-blue-500 transition-colors"
                    >
                      Sign up
                    </button>
                  </div>
                )}
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

import { useEffect, useLayoutEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartSidebar from './components/CartSidebar'
import AuthModal from './components/AuthModal'
import ConsentGateModal from './components/ConsentGateModal'
import Seo from './components/Seo'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Lessons from './pages/Lessons'
import Gallery from './pages/Gallery'
import Booking from './pages/Booking'
import Partners from './pages/Partners'
import Community from './pages/Community'
import About from './pages/About'
import FAQ from './pages/FAQ'
import Legal from './pages/Legal'
import Pricing from './pages/Pricing'
import Account from './pages/Account'
import Licenses from './pages/Licenses'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

function ScrollToTop() {
  const { pathname } = useLocation()

  // Browsers default to history.scrollRestoration = 'auto', which restores the
  // previous scroll position on back/forward AFTER our effect runs, silently
  // undoing scrollTo(0,0). Turning it off is what makes this stick.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // useLayoutEffect runs before paint, so the new page never flashes mid-scroll.
  useLayoutEffect(() => {
    // The site sets `scroll-behavior: smooth` globally (nice for anchor links,
    // wrong here), so force an instant jump or the animated scroll lets the
    // browser's restore win the race.
    const jump = () => {
      try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) }
      catch { window.scrollTo(0, 0) }
    }
    jump()
    // Safety net: the page-transition animation restores page height a frame
    // later, so re-assert the top position on the next two frames.
    let r2
    const r1 = requestAnimationFrame(() => {
      jump()
      r2 = requestAnimationFrame(jump)
    })
    return () => { cancelAnimationFrame(r1); if (r2) cancelAnimationFrame(r2) }
  }, [pathname])

  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/account" element={<Account />} />
          <Route path="/licenses" element={<Licenses />} />
          <Route path="/privacy" element={<Legal doc="privacy" />} />
          <Route path="/terms" element={<Legal doc="terms" />} />
          <Route path="/returns" element={<Legal doc="returns" />} />
          <Route path="/cookies" element={<Legal doc="cookies" />} />
        </Routes>
        <Footer />
      </motion.div>
    </AnimatePresence>
  )
}

function GlobalAuthModal() {
  const { authModal, closeAuth } = useAuth()
  return <AuthModal open={authModal.open} mode={authModal.mode} reason={authModal.reason} initialMode={authModal.mode} onClose={closeAuth} />
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-star-black text-star-white font-sans">
            <ScrollToTop />
            <Seo />
            <Navbar />
            <CartSidebar />
            <AnimatedRoutes />
            <GlobalAuthModal />
            <ConsentGateModal />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

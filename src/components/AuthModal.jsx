import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Mail, Lock, User, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ open, onClose, initialMode = 'signup', reason }) {
  const { signUp, signIn, trialDaysOffer } = useAuth()
  const [mode, setMode] = useState(initialMode)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [checkEmail, setCheckEmail] = useState(false)

  const reset = () => { setError(null); setLoading(false); setCheckEmail(false) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      if (mode === 'signup') {
        const { data, error } = await signUp(email, password, fullName)
        if (error) throw error
        // If email confirmation is on, there's no active session yet
        if (!data.session) { setCheckEmail(true); setLoading(false); return }
        onClose()
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        onClose()
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
          />
          {/* Flex-centered wrapper: framer-motion's transform would override
              Tailwind's -translate centering, so positioning lives here. */}
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md max-h-[88svh] overflow-y-auto pointer-events-auto"
          >
            <div className="rounded-2xl sm:rounded-3xl border border-star-border bg-star-card p-5 sm:p-7 shadow-2xl">
              <div className="flex items-center justify-between gap-3 mb-1">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {mode === 'signup' ? 'Create your account' : 'Welcome back'}
                </h2>
                <button onClick={onClose} className="text-star-grey hover:text-white transition-colors flex-shrink-0">
                  <X size={20} />
                </button>
              </div>
              <p className="text-star-grey text-xs sm:text-sm mb-5 sm:mb-6">
                {reason || (mode === 'signup'
                  ? `Start your ${trialDaysOffer}-day free trial, full access, no card required.`
                  : 'Log in to continue your training.')}
              </p>

              {checkEmail ? (
                <div className="text-center py-4 sm:py-6">
                  <div className="w-14 h-14 rounded-2xl bg-star-green/10 border border-star-green/30 flex items-center justify-center mx-auto mb-4">
                    <Check size={24} className="text-star-green" />
                  </div>
                  <p className="text-white font-bold mb-2">Check your email</p>
                  <p className="text-star-grey text-sm">
                    We sent a confirmation link to <span className="text-white">{email}</span>. Click it to activate your account, then log in.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  {mode === 'signup' && (
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-star-grey" />
                      <input
                        type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                        placeholder="Full name"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-star-black border border-star-border text-white placeholder:text-star-grey/60 text-sm focus:outline-none focus:border-star-blue/50"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-star-grey" />
                    <input
                      type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-star-black border border-star-border text-white placeholder:text-star-grey/60 text-sm focus:outline-none focus:border-star-blue/50"
                    />
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-star-grey" />
                    <input
                      type="password" required value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Password (8+ characters)" minLength={8}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-star-black border border-star-border text-white placeholder:text-star-grey/60 text-sm focus:outline-none focus:border-star-blue/50"
                    />
                  </div>

                  {error && <p className="text-red-400 text-xs px-1">{error}</p>}

                  <button
                    type="submit" disabled={loading}
                    className="w-full btn-primary justify-center py-3 sm:py-3.5 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : mode === 'signup' ? 'Start Free Trial' : 'Log In'}
                  </button>
                </form>
              )}

              {!checkEmail && (
                <p className="text-center text-star-grey text-xs sm:text-sm mt-4">
                  {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); reset() }}
                    className="text-star-blue font-semibold hover:underline"
                  >
                    {mode === 'signup' ? 'Log in' : 'Sign up'}
                  </button>
                </p>
              )}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

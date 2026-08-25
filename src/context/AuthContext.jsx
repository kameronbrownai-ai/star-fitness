import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // Subscription / entitlement from the backend
  const [entitlement, setEntitlement] = useState(null)
  const [subscription, setSubscription] = useState(null)

  // Trial length currently on offer (30 days for the first 5,000 subscribers,
  // 14 after, see /config and handle_new_subscriber in server/schema.sql).
  // Fetched once so every page shows the same, live number instead of a
  // hardcoded string that goes stale the moment the threshold is crossed.
  const [trialDaysOffer, setTrialDaysOffer] = useState(14)
  useEffect(() => {
    fetch('/api/config').then((r) => r.json()).then((d) => {
      if (d.currentTrialDays) setTrialDaysOffer(d.currentTrialDays)
    }).catch(() => {})
  }, [])

  // Global auth-modal control so any component can prompt sign-in
  const [authModal, setAuthModal] = useState({ open: false, mode: 'signup', reason: null })
  const openAuth = (opts = {}) => setAuthModal({ open: true, mode: opts.mode || 'signup', reason: opts.reason || null })
  const closeAuth = () => setAuthModal((s) => ({ ...s, open: false }))

  async function refreshEntitlement(activeSession) {
    const s = activeSession ?? session
    if (!s?.access_token) { setEntitlement(null); setSubscription(null); return null }
    try {
      const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${s.access_token}` } })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      setEntitlement(data.entitlement)
      setSubscription(data.subscription)
      return data.entitlement
    } catch {
      setEntitlement(null); setSubscription(null); return null
    }
  }

  // ── Consents (liability waiver + biometric) logged to the account ──
  const [consents, setConsents] = useState({ liability_waiver: false, biometric: false })
  async function refreshConsents(activeSession) {
    const s = activeSession ?? session
    if (!s?.access_token) { setConsents({ liability_waiver: false, biometric: false }); return }
    try {
      const res = await fetch('/api/consent', { headers: { Authorization: `Bearer ${s.access_token}` } })
      if (!res.ok) return
      const acct = await res.json()
      setConsents(acct)
      // Sync any acceptance made while logged out up to the account (proof).
      const post = (type) => fetch('/api/consent', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${s.access_token}` },
        body: JSON.stringify({ type }),
      }).catch(() => {})
      if (!acct.liability_waiver && localStorage.getItem('sf_consent_liability') === '1') { post('liability_waiver'); setConsents(c => ({ ...c, liability_waiver: true })) }
      if (!acct.biometric && localStorage.getItem('sf_consent_biometric') === '1') { post('biometric'); setConsents(c => ({ ...c, biometric: true })) }
    } catch {}
  }
  async function recordConsent(type) {
    const s = session
    if (!s?.access_token) return false
    try {
      const res = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${s.access_token}` },
        body: JSON.stringify({ type }),
      })
      if (res.ok) { setConsents((c) => ({ ...c, [type]: true })); return true }
    } catch {}
    return false
  }

  // ── Consent GATE, blocks physical use / camera until accepted ──
  // Accepts on the account when logged in; also mirrors to localStorage so a
  // logged-out user can proceed and the acceptance is synced to their account
  // the moment they log in (see refreshConsents).
  const [consentGate, setConsentGate] = useState({ open: false, kind: null, onAccept: null })
  const LS = { liability: 'sf_consent_liability', biometric: 'sf_consent_biometric' }
  function hasAccepted(kind) {
    const acct = kind === 'liability' ? consents.liability_waiver : consents.biometric
    return acct || (typeof localStorage !== 'undefined' && localStorage.getItem(LS[kind]) === '1')
  }
  function requireConsent(kind, onAccept) {
    if (hasAccepted(kind)) { onAccept?.(); return }
    setConsentGate({ open: true, kind, onAccept })
  }
  async function acceptConsentGate() {
    const kind = consentGate.kind
    const type = kind === 'liability' ? 'liability_waiver' : 'biometric'
    try { localStorage.setItem(LS[kind], '1') } catch {}
    if (session) await recordConsent(type)
    const cb = consentGate.onAccept
    setConsentGate({ open: false, kind: null, onAccept: null })
    cb?.()
  }
  function closeConsentGate() { setConsentGate({ open: false, kind: null, onAccept: null }) }
  async function openBillingPortal() {
    const s = session
    if (!s?.access_token) return { error: 'Please log in.' }
    try {
      const res = await fetch('/api/billing-portal', { method: 'POST', headers: { Authorization: `Bearer ${s.access_token}` } })
      const data = await res.json()
      if (res.ok && data.url) { window.location.href = data.url; return {} }
      return { error: data.error || 'Could not open billing.' }
    } catch { return { error: 'Could not open billing.' } }
  }

  useEffect(() => {
    // Load any existing session on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      if (data.session) { refreshEntitlement(data.session); refreshConsents(data.session) }
      setLoading(false)
    })

    // Keep state in sync with login/logout/refresh
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session) { refreshEntitlement(session); refreshConsents(session) }
      else { setEntitlement(null); setSubscription(null); setConsents({ liability_waiver: false, biometric: false }) }
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const signUp = (email, password, fullName) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  // Derived helpers used across the app
  const tier = entitlement?.tier ?? 'free'
  const hasFullLibrary = !!entitlement?.access          // all videos + AI coach
  const hasVision = !!entitlement?.vision               // voice + camera (tier3/comp/trial)
  const trialDaysLeft = subscription?.trial_ends_at && tier === 'trial'
    ? Math.max(0, Math.ceil((new Date(subscription.trial_ends_at) - Date.now()) / 86400000))
    : null

  return (
    <AuthContext.Provider value={{
      user, session, loading, signUp, signIn, signOut,
      authModal, openAuth, closeAuth,
      entitlement, subscription, refreshEntitlement,
      tier, hasFullLibrary, hasVision, trialDaysLeft, trialDaysOffer,
      consents, recordConsent, openBillingPortal,
      requireConsent, hasAccepted, consentGate, acceptConsentGate, closeConsentGate,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

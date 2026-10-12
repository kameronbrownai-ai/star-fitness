// Client-side analytics. One module, two destinations (PostHog and GA4), so
// no call site ever knows which tools exist. Swapping or dropping a
// destination later is a change to this file alone.
//
// The plan this implements lives in .telemetry/tracking-plan.yaml.
//
// Three rules are enforced here rather than trusted to call sites:
//
//   1. No PII, ever. stripPii() drops email, name and friends before anything
//      leaves the browser, and shouts about it in development.
//   2. Internal users send nothing. A hard return, not a dashboard filter.
//   3. Nothing is sent off production. Dev, tunnels and previews stay silent.

import {
  POSTHOG_KEY, POSTHOG_HOST, GA4_ID,
  INTERNAL_USER_IDS, PRODUCTION_HOSTS,
} from '../config/analytics'

// Keys that must never reach an analytics destination. The product captures
// camera and biometric data; the analytics layer holds nothing that would make
// a breach worse.
const BANNED_KEYS = [
  'email', 'name', 'full_name', 'fullname', 'first_name', 'last_name',
  'phone', 'address', 'password', 'token', 'access_token', 'jersey',
  'initials', 'athlete_name', 'landmarks', 'photo', 'image', 'message',
  'text', 'prompt',
]

let posthog = null
let ready = false
let starting = null
let identity = { userId: null, isInternal: false }

function isProduction() {
  return typeof window !== 'undefined' && PRODUCTION_HOSTS.includes(window.location.hostname)
}

function configured() {
  return Boolean(POSTHOG_KEY || GA4_ID)
}

/** True when this call must not produce analytics. Checked on every send. */
function blocked() {
  if (import.meta.env.DEV) return true
  if (!isProduction()) return true
  if (!configured()) return true
  if (identity.isInternal) return true
  return false
}

/**
 * Removes anything personally identifying. Returns a new object; never
 * mutates the caller's. In development it throws, loudly and early, because a
 * PII leak found in a code review is free and one found in PostHog is not.
 */
function stripPii(props = {}) {
  const clean = {}
  const dropped = []
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null) continue
    if (BANNED_KEYS.includes(k.toLowerCase())) { dropped.push(k); continue }
    clean[k] = v
  }
  if (dropped.length && import.meta.env.DEV) {
    throw new Error(
      `analytics: refusing to send PII property/properties [${dropped.join(', ')}]. ` +
      `The tracking plan sets pii_policy: none. Send a shape, not a person.`
    )
  }
  return clean
}

/** Loads PostHog and GA4 once, lazily, after the app has already painted. */
async function start() {
  if (ready || starting) return starting
  if (import.meta.env.DEV || !isProduction() || !configured()) return null

  starting = (async () => {
    if (POSTHOG_KEY) {
      try {
        // Dynamic import keeps PostHog out of the main bundle: Vite emits it
        // as its own chunk, fetched after the page is interactive.
        const mod = await import('posthog-js')
        posthog = mod.default
        posthog.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          // Both destinations get pageviews from trackPageView() on route
          // change. Leaving PostHog's own capture on would double-count the
          // first load, and its SPA handling has varied across versions.
          capture_pageview: false,
          capture_pageleave: true,
          autocapture: false,  // the plan tracks named events, not every click
          persistence: 'localStorage+cookie',
        })
      } catch (e) {
        console.warn('analytics: PostHog failed to load', e?.message)
      }
    }

    if (GA4_ID) {
      try {
        const s = document.createElement('script')
        s.async = true
        s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`
        document.head.appendChild(s)
        window.dataLayer = window.dataLayer || []
        window.gtag = function gtag() { window.dataLayer.push(arguments) }
        window.gtag('js', new Date())
        // React Router does not reload the page, so GA4 would otherwise record
        // a single pageview per session. Router.jsx sends them explicitly.
        window.gtag('config', GA4_ID, { send_page_view: false })
      } catch (e) {
        console.warn('analytics: GA4 failed to load', e?.message)
      }
    }

    ready = true
  })()

  return starting
}

/**
 * Attaches the signed-in user, or clears on sign-out. Takes a Supabase user id
 * and a tier, never an email or a name: the signature makes the PII rule
 * impossible to break by accident.
 *
 * Call this from AuthContext whenever auth state changes.
 */
export function setUser(userId, tier) {
  const isInternal = Boolean(
    userId && (INTERNAL_USER_IDS.includes(userId) || tier === 'comp')
  )
  identity = { userId: userId || null, isInternal }

  if (!userId) {
    try { posthog?.reset() } catch {}
    return
  }
  if (blocked()) return

  start().then(() => {
    try {
      posthog?.identify(userId, { plan: tier || 'free' })
    } catch {}
    try {
      window.gtag?.('set', { user_id: userId })
      window.gtag?.('set', 'user_properties', { plan: tier || 'free' })
    } catch {}
  })
}

/**
 * Sends one event to both destinations.
 *
 * Never throws in production and never blocks the caller: a tracking failure
 * must not interrupt someone mid-workout.
 */
export function track(event, props = {}) {
  if (blocked()) return
  const clean = stripPii(props)

  start().then(() => {
    try { posthog?.capture(event, clean) } catch {}
    try { window.gtag?.('event', gaName(event), clean) } catch {}
  }).catch(() => {})
}

/**
 * Records an SPA route change. React Router does not reload the page, so
 * without this both tools would see a single pageview per session.
 */
export function trackPageView(path) {
  if (blocked()) return
  start().then(() => {
    try { posthog?.capture('$pageview', { $current_url: window.location.href }) } catch {}
    try { window.gtag?.('event', 'page_view', { page_path: path, page_location: window.location.href }) } catch {}
  }).catch(() => {})
}

// GA4 rejects dots in event names, and reserved names collide with its own
// ecommerce reporting. PostHog keeps the plan's object.action names as written.
const GA4_RENAMES = {
  'order.completed': 'purchase',
  'checkout.started': 'begin_checkout',
  'user.signed_up': 'sign_up',
  'user.signed_in': 'login',
}
function gaName(event) {
  return GA4_RENAMES[event] || event.replace(/\./g, '_')
}

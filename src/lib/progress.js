// Client helpers for progress tracking: workouts, streaks, sharing.
// Every call needs a Supabase session; callers pass the access token.

import { supabase } from './supabase'

async function token() {
  const { data } = await supabase.auth.getSession()
  return data?.session?.access_token || null
}

async function api(path, opts = {}) {
  const t = await token()
  if (!t) throw new Error('Not signed in')
  const res = await fetch(`/api${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}`, ...(opts.headers || {}) },
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
  return body
}

/** Today's date in the athlete's own calendar, 'YYYY-MM-DD'. */
export function localToday() {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * Records a training day. Silent on failure so a logging hiccup never
 * interrupts someone mid-workout; the card refreshes on next visit anyway.
 *   source: 'class' | 'coach' | 'manual' | 'assessment'
 *   ref:    lesson id, or a short note
 */
export async function logWorkout(source, ref = '') {
  try {
    await api('/workouts', { method: 'POST', body: JSON.stringify({ date: localToday(), source, ref }) })
    return true
  } catch {
    return false
  }
}

export function getStats() {
  return api(`/stats?today=${localToday()}`)
}

export function getProfile() {
  return api('/profile')
}

export function saveProfile(patch) {
  return api('/profile', { method: 'PUT', body: JSON.stringify(patch) })
}

export function shareAssessment(id) {
  return api(`/assessment/${id}/share`, { method: 'POST' })
}

export function unshareAssessment(id) {
  return api(`/assessment/${id}/unshare`, { method: 'POST' })
}

/** Public, no auth: a shared score card. */
export async function getSharedScore(id) {
  const res = await fetch(`/api/share/${id}`)
  if (!res.ok) return null
  return res.json()
}

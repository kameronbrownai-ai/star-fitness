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

// ── Teams ────────────────────────────────────────────────────────────────────

export function createTeam(name, sport) {
  return api('/teams', { method: 'POST', body: JSON.stringify({ name, sport }) })
}

export function joinTeam(code) {
  return api('/teams/join', { method: 'POST', body: JSON.stringify({ code }) })
}

export function myTeams() {
  return api('/teams/mine')
}

/** Works signed out too, for public teams; sends the token when one exists. */
export async function getTeam(id) {
  const t = await token()
  const res = await fetch(`/api/teams/${id}?today=${localToday()}`, {
    headers: t ? { Authorization: `Bearer ${t}` } : {},
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
  return body
}

export function updateTeam(id, patch) {
  return api(`/teams/${id}`, { method: 'PUT', body: JSON.stringify(patch) })
}

export function leaveTeam(id) {
  return api(`/teams/${id}/leave`, { method: 'POST' })
}

export function deleteTeam(id) {
  return api(`/teams/${id}`, { method: 'DELETE' })
}

export function removeMember(teamId, userId) {
  return api(`/teams/${teamId}/members/${userId}`, { method: 'DELETE' })
}

// ── Coach mode: testing sessions ─────────────────────────────────────────────
// Captures taken by a coach about other athletes. Separate from the signed-in
// user's own assessments on purpose.

export function createTestSession(name, location, notes) {
  return api('/test-sessions', { method: 'POST', body: JSON.stringify({ name, location, notes }) })
}

export function listTestSessions() {
  return api('/test-sessions')
}

export function getTestSession(id) {
  return api(`/test-sessions/${id}`)
}

export function addCapture(sessionId, capture) {
  return api(`/test-sessions/${sessionId}/captures`, { method: 'POST', body: JSON.stringify(capture) })
}

export function deleteCapture(sessionId, captureId) {
  return api(`/test-sessions/${sessionId}/captures/${captureId}`, { method: 'DELETE' })
}

export function deleteTestSession(id) {
  return api(`/test-sessions/${id}`, { method: 'DELETE' })
}

/** Downloads the session as a CSV the browser saves to disk. */
export async function exportTestSession(id, name) {
  const t = await token()
  const res = await fetch(`/api/test-sessions/${id}/export`, { headers: { Authorization: `Bearer ${t}` } })
  if (!res.ok) throw new Error('Could not export')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `starmat-${(name || 'session').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

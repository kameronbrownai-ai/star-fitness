const KEY = 'sf_coach_v1'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}

function persist(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
}

export function getProfile() {
  return load().profile || null
}

export function saveProfile(profile) {
  persist({ ...load(), profile })
}

export function getSessionCount() {
  return load().sessionCount || 0
}

export function getSessionMsgCount() {
  return load().sessionMsgCount || 0
}

export function startSession() {
  const data = load()
  const count = (data.sessionCount || 0) + 1
  persist({ ...data, sessionCount: count, sessionMsgCount: 0 })
  return count
}

export function incrementSessionMsg() {
  const data = load()
  const count = (data.sessionMsgCount || 0) + 1
  persist({ ...data, sessionMsgCount: count })
  return count
}

export function getSessionHistory() {
  return load().sessionHistory || []
}

export function hasSkippedOnboarding() {
  return !!load().skippedOnboarding
}

export function setSkippedOnboarding() {
  persist({ ...load(), skippedOnboarding: true })
}

export function addSessionNote(note) {
  const data = load()
  const history = [
    { date: new Date().toISOString().split('T')[0], note },
    ...(data.sessionHistory || []),
  ].slice(0, 8)
  persist({ ...data, sessionHistory: history })
}

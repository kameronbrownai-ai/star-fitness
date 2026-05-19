// Persists all form submissions to localStorage so no data is lost between sessions.
// In production, replace the localStorage calls with API POSTs.

export const saveSubmission = (type, data) => {
  const key = `starfitness_${type}`
  const existing = JSON.parse(localStorage.getItem(key) || '[]')
  const entry = { ...data, id: Date.now(), submittedAt: new Date().toISOString() }
  existing.push(entry)
  localStorage.setItem(key, JSON.stringify(existing))
  return entry
}

export const getSubmissions = (type) => {
  return JSON.parse(localStorage.getItem(`starfitness_${type}`) || '[]')
}

export const clearSubmissions = (type) => {
  localStorage.removeItem(`starfitness_${type}`)
}

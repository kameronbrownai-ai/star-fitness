// Shared speech-synthesis settings for the AI Coach.
//
// The rate lived in three places with three different values (0.95, 0.95, 1.0)
// and read back too fast to follow while training. One constant now, so tuning
// it is a single edit.

// Browser default is 1.0. Coaching cues are heard while moving, often at a
// distance from the phone, so they need to be noticeably slower than
// conversational speed.
export const SPEECH_RATE = 0.8

// Live form-check cues during a set are short and urgent, so they can run a
// touch quicker than a full workout readout without becoming hard to follow.
export const LIVE_CUE_RATE = 0.85

/**
 * Strips markdown and reshapes text so a synthesizer reads it naturally.
 *
 * Screen formatting works against speech: "- " reads as nothing and runs
 * bullets together, "90°" is read as "ninety" without the unit, and headings
 * collide with the sentence after them. Converting those to real punctuation
 * makes the engine pause in the right places.
 */
export function toSpokenText(text) {
  return String(text || '')
    // markdown emphasis, headings, code ticks
    .replace(/[#*`_]/g, '')
    // list markers become sentence breaks so each point gets a pause
    .replace(/^\s*[-•]\s*/gm, '. ')
    .replace(/^\s*\d+\.\s*/gm, '. ')
    // degrees are core to the product and must be spoken, not skipped
    .replace(/(\d+)\s*°/g, '$1 degrees')
    // collapse newlines into pauses
    .replace(/\n+/g, '. ')
    // tidy whitespace first, then collapse the duplicate stops the
    // substitutions above create. Order matters: removing the space before a
    // period turns ". ." into "..", so that cleanup has to come first.
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?])/g, '$1')
    .replace(/\.{2,}/g, '.')
    .replace(/\.\s*\./g, '.')
    .trim()
}

/**
 * Builds a configured utterance. Callers attach their own onend/onerror.
 */
export function buildUtterance(text, { rate = SPEECH_RATE, pitch = 1 } = {}) {
  const utt = new SpeechSynthesisUtterance(toSpokenText(text))
  utt.rate = rate
  utt.pitch = pitch
  return utt
}

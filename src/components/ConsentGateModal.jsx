import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Camera, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// One modal drives two gates:
//  • 'liability'  → assumption-of-risk / liability waiver before any physical use
//  • 'biometric'  → camera + body-position data consent before the camera activates
// Both require an active checkbox + "I Agree", and the acceptance is logged
// (to the account when signed in, mirrored locally otherwise).
// [ATTORNEY TO PROVIDE final legal wording for both, see placeholders below.]
const COPY = {
  liability: {
    icon: ShieldCheck,
    title: 'Before you begin',
    intro: 'Exercise carries inherent risks. Please read and accept before starting a workout or assessment.',
    // [ATTORNEY TO PROVIDE, assumption of risk / liability waiver language]
    body: 'I understand that physical exercise carries inherent risks of injury. I confirm I am physically able to exercise, I voluntarily assume all risks associated with using the Star Mat and Star Fitness content, and I release Star Fitness from liability to the fullest extent permitted by law. Star Fitness content is general fitness guidance only, not medical advice. I will consult a healthcare professional before beginning any exercise or recovery program.',
    check: 'I have read and agree to the above, and I accept the assumption of risk.',
    cta: 'I Agree',
  },
  biometric: {
    icon: Camera,
    title: 'Camera & movement data',
    intro: 'This feature uses your camera to read your body position.',
    // [ATTORNEY TO PROVIDE, biometric/camera-data consent, incl. state law (e.g. BIPA)]
    body: 'To generate your feedback, this feature detects your body position from your camera. All processing happens on your device, your camera video and body-position data are NOT uploaded to or stored by Star Fitness. For the Star Assessment, only your final numeric score is saved. For the AI Coach form check, a single still image is sent for analysis only when you tap "Analyze." I consent to this on-device processing of my camera and movement data.',
    check: 'I consent to the on-device use of my camera and movement data as described.',
    cta: 'I Agree & Continue',
  },
}

export default function ConsentGateModal() {
  const { consentGate, acceptConsentGate, closeConsentGate } = useAuth()
  const [checked, setChecked] = useState(false)
  useEffect(() => { setChecked(false) }, [consentGate.open, consentGate.kind])

  const kind = consentGate.kind || 'liability'
  const c = COPY[kind]
  const Icon = c.icon

  return (
    <AnimatePresence>
      {consentGate.open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[95]" onClick={closeConsentGate} />
          <div className="fixed inset-0 z-[96] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="w-full max-w-md max-h-[88svh] overflow-y-auto pointer-events-auto rounded-2xl border border-star-border bg-star-card p-6 shadow-2xl">
              <div className="w-11 h-11 rounded-xl bg-star-yellow/10 border border-star-yellow/30 flex items-center justify-center mb-4">
                <Icon size={20} className="text-star-yellow" />
              </div>
              <h2 className="text-white font-black text-xl mb-1">{c.title}</h2>
              <p className="text-star-grey text-sm mb-4">{c.intro}</p>
              <div className="rounded-xl bg-star-black border border-star-border p-4 mb-4 max-h-48 overflow-y-auto">
                <p className="text-white/60 text-xs leading-relaxed">{c.body}</p>
              </div>

              <button onClick={() => setChecked(v => !v)} className="flex items-start gap-2.5 text-left mb-5 w-full">
                <span className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'bg-star-yellow border-star-yellow' : 'border-white/30'}`}>
                  {checked && <Check size={13} className="text-black" strokeWidth={3} />}
                </span>
                <span className="text-white/70 text-sm leading-relaxed">{c.check}</span>
              </button>

              <div className="flex gap-3">
                <button onClick={closeConsentGate} className="flex-1 py-3 rounded-xl border border-star-border text-white/70 font-semibold text-sm">Cancel</button>
                <button onClick={acceptConsentGate} disabled={!checked}
                  className="flex-1 py-3 rounded-xl bg-star-yellow text-black font-bold text-sm disabled:opacity-40">
                  {c.cta}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

import { Info } from 'lucide-react'

// Short, visible point-of-claim disclaimer. The fuller Health Disclaimer lives
// in Terms, this surfaces it wherever we mention rehab, recovery, wellness,
// injury, or AI coaching. [ATTORNEY TO FINALIZE wording]
export default function FitnessDisclaimer({ className = '' }) {
  return (
    <div className={`flex items-start gap-2 text-star-grey/70 text-xs leading-relaxed ${className}`}>
      <Info size={13} className="flex-shrink-0 mt-0.5" />
      <p>
        Star Fitness provides general fitness guidance only, not medical advice, diagnosis, or treatment.
        Consult a healthcare professional before starting any exercise or recovery program.
      </p>
    </div>
  )
}

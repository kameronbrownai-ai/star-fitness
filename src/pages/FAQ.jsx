import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    category: 'The Star Mat',
    items: [
      {
        q: 'What is the Star Mat?',
        a: 'The Star Mat is a premium training mat with a built-in 8-directional compass star printed directly on its surface. The star\'s 8 labeled angles (45°–360°) give athletes and coaches a spatial reference for every drill, making random footwork patterns into repeatable, measurable movements.',
      },
      {
        q: 'What\'s the difference between the Pro and Lite?',
        a: 'The Star Mat Pro 2.0 ($249) is our flagship, 8mm premium TPE foam, two-sided print (train on either side), 75"×75" for full-body movement, and includes a carry strap and a free trial account. The Star Mat Lite ($199) is our travel-friendly option, 4mm foam, single-sided print, 55"×55", and foldable for easy storage and portability, and also comes with a free trial account.',
      },
      {
        q: 'What surfaces does the Star Mat work on?',
        a: 'The Star Mat works on hardwood, tile, turf, grass, and concrete. The non-slip bottom keeps it locked in place on smooth surfaces. Outdoors on grass or turf, the mat\'s weight holds it steady.',
      },
      {
        q: 'How do I clean and care for the mat?',
        a: 'Wipe down with a damp cloth and mild soap after each session. Avoid harsh chemicals or solvents, they can degrade the TPE foam and fade the print. Allow it to air dry before rolling or storing. Store rolled, not folded, to prevent creasing.',
      },
      {
        q: 'What\'s the weight capacity?',
        a: 'The Star Mat Pro 2.0 supports up to 300 lbs of static load. Dynamic movement loads are distributed across the surface, making it suitable for athletes of all sizes and training intensities.',
      },
    ],
  },
  {
    category: 'Training & Lessons',
    items: [
      {
        q: 'What sports does Star Fitness support?',
        a: 'Our lesson library covers Football, Basketball, Soccer, Baseball/Softball, Track & Field, Tennis, Golf, Hockey, Lacrosse, and MMA/Combat. Each sport has dedicated training classes and sport-specific injury recovery protocols.',
      },
      {
        q: 'How does the AI Coach work?',
        a: 'The AI Coach uses Claude (Anthropic\'s AI) to generate custom Star Mat workouts based on your sport, position, goals, and any injuries. Tell it what you want, it returns a full workout with exercises, sets, reps, rest periods, and which compass direction to face for each movement.',
      },
      {
        q: 'Can I use the camera/form check feature?',
        a: 'Yes. The AI Coach includes a live form-check camera powered by MediaPipe pose detection. It tracks your key joints in real time, calculates angles at your knees and hips, and lets you send a freeze-frame to the AI for feedback. Works on any modern smartphone or laptop camera.',
      },
      {
        q: 'Which classes are free vs. paid?',
        a: 'Every sport has at least one free class in both the Training and Recovery tracks, no account required. The full library (4 training + 3 recovery classes per sport) requires a Star Fitness subscription, which comes with your Star Mat Pro purchase.',
      },
      {
        q: 'What is "training in all planes of motion"?',
        a: 'Most gym equipment only allows you to move forward and backward (one plane). The Star Mat\'s 8-directional compass guides you to train in every direction, front, back, left, right, and all diagonals. This builds the functional strength, balance, and coordination that actually transfers to sport performance.',
      },
    ],
  },
  {
    category: 'Orders & Shipping',
    items: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping (US): 5–7 business days. Expedited: 2–3 business days. International orders: 10–15 business days. All orders receive a tracking number within 24 hours of dispatch.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to Canada, the UK, Australia, and select EU countries. International shipping rates are calculated at checkout. Import duties and taxes are the responsibility of the recipient.',
      },
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day Star Guarantee. If you\'re not satisfied for any reason, return your mat within 30 days of delivery for a full refund. The mat must be clean and undamaged. Contact Info@starmatapp.com to start a return.',
      },
      {
        q: 'Can I order for my gym or team?',
        a: 'Yes, B2B and team orders are available with volume pricing. We work with gyms, athletic programs, and corporate wellness centers. Contact us at Info@starmatapp.com with your quantity and use case for a custom quote.',
      },
    ],
  },
  {
    category: 'Account & Subscriptions',
    items: [
      {
        q: 'How do I access my subscription content?',
        a: 'After purchase, you\'ll receive an email with account activation instructions. Log in at starmat.app/lessons to access the full class library for your sport(s). Your subscription is tied to your account and works on any device.',
      },
      {
        q: 'Can I cancel my subscription anytime?',
        a: 'Yes. You can cancel anytime from your account settings. Your access remains active through the end of the current billing period. No cancellation fees.',
      },
      {
        q: 'Is there a free trial?',
        a: 'Yes, every new account gets a free trial with full access, no card required: 30 days for our first 5,000 members, 14 days after that. Buying a Star Mat (Pro or Lite) automatically creates your account and starts the trial. Individual sport pages also have free classes you can access without an account.',
      },
    ],
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  const toggle = (key) => setOpen(open === key ? null : key)

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <section className="section-padding py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] rounded-full bg-star-yellow/6 blur-[80px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10">
          <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-3">Got Questions?</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Frequently Asked <span className="text-gradient-yellow">Questions</span>
          </h1>
          <p className="text-star-grey text-lg max-w-xl mx-auto">
            Everything you need to know about the Star Mat, training programs, orders, and your account.
          </p>
        </motion.div>
      </section>

      {/* FAQ Sections */}
      <div className="section-padding max-w-3xl mx-auto">
        {faqs.map((section) => (
          <div key={section.category} className="mb-12">
            <h2 className="text-star-yellow text-xs font-bold tracking-widest uppercase mb-6 flex items-center gap-3">
              <span className="flex-1 h-px bg-star-border" />
              {section.category}
              <span className="flex-1 h-px bg-star-border" />
            </h2>

            <div className="space-y-3">
              {section.items.map((item, i) => {
                const key = `${section.category}-${i}`
                const isOpen = open === key
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    className="rounded-2xl border border-star-border bg-star-card overflow-hidden"
                  >
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="text-white font-semibold text-base leading-snug">{item.q}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown size={18} className="text-star-grey" />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-5 text-star-grey text-sm leading-relaxed border-t border-star-border/50 pt-4">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 glass rounded-3xl p-8 text-center border border-star-border"
        >
          <h3 className="text-white font-black text-xl mb-2">Still have a question?</h3>
          <p className="text-star-grey text-sm mb-5">Our team responds within 24 hours, usually faster.</p>
          <a
            href="mailto:Info@starmatapp.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-star-blue text-white rounded-full font-bold text-sm hover:bg-blue-500 transition-colors"
          >
            Email Support
          </a>
        </motion.div>
      </div>
    </main>
  )
}

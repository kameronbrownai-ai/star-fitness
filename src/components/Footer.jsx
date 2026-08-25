import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Instagram, Youtube, Facebook } from 'lucide-react'

const StarLogo = () => (
  <img src="/images/logo.png" alt="" width={28} height={28} className="object-contain" />
)

// Brand icons (lucide has no X / TikTok marks)
const XIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const TikTokIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
)

const footerLinks = {
  Products: [
    { label: 'Star Mat Pro', to: '/shop?category=Mats' },
    { label: 'Star Mat Lite', to: '/shop?category=Mats' },
    { label: 'Accessories', to: '/shop?category=Accessories' },
    { label: 'Apparel', to: '/shop?category=Apparel' },
  ],
  Training: [
    { label: 'All Classes', to: '/lessons' },
    { label: 'Beginner', to: '/lessons' },
    { label: 'Advanced', to: '/lessons' },
    { label: 'Live Sessions', to: '/lessons' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Community', to: '/community' },
    { label: 'Partners', to: '/community' },
    { label: 'Press', to: '/about' },
  ],
  Support: [
    { label: 'FAQ', to: '/faq' },
    { label: 'Shipping', to: '/returns' },
    { label: 'Returns', to: '/returns' },
    { label: 'Contact', to: '/faq' },
  ],
}

const socials = [
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: XIcon, href: '#', label: 'X' },
  { Icon: TikTokIcon, href: '#', label: 'TikTok' },
  { Icon: Youtube, href: '#', label: 'YouTube' },
  { Icon: Facebook, href: '#', label: 'Facebook' },
]

export default function Footer() {
  return (
    <footer className="border-t border-star-border bg-star-black mt-20">
      {/* Newsletter */}
      <div className="section-padding py-16 border-b border-star-border">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-3">Stay Connected</p>
            <h3 className="text-3xl font-black mb-4">
              Join the <span className="text-gradient-blue">Star Community</span>
            </h3>
            <p className="text-star-grey mb-8">
              Get early access to new classes, product drops, and exclusive member discounts.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-5 py-3 rounded-full bg-star-card border border-star-border text-white placeholder-star-grey focus:outline-none focus:border-star-blue transition-colors text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary text-sm py-3 px-6 whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Links */}
      <div className="section-padding py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <StarLogo />
              <span className="font-black text-white tracking-tight">STAR FITNESS™</span>
            </Link>
            <p className="text-star-grey text-sm leading-relaxed mb-6">
              Premium fitness equipment and training for those who demand more from every session.
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, color: '#007AFF' }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-full border border-star-border flex items-center justify-center text-star-grey hover:text-star-blue hover:border-star-blue transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-white font-semibold text-sm mb-4">{group}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-star-grey hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Fitness disclaimer, [ATTORNEY TO FINALIZE wording] */}
      <div className="section-padding pb-6 border-t border-star-border pt-6">
        <p className="text-star-grey/70 text-xs leading-relaxed max-w-4xl">
          Star Fitness content, the AI Coach, and the Star Assessment are provided for general fitness and educational
          purposes only and are not medical advice, diagnosis, or treatment. The Star Score is an estimate, not a medical
          measurement. Always consult a qualified healthcare professional before beginning any exercise or recovery program,
          especially if you have an injury or medical condition.
        </p>
      </div>

      {/* Bottom bar */}
      <div className="section-padding py-6 border-t border-star-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-star-grey text-sm">© 2026 Star Fitness. All rights reserved.</p>
            <p className="text-star-grey/60 text-xs mt-1">
              Star Mat™, Star Fitness™, Star Mat AI Coach™, Star Assessment™, Star Score™, and LOAD DECIDE™ are trademarks of Leroy Collins d/b/a Star Fitness.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {[
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Terms of Service', to: '/terms' },
              { label: 'Cookie Policy', to: '/cookies' },
              { label: 'Licenses', to: '/licenses' },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="text-star-grey hover:text-white text-sm transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

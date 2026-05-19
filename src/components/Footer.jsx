import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Instagram, Twitter, Youtube, Facebook } from 'lucide-react'

const StarLogo = () => (
  <svg width="28" height="28" viewBox="0 0 50 50" fill="none">
    <polygon points="25,3 31,18 47,18 35,29 39,45 25,37 11,45 15,29 3,18 19,18" fill="#FFD700" />
  </svg>
)

const footerLinks = {
  Products: [
    { label: 'Star Mat Pro', to: '/shop' },
    { label: 'Star Mat Lite', to: '/shop' },
    { label: 'Accessories', to: '/shop' },
    { label: 'Apparel', to: '/apparel' },
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
    { label: 'FAQ', to: '/' },
    { label: 'Shipping', to: '/' },
    { label: 'Returns', to: '/' },
    { label: 'Contact', to: '/' },
  ],
}

const socials = [
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Twitter, href: '#', label: 'Twitter' },
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
              <span className="font-black text-white tracking-tight">STAR FITNESS</span>
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

      {/* Bottom bar */}
      <div className="section-padding py-6 border-t border-star-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-star-grey text-sm">
            © 2025 Star Fitness. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-star-grey hover:text-white text-sm transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

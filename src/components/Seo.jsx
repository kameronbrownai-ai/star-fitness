import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE = 'Star Fitness'
const ORIGIN = 'https://starmat.app'

// Per-route title and description. Titles stay under ~60 characters and
// descriptions under ~155 so search engines show them without truncating.
// Every claim here has to be one we can back up, same rule as the page copy.
export const ROUTE_META = {
  '/': {
    title: 'Star Mat, Sport-Specific Training Mat | Star Fitness',
    description:
      'The Star Mat is a training mat with 8 calibrated angles, paired with an AI Coach that builds workouts around them. Balance, core, speed, strength, and endurance in every plane of motion.',
  },
  '/shop': {
    title: 'Shop the Star Mat, Gear & Apparel | Star Fitness',
    description:
      'Star Mat Pro 2.0 at $249 and Star Mat Lite at $199, plus bands, rollers, bags, and apparel. Free shipping on mats and a 30-day return guarantee.',
  },
  '/lessons': {
    title: 'Training Classes by Sport | Star Fitness',
    description:
      'Guided Star Mat classes for football, basketball, soccer, baseball, track, tennis, golf, hockey, lacrosse, and MMA, plus a wellness and rehab track.',
  },
  '/gallery': {
    title: 'Star Mat Videos & Gallery | Star Fitness',
    description:
      'Watch the Star Mat in use: drills, footwork patterns, golf work, and full training sessions on the 8-angle directional surface.',
  },
  '/booking': {
    title: 'Book a Class | Star Fitness',
    description:
      'Reserve a session with a Star Mat coach. Book one-on-one training or a group class built around the S.T.A.R. method.',
  },
  '/partners': {
    title: 'Partner Program for Facilities & Coaches | Star Fitness',
    description:
      'Bring the Star Mat to your training facility, academy, golf simulator, studio, school program, or clinic. Partner pricing and program details.',
  },
  '/community': {
    title: 'Star Mat Community & Partners | Star Fitness',
    description:
      'One standard of precision across ten sports. Meet the Star Mat community and the partner program built for facilities and coaches.',
  },
  '/about': {
    title: 'Our Story & the S.T.A.R. Method | Star Fitness',
    description:
      'How the Star Mat went from tape on a gym floor to 8 calibrated angles and an AI Coach. Speed, Technique, Agility, and Reactivity.',
  },
  '/faq': {
    title: 'Frequently Asked Questions | Star Fitness',
    description:
      'Answers on Star Mat sizes and materials, shipping and returns, membership tiers and free trials, the AI Coach, and the Star Assessment.',
  },
  '/pricing': {
    title: 'Membership Plans & Pricing | Star Fitness',
    description:
      'Free starter library, Training at $5/month, or Elite at $14.99/month with voice and live camera coaching. Free trial, no card required.',
  },
  '/account': {
    title: 'Your Account | Star Fitness',
    description: 'Manage your Star Fitness membership, billing, Star Score history, and account settings.',
  },
  '/licenses': {
    title: 'Licenses & Attributions | Star Fitness',
    description: 'Open-source licenses and third-party attributions for software used to build Star Fitness and the Star Mat AI Coach.',
  },
  '/privacy': {
    title: 'Privacy Policy | Star Fitness',
    description: 'How Star Fitness collects, uses, stores, and protects your personal information, including camera and biometric data.',
  },
  '/terms': {
    title: 'Terms of Service | Star Fitness',
    description: 'The terms governing your use of starmat.app, Star Fitness memberships, and the Star Mat AI Coach.',
  },
  '/returns': {
    title: 'Returns & Shipping | Star Fitness',
    description: 'Our 30-day return guarantee, shipping timelines, and how to start a return or exchange on a Star Mat order.',
  },
  '/cookies': {
    title: 'Cookie Policy | Star Fitness',
    description: 'Which cookies starmat.app uses, what each one does, and how to control them in your browser.',
  },
}

const FALLBACK = ROUTE_META['/']

function setMeta(selector, attr, key, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

/**
 * Keeps <title>, the meta description, the canonical URL, and the og/twitter
 * mirrors in step with the current route. Without this every route served the
 * same title, which reads to search engines as 16 duplicate pages.
 */
export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = ROUTE_META[pathname] || FALLBACK

    document.title = meta.title
    setMeta('meta[name="description"]', 'name', 'description', meta.description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', meta.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', meta.description)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description)

    const url = ORIGIN + (pathname === '/' ? '/' : pathname)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [pathname])

  return null
}

export { SITE }

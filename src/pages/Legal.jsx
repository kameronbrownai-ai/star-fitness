import { motion } from 'framer-motion'

const EFFECTIVE = 'July 2026'

const DOCS = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'Star Fitness ("Star Fitness," "we," "us") respects your privacy. This Privacy Policy explains what information Star Fitness collects, how we use it, and the choices you have. It applies to starmat.app and any Star Fitness services.',
    sections: [
      ['Information We Collect', 'Star Fitness collects information you provide directly, such as your name, email address, shipping address, and payment details when you place an order or create an account. We also collect limited technical data automatically, including device type, browser, and pages visited, to keep the site working and improve it.'],
      ['How We Use Your Information', 'Star Fitness uses your information to process and ship orders, provide customer support, send order updates, operate the AI Coach and training features, and, only if you opt in, send marketing emails. We do not sell your personal information.'],
      ['Payments', 'Star Fitness processes payments through Stripe. Your full card details are entered on Stripe\'s secure systems and are never stored on Star Fitness servers. Stripe\'s handling of your data is governed by Stripe\'s own privacy policy.'],
    ['AI Coach, Camera & Movement Data', 'When you use the AI Coach, your messages are processed to generate workout guidance. The Star Assessment and the Live Form Check use on-device pose detection (Google MediaPipe) that runs entirely in your browser, your camera video and body-position data are processed on your device and are NOT uploaded to or stored by Star Fitness. For the Star Assessment, only your final numeric Star Score and category results are saved to your account. For the AI Coach form check, a single still image is sent for analysis ONLY when you tap "Analyze"; it is used to generate feedback and is not stored by Star Fitness. Star Fitness does not record, retain, or sell your camera feed or biometric identifiers. This section is being finalized with our legal counsel, including any biometric-data consent required by applicable law.'],
      ['Cookies', 'Star Fitness uses essential cookies to run the site and remember your cart and preferences. See our Cookie Policy for details.'],
      ['Your Choices', 'You may request access to, correction of, or deletion of your personal information at any time by emailing Info@starmatapp.com. You can unsubscribe from marketing emails using the link in any message.'],
      ['Contact', 'Questions about this policy? Email Info@starmatapp.com.'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'These Terms of Service govern your use of starmat.app and the purchase of Star Fitness products. By using the site or placing an order, you agree to these terms.',
    sections: [
      ['Products & Pricing', 'Star Fitness makes every effort to display products, descriptions, and prices accurately. Prices are in U.S. dollars and may change at any time. If a product is listed at an incorrect price, Star Fitness reserves the right to cancel the order and issue a full refund.'],
      ['Orders', 'Your order is an offer to buy. Star Fitness may accept or decline any order. You will receive an order confirmation by email once your order is accepted.'],
      ['Subscriptions', 'Star Fitness subscription plans renew automatically until canceled. You may cancel at any time from your account settings; access continues through the end of the current billing period. No partial-period refunds are provided unless required by law.'],
      ['Acceptable Use', 'You agree to use Star Fitness products and services lawfully and not to misuse, copy, or resell the software, content, or training materials without permission.'],
      ['Health Disclaimer', 'Star Fitness products and the AI Coach provide general fitness guidance and are not medical advice. Consult a qualified healthcare professional before beginning any exercise or recovery program, especially if you have an injury or medical condition.'],
      ['Limitation of Liability', 'To the fullest extent permitted by law, Star Fitness is not liable for any indirect or consequential damages arising from use of its products or services. Your use is at your own risk.'],
      ['Contact', 'Questions about these terms? Email Info@starmatapp.com.'],
    ],
  },
  returns: {
    title: 'Returns & Shipping',
    intro: 'Star Fitness wants you to train with confidence. This page covers how Star Fitness ships orders and how returns work.',
    sections: [
      ['Shipping Times', 'Star Fitness ships within the United States in 5–7 business days for standard shipping and 2–3 business days for expedited. International orders typically arrive in 10–15 business days. You receive a tracking number by email once your order ships.'],
      ['Shipping Cost', 'Shipping is free on all Star Mat orders within the United States. International shipping rates are calculated at checkout, and any import duties or taxes are the responsibility of the recipient.'],
      ['30-Day Return Guarantee', 'If you are not satisfied, you may return your Star Mat within 30 days of delivery for a full refund. The mat must be clean and undamaged. To start a return, email Info@starmatapp.com with your order number.'],
      ['Refunds', 'Once your return is received and inspected, Star Fitness issues your refund to the original payment method within 5–10 business days. Original shipping costs are non-refundable where applicable.'],
      ['Damaged or Wrong Items', 'If your order arrives damaged or incorrect, email Info@starmatapp.com within 7 days of delivery and Star Fitness will make it right at no cost to you.'],
      ['Contact', 'Questions about an order? Email Info@starmatapp.com.'],
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    intro: 'This Cookie Policy explains how Star Fitness uses cookies and similar technologies on starmat.app.',
    sections: [
      ['What Cookies Are', 'Cookies are small text files stored on your device that help a website function and remember your preferences.'],
      ['How Star Fitness Uses Cookies', 'Star Fitness uses essential cookies to operate the site, keeping items in your cart, remembering your preferences, and keeping you signed in. Star Fitness may use limited analytics to understand how the site is used and improve it.'],
      ['Managing Cookies', 'You can control or delete cookies through your browser settings. Disabling essential cookies may affect how the site works, such as your cart not saving between pages.'],
      ['Contact', 'Questions about cookies? Email Info@starmatapp.com.'],
    ],
  },
}

export default function Legal({ doc }) {
  const data = DOCS[doc] || DOCS.privacy
  return (
    <main className="pt-28 pb-24">
      <div className="section-padding max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-star-yellow text-xs font-bold tracking-widest uppercase mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-black mb-3">{data.title}</h1>
          <p className="text-star-grey text-sm mb-8">Effective {EFFECTIVE}</p>
          <p className="text-star-grey leading-relaxed mb-10">{data.intro}</p>

          <div className="space-y-8">
            {data.sections.map(([heading, body]) => (
              <div key={heading}>
                <h2 className="text-white font-bold text-lg mb-2">{heading}</h2>
                <p className="text-star-grey leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}

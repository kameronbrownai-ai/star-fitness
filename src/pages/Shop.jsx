import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Heart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'

const LogoIcon = ({ size = 16, className = '' }) => (
  <img src="/images/logo.jpeg" alt="" width={size} height={size} className={`object-contain ${className}`} style={{ mixBlendMode: 'screen' }} />
)

const categories = ['All', 'Mats', 'Accessories', 'Bundles', 'Apparel']

const products = [
  // Mats
  { id: 1, name: 'Star Mat Pro 2.0', price: 149, originalPrice: 179, category: 'Mats', badge: 'Best Seller', badgeColor: '#007AFF', rating: 4.9, reviews: 2847, accent: '#007AFF', gradient: 'from-blue-900/60 to-star-black', emoji: '🧘', image: '/images/mat-clean.jpeg', desc: '8mm premium TPE foam, micro-suede top, carry strap included.', features: ['8mm Cushion', 'Non-Slip', 'Carry Strap', '72" Length'] },
  { id: 2, name: 'Star Mat Lite', price: 89, originalPrice: null, category: 'Mats', badge: 'New', badgeColor: '#30D158', rating: 4.7, reviews: 1204, accent: '#30D158', gradient: 'from-green-900/40 to-star-black', emoji: '🧘', image: '/images/mat-clean.jpeg', desc: '4mm travel mat. Lightweight, foldable, and just as grippy.', features: ['4mm Cushion', 'Foldable', 'Lightweight', '68" Length'] },
  // Accessories
  { id: 3, name: 'Resistance Band Set', price: 45, originalPrice: null, category: 'Accessories', badge: null, badgeColor: null, rating: 4.8, reviews: 934, accent: '#FFD700', gradient: 'from-yellow-900/30 to-star-black', emoji: '💪', desc: '5 progressive bands, 10–50 lbs. Fabric-wrapped for comfort.', features: ['5 Levels', 'Fabric Wrap', 'Non-Snap', 'Carry Pouch'] },
  { id: 4, name: 'Foam Roller Pro', price: 55, originalPrice: null, category: 'Accessories', badge: null, badgeColor: null, rating: 4.6, reviews: 612, accent: '#BF5AF2', gradient: 'from-purple-900/30 to-star-black', emoji: '🔵', desc: 'High-density EVA roller with star-pattern surface for deep tissue.', features: ['36" Length', 'High-Density', 'Star Pattern', 'Full Body'] },
  { id: 5, name: 'Cork Yoga Block Set', price: 35, originalPrice: null, category: 'Accessories', badge: null, badgeColor: null, rating: 4.7, reviews: 488, accent: '#FF9F0A', gradient: 'from-orange-900/30 to-star-black', emoji: '🟫', desc: 'Cork yoga blocks for stability, alignment, and deeper stretches.', features: ['2-Pack', 'Cork', 'Eco-Friendly', 'Anti-Slip'] },
  { id: 6, name: 'Star Mat Bag', price: 49, originalPrice: null, category: 'Accessories', badge: null, badgeColor: null, rating: 4.5, reviews: 376, accent: '#64D2FF', gradient: 'from-cyan-900/30 to-star-black', emoji: '👜', desc: 'Heavy-duty canvas mat bag. Fits Pro and Lite.', features: ['Canvas', 'Interior Pockets', 'Adjustable Strap', 'Water Resistant'] },
  { id: 7, name: 'Star Water Bottle', price: 39, originalPrice: null, category: 'Accessories', badge: null, badgeColor: null, rating: 4.6, reviews: 291, accent: '#32D4B9', gradient: 'from-teal-900/30 to-star-black', emoji: '💧', desc: '32oz insulated stainless steel. Keeps cold 24h, hot 12h.', features: ['32oz', 'Insulated', 'Star Lid', 'BPA-Free'] },
  // Bundles
  { id: 8, name: 'Starter Bundle', price: 199, originalPrice: 243, category: 'Bundles', badge: 'Save $44', badgeColor: '#FF375F', rating: 4.9, reviews: 1823, accent: '#FF375F', gradient: 'from-red-900/30 to-star-black', emoji: '🎁', desc: 'Star Mat Pro + Resistance Bands + Mat Bag. Everything to begin.', features: ['Mat Pro', 'Band Set', 'Mat Bag', 'Free Shipping'] },
  { id: 9, name: 'Elite Bundle', price: 289, originalPrice: 378, category: 'Bundles', badge: 'Most Value', badgeColor: '#FFD700', rating: 5.0, reviews: 641, accent: '#FFD700', gradient: 'from-yellow-900/50 to-star-black', emoji: '👑', desc: 'Everything in Starter + Foam Roller + Yoga Blocks + Water Bottle.', features: ['All Accessories', 'Priority Ship', '1-Year Warranty', 'Free Class Month'] },
  // Apparel
  { id: 10, name: 'Performance Tee', price: 45, originalPrice: null, category: 'Apparel', badge: 'Bestseller', badgeColor: '#007AFF', rating: 4.8, reviews: 1102, accent: '#007AFF', gradient: 'from-blue-900/40 to-star-black', emoji: '👕', desc: 'Ultra-soft, sweat-wicking tee with embossed star on the chest.', features: ['Moisture-Wick', 'Star Logo', 'Unisex Fit', '4 Colors'] },
  { id: 11, name: 'High-Rise Leggings', price: 85, originalPrice: null, category: 'Apparel', badge: 'New', badgeColor: '#30D158', rating: 4.9, reviews: 876, accent: '#BF5AF2', gradient: 'from-purple-900/40 to-star-black', emoji: '👖', desc: 'Second-skin fit. Hidden pocket, seamless waistband, squat-proof.', features: ['4-Way Stretch', 'Hidden Pocket', 'Squat-Proof', 'High-Rise'] },
  { id: 12, name: 'Sports Bra', price: 55, originalPrice: null, category: 'Apparel', badge: null, badgeColor: null, rating: 4.7, reviews: 654, accent: '#FF6B9D', gradient: 'from-pink-900/30 to-star-black', emoji: '🩱', desc: 'Medium-impact support with removable pad and racerback design.', features: ['Med. Support', 'Removable Pad', 'Racerback', '3 Colors'] },
  { id: 13, name: 'Training Shorts', price: 65, originalPrice: null, category: 'Apparel', badge: null, badgeColor: null, rating: 4.6, reviews: 432, accent: '#8E8E93', gradient: 'from-gray-800/40 to-star-black', emoji: '🩳', desc: '5" inseam, built-in liner, elastic waistband with drawstring.', features: ['5" Inseam', 'Built-in Liner', 'Drawstring', 'Recycled Poly'] },
  { id: 14, name: 'Zip-Up Hoodie', price: 95, originalPrice: null, category: 'Apparel', badge: 'Limited', badgeColor: '#FF9F0A', rating: 4.8, reviews: 389, accent: '#FF9F0A', gradient: 'from-orange-900/30 to-star-black', emoji: '🧥', desc: 'Brushed interior, star-embroidered chest, thumb holes.', features: ['French Terry', 'Thumb Holes', 'Star Embroidery', '2 Colors'] },
  { id: 15, name: 'Star Training Cap', price: 35, originalPrice: null, category: 'Apparel', badge: null, badgeColor: null, rating: 4.5, reviews: 287, accent: '#FFD700', gradient: 'from-yellow-900/20 to-star-black', emoji: '🧢', desc: '6-panel cap with embroidered gold star logo. One size fits most.', features: ['Cotton Twill', 'Gold Star', 'Structured', 'One Size'] },
]

export default function Shop() {
  const [active, setActive] = useState('All')
  const [wishlist, setWishlist] = useState(new Set())
  const [addedId, setAddedId] = useState(null)
  const { addItem } = useCart()

  const filtered = active === 'All' ? products : products.filter((p) => p.category === active)

  const handleAdd = (product) => {
    addItem({ id: product.id, name: product.name, price: product.price, accent: product.accent, emoji: product.emoji })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1800)
  }

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <section className="section-padding py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] rounded-full bg-star-blue/8 blur-[80px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10">
          <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-3">Everything Star Fitness</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Gear & <span className="text-gradient-blue">Apparel</span>
          </h1>
          <p className="text-star-grey text-lg max-w-xl mx-auto">
            Premium mats, accessories, and performance apparel — all in one place.
          </p>
        </motion.div>
      </section>

      {/* Filter tabs */}
      <div className="section-padding mb-10">
        <div className="flex gap-2 flex-wrap justify-center">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActive(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                active === cat
                  ? 'bg-star-blue text-white shadow-lg shadow-star-blue/30'
                  : 'glass text-star-grey hover:text-white border border-star-border'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="section-padding mb-6 max-w-7xl mx-auto">
        <p className="text-star-grey text-sm">
          Showing <span className="text-white font-semibold">{filtered.length}</span> products
        </p>
      </div>

      {/* Product Grid */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="card-hover"
                >
                  <div className={`relative rounded-2xl border border-star-border bg-gradient-to-b ${product.gradient} p-5 flex flex-col h-full`}>
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold text-star-black" style={{ backgroundColor: product.badgeColor }}>
                        {product.badge}
                      </div>
                    )}
                    {/* Wishlist */}
                    <button onClick={() => toggleWishlist(product.id)} className="absolute top-4 left-4 w-7 h-7 rounded-full glass border border-white/10 flex items-center justify-center">
                      <Heart size={12} fill={wishlist.has(product.id) ? '#FF375F' : 'none'} className={wishlist.has(product.id) ? 'text-red-400' : 'text-star-grey'} />
                    </button>

                    {/* Visual */}
                    <div className="relative h-36 mb-4 rounded-xl overflow-hidden flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <motion.span
                          animate={{ y: [-6, 6, -6] }}
                          transition={{ duration: 4 + (i % 3) * 0.7, repeat: Infinity, ease: 'easeInOut' }}
                          className="text-6xl"
                        >
                          {product.emoji}
                        </motion.span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className="text-star-grey text-xs font-semibold uppercase tracking-wider mb-1">{product.category}</p>
                      <h3 className="text-white font-bold text-base mb-1">{product.name}</h3>
                      <p className="text-star-grey text-sm mb-3 leading-relaxed">{product.desc}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.features.map((f) => (
                          <span key={f} className="px-2 py-0.5 rounded-full bg-white/5 text-star-grey text-xs border border-white/8">{f}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} size={11} fill={idx < Math.floor(product.rating) ? '#FFD700' : 'none'} className={idx < Math.floor(product.rating) ? 'text-star-yellow' : 'text-star-grey'} />
                          ))}
                        </div>
                        <span className="text-star-grey text-xs">({product.reviews.toLocaleString()})</span>
                      </div>
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/8">
                      <div>
                        <span className="text-white font-black text-xl">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-star-grey text-sm line-through ml-2">${product.originalPrice}</span>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleAdd(product)}
                        className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ${
                          addedId === product.id
                            ? 'bg-green-500 text-white'
                            : 'bg-star-blue text-white hover:shadow-lg hover:shadow-star-blue/40'
                        }`}
                      >
                        {addedId === product.id ? <><Check size={12} /> Added</> : '+ Add'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ── ONE-SHEET SHOWCASE ── */}
      <div className="section-padding mt-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-star-grey text-sm tracking-widest uppercase mb-3">Product Details</p>
            <h2 className="text-4xl font-black">See the Star Mat <span className="text-gradient-yellow">Up Close</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="rounded-3xl overflow-hidden border border-star-border bg-star-card"
            >
              <img src="/images/mat-onesheet-specs.png" alt="Star Mat — all angles and specifications" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="rounded-3xl overflow-hidden border border-star-border bg-star-card"
            >
              <img src="/images/mat-onesheet-scale.png" alt="Star Mat — size and scale reference" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Guarantee */}
      <div className="section-padding mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto glass rounded-3xl p-10 text-center border border-star-blue/20"
        >
          <LogoIcon size={40} className="mx-auto mb-4" />
          <h3 className="text-2xl font-black mb-2">30-Day Star Guarantee</h3>
          <p className="text-star-grey max-w-lg mx-auto">Not in love? Return it, no questions asked.</p>
        </motion.div>
      </div>
    </main>
  )
}

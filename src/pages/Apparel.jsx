import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, Check } from 'lucide-react'

const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories']

const apparel = [
  {
    id: 1,
    name: 'Star Logo Performance Tee',
    price: 45,
    category: 'Tops',
    colors: ['#0A0A0A', '#007AFF', '#FFFFFF'],
    badge: 'Bestseller',
    badgeColor: '#007AFF',
    material: 'Moisture-Wicking Blend',
    gradient: 'from-blue-900/40 to-star-black',
    accent: '#007AFF',
    desc: 'Ultra-soft, sweat-wicking tee with an embossed star on the chest.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 2,
    name: 'High-Rise Training Leggings',
    price: 85,
    category: 'Bottoms',
    colors: ['#0A0A0A', '#1a1a2e', '#FFD700'],
    badge: 'New',
    badgeColor: '#30D158',
    material: '4-Way Stretch',
    gradient: 'from-purple-900/40 to-star-black',
    accent: '#BF5AF2',
    desc: 'Second-skin fit. Hidden pocket, seamless waistband, squat-proof fabric.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 3,
    name: 'Star Sports Bra',
    price: 55,
    category: 'Tops',
    colors: ['#0A0A0A', '#FF375F', '#30D158'],
    badge: null,
    badgeColor: null,
    material: 'Compression Knit',
    gradient: 'from-pink-900/30 to-star-black',
    accent: '#FF6B9D',
    desc: 'Medium-impact support with a removable pad and racerback design.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 4,
    name: 'Elite Training Shorts',
    price: 65,
    category: 'Bottoms',
    colors: ['#0A0A0A', '#1a1a2e', '#3a3a3a'],
    badge: null,
    badgeColor: null,
    material: 'Recycled Polyester',
    gradient: 'from-gray-800/40 to-star-black',
    accent: '#8E8E93',
    desc: '5" inseam, built-in brief liner, elastic waistband with drawstring.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 5,
    name: 'Star Zip-Up Hoodie',
    price: 95,
    category: 'Outerwear',
    colors: ['#0A0A0A', '#1a2040', '#2d1a1a'],
    badge: 'Limited',
    badgeColor: '#FF9F0A',
    material: 'French Terry',
    gradient: 'from-orange-900/30 to-star-black',
    accent: '#FF9F0A',
    desc: 'Warm-up in style. Brushed interior, star-embroidered chest, thumb holes.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 6,
    name: 'Compression Long Sleeve',
    price: 72,
    category: 'Tops',
    colors: ['#0A0A0A', '#007AFF', '#FF375F'],
    badge: null,
    badgeColor: null,
    material: 'Compression Fabric',
    gradient: 'from-cyan-900/30 to-star-black',
    accent: '#64D2FF',
    desc: 'Muscle-mapping seams for targeted compression and full range of motion.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 7,
    name: 'Star Training Cap',
    price: 35,
    category: 'Accessories',
    colors: ['#0A0A0A', '#1a2040', '#FFD700'],
    badge: null,
    badgeColor: null,
    material: 'Cotton Twill',
    gradient: 'from-yellow-900/20 to-star-black',
    accent: '#FFD700',
    desc: 'Structured 6-panel cap with embroidered gold star logo. One size fits most.',
    sizes: ['One Size'],
  },
  {
    id: 8,
    name: 'Headband 3-Pack',
    price: 25,
    category: 'Accessories',
    colors: ['#0A0A0A', '#007AFF', '#FFD700'],
    badge: null,
    badgeColor: null,
    material: 'Non-Slip Fabric',
    gradient: 'from-green-900/20 to-star-black',
    accent: '#30D158',
    desc: 'Moisture-wicking, non-slip headbands. Three colorways per pack.',
    sizes: ['One Size'],
  },
]

const ColorSwatch = ({ color }) => (
  <div
    className="w-4 h-4 rounded-full border border-white/20 cursor-pointer hover:scale-125 transition-transform"
    style={{ backgroundColor: color }}
    title={color}
  />
)

export default function Apparel() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [wishlist, setWishlist] = useState(new Set())
  const [addedId, setAddedId] = useState(null)
  const [selectedSizes, setSelectedSizes] = useState({})

  const filtered = activeCategory === 'All'
    ? apparel
    : apparel.filter((a) => a.category === activeCategory)

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleAdd = (id) => {
    setAddedId(id)
    setTimeout(() => setAddedId(null), 1800)
  }

  const setSize = (id, size) => {
    setSelectedSizes((prev) => ({ ...prev, [id]: size }))
  }

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <section className="section-padding py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 left-1/3 w-[50vw] h-[30vw] rounded-full bg-star-yellow/5 blur-[100px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl"
        >
          <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-3">Star Apparel</p>
          <h1 className="text-5xl md:text-6xl font-black mb-5">
            Wear Your <span className="text-gradient-yellow">Standard.</span>
          </h1>
          <p className="text-star-grey text-lg leading-relaxed">
            Premium performance apparel engineered for every rep, stretch, and sprint.
            Designed to move with you, not against you.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <div className="section-padding mb-10">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-star-yellow text-star-black shadow-lg shadow-star-yellow/20'
                  : 'glass text-star-grey hover:text-white border border-star-border'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="card-hover"
                >
                  <div className={`rounded-2xl border border-star-border bg-gradient-to-b ${item.gradient} overflow-hidden`}>
                    {/* Visual panel */}
                    <div className="relative h-52 flex items-center justify-center overflow-hidden p-6">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-star-black/30" />

                      {/* Abstract clothing shape */}
                      <div
                        className="w-28 h-28 rounded-2xl flex items-center justify-center font-black text-4xl"
                        style={{
                          backgroundColor: `${item.accent}15`,
                          border: `1px solid ${item.accent}30`,
                        }}
                      >
                        {item.category === 'Tops' && '👕'}
                        {item.category === 'Bottoms' && '👖'}
                        {item.category === 'Outerwear' && '🧥'}
                        {item.category === 'Accessories' && '🧢'}
                      </div>

                      {/* Wishlist */}
                      <motion.button
                        onClick={() => toggleWishlist(item.id)}
                        whileTap={{ scale: 0.85 }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center"
                      >
                        <Heart
                          size={14}
                          fill={wishlist.has(item.id) ? '#FF375F' : 'none'}
                          className={wishlist.has(item.id) ? 'text-red-400' : 'text-star-grey'}
                        />
                      </motion.button>

                      {/* Badge */}
                      {item.badge && (
                        <div
                          className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-bold text-black"
                          style={{ backgroundColor: item.badgeColor }}
                        >
                          {item.badge}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="text-white font-bold leading-tight">{item.name}</h3>
                        <span className="text-white font-black text-lg whitespace-nowrap">${item.price}</span>
                      </div>
                      <p className="text-star-grey text-xs mb-1">{item.material}</p>
                      <p className="text-star-grey text-sm mb-4 leading-relaxed">{item.desc}</p>

                      {/* Colors */}
                      <div className="flex gap-1.5 mb-4">
                        {item.colors.map((c) => (
                          <ColorSwatch key={c} color={c} />
                        ))}
                      </div>

                      {/* Sizes */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSize(item.id, size)}
                            className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                              selectedSizes[item.id] === size
                                ? 'border-star-blue bg-star-blue/20 text-white'
                                : 'border-star-border text-star-grey hover:border-white/30'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>

                      {/* Add to cart */}
                      <motion.button
                        onClick={() => handleAdd(item.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                          addedId === item.id
                            ? 'bg-green-500 text-white'
                            : 'bg-star-blue/10 border border-star-blue/30 text-star-blue hover:bg-star-blue hover:text-white'
                        }`}
                      >
                        {addedId === item.id ? (
                          <>
                            <Check size={15} /> Added to Cart
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={15} /> Add to Cart
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Materials Banner */}
      <div className="section-padding mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto glass rounded-3xl p-10 md:p-14 border border-star-border overflow-hidden relative"
        >
          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
            <svg width="300" height="300" viewBox="0 0 50 50" fill="#FFD700">
              <polygon points="25,3 31,18 47,18 35,29 39,45 25,37 11,45 15,29 3,18 19,18" />
            </svg>
          </div>
          <div className="relative z-10">
            <p className="text-star-yellow text-sm font-semibold tracking-widest uppercase mb-3">Materials</p>
            <h3 className="text-3xl font-black mb-4">Built for Performance, Designed to Last</h3>
            <p className="text-star-grey max-w-xl mb-8">
              Every Star Fitness garment is made with recycled or sustainably sourced fabrics.
              Durable enough for daily training. Soft enough to sleep in.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                ['Recycled Poly', '40% of all garments'],
                ['Anti-Odor Tech', 'Stay fresh longer'],
                ['4-Way Stretch', 'Full range of motion'],
                ['Quick-Dry', 'Wicks in seconds'],
              ].map(([title, sub]) => (
                <div key={title}>
                  <p className="text-white font-semibold mb-1">{title}</p>
                  <p className="text-star-grey text-sm">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

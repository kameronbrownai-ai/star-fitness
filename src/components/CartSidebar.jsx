import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import CompassStar from './CompassStar'

export default function CartSidebar() {
  const { items, open, setOpen, total, count, removeItem, increment, decrement, clearCart } = useCart()

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-star-dark border-l border-star-border z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-star-border">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-star-blue" />
                <h2 className="text-white font-bold text-lg">Your Cart</h2>
                {count > 0 && (
                  <span className="w-5 h-5 rounded-full bg-star-blue text-white text-xs font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button onClick={clearCart} className="text-star-grey hover:text-red-400 text-xs transition-colors">
                    Clear all
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-star-grey hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <ShoppingBag size={48} className="text-star-border mb-4" />
                    <p className="text-white font-semibold mb-2">Your cart is empty</p>
                    <p className="text-star-grey text-sm mb-6">Add something to get started.</p>
                    <button
                      onClick={() => setOpen(false)}
                      className="btn-primary text-sm py-3 px-6"
                    >
                      Browse Shop
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 p-4 rounded-xl bg-star-card border border-star-border"
                    >
                      {/* Icon */}
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                        style={{ backgroundColor: `${item.accent || '#007AFF'}15`, border: `1px solid ${item.accent || '#007AFF'}30` }}
                      >
                        {item.emoji || <CompassStar size={24} color={item.accent || '#FFD700'} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                        <p className="text-star-grey text-xs mb-2">${item.price} each</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decrement(item.id)}
                              className="w-6 h-6 rounded-full border border-star-border flex items-center justify-center text-star-grey hover:text-white hover:border-white/30 transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-white text-sm font-semibold w-4 text-center">{item.qty}</span>
                            <button
                              onClick={() => increment(item.id)}
                              className="w-6 h-6 rounded-full border border-star-border flex items-center justify-center text-star-grey hover:text-white hover:border-white/30 transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-white font-bold text-sm">${(item.price * item.qty).toFixed(2)}</span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-star-grey hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-star-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-star-grey">Subtotal</span>
                  <span className="text-white font-black text-xl">${total.toFixed(2)}</span>
                </div>
                <p className="text-star-grey text-xs text-center">Shipping & taxes calculated at checkout</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full btn-primary justify-center py-4"
                >
                  Checkout
                  <ArrowRight size={18} />
                </motion.button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-full text-center text-star-grey hover:text-white text-sm transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

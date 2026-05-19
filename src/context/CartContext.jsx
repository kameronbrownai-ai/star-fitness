import { createContext, useContext, useReducer, useEffect, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'starfitness_cart'

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find((i) => i.id === action.item.id)
      if (exists) {
        return state.map((i) =>
          i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...state, { ...action.item, qty: 1 }]
    }
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id)
    case 'INCREMENT':
      return state.map((i) => (i.id === action.id ? { ...i, qty: i.qty + 1 } : i))
    case 'DECREMENT':
      return state
        .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    case 'CLEAR':
      return []
    case 'INIT':
      return action.items
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  const [open, setOpen] = useState(false)

  // Restore cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (saved.length) dispatch({ type: 'INIT', items: saved })
    } catch {}
  }, [])

  // Persist cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item) => {
    dispatch({ type: 'ADD', item })
    setOpen(true)
  }

  const removeItem = (id) => dispatch({ type: 'REMOVE', id })
  const increment = (id) => dispatch({ type: 'INCREMENT', id })
  const decrement = (id) => dispatch({ type: 'DECREMENT', id })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, count, total, open, setOpen, addItem, removeItem, increment, decrement, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

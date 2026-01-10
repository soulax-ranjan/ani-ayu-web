import { create } from 'zustand'
import { CartItem, Product } from '@/types/product'

interface CartStore {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  
  addItem: (product: Product, size: string, quantity?: number) => void
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: string, size: string) => number
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  addItem: (product: Product, size: string, quantity: number = 1) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && item.size === size
      )

      let updatedItems: CartItem[]
      
      if (existingItemIndex >= 0) {
        // Update existing item
        updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += quantity
      } else {
        // Add new item
        updatedItems = [...state.items, { product, size, quantity }]
      }

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

      return {
        items: updatedItems,
        totalItems,
        totalPrice
      }
    })
  },

  removeItem: (productId: string, size: string) => {
    set((state) => {
      const updatedItems = state.items.filter(
        item => !(item.product.id === productId && item.size === size)
      )
      
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

      return {
        items: updatedItems,
        totalItems,
        totalPrice
      }
    })
  },

  updateQuantity: (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId, size)
      return
    }

    set((state) => {
      const updatedItems = state.items.map(item => {
        if (item.product.id === productId && item.size === size) {
          return { ...item, quantity }
        }
        return item
      })

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

      return {
        items: updatedItems,
        totalItems,
        totalPrice
      }
    })
  },

  clearCart: () => {
    set({
      items: [],
      totalItems: 0,
      totalPrice: 0
    })
  },

  getItemQuantity: (productId: string, size: string) => {
    const item = get().items.find(
      item => item.product.id === productId && item.size === size
    )
    return item ? item.quantity : 0
  }
}))

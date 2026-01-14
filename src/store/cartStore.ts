import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { CartItem, Product } from '@/types/product'
import { CartTotals, ShippingMethod } from '@/types/checkout'

// Utility functions
const generateGuestId = () => {
  return 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

const calculateTotals = (items: CartItem[], shippingCost: number = 0, taxRate: number = 0.18): CartTotals => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shipping = shippingCost
  const tax = subtotal * taxRate
  const discount = 0 // Can be implemented later
  const total = subtotal + shipping + tax - discount
  
  return {
    subtotal,
    shipping,
    tax,
    discount,
    total
  }
}

interface CartStore {
  // Core cart state
  guestId: string
  items: CartItem[]
  totals: CartTotals
  selectedShipping: ShippingMethod | null
  isLoading: boolean
  totalItems: number
  
  // Cart actions
  addItem: (product: Product, size: string, quantity?: number) => void
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: string, size: string) => number
  
  // Shipping actions
  setShipping: (shipping: ShippingMethod) => void
  
  // Utility actions
  initializeGuestSession: () => void
  recalculateTotals: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    subscribeWithSelector((set, get) => ({
      // Initial state
      guestId: '',
      items: [],
      totals: {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: 0
      },
      selectedShipping: null,
      isLoading: false,
      totalItems: 0,

      // Initialize guest session
      initializeGuestSession: () => {
        set((state) => {
          if (!state.guestId) {
            return { guestId: generateGuestId() }
          }
          return state
        })
      },

      // Recalculate totals
      recalculateTotals: () => {
        set((state) => {
          const shippingCost = state.selectedShipping?.cost || 0
          const totals = calculateTotals(state.items, shippingCost)
          return { totals }
        })
      },

      addItem: (product: Product, size: string, quantity: number = 1) => {
        set((state) => {
          // Ensure guest session exists
          const guestId = state.guestId || generateGuestId()
          
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
            const newItem: CartItem = {
              id: `${product.id}-${size}-${Date.now()}`,
              product,
              size,
              quantity,
              price: product.price // Lock in current price
            }
            updatedItems = [...state.items, newItem]
          }

          const shippingCost = state.selectedShipping?.cost || 0
          const totals = calculateTotals(updatedItems, shippingCost)
          const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

          return {
            guestId,
            items: updatedItems,
            totals,
            totalItems
          }
        })
      },

      removeItem: (productId: string, size: string) => {
        set((state) => {
          const updatedItems = state.items.filter(
            item => !(item.product.id === productId && item.size === size)
          )
          
          const shippingCost = state.selectedShipping?.cost || 0
          const totals = calculateTotals(updatedItems, shippingCost)
          const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

          return {
            items: updatedItems,
            totals,
            totalItems
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

          const shippingCost = state.selectedShipping?.cost || 0
          const totals = calculateTotals(updatedItems, shippingCost)
          const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

          return {
            items: updatedItems,
            totals,
            totalItems
          }
        })
      },

      setShipping: (shipping: ShippingMethod) => {
        set((state) => {
          const totals = calculateTotals(state.items, shipping.cost)
          return {
            selectedShipping: shipping,
            totals
          }
        })
      },

      clearCart: () => {
        set({
          items: [],
          totals: {
            subtotal: 0,
            shipping: 0,
            tax: 0,
            discount: 0,
            total: 0
          },
          selectedShipping: null,
          totalItems: 0
        })
      },

      getItemQuantity: (productId: string, size: string) => {
        const item = get().items.find(
          item => item.product.id === productId && item.size === size
        )
        return item ? item.quantity : 0
      }
    })),
    {
      name: 'ani-ayu-cart-storage',
      partialize: (state) => ({
        guestId: state.guestId,
        items: state.items,
        totals: state.totals,
        selectedShipping: state.selectedShipping,
        totalItems: state.totalItems
      })
    }
  )
)

// Initialize guest session on first load
if (typeof window !== 'undefined') {
  useCartStore.getState().initializeGuestSession()
}

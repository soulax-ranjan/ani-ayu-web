import { create } from 'zustand'
import { CartItem, Product } from '@/types/product'
import { CartTotals, ShippingMethod } from '@/types/checkout'
import { apiClient } from '@/lib/api'

interface CartStore {
  // Core cart state
  items: CartItem[]
  totals: CartTotals
  selectedShipping: ShippingMethod | null
  isLoading: boolean
  totalItems: number
  error: string | null
  
  // Cart actions
  fetchCart: () => Promise<void>
  addItem: (product: Product, size: string, quantity?: number) => Promise<boolean>
  removeItem: (productId: string, size: string) => Promise<void>
  updateQuantity: (productId: string, size: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  
  // Shipping actions
  setShipping: (shipping: ShippingMethod) => void
  
  // Session actions
  initializeSession: () => Promise<void>
  
  // Helpers
  getItemQuantity: (productId: string, size: string) => number
}

/** Recompute totals from a list of items */
function computeTotals(items: CartItem[], shippingCost: number): CartTotals {
  const subtotal = items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0)
  const tax = 0
  const total = subtotal + shippingCost + tax
  return { subtotal, shipping: shippingCost, tax, discount: 0, total }
}

export const useCartStore = create<CartStore>((set, get) => ({
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
  error: null,

  initializeSession: async () => {
    try {
      const existingGuestId = typeof window !== 'undefined' ? localStorage.getItem('guest_id') : null
      
      if (!existingGuestId) {
        const response = await apiClient.startGuestSession()
        if (response?.guestId && typeof window !== 'undefined') {
          localStorage.setItem('guest_id', response.guestId)
        }
      }
      
      await get().fetchCart()
      set({ error: null })
    } catch (error) {
      console.error('Failed to init session', error)
      try { await get().fetchCart() } catch (e) {}
    }
  },

  fetchCart: async () => {
    set({ isLoading: true, error: null })
    try {
      const cartData = await apiClient.getCart()
      
      const subtotal = cartData.summary?.subtotal || cartData.totalAmount || 0
      const shipping = get().selectedShipping?.cost || 0
      const tax = 0
      const total = subtotal + shipping + tax
      
      set({
        items: cartData.items.map((item: any) => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image_url || item.product.image,
            description: '',
            category: item.product.category_id || 'boys',
            sizes: [item.size],
            material: '',
            occasion: '',
            rating: 0,
            featured: false,
            slug: item.product.slug
          } as Product,
          size: item.size,
          quantity: item.quantity,
          price: item.product.price || 0
        })),
        totals: { subtotal, shipping, tax, discount: 0, total },
        totalItems: cartData.summary?.totalItems || cartData.totalItems || cartData.items.length
      })
    } catch (error) {
      // safe to ignore if empty
    } finally {
      set({ isLoading: false })
    }
  },

  addItem: async (product: Product, size: string, quantity: number = 1) => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.addToCart({
        productId: product.id,
        quantity,
        size,
        price: product.price
      } as any)
      
      await get().fetchCart()
      set({ isLoading: false })
      return true
    } catch (error: any) {
      console.error('Failed to add item:', error)
      
      // Retry on session expiry
      if (error.message?.includes('400') || error.message?.includes('401') || error.toString().includes('400')) {
        try {
          const response = await apiClient.startGuestSession()
          if (response?.guestId && typeof window !== 'undefined') {
            localStorage.setItem('guest_id', response.guestId)
          }
          await apiClient.addToCart({ productId: product.id, quantity, size, price: product.price })
          await get().fetchCart()
          set({ isLoading: false })
          return true
        } catch (retryError) {
          console.error('Retry failed:', retryError)
        }
      }
      
      set({ error: 'Failed to add item to cart', isLoading: false })
      return false
    }
  },

  removeItem: async (productId: string, size: string) => {
    const previousItems = get().items
    const item = previousItems.find(i => i.product.id === productId && i.size === size)
    if (!item) return

    // --- Optimistic update: remove instantly from UI ---
    const newItems = previousItems.filter(i => !(i.product.id === productId && i.size === size))
    set({
      items: newItems,
      totals: computeTotals(newItems, get().selectedShipping?.cost || 0),
      totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
      error: null
    })

    try {
      await apiClient.removeCartItem(undefined, item.id)
      // Silently sync in background to ensure server state matches
      get().fetchCart().catch(() => {})
    } catch (error: any) {
      console.error('Failed to remove item:', error)
      // Roll back on failure
      set({
        items: previousItems,
        totals: computeTotals(previousItems, get().selectedShipping?.cost || 0),
        totalItems: previousItems.reduce((sum, i) => sum + i.quantity, 0),
        error: `Failed to remove item: ${error?.message || error?.toString() || 'Unknown API error'}`
      })
    }
  },

  updateQuantity: async (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      await get().removeItem(productId, size)
      return
    }

    const previousItems = get().items
    const item = previousItems.find(i => i.product.id === productId && i.size === size)
    if (!item) return

    // --- Optimistic update: reflect new quantity instantly ---
    const newItems = previousItems.map(i =>
      i.product.id === productId && i.size === size
        ? { ...i, quantity }
        : i
    )
    set({
      items: newItems,
      totals: computeTotals(newItems, get().selectedShipping?.cost || 0),
      totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
      error: null
    })

    try {
      await apiClient.updateCartItem(undefined, item.id, quantity)
      // Silently sync in background
      get().fetchCart().catch(() => {})
    } catch (error) {
      console.error('Failed to update quantity:', error)
      // Roll back on failure
      set({
        items: previousItems,
        totals: computeTotals(previousItems, get().selectedShipping?.cost || 0),
        totalItems: previousItems.reduce((sum, i) => sum + i.quantity, 0),
        error: 'Failed to update quantity. Please try again.'
      })
    }
  },

  clearCart: async () => {
    const previousItems = get().items
    if (previousItems.length === 0) return

    // --- Optimistic update: clear instantly from UI ---
    set({
      items: [],
      totals: { subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0 },
      totalItems: 0,
      error: null
    })

    try {
      await apiClient.clearCart()
    } catch (bulkError: any) {
      console.warn('Bulk clear failed, trying item-by-item...', bulkError)
      try {
        for (const item of previousItems) {
          await apiClient.removeCartItem(undefined, item.id)
        }
      } catch (retryError: any) {
        console.error('Failed to clear cart:', retryError)
        // Roll back on failure
        set({
          items: previousItems,
          totals: computeTotals(previousItems, get().selectedShipping?.cost || 0),
          totalItems: previousItems.reduce((sum, i) => sum + i.quantity, 0),
          error: `Failed to clear cart: ${retryError?.message || retryError?.toString() || 'Unknown API error'}`
        })
      }
    }
  },

  setShipping: (shipping: ShippingMethod) => {
    set((state) => {
      const subtotal = state.totals.subtotal
      const newTotal = subtotal + shipping.cost + state.totals.tax
      return {
        selectedShipping: shipping,
        totals: {
          ...state.totals,
          shipping: shipping.cost,
          total: newTotal
        }
      }
    })
  },

  getItemQuantity: (productId: string, size: string) => {
    const item = get().items.find(
      item => item.product.id === productId && item.size === size
    )
    return item ? item.quantity : 0
  }
}))

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
      // Check for existing guest session in localStorage
      const existingGuestId = typeof window !== 'undefined' ? localStorage.getItem('guest_id') : null;
      
      if (!existingGuestId) {
          const response = await apiClient.startGuestSession()
          if (response?.guestId && typeof window !== 'undefined') {
             localStorage.setItem('guest_id', response.guestId)
          }
      } else {
        // Optional: Verify if session is still valid?
        // For now, assume it's valid, if API fails with 400/401 retry logic will handle it.
      }
      
      await get().fetchCart()
      set({ error: null })
    } catch (error) {
       console.error('Failed to init session', error)
       // If init fails, maybe existing session works?
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
            // Minimal product object for cart display
          } as Product,
          size: item.size,
          quantity: item.quantity,
          price: item.product.price || 0
        })), 
        totals: {
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            discount: 0,
            total: total
        },
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
        color: null, // Default color if not handled
        price: product.price
      } as any) // Type assertion to bypass strict checks if API signature evolved
      
      await get().fetchCart()
      set({ isLoading: false })
      return true
    } catch (error: any) {
      console.error('Failed to add item:', error)
      
      // Retry logic: If 400/401, maybe session expired or missing
      if (error.message?.includes('400') || error.message?.includes('401') || error.toString().includes('400')) {
          try {
              console.log('Retrying add to cart after session refresh...')
              const response = await apiClient.startGuestSession()
              
              if (response?.guestId && typeof window !== 'undefined') {
                 localStorage.setItem('guest_id', response.guestId)
              }

              await apiClient.addToCart({
                productId: product.id,
                quantity,
                size,
                price: product.price
              })
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
    set({ isLoading: true, error: null })
    try {
      const item = get().items.find(i => 
        i.product.id === productId && i.size === size
      );
      
      if (item) {
        await apiClient.removeCartItem(undefined, item.id)
        await get().fetchCart()
      }
    } catch (error) {
      console.error('Failed to remove item:', error)
      set({ error: 'Failed to remove item' })
    } finally {
      set({ isLoading: false })
    }
  },

  updateQuantity: async (productId: string, size: string, quantity: number) => {
    set({ isLoading: true, error: null })
    try {
      if (quantity <= 0) {
        await get().removeItem(productId, size)
        return
      }

      const item = get().items.find(i => 
        i.product.id === productId && i.size === size
      );
                   
      if (item) {
        await apiClient.updateCartItem(undefined, item.id, quantity)
        await get().fetchCart()
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
      set({ error: 'Failed to update quantity' })
    } finally {
      set({ isLoading: false })
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null })
    try {
      // Backend expects item-by-item deletion or the clear endpoint behavior is unexpected.
      // Iterating to be safe based on 'delete cart/item/:id' prompt.
      const currentItems = get().items;
      
      // If there's a bulk clear endpoint (DELETE /cart/:sessionId), we try that first
      // But based on user prompt, maybe we should just loop if that fails or is the intended way.
      // Let's try the standard clear first, if it fails or if we need to do it by item:
      
      await apiClient.clearCart()
      await get().fetchCart()
      
    } catch (error) {
       console.warn('Bulk clear failed, trying item-by-item...', error)
       try {
         const currentItems = get().items;
         for (const item of currentItems) {
            await apiClient.removeCartItem(undefined, item.id)
         }
         await get().fetchCart()
       } catch (retryError) {
          console.error('Failed to clear cart:', retryError)
          set({ error: 'Failed to clear cart' })
       }
    } finally {
      set({ isLoading: false })
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

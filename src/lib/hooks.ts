'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  apiClient,
  type Product,
  type Category,
  type Cart,
  type HomepageData,
  type Banner,
  type TopPick,
  type BestSeller,
  type Testimonial,
  type BusinessStats,
  getSessionId
} from './api'

// Generic hook for API calls with loading and error states
export function useAPI<T>(
  apiCall: () => Promise<T>,
  dependencies: ReadonlyArray<unknown> = []
): {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
} {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, dependencies) // Remove apiCall from dependencies to prevent infinite loops

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Homepage hooks
export function useHomepageData() {
  const fetchData = useCallback(() => apiClient.getHomepageData(), [])
  return useAPI<HomepageData>(fetchData)
}

export function useBanners() {
  const fetchData = useCallback(() => apiClient.getBanners(), [])
  return useAPI<{ banners: Banner[] }>(fetchData)
}

export function useTopPicks() {
  const fetchData = useCallback(() => apiClient.getTopPicks(), [])
  return useAPI<{ topPicks: TopPick[] }>(fetchData)
}

export function useBestSellers(limit?: number) {
  const fetchData = useCallback(() => apiClient.getBestSellers(limit), [limit])
  return useAPI<{ bestSellers: BestSeller[] }>(fetchData, [limit])
}

export function useTestimonials(limit?: number, featured?: boolean) {
  const fetchData = useCallback(() => apiClient.getTestimonials(limit, featured), [limit, featured])
  return useAPI<{ testimonials: Testimonial[] }>(fetchData, [limit, featured])
}

export function useStats() {
  const fetchData = useCallback(() => apiClient.getStats(), [])
  return useAPI<{ stats: BusinessStats }>(fetchData)
}

// Product hooks
export function useProducts(params?: Parameters<typeof apiClient.getProducts>[0]) {
  const fetchData = useCallback(() => apiClient.getProducts(params), [JSON.stringify(params)])
  return useAPI(fetchData, [JSON.stringify(params)])
}

export function useProduct(id: string) {
  const fetchData = useCallback(() => apiClient.getProduct(id), [id])
  return useAPI<Product>(fetchData, [id])
}

export function useRelatedProducts(id: string) {
  const fetchData = useCallback(() => apiClient.getRelatedProducts(id), [id])
  return useAPI<{ products: Product[] }>(fetchData, [id])
}

// Category hooks
export function useCategories() {
  const fetchData = useCallback(() => apiClient.getCategories(), [])
  return useAPI<{ categories: Category[] }>(fetchData)
}

export function useCategory(slug: string) {
  const fetchData = useCallback(() => apiClient.getCategory(slug), [slug])
  return useAPI<Category>(fetchData, [slug])
}

// Cart hooks
export function useCart() {
  const [sessionId] = useState(() => getSessionId())
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const cartData = await apiClient.getCart(sessionId)
      setCart(cartData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart')
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  const addToCart = useCallback(async (
    productId: string,
    size: string,
    quantity: number,
    price: number
  ) => {
    try {
      setError(null)
      await apiClient.addToCart({
        sessionId,
        productId,
        size,
        quantity,
        price
      })
      await fetchCart() // Refresh cart after adding
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart')
      return false
    }
  }, [sessionId, fetchCart])

  const updateCartItem = useCallback(async (itemId: string, quantity: number) => {
    try {
      setError(null)
      await apiClient.updateCartItem(sessionId, itemId, quantity)
      await fetchCart() // Refresh cart after updating
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart')
      return false
    }
  }, [sessionId, fetchCart])

  const removeCartItem = useCallback(async (itemId: string) => {
    try {
      setError(null)
      await apiClient.removeCartItem(sessionId, itemId)
      await fetchCart() // Refresh cart after removing
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item')
      return false
    }
  }, [sessionId, fetchCart])

  const clearCart = useCallback(async () => {
    try {
      setError(null)
      await apiClient.clearCart(sessionId)
      await fetchCart() // Refresh cart after clearing
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart')
      return false
    }
  }, [sessionId, fetchCart])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return {
    cart,
    loading,
    error,
    sessionId,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    refetch: fetchCart
  }
}

// Search hook with debouncing
export function useProductSearch(initialQuery: string = '', debounceMs: number = 300) {
  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<Parameters<typeof apiClient.getProducts>[0]>({})

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs])

  // Fetch products when debounced query or filters change
  const searchParams = {
    ...filters,
    search: debouncedQuery || undefined
  }

  const { data, loading, error, refetch } = useProducts(searchParams)

  return {
    query,
    setQuery,
    filters,
    setFilters,
    products: data?.products || [],
    pagination: data?.pagination,
    availableFilters: data?.filters,
    loading,
    error,
    refetch
  }
}

// Wishlist hook (using localStorage for now)
export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ani_ayu_wishlist')
      if (saved) {
        try {
          setWishlist(JSON.parse(saved))
        } catch {
          setWishlist([])
        }
      }
    }
  }, [])

  const addToWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) return prev
      const newWishlist = [...prev, productId]
      if (typeof window !== 'undefined') {
        localStorage.setItem('ani_ayu_wishlist', JSON.stringify(newWishlist))
      }
      return newWishlist
    })
  }, [])

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      const newWishlist = prev.filter(id => id !== productId)
      if (typeof window !== 'undefined') {
        localStorage.setItem('ani_ayu_wishlist', JSON.stringify(newWishlist))
      }
      return newWishlist
    })
  }, [])

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId)
  }, [wishlist])

  const toggleWishlist = useCallback((productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(productId)
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist])

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    wishlistCount: wishlist.length
  }
}
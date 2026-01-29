// API configuration and client for Ani & Ayu e-commerce
//const API_BASE_URL = 'https://ani-ayu-api.onrender.com'
const API_BASE_URL = 'https://ani-ayu-api-9b22.onrender.com'

// Enhanced Product API response interface
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  short_description?: string
  category_id: string
  price: number
  original_price?: number
  discount_percent?: number
  currency?: string

  // Images and media
  image_url: string
  images: string[]
  video_url?: string

  // Core product info
  rating: number
  review_count: number
  sizes: string[]
  colors: string[]
  material: string
  occasion: string
  age_range: string
  features: string[]
  in_stock: boolean
  featured: boolean
  section?: number

  // Enhanced fields
  sku?: string
  barcode?: string
  brand?: string
  tags?: string[]
  specifications?: Record<string, any>

  // Inventory
  stock_quantity?: number
  low_stock_threshold?: number

  // Physical attributes
  shipping_weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
    unit?: string
  }

  // Policies and metadata
  return_policy?: string
  warranty?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string[]

  // Status and features
  status?: 'active' | 'inactive' | 'draft' | 'archived'
  customizable?: boolean

  // Category object (populated)
  category?: {
    id: string
    name: string
    slug?: string
  }

  // Timestamps
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  featured: boolean
  product_count?: number
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  size: string
  quantity: number
  image: string
  total: number
  product: Product // Nested product object from API
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  summary?: {
    totalItems: number
    subtotal: number
  }
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  ctaText: string
  ctaLink: string
  backgroundColor: string
  textColor: string
  featured: boolean
  order: number
}

export interface TopPick {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  rating: number
  reviewCount: number
  badge: string
  description: string
}

export interface BestSeller {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  rating: number
  reviewCount: number
  salesCount: number
  rank: number
  description: string
  ageRange: string
}

export interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  review: string
  productName: string
  image: string
  date: string
  verified: boolean
}

export interface BusinessStats {
  totalCustomers: number
  happyCustomers: number
  productsDelivered: number
  citiesCovered: number
  averageRating: number
}

export interface HomepageData {
  banners: Banner[]
  topPicks: TopPick[]
  bestSellers: BestSeller[]
  testimonials: Testimonial[]
  stats: BusinessStats
  categories: Category[]
}

// API Client Class
class APIClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    // Get guest ID from localStorage if available
    let guestId = '';
    if (typeof window !== 'undefined') {
      guestId = localStorage.getItem('guest_id') || '';
    }

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(guestId ? { 'x-guest-id': guestId } : {}),
        ...options?.headers,
      },
      mode: 'cors',
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        // Parse error response if possible
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // ignore
        }

        const errorMessage = errorData?.message || `API Error: ${response.status} ${response.statusText}`;
        const error = new Error(errorMessage) as any;
        error.status = response.status;
        error.data = errorData;
        throw error
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Homepage APIs
  async getHomepageData(): Promise<HomepageData> {
    return this.request<HomepageData>('/homepage')
  }

  async getBanners(): Promise<{ banners: Banner[] }> {
    return this.request<{ banners: Banner[] }>('/banners')
  }

  async getTopPicks(): Promise<{ topPicks: TopPick[] }> {
    return this.request<{ topPicks: TopPick[] }>('/homepage/top-picks')
  }

  async getBestSellers(limit?: number): Promise<{ bestSellers: BestSeller[] }> {
    const params = new URLSearchParams()
    params.append('featured', 'true')
    if (limit) params.append('limit', limit.toString())

    const response = await this.request<{ products: Product[] }>(`/products?${params.toString()}`)

    // Transform products to best sellers format with enhanced data
    const bestSellers: BestSeller[] = response.products.map((product, index) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price || product.price * 1.25,
      image: product.image_url,
      rating: product.rating,
      reviewCount: product.review_count,
      salesCount: Math.floor(product.rating * product.review_count * 10),
      rank: index + 1,
      description: product.short_description || product.description,
      ageRange: product.age_range
    }))

    return { bestSellers }
  }

  async getTestimonials(limit?: number, featured?: boolean): Promise<{ testimonials: Testimonial[] }> {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (featured !== undefined) params.append('featured', featured.toString())
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<{ testimonials: Testimonial[] }>(`/homepage/testimonials${query}`)
  }

  async getStats(): Promise<{ stats: BusinessStats }> {
    return this.request<{ stats: BusinessStats }>('/homepage/stats')
  }

  // Product APIs
  async getProducts(params?: {
    category?: string
    search?: string
    sort?: string
    order?: 'asc' | 'desc'
    minPrice?: number
    maxPrice?: number
    sizes?: string[]
    colors?: string[]
    materials?: string[]
    occasions?: string[]
    ageRanges?: string[]
    featured?: boolean
    inStock?: boolean
    page?: number
    limit?: number
  }): Promise<{
    products: Product[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
    filters: Record<string, unknown>
  }> {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Transform 'category' to 'categoryName' for backend
          const paramKey = key === 'category' ? 'categoryName' : key

          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(paramKey, v))
          } else {
            searchParams.append(paramKey, value.toString())
          }
        }
      })
    }

    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return this.request(`/products${query}`)
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`)
  }

  async getRelatedProducts(id: string): Promise<{ products: Product[] }> {
    return this.request<{ products: Product[] }>(`/products/${id}/related`)
  }

  // Category APIs
  async getCategories(): Promise<{ categories: Category[] }> {
    return this.request<{ categories: Category[] }>('/categories')
  }

  async getCategory(slug: string): Promise<Category> {
    return this.request<Category>(`/categories/${slug}`)
  }

  async getCategoryById(id: string): Promise<Category> {
    return this.request<Category>(`/categories/${id}`)
  }

  // Cart APIs
  async getCart(sessionId?: string): Promise<Cart> {
    const url = sessionId ? `/cart/${sessionId}` : '/cart'
    return this.request<Cart>(url)
  }

  async addToCart(data: {
    sessionId?: string
    productId: string
    size: string
    quantity: number
    price?: number
  }): Promise<{
    success: boolean
    message: string
    cartItem: CartItem
  }> {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCartItem(sessionId: string | undefined, itemId: string, quantity: number): Promise<{
    success: boolean
    message: string
  }> {
    // Cookie-based session: PUT /cart/item/:itemId
    return this.request(`/cart/item/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  }

  async removeCartItem(sessionId: string | undefined, itemId: string): Promise<{
    success: boolean
    message: string
  }> {
    // Cookie-based session: DELETE /cart/item/:itemId
    return this.request(`/cart/item/${itemId}`, {
      method: 'DELETE',
    })
  }

  async clearCart(sessionId?: string): Promise<{
    success: boolean
    message: string
  }> {
    // Cookie-based session: DELETE /cart
    return this.request(`/cart`, {
      method: 'DELETE',
    })
  }

  // Guest Session
  async startGuestSession(): Promise<{ success: boolean; guestId: string; message: string }> {
    return this.request('/guest/session', {
      method: 'POST',
      body: JSON.stringify({}),
    })
  }

  // Address
  async saveAddress(data: {
    fullName: string
    email: string
    phone: string
    addressLine1: string
    city: string
    state: string
    country: string
    postalCode: string
  }): Promise<{ id: string; full_name: string;[key: string]: any }> {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Checkout & Payment
  async placeOrder(data: {
    addressId: string
    paymentMethod: 'cod' | 'card' | 'upi'
    cartItemIds?: string[]
  }): Promise<{
    success: boolean
    orderId: string
    message: string
    requiresPayment?: boolean
    razorpayOrderId?: string
    amount?: number
    currency?: string
    key?: string
  }> {
    return this.request('/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createRazorpayOrder(data: {
    orderId: string
    amount: number
    currency?: string
  }): Promise<{
    success: boolean
    razorpayOrderId: string
    amount: number
    currency: string
    key: string
  }> {
    return this.request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async verifyPayment(data: {
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
  }): Promise<{ success: boolean; orderId: string; message: string }> {
    // Backend expects snake_case field names
    return this.request('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({
        razorpay_order_id: data.razorpayOrderId,
        razorpay_payment_id: data.razorpayPaymentId,
        razorpay_signature: data.razorpaySignature
      }),
    })
  }

  // Orders
  async getOrder(orderId: string): Promise<any> {
    return this.request(`/orders/${orderId}`)
  }

  async getMyOrders(): Promise<any[]> {
    return this.request(`/orders`)
  }

  async trackOrder(data: { email: string; phone: string }): Promise<any[]> {
    return this.request('/orders/track', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Health check
  async healthCheck(): Promise<{
    status: string
    timestamp: string
    uptime: number
  }> {
    return this.request('/health')
  }
}

// Create and export a singleton instance
export const apiClient = new APIClient()

// Export the class for custom instances if needed
export { APIClient }

// Utility functions for common operations
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price)
}

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const getDiscountPercentage = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

export const getSessionId = (): string => {
  if (typeof window === 'undefined') return generateSessionId()

  let sessionId = localStorage.getItem('ani_ayu_session_id')
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem('ani_ayu_session_id', sessionId)
  }
  return sessionId
}

// Transform API Product to Frontend Product with null safety
export const transformApiProduct = (apiProduct: Product): import('../types/product').Product => {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.description || '',
    short_description: apiProduct.short_description,
    price: apiProduct.price || 0,
    original_price: apiProduct.original_price,
    originalPrice: apiProduct.original_price, // Legacy compatibility
    discount_percent: apiProduct.discount_percent || 0,
    currency: apiProduct.currency || 'INR',

    // Images and media
    image: apiProduct.image_url || '', // Main image mapping
    image_url: apiProduct.image_url,
    images: apiProduct.images || [],
    video_url: apiProduct.video_url,

    // Core product info
    rating: apiProduct.rating || 0,
    review_count: apiProduct.review_count || 0,
    reviewCount: apiProduct.review_count || 0, // Legacy compatibility
    category: apiProduct.category_id,
    category_id: apiProduct.category_id,
    sizes: apiProduct.sizes || [],
    colors: apiProduct.colors || [],
    features: apiProduct.features || [],
    age_range: apiProduct.age_range,
    ageRange: apiProduct.age_range, // Legacy compatibility
    material: apiProduct.material || '',
    occasion: apiProduct.occasion || '',

    // Enhanced fields
    sku: apiProduct.sku,
    barcode: apiProduct.barcode,
    brand: apiProduct.brand,
    tags: apiProduct.tags || [],
    specifications: apiProduct.specifications || {},

    // Inventory
    in_stock: apiProduct.in_stock !== false, // Default to true if undefined
    stock_quantity: apiProduct.stock_quantity,
    low_stock_threshold: apiProduct.low_stock_threshold || 5,
    featured: apiProduct.featured || false,

    // Physical attributes
    shipping_weight: apiProduct.shipping_weight,
    dimensions: apiProduct.dimensions,

    // Policies and metadata
    return_policy: apiProduct.return_policy,
    warranty: apiProduct.warranty,
    meta_title: apiProduct.meta_title,
    meta_description: apiProduct.meta_description,
    meta_keywords: apiProduct.meta_keywords || [],

    // Status and features
    status: apiProduct.status || 'active',
    customizable: apiProduct.customizable || false,

    // Timestamps
    created_at: apiProduct.created_at,
    updated_at: apiProduct.updated_at
  }
}

// Helper function to get stock status
export const getStockStatus = (product: import('../types/product').Product): 'in_stock' | 'low_stock' | 'out_of_stock' => {
  if (product.stock_quantity === 0) return 'out_of_stock'
  if (product.stock_quantity !== undefined && product.stock_quantity <= (product.low_stock_threshold || 5)) return 'low_stock'
  return 'in_stock'
}

// Helper function to get stock display text
export const getStockDisplay = (product: import('../types/product').Product): string => {
  const status = getStockStatus(product)
  switch (status) {
    case 'out_of_stock':
      return 'Out of Stock'
    case 'low_stock':
      return `Only ${product.stock_quantity} left`
    case 'in_stock':
      return product.stock_quantity !== undefined ? `${product.stock_quantity} in stock` : 'In Stock'
    default:
      return 'In Stock'
  }
}
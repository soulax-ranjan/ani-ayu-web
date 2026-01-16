// Enhanced Product interface with new schema fields
export interface Product {
  id: string
  name: string
  slug?: string
  description: string
  short_description?: string
  price: number
  original_price?: number
  discount_percent?: number
  currency?: string
  
  // Images and media
  image: string // Main image (mapped from image_url)
  image_url?: string // Raw API field
  images?: string[] // Additional images for product details
  video_url?: string
  
  // Core product info
  rating: number
  review_count?: number
  category: string
  category_id?: string
  sizes: string[]
  colors?: string[]
  features?: string[]
  age_range?: string
  ageRange?: string // Legacy field for compatibility
  material: string
  occasion: string
  
  // New enhanced fields
  sku?: string
  barcode?: string
  brand?: string
  tags?: string[]
  specifications?: Record<string, any>
  
  // Inventory
  in_stock?: boolean
  stock_quantity?: number
  low_stock_threshold?: number
  featured?: boolean
  section?: number
  
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
  
  // Timestamps
  created_at?: string
  updated_at?: string

  // Legacy fields for compatibility
  originalPrice?: number // Mapped from original_price
  reviewCount?: number // Mapped from review_count
}

export interface CartItem {
  id: string
  product: Product
  size: string
  quantity: number
  price: number // Price at time of adding to cart
}

export interface Filters {
  category: string[]
  priceRange: [number, number]
  sizes: string[]
  sortBy: 'price-low' | 'price-high' | 'popularity' | 'rating'
}

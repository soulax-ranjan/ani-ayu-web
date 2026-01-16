import { Product } from './product'

export interface CartItem {
  id: string
  product: Product
  size: string
  quantity: number
  price: number // Current price at time of adding
}

export interface CartTotals {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface BillingAddress extends ShippingAddress {
  sameAsShipping: boolean
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  cost: number
  estimatedDays: string
}

export interface PaymentMethod {
  id: string
  name: string
  type: 'card' | 'upi' | 'netbanking' | 'cod' | 'wallet'
  description: string
  available: boolean
}

export interface CheckoutData {
  contact: {
    email: string
    phone: string
    subscribeNewsletter: boolean
  }
  shipping: ShippingAddress
  billing: BillingAddress
  shippingMethod: ShippingMethod
  paymentMethod: PaymentMethod
}

export interface Order {
  id: string
  orderNumber: string
  guestId: string
  status: OrderStatus
  items: CartItem[]
  totals: CartTotals
  shipping: ShippingAddress
  billing: BillingAddress
  shippingMethod: ShippingMethod
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  createdAt: string
  updatedAt: string
  trackingNumber?: string
  estimatedDelivery?: string
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed' 
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'

export type CheckoutStep = 
  | 'contact'
  | 'shipping'
  | 'payment'
  | 'review'
  | 'confirmation'

// Re-export from existing types

/**
 * Payment Type Definitions
 * Based on the Razorpay Payment Flow API Integration Guide
 */

export interface CheckoutRequest {
    addressId: string
    paymentMethod: 'card' | 'upi' | 'cod'
    cartItemIds?: string[]
}

export interface CheckoutResponse {
    success: boolean
    orderId: string
    message: string
    requiresPayment?: boolean
    amount?: number
    currency?: string
    paymentMethod?: string
    // Razorpay specific fields (when requiresPayment is true)
    razorpayOrderId?: string
    key?: string
}

export interface CreateRazorpayOrderRequest {
    orderId: string
    amount: number
    currency?: string
}

export interface CreateRazorpayOrderResponse {
    success: boolean
    razorpayOrderId: string
    amount: number
    currency: string
    key: string
}

export interface VerifyPaymentRequest {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
    // Legacy support for existing API
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
}

export interface VerifyPaymentResponse {
    success: boolean
    message: string
    orderId: string
}

export interface Payment {
    id: string
    order_id: string
    razorpay_order_id: string
    razorpay_payment_id: string
    amount: number
    currency: string
    status: PaymentStatus
    method: PaymentMethodType
    created_at: string
    captured_at?: string
    refunded_at?: string
    failed_reason?: string
}

export type PaymentStatus =
    | 'pending'
    | 'authorized'
    | 'captured'
    | 'failed'
    | 'refunded'

export type PaymentMethodType =
    | 'card'
    | 'upi'
    | 'netbanking'
    | 'wallet'
    | 'cod'

export interface PaymentError {
    code?: string
    description?: string
    message: string
    status?: number
    data?: any
}

/**
 * Razorpay specific response types
 */
export interface RazorpayResponse {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
}

export interface RazorpayErrorResponse {
    error: {
        code: string
        description: string
        source: string
        step: string
        reason: string
        metadata: {
            order_id: string
            payment_id: string
        }
    }
}

/**
 * Payment flow state
 */
export interface PaymentState {
    loading: boolean
    error: PaymentError | null
    orderId: string | null
    paymentStatus: PaymentStatus | null
}

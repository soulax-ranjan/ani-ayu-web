/**
 * Razorpay Utility Functions
 * Handles loading the Razorpay checkout script and provides type definitions
 */

export interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description: string
    order_id: string
    handler: (response: RazorpayResponse) => void
    prefill?: {
        name?: string
        email?: string
        contact?: string
    }
    theme?: {
        color?: string
    }
    modal?: {
        ondismiss?: () => void
    }
}

export interface RazorpayResponse {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
}

export interface RazorpayError {
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

declare global {
    interface Window {
        Razorpay: any
    }
}

/**
 * Loads the Razorpay checkout script dynamically
 * @returns Promise that resolves to true if script loaded successfully, false otherwise
 */
export const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        // Check if script is already loaded
        if (window.Razorpay) {
            resolve(true)
            return
        }

        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.onload = () => {
            console.log('✅ Razorpay script loaded successfully')
            resolve(true)
        }
        script.onerror = () => {
            console.error('❌ Failed to load Razorpay script')
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

/**
 * Checks if Razorpay script is already loaded
 */
export const isRazorpayLoaded = (): boolean => {
    return typeof window !== 'undefined' && !!window.Razorpay
}

/**
 * Removes the Razorpay script from the DOM (useful for cleanup)
 */
export const unloadRazorpayScript = (): void => {
    const script = document.querySelector('script[src*="razorpay.com"]')
    if (script) {
        script.remove()
    }
}

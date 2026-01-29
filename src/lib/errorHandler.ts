/**
 * Error Handling Utilities for Payment Flow
 */

import { PaymentError } from '@/types/payment'

/**
 * Handles payment-related errors and returns user-friendly messages
 */
export const handlePaymentError = (error: any): string => {
    // Handle API response errors
    if (error.response) {
        switch (error.response.status) {
            case 400:
                return error.response.data?.message || 'Invalid payment details. Please try again.'
            case 404:
                return 'Order not found. Please contact support.'
            case 409:
                return 'This order has already been processed.'
            case 500:
                return 'Server error. Please try again later.'
            default:
                return error.response.data?.message || 'Payment failed. Please try again.'
        }
    }

    // Handle network errors
    if (error.message === 'Network Error' || error.message === 'Failed to fetch') {
        return 'Network error. Please check your internet connection and try again.'
    }

    // Handle Razorpay specific errors
    if (error.code) {
        switch (error.code) {
            case 'BAD_REQUEST_ERROR':
                return 'Invalid payment request. Please try again.'
            case 'GATEWAY_ERROR':
                return 'Payment gateway error. Please try again.'
            case 'SERVER_ERROR':
                return 'Payment server error. Please try again later.'
            default:
                return error.description || 'Payment failed. Please try again.'
        }
    }

    // Handle user cancellation
    if (error.message === 'Payment cancelled by user') {
        return 'Payment was cancelled. You can try again when ready.'
    }

    // Handle script loading errors
    if (error.message === 'Failed to load Razorpay SDK') {
        return 'Failed to load payment gateway. Please refresh the page and try again.'
    }

    // Default error message
    return error.message || 'An unexpected error occurred. Please try again.'
}

/**
 * Handles checkout-related errors
 */
export const handleCheckoutError = (error: any): string => {
    if (error.status === 400) {
        return error.data?.message || 'Invalid checkout details. Please check your information.'
    }

    if (error.status === 404) {
        return 'Address not found. Please select a valid delivery address.'
    }

    if (error.message?.includes('address')) {
        return 'Failed to save address. Please try again.'
    }

    return error.message || 'Failed to process checkout. Please try again.'
}

/**
 * Retry logic for failed operations
 */
export const retryOperation = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
): Promise<T> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation()
        } catch (error) {
            if (attempt === maxRetries) {
                throw error
            }

            console.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`)
            await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
        }
    }

    throw new Error('Max retries exceeded')
}

/**
 * Creates a standardized PaymentError object
 */
export const createPaymentError = (
    message: string,
    code?: string,
    status?: number,
    data?: any
): PaymentError => {
    return {
        message,
        code,
        status,
        data,
        description: data?.description
    }
}

/**
 * Logs errors with context for debugging
 */
export const logPaymentError = (
    context: string,
    error: any,
    additionalData?: Record<string, any>
): void => {
    console.error(`[Payment Error - ${context}]`, {
        error,
        message: error.message,
        code: error.code,
        status: error.status,
        data: error.data,
        ...additionalData
    })
}

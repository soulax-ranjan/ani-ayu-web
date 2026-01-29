/**
 * Custom Hook for Payment Processing
 * Handles the complete Razorpay payment flow
 */

'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { loadRazorpayScript } from '@/lib/razorpay'
import {
    handlePaymentError,
    handleCheckoutError,
    logPaymentError
} from '@/lib/errorHandler'
import type {
    CheckoutRequest,
    CheckoutResponse,
    RazorpayResponse,
    PaymentState,
    VerifyPaymentRequest
} from '@/types/payment'
import type { RazorpayOptions } from '@/lib/razorpay'

interface UsePaymentOptions {
    onSuccess?: (orderId: string) => void
    onError?: (error: string) => void
    onCancel?: () => void
}

export const usePayment = (options?: UsePaymentOptions) => {
    const router = useRouter()
    const [state, setState] = useState<PaymentState>({
        loading: false,
        error: null,
        orderId: null,
        paymentStatus: null
    })

    /**
     * Main payment processing function
     */
    const processPayment = useCallback(async (checkoutData: CheckoutRequest) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }))

            // Step 1: Create order in database
            console.log('📦 Creating order...', checkoutData)
            const checkoutResult = await apiClient.placeOrder(checkoutData)

            if (!checkoutResult.success) {
                throw new Error(checkoutResult.message || 'Failed to create order')
            }

            setState(prev => ({ ...prev, orderId: checkoutResult.orderId }))

            // If COD, redirect to success page immediately
            if (!checkoutResult.requiresPayment || checkoutData.paymentMethod === 'cod') {
                console.log('✅ COD order placed successfully')
                setState(prev => ({
                    ...prev,
                    loading: false,
                    paymentStatus: 'captured'
                }))

                if (options?.onSuccess) {
                    options.onSuccess(checkoutResult.orderId)
                } else {
                    router.push(`/checkout/success?orderId=${checkoutResult.orderId}`)
                }
                return
            }

            // Step 2: Handle online payment
            await handleOnlinePayment(checkoutResult)

        } catch (err: any) {
            const errorMessage = handleCheckoutError(err)
            logPaymentError('processPayment', err, { checkoutData })

            setState(prev => ({
                ...prev,
                loading: false,
                error: { message: errorMessage }
            }))

            if (options?.onError) {
                options.onError(errorMessage)
            }
        }
    }, [router, options])

    /**
     * Handles online payment flow (Razorpay)
     */
    const handleOnlinePayment = async (checkoutResult: CheckoutResponse) => {
        try {
            // Check for mock payment mode
            if (checkoutResult.key === 'rzp_test_mock_key') {
                console.log('⚠️ MOCK PAYMENT MODE - Bypassing Razorpay')
                await handleMockPayment(checkoutResult)
                return
            }

            // Load Razorpay script
            console.log('📜 Loading Razorpay script...')
            const scriptLoaded = await loadRazorpayScript()

            if (!scriptLoaded) {
                throw new Error('Failed to load Razorpay SDK')
            }

            // Open Razorpay checkout
            await openRazorpayCheckout(checkoutResult)

        } catch (err: any) {
            const errorMessage = handlePaymentError(err)
            logPaymentError('handleOnlinePayment', err, { checkoutResult })
            throw new Error(errorMessage)
        }
    }

    /**
     * Opens Razorpay checkout modal
     */
    const openRazorpayCheckout = (checkoutResult: CheckoutResponse): Promise<void> => {
        return new Promise((resolve, reject) => {
            const razorpayOptions: RazorpayOptions = {
                key: checkoutResult.key!,
                amount: checkoutResult.amount!,
                currency: checkoutResult.currency || 'INR',
                name: 'Ani & Ayu',
                description: 'Order Payment',
                order_id: checkoutResult.razorpayOrderId!,
                handler: async (response: RazorpayResponse) => {
                    try {
                        await verifyPayment(response, checkoutResult.orderId)
                        resolve()
                    } catch (err) {
                        reject(err)
                    }
                },
                prefill: {
                    name: localStorage.getItem('userName') || '',
                    email: localStorage.getItem('userEmail') || '',
                    contact: localStorage.getItem('userPhone') || ''
                },
                theme: {
                    color: '#F4A261' // Your brand color
                },
                modal: {
                    ondismiss: () => {
                        setState(prev => ({ ...prev, loading: false }))
                        if (options?.onCancel) {
                            options.onCancel()
                        }
                        reject(new Error('Payment cancelled by user'))
                    }
                }
            }

            console.log('💳 Opening Razorpay checkout...')
            const razorpay = new window.Razorpay(razorpayOptions)

            razorpay.on('payment.failed', (response: any) => {
                const error = response.error
                logPaymentError('Razorpay payment failed', error)
                setState(prev => ({
                    ...prev,
                    loading: false,
                    paymentStatus: 'failed',
                    error: {
                        message: error.description || 'Payment failed',
                        code: error.code
                    }
                }))
                reject(new Error(error.description || 'Payment failed'))
            })

            razorpay.open()
            setState(prev => ({ ...prev, loading: false })) // User is now interacting with Razorpay
        })
    }

    /**
     * Verifies payment with backend
     */
    const verifyPayment = async (
        response: RazorpayResponse,
        orderId: string
    ): Promise<void> => {
        try {
            setState(prev => ({ ...prev, loading: true }))
            console.log('🔍 Verifying payment...')

            const verifyData: VerifyPaymentRequest = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                // Legacy support
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
            }

            const verifyResult = await apiClient.verifyPayment(verifyData)

            if (!verifyResult.success) {
                throw new Error(verifyResult.message || 'Payment verification failed')
            }

            console.log('✅ Payment verified successfully')
            setState(prev => ({
                ...prev,
                loading: false,
                paymentStatus: 'captured'
            }))

            if (options?.onSuccess) {
                options.onSuccess(verifyResult.orderId)
            } else {
                router.push(`/checkout/success?orderId=${verifyResult.orderId}`)
            }

        } catch (err: any) {
            const errorMessage = handlePaymentError(err)
            logPaymentError('verifyPayment', err, { response, orderId })

            setState(prev => ({
                ...prev,
                loading: false,
                paymentStatus: 'failed',
                error: { message: errorMessage }
            }))

            throw new Error(errorMessage)
        }
    }

    /**
     * Handles mock payment for testing
     */
    const handleMockPayment = async (checkoutResult: CheckoutResponse): Promise<void> => {
        return new Promise((resolve, reject) => {
            console.log('⚠️ Simulating payment delay...')

            setTimeout(async () => {
                try {
                    const mockResponse: RazorpayResponse = {
                        razorpay_order_id: checkoutResult.razorpayOrderId!,
                        razorpay_payment_id: `pay_mock_${Date.now()}`,
                        razorpay_signature: 'mock_signature_valid'
                    }

                    await verifyPayment(mockResponse, checkoutResult.orderId)
                    resolve()
                } catch (err) {
                    reject(err)
                }
            }, 1500)
        })
    }

    /**
     * Resets the payment state
     */
    const resetPayment = useCallback(() => {
        setState({
            loading: false,
            error: null,
            orderId: null,
            paymentStatus: null
        })
    }, [])

    return {
        processPayment,
        resetPayment,
        loading: state.loading,
        error: state.error?.message || null,
        orderId: state.orderId,
        paymentStatus: state.paymentStatus
    }
}

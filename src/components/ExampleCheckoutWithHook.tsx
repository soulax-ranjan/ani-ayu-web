/**
 * Example Checkout Component using usePayment Hook
 * This demonstrates how to integrate the payment flow in a modern way
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePayment } from '@/lib/hooks/usePayment'
import type { CheckoutRequest } from '@/types/payment'

export default function ExampleCheckoutWithHook() {
    const router = useRouter()
    const [selectedAddress, setSelectedAddress] = useState<string>('')
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card')

    // Initialize payment hook with callbacks
    const { processPayment, loading, error, resetPayment } = usePayment({
        onSuccess: (orderId) => {
            console.log('✅ Payment successful!', orderId)
            // Custom success handling (optional)
            // The hook will redirect to success page by default
        },
        onError: (errorMessage) => {
            console.error('❌ Payment failed:', errorMessage)
            // Error is already set in the hook state
            // You can add custom error handling here
        },
        onCancel: () => {
            console.log('⚠️ Payment cancelled by user')
            // User closed the Razorpay modal
        }
    })

    const handleCheckout = async () => {
        // Validate inputs
        if (!selectedAddress) {
            alert('Please select a delivery address')
            return
        }

        // Reset any previous errors
        resetPayment()

        // Prepare checkout data
        const checkoutData: CheckoutRequest = {
            addressId: selectedAddress,
            paymentMethod: paymentMethod,
            // Optional: specify specific cart items
            // cartItemIds: ['item-1', 'item-2']
        }

        // Process payment
        // The hook handles everything:
        // 1. Creates order
        // 2. Loads Razorpay script (if needed)
        // 3. Opens payment modal (for online payments)
        // 4. Verifies payment
        // 5. Redirects to success page
        await processPayment(checkoutData)
    }

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            {/* Address Selection */}
            <div className="address-section">
                <h2>Delivery Address</h2>
                <select
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    disabled={loading}
                >
                    <option value="">Select an address</option>
                    <option value="address-1">Home Address</option>
                    <option value="address-2">Office Address</option>
                </select>
            </div>

            {/* Payment Method Selection */}
            <div className="payment-method-section">
                <h2>Payment Method</h2>

                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                        disabled={loading}
                    />
                    <div>
                        <strong>Credit/Debit Card</strong>
                        <p>Pay securely with Razorpay</p>
                    </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'upi')}
                        disabled={loading}
                    />
                    <div>
                        <strong>UPI</strong>
                        <p>Pay with Google Pay, PhonePe, Paytm, etc.</p>
                    </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                        disabled={loading}
                    />
                    <div>
                        <strong>Cash on Delivery</strong>
                        <p>Pay when you receive your order</p>
                    </div>
                </label>
            </div>

            {/* Error Display */}
            {error && (
                <div className="error-message">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Checkout Button */}
            <button
                onClick={handleCheckout}
                disabled={loading || !selectedAddress}
                className="checkout-button"
            >
                {loading ? (
                    <>
                        <span className="spinner" />
                        Processing...
                    </>
                ) : (
                    <>
                        {paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}
                    </>
                )}
            </button>

            {/* Loading Indicator */}
            {loading && (
                <div className="loading-info">
                    <p>
                        {paymentMethod === 'cod'
                            ? 'Creating your order...'
                            : 'Opening payment gateway...'}
                    </p>
                </div>
            )}

            <style jsx>{`
        .checkout-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
        }

        .address-section,
        .payment-method-section {
          margin-bottom: 2rem;
        }

        h2 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
        }

        .payment-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px solid #ddd;
          border-radius: 8px;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .payment-option:hover {
          border-color: #F4A261;
        }

        .payment-option.selected {
          border-color: #F4A261;
          background-color: #FFF5EE;
        }

        .payment-option input[type="radio"] {
          width: 20px;
          height: 20px;
        }

        .payment-option strong {
          display: block;
          margin-bottom: 0.25rem;
        }

        .payment-option p {
          margin: 0;
          font-size: 0.875rem;
          color: #666;
        }

        .error-message {
          padding: 1rem;
          background-color: #FEE;
          border: 1px solid #F88;
          border-radius: 8px;
          color: #C00;
          margin-bottom: 1rem;
        }

        .checkout-button {
          width: 100%;
          padding: 1rem;
          background-color: #F4A261;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .checkout-button:hover:not(:disabled) {
          background-color: #E89451;
        }

        .checkout-button:disabled {
          background-color: #CCC;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-info {
          text-align: center;
          margin-top: 1rem;
          color: #666;
        }
      `}</style>
        </div>
    )
}

# Razorpay Payment Integration - Implementation Guide

This document explains how to use the Razorpay payment integration utilities in the Ani & Ayu web application.

## Overview

The payment integration consists of the following modules:

1. **`/src/lib/razorpay.ts`** - Razorpay script loader and utilities
2. **`/src/lib/hooks/usePayment.ts`** - Custom React hook for payment processing
3. **`/src/types/payment.ts`** - TypeScript type definitions
4. **`/src/lib/errorHandler.ts`** - Error handling utilities
5. **`/src/lib/api.ts`** - API client (updated to support payment methods)

## Quick Start

### Basic Usage

```typescript
import { usePayment } from '@/lib/hooks/usePayment'

function CheckoutPage() {
  const { processPayment, loading, error } = usePayment({
    onSuccess: (orderId) => {
      console.log('Payment successful!', orderId)
    },
    onError: (error) => {
      console.error('Payment failed:', error)
    },
    onCancel: () => {
      console.log('Payment cancelled by user')
    }
  })

  const handleCheckout = async () => {
    await processPayment({
      addressId: 'address-uuid',
      paymentMethod: 'card', // 'card' | 'upi' | 'cod'
      cartItemIds: [] // Optional
    })
  }

  return (
    <div>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Processing...' : 'Place Order'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  )
}
```

## API Reference

### `usePayment` Hook

The main hook for handling payment processing.

#### Parameters

```typescript
interface UsePaymentOptions {
  onSuccess?: (orderId: string) => void
  onError?: (error: string) => void
  onCancel?: () => void
}
```

#### Returns

```typescript
{
  processPayment: (data: CheckoutRequest) => Promise<void>
  resetPayment: () => void
  loading: boolean
  error: string | null
  orderId: string | null
  paymentStatus: PaymentStatus | null
}
```

#### Example with All Options

```typescript
const payment = usePayment({
  onSuccess: (orderId) => {
    // Custom success handling
    router.push(`/order-confirmation/${orderId}`)
  },
  onError: (error) => {
    // Custom error handling
    toast.error(error)
  },
  onCancel: () => {
    // User cancelled payment
    toast.info('Payment cancelled')
  }
})

// Process payment
await payment.processPayment({
  addressId: selectedAddress,
  paymentMethod: 'card',
  cartItemIds: specificItems // Optional
})

// Reset state if needed
payment.resetPayment()
```

### Payment Flow

The `usePayment` hook handles the complete payment flow:

1. **Order Creation** - Creates order in database via `/api/checkout`
2. **Payment Method Check** - Determines if online payment is required
3. **COD Flow** - Redirects directly to success page for COD orders
4. **Online Payment Flow**:
   - Loads Razorpay script
   - Opens Razorpay checkout modal
   - Handles payment response
   - Verifies payment with backend
   - Redirects to success page

### Mock Payment Mode

For testing without real Razorpay credentials:

```typescript
// Backend returns this key for mock mode
{
  key: 'rzp_test_mock_key'
}

// The hook automatically detects and simulates payment
// No Razorpay modal will open
```

## Type Definitions

### CheckoutRequest

```typescript
interface CheckoutRequest {
  addressId: string
  paymentMethod: 'card' | 'upi' | 'cod'
  cartItemIds?: string[]
}
```

### CheckoutResponse

```typescript
interface CheckoutResponse {
  success: boolean
  orderId: string
  message?: string
  requiresPayment?: boolean
  amount?: number
  currency?: string
  paymentMethod?: string
  razorpayOrderId?: string
  key?: string
}
```

### Payment Status

```typescript
type PaymentStatus = 
  | 'pending' 
  | 'authorized' 
  | 'captured' 
  | 'failed' 
  | 'refunded'
```

## Error Handling

The integration includes comprehensive error handling:

```typescript
import { handlePaymentError, handleCheckoutError } from '@/lib/errorHandler'

try {
  await processPayment(data)
} catch (error) {
  const userMessage = handlePaymentError(error)
  console.error(userMessage)
}
```

### Common Error Scenarios

- **Network errors** - "Network error. Please check your internet connection"
- **Invalid payment details** - "Invalid payment details. Please try again"
- **Payment gateway errors** - "Payment gateway error. Please try again"
- **User cancellation** - "Payment was cancelled. You can try again when ready"
- **Script loading failure** - "Failed to load payment gateway. Please refresh"

## Advanced Usage

### Custom Success Handling

```typescript
const { processPayment } = usePayment({
  onSuccess: async (orderId) => {
    // Clear cart
    await clearCart()
    
    // Track analytics
    analytics.track('purchase_completed', { orderId })
    
    // Show custom success UI
    setShowConfetti(true)
    
    // Redirect after delay
    setTimeout(() => {
      router.push(`/orders/${orderId}`)
    }, 2000)
  }
})
```

### Retry Logic

```typescript
import { retryOperation } from '@/lib/errorHandler'

const handlePaymentWithRetry = async () => {
  try {
    await retryOperation(
      () => processPayment(checkoutData),
      3, // max retries
      1000 // delay in ms
    )
  } catch (error) {
    console.error('Payment failed after retries')
  }
}
```

### Manual Razorpay Script Loading

```typescript
import { loadRazorpayScript, isRazorpayLoaded } from '@/lib/razorpay'

// Check if already loaded
if (!isRazorpayLoaded()) {
  const loaded = await loadRazorpayScript()
  if (!loaded) {
    console.error('Failed to load Razorpay')
  }
}
```

## Integration with Existing Checkout Page

To update your existing checkout page to use the new hook:

```typescript
// Before
const handlePlaceOrder = async () => {
  // Manual API calls and Razorpay handling
}

// After
const { processPayment, loading, error } = usePayment()

const handlePlaceOrder = async () => {
  await processPayment({
    addressId,
    paymentMethod
  })
}
```

## Testing

### Test Payment Flow

1. Use test Razorpay credentials
2. Test cards available at: https://razorpay.com/docs/payments/payments/test-card-details/

```javascript
// Success
Card: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date

// Failure
Card: 4000 0000 0000 0002
CVV: 123
Expiry: Any future date
```

### Mock Mode Testing

Set backend to return `key: 'rzp_test_mock_key'` to test without Razorpay modal.

## Best Practices

1. **Always handle errors** - Use the provided error handlers
2. **Show loading states** - Use the `loading` state from the hook
3. **Validate before payment** - Ensure address and cart are valid
4. **Clear sensitive data** - Don't store payment details in localStorage
5. **Log for debugging** - The hook includes console logs for debugging
6. **Test thoroughly** - Test all payment methods and error scenarios

## Troubleshooting

### Razorpay script not loading

```typescript
// Check browser console for errors
// Ensure you're not blocking third-party scripts
// Try manual loading:
const loaded = await loadRazorpayScript()
console.log('Script loaded:', loaded)
```

### Payment verification fails

```typescript
// Check backend logs
// Ensure Razorpay webhook is configured
// Verify signature validation is correct
```

### Type errors

```typescript
// Ensure all types are imported from correct locations
import type { CheckoutRequest } from '@/types/payment'
import { usePayment } from '@/lib/hooks/usePayment'
```

## API Endpoints Used

- `POST /api/checkout` - Create order
- `POST /api/payments/verify` - Verify payment
- `GET /api/orders/:orderId` - Get order details

## Security Considerations

1. **Never expose Razorpay secret** - Only use key ID on frontend
2. **Always verify on backend** - Never trust frontend payment status
3. **Use HTTPS** - Required for Razorpay integration
4. **Validate signatures** - Backend must verify Razorpay signatures
5. **Sanitize inputs** - Validate all user inputs before processing

## Migration Guide

If you're migrating from the old implementation:

1. Install the new utilities (already done)
2. Update imports to use `usePayment` hook
3. Replace manual Razorpay code with hook calls
4. Update error handling to use new utilities
5. Test thoroughly with all payment methods

## Support

For issues or questions:
- Check the [Razorpay Documentation](https://razorpay.com/docs/)
- Review the API Integration Guide (provided separately)
- Check browser console for detailed error logs

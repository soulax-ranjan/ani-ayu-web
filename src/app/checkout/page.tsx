"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Lock, CreditCard, Truck, User, Mail, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { CheckoutStep } from '@/types/checkout'
import { apiClient } from '@/lib/api'

// Define window.Razorpay for TS
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, totals, totalItems } = useCartStore()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  })

  const [addressId, setAddressId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('card')

  if (totalItems === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-cream/30 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-ink mb-4">Your cart is empty</h2>
            <p className="text-muted-text mb-6">Add some items to your cart before checkout.</p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-black">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const steps = [
    { id: 'contact', name: 'Contact', icon: Mail },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'payment', name: 'Payment', icon: CreditCard },
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleNextStep = async () => {
    setError(null)
    if (currentStep === 'contact') {
      if (!formData.email || !formData.phone) {
        setError("Please fill in all contact details.")
        return
      }
      setCurrentStep('shipping')
    } else if (currentStep === 'shipping') {
      // Validate address
      if (!formData.firstName || !formData.addressLine1 || !formData.city || !formData.state || !formData.postalCode) {
        setError("Please fill in all address details.")
        return
      }

      // Save Address
      setLoading(true)
      try {
        const addressPayload = {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode
        }

        const res = await apiClient.saveAddress(addressPayload)
        console.log('Address API Response:', res)

        // Handle potential ID variations
        // Correct structure based on user feedback: response.address.id
        const newAddressId = res.address?.id || res.id || res._id || (res.data && res.data.id)

        if (newAddressId) {
          console.log('Address saved with ID:', newAddressId)
          setAddressId(newAddressId)
          setCurrentStep('payment')
        } else {
          console.error('Missing ID in address response. Full response:', res)
          setError("Failed to save address. Response received but ID missing. Check console for details.")
        }
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Something went wrong saving your address.")
      } finally {
        setLoading(false)
      }
    }
  }

  const handlePlaceOrder = async () => {
    if (!addressId) {
      setError("Missing address. Please go back and save details.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const checkoutData = {
        addressId,
        paymentMethod
      }

      const res = await apiClient.placeOrder(checkoutData)

      if (res.success) {
        if (paymentMethod === 'cod') {
          router.push(`/checkout/success?orderId=${res.orderId}`)
        } else if (paymentMethod === 'card' && res.razorpayOrderId) {

          // MOCK PAYMENT FLOW
          if (res.key === 'rzp_test_mock_key') {
            console.log("⚠️ MOCK PAYMENT DETECTED - Bypassing Razorpay Popup ⚠️");

            // Simulate User Payment Delay
            setTimeout(async () => {
              try {
                const verifyRes = await apiClient.verifyPayment({
                  razorpayOrderId: res.razorpayOrderId!,
                  razorpayPaymentId: "pay_mock_" + Date.now(), // Generate fake ID
                  razorpaySignature: "mock_signature_valid"    // Backend accepts this
                })

                if (verifyRes.success) {
                  router.push(`/checkout/success?orderId=${verifyRes.orderId}`)
                } else {
                  throw new Error(verifyRes.message || "Mock verification failed")
                }
              } catch (verifyErr: any) {
                console.error("Mock Payment Verification Failed", verifyErr)
                setError(verifyErr.message || "Mock Payment Verification Failed")
                setLoading(false)
              }
            }, 1500);
            return; // Exit early to avoid opening real Razorpay
          }

          // Open Razorpay
          const options = {
            key: res.key,
            amount: res.amount,
            currency: res.currency,
            name: "Ani & Ayu",
            description: "Order Payment", // Could contain order ID
            order_id: res.razorpayOrderId,
            handler: async function (response: any) {
              try {
                const verifyRes = await apiClient.verifyPayment({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature
                })
                if (verifyRes.success) {
                  router.push(`/checkout/success?orderId=${verifyRes.orderId}`)
                }
              } catch (verifyErr) {
                console.error("Payment verification failed", verifyErr)
                setError("Payment verification failed. Please contact support.")
              }
            },
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: formData.phone
            },
            theme: {
              color: "#F4A261" // Example primary color
            }
          }

          const rzp1 = new window.Razorpay(options)
          rzp1.on('payment.failed', function (response: any) {
            setError(`Payment Failed: ${response.error.description}`)
          });
          rzp1.open()
          setLoading(false) // Wait for user interaction
        }
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to place order.")
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-cream/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/cart" className="flex items-center gap-2 text-muted-text hover:text-ink transition-colors">
              <ArrowLeft size={20} />
              Back to Cart
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-3xl font-bold text-ink">Checkout</h1>
            <div className="flex items-center gap-2 text-muted-text">
              <Lock size={16} />
              <span className="text-sm">Secure Checkout</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Progress Steps */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center max-w-lg mx-auto">
                    {steps.map((step, index) => {
                      const StepIcon = step.icon
                      const isActive = index === currentStepIndex
                      const isCompleted = index < currentStepIndex

                      return (
                        <div key={step.id} className="flex flex-col items-center relative z-10">
                          <div className={`
                            flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                            ${isActive
                              ? 'border-primary bg-primary text-black'
                              : isCompleted
                                ? 'border-green-500 bg-green-500 text-white'
                                : 'border-gray-300 bg-white text-gray-400'
                            }
                          `}>
                            <StepIcon size={18} />
                          </div>
                          <span className={`
                            mt-2 text-xs font-medium
                            ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'}
                          `}>
                            {step.name}
                          </span>
                        </div>
                      )
                    })}
                    {/* Connector lines could run behind but keeping simple for now */}
                  </div>
                </div>

                {/* Step Content */}
                <div className="p-6">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                      {error}
                    </div>
                  )}

                  {currentStep === 'contact' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-ink">Contact Information</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-ink mb-2">Email</label>
                          <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Enter your email"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-ink mb-2">Phone Number</label>
                          <input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 'shipping' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-ink">Shipping Address</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-ink mb-2">First Name</label>
                          <input
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="First name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-ink mb-2">Last Name</label>
                          <input
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Last name"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-ink mb-2">Address</label>
                          <input
                            name="addressLine1"
                            type="text"
                            value={formData.addressLine1}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Street address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-ink mb-2">City</label>
                          <input
                            name="city"
                            type="text"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-ink mb-2">State</label>
                          <input
                            name="state"
                            type="text"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="State"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-ink mb-2">Postal Code</label>
                          <input
                            name="postalCode"
                            type="text"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Postal code"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-ink mb-2">Country</label>
                          <input
                            name="country"
                            type="text"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 'payment' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-ink">Payment Information</h2>
                      <div className="space-y-3">
                        <label className={`block p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="payment" className="accent-primary" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                            <div className="flex-1">
                              <div className="font-medium text-ink">Credit/Debit Card (Razorpay)</div>
                              <div className="text-sm text-gray-500">Safe and secure payments via Razorpay</div>
                            </div>
                            <CreditCard className="text-gray-400" />
                          </div>
                        </label>

                        <label className={`block p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="payment" className="accent-primary" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                            <div className="flex-1">
                              <div className="font-medium text-ink">Cash on Delivery</div>
                              <div className="text-sm text-gray-500">Pay when you receive your order</div>
                            </div>
                            <div className="text-green-600 font-bold">₹</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="p-6 border-t border-gray-100 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const stepOrder: CheckoutStep[] = ['contact', 'shipping', 'payment']
                      const prevIdx = stepOrder.indexOf(currentStep) - 1
                      if (prevIdx >= 0) setCurrentStep(stepOrder[prevIdx])
                    }}
                    disabled={currentStep === 'contact' || loading}
                  >
                    Previous
                  </Button>

                  {currentStep === 'payment' ? (
                    <Button
                      onClick={handlePlaceOrder}
                      className="bg-primary hover:bg-primary/90 text-black min-w-[140px]"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="animate-spin" /> : paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextStep}
                      className="bg-primary hover:bg-primary/90 text-black"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="animate-spin" /> : 'Continue'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <h2 className="font-semibold text-ink mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {/* Fallback image handle */}
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                        {item.product.image && (
                          <img src={item.product.image} alt={item.product.name} className="object-cover w-full h-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{item.product?.name || item.product.id}</p>
                        <p className="text-xs text-muted-text">Size: {item.size} • Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-ink">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-text">Subtotal</span>
                    <span className="text-ink">₹{totals.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-text">Shipping</span>
                    <span className="text-ink">
                      {totals.shipping > 0 ? `₹${totals.shipping.toLocaleString()}` : 'Free'}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-ink">Total</span>
                      <span className="text-primary">₹{totals.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 text-xs text-muted-text">
                  <Lock size={14} />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
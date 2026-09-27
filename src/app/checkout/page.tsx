"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Lock, CreditCard, Truck, Mail, Loader2, Check, ChevronDown, Tag, X, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CheckoutStep } from '@/types/checkout'
import { apiClient } from '@/lib/api'
import { trackEvent } from '@/lib/mixpanel'
import { useEffect } from 'react'

// Define window.Razorpay for TS
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Disable static generation (uses cart state and dynamic data)
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

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
  const [paymentMethod] = useState<'card'>('card')

  useEffect(() => {
    trackEvent('Checkout Started', {
      cart_total: totals.total,
      item_count: totalItems
    })
  }, [])

  // Coupon state
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [summaryOpen, setSummaryOpen] = useState(false)

  if (totalItems === 0) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] bg-[#fdfbf7] flex items-center">
          <div className="max-w-md mx-auto px-4 py-16 text-center">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-ink">Your bag is empty</h1>
            <p className="mt-2 text-ink/60">Add something to your bag before checking out.</p>
            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-7 py-3.5 font-semibold shadow-lg shadow-primary/25 transition-colors"
            >
              Start shopping <ArrowRight size={18} />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const steps = [
    { id: 'contact', name: 'Contact', icon: Mail },
    { id: 'shipping', name: 'Address', icon: Truck },
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

        console.log('🔍 Extracted address ID:', newAddressId)
        console.log('🔍 Address ID type:', typeof newAddressId)
        console.log('🔍 Is valid UUID format?', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newAddressId || ''))

        if (newAddressId) {
          console.log('✅ Address saved with ID:', newAddressId)
          setAddressId(newAddressId)
          setCurrentStep('payment')
        } else {
          console.error('❌ Missing ID in address response. Full response:', res)
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

  const handleApplyCoupon = async (codeToApply?: string | React.MouseEvent) => {
    const code = typeof codeToApply === 'string' ? codeToApply : couponCode;
    
    if (!code.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    // Set the state if a code was passed
    if (typeof codeToApply === 'string') {
      setCouponCode(code);
    }

    setCouponLoading(true)
    setCouponError(null)

    try {
      const result = await apiClient.verifyCoupon({
        code: code.trim().toUpperCase(),
        orderAmount: totals.total
      })

      if (result.valid && result.discount) {
        setCouponDiscount(result.discount)
        setCouponApplied(true)
        setCouponError(null)
        trackEvent('Coupon Applied', {
          code: code.trim().toUpperCase(),
          discount_amount: result.discount
        })
      } else {
        setCouponError(result.message || 'Invalid coupon code')
        setCouponDiscount(0)
        setCouponApplied(false)
      }
    } catch (err: any) {
      setCouponError(err.message || 'Failed to verify coupon')
      setCouponDiscount(0)
      setCouponApplied(false)
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setCouponDiscount(0)
    setCouponApplied(false)
    setCouponError(null)
  }

  const handlePlaceOrder = async () => {
    if (!addressId) {
      setError("Missing address. Please go back and save details.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get cart item IDs
      const cartItemIds = items.map(item => item.id)

      const checkoutData: any = {
        addressId,
        paymentMethod,
        cartItemIds // Include cart items as per API requirement
      }

      if (couponApplied && couponCode) {
        checkoutData.couponCode = couponCode.trim();
        checkoutData.coupon_code = couponCode.trim(); // Fallback for snake_case backend expectation
      }

      console.log('🛒 Placing order with data:', checkoutData)
      console.log('📦 Guest ID:', localStorage.getItem('guest_id'))
      console.log('🛍️ Cart items:', cartItemIds)

      const res = await apiClient.placeOrder(checkoutData)
      console.log('✅ Order response:', res)

      if (res.success) {
        trackEvent('Order Initiated', {
          order_id: res.orderId,
          amount: totals.total,
          payment_method: paymentMethod
        })
        if (res.requiresPayment && res.razorpayOrderId) {

          console.log('💳 Razorpay order received from checkout:', res.razorpayOrderId)
          console.log('💰 Amount:', res.amount, 'Currency:', res.currency, 'Key:', res.key)

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
            key: res.key!,
            amount: res.amount!,
            currency: res.currency || 'INR',
            name: "Ani & Ayu",
            description: "Order Payment",
            order_id: res.razorpayOrderId,
            handler: async function (response: any) {
              setLoading(true) // Show loading during verification
              try {
                const verifyRes = await apiClient.verifyPayment({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature
                })

                console.log('✅ Payment verified:', verifyRes)

                if (verifyRes.success) {
                  // Redirect to success page
                  router.push(`/checkout/success?orderId=${verifyRes.orderId}`)
                } else {
                  setError(verifyRes.message || "Payment verification failed")
                  setLoading(false)
                }
              } catch (verifyErr: any) {
                console.error("❌ Payment verification failed", verifyErr)
                setError(verifyErr.message || "Payment verification failed. Please contact support.")
                setLoading(false)
              }
            },
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: formData.phone
            },
            theme: {
              color: "#3a7d6e" // brand teal
            },
            modal: {
              ondismiss: function () {
                setLoading(false)
              }
            }
          }

          const rzp1 = new window.Razorpay(options)
          rzp1.on('payment.failed', function (response: any) {
            console.error('❌ Payment failed:', response.error)
            setError(`Payment Failed: ${response.error.description}`)
            setLoading(false)
          });
          rzp1.open()
        }
      }
    } catch (err: any) {
      console.error('❌ Checkout error:', err)
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        data: err.data
      })

      let errorMessage = err.message || "Failed to place order."

      // Provide more specific error messages
      if (err.message === 'Failed to fetch' || err.message === 'Network request failed') {
        errorMessage = "Network error. Please check your internet connection and try again."
      } else if (err.status === 400) {
        errorMessage = err.data?.message || "Invalid order data. Please check your details."
      } else if (err.status === 404) {
        errorMessage = "Address not found. Please go back and re-enter your address."
      } else if (err.status === 500) {
        errorMessage = "Server error. Please try again in a moment."
      }

      setError(errorMessage)
      setLoading(false)
    }
  }

  const rupees = (n: number) => `₹${(n || 0).toLocaleString('en-IN')}`
  const grandTotal = totals.total - couponDiscount
  const stepOrder: CheckoutStep[] = ['contact', 'shipping', 'payment']
  const goBack = () => {
    const prevIdx = stepOrder.indexOf(currentStep) - 1
    if (prevIdx >= 0) setCurrentStep(stepOrder[prevIdx])
  }

  const inputClass =
    'w-full h-12 rounded-xl bg-white px-4 text-sm text-ink ring-1 ring-stone-200 placeholder:text-ink/35 outline-none transition-shadow focus:ring-2 focus:ring-primary'
  const labelClass = 'block text-xs font-semibold text-ink/70 mb-1.5'

  const OFFERS = [
    { code: 'FIRSTBUY10', text: '10% off your first order', minTotal: 0 },
    { code: 'ANIAYU15', text: '15% off on orders above ₹10,000', minTotal: 10000 },
  ]

  const summary = (
    <div className="rounded-3xl bg-white ring-1 ring-stone-200/70 p-5 md:p-6">
      <h2 className="hidden lg:block font-heading text-lg font-bold text-ink mb-4">Order summary</h2>

      {/* Items */}
      <ul className="space-y-4 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="relative w-14 aspect-[4/5] shrink-0 rounded-xl overflow-hidden bg-gradient-to-b from-[#fbf6ee] to-[#f1e7da]">
              {item.product.image && (
                <Image src={item.product.image} alt={item.product.name} fill sizes="56px" className="object-cover" />
              )}
              <span className="absolute -top-0 -right-0 min-w-5 h-5 px-1 rounded-bl-lg bg-ink/70 text-white text-[10px] font-semibold grid place-items-center tabular-nums">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink line-clamp-2">{item.product?.name || item.product.id}</p>
              <p className="mt-0.5 text-xs text-ink/55">Age: {item.size}</p>
            </div>
            <span className="text-sm font-semibold text-ink tabular-nums">{rupees(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      {/* Coupon */}
      <div className="mt-5 pt-5 border-t border-stone-200/70">
        {!couponApplied ? (
          <>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCoupon() }}
                  placeholder="Coupon code"
                  aria-label="Coupon code"
                  className={`${inputClass} pl-10 uppercase tracking-wider`}
                  disabled={couponLoading}
                />
              </div>
              <button
                onClick={handleApplyCoupon}
                disabled={couponLoading || !couponCode.trim()}
                className="h-12 px-5 rounded-xl bg-ink text-white text-sm font-semibold transition-opacity disabled:opacity-30"
              >
                {couponLoading ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
              </button>
            </div>
            {couponError && <p className="mt-2 text-xs text-red-600">{couponError}</p>}

            <div className="mt-3 space-y-2">
              {OFFERS.map((offer) => {
                const locked = totals.total < offer.minTotal
                return (
                  <div key={offer.code} className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-[#c9a45c]/60 bg-[#e6c88a]/10 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-xs font-bold tracking-wider text-[#6f5429]">{offer.code}</p>
                      <p className="text-[11px] text-ink/60">{offer.text}</p>
                    </div>
                    <button
                      onClick={() => handleApplyCoupon(offer.code)}
                      disabled={locked || couponLoading}
                      title={locked ? 'Add more items to unlock' : ''}
                      className="shrink-0 text-xs font-semibold text-primary hover:underline underline-offset-4 disabled:text-ink/30 disabled:no-underline disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between rounded-xl bg-primary/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-primary text-white grid place-items-center"><Check size={15} /></span>
              <div>
                <p className="text-sm font-bold tracking-wider text-primary">{couponCode}</p>
                <p className="text-xs text-ink/60">You save {rupees(couponDiscount)}</p>
              </div>
            </div>
            <button onClick={handleRemoveCoupon} className="p-1.5 rounded-full text-ink/50 hover:text-red-600 hover:bg-white" aria-label="Remove coupon">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Totals */}
      <dl className="mt-5 pt-5 border-t border-stone-200/70 space-y-2.5 text-sm">
        <div className="flex justify-between text-ink/70">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{rupees(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between text-ink/70">
          <dt>Shipping</dt>
          <dd className={totals.shipping > 0 ? 'tabular-nums' : 'font-medium text-primary'}>
            {totals.shipping > 0 ? rupees(totals.shipping) : 'Free'}
          </dd>
        </div>
        {couponApplied && couponDiscount > 0 && (
          <div className="flex justify-between font-medium text-primary">
            <dt>Discount</dt>
            <dd className="tabular-nums">−{rupees(couponDiscount)}</dd>
          </div>
        )}
        <div className="flex justify-between items-baseline pt-3 border-t border-stone-200/70">
          <dt className="font-semibold text-ink">Total</dt>
          <dd className="font-heading text-2xl font-bold text-ink tabular-nums">{rupees(grandTotal)}</dd>
        </div>
        <p className="text-xs text-ink/50">Inclusive of all taxes</p>
      </dl>
    </div>
  )

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#fdfbf7]">
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
          {/* Title row */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-primary transition-colors">
                <ArrowLeft size={16} /> Back to bag
              </Link>
              <h1 className="mt-1 font-heading text-2xl md:text-3xl font-bold text-ink">Checkout</h1>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white ring-1 ring-stone-200/70 px-3 py-1.5 text-xs font-medium text-ink/70">
              <Lock size={13} className="text-primary" /> Secure checkout
            </span>
          </div>

          {/* Mobile: collapsible order summary */}
          <div className="lg:hidden mb-5">
            <button
              onClick={() => setSummaryOpen((v) => !v)}
              aria-expanded={summaryOpen}
              className="w-full flex items-center justify-between rounded-2xl bg-white ring-1 ring-stone-200/70 px-4 py-3.5"
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                {summaryOpen ? 'Hide' : 'Show'} order summary
                <ChevronDown size={16} className={`transition-transform ${summaryOpen ? 'rotate-180' : ''}`} />
              </span>
              <span className="font-heading font-bold text-ink tabular-nums">{rupees(grandTotal)}</span>
            </button>
            {summaryOpen && <div className="mt-3">{summary}</div>}
          </div>

          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Steps */}
            <div className="lg:col-span-7">
              {/* Stepper */}
              <ol className="flex items-center mb-6">
                {steps.map((step, index) => {
                  const isActive = index === currentStepIndex
                  const isCompleted = index < currentStepIndex
                  return (
                    <li key={step.id} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-8 h-8 rounded-full grid place-items-center text-sm font-semibold transition-colors ${
                            isCompleted ? 'bg-primary text-white' : isActive ? 'bg-primary/10 text-primary ring-2 ring-primary' : 'bg-white text-ink/40 ring-1 ring-stone-200'
                          }`}
                        >
                          {isCompleted ? <Check size={16} /> : index + 1}
                        </span>
                        <span className={`text-sm font-medium ${isActive || isCompleted ? 'text-ink' : 'text-ink/40'}`}>{step.name}</span>
                      </div>
                      {index < steps.length - 1 && (
                        <span className={`flex-1 h-px mx-3 ${isCompleted ? 'bg-primary' : 'bg-stone-200'}`} />
                      )}
                    </li>
                  )
                })}
              </ol>

              {/* Completed step summaries */}
              {currentStepIndex > 0 && (
                <div className="mb-4 rounded-2xl bg-white ring-1 ring-stone-200/70 divide-y divide-stone-200/70 text-sm">
                  <div className="flex items-start justify-between gap-4 px-5 py-3.5">
                    <div className="flex gap-3 min-w-0">
                      <Mail size={16} className="mt-0.5 shrink-0 text-ink/40" />
                      <p className="text-ink/80 truncate">{formData.email} · {formData.phone}</p>
                    </div>
                    <button onClick={() => setCurrentStep('contact')} disabled={loading} className="shrink-0 text-xs font-semibold text-primary hover:underline underline-offset-4">Edit</button>
                  </div>
                  {currentStepIndex > 1 && (
                    <div className="flex items-start justify-between gap-4 px-5 py-3.5">
                      <div className="flex gap-3 min-w-0">
                        <Truck size={16} className="mt-0.5 shrink-0 text-ink/40" />
                        <p className="text-ink/80">
                          {`${formData.firstName} ${formData.lastName}`.trim()}, {formData.addressLine1}, {formData.city}, {formData.state} {formData.postalCode}
                        </p>
                      </div>
                      <button onClick={() => setCurrentStep('shipping')} disabled={loading} className="shrink-0 text-xs font-semibold text-primary hover:underline underline-offset-4">Edit</button>
                    </div>
                  )}
                </div>
              )}

              {/* Current step */}
              <div className="rounded-3xl bg-white ring-1 ring-stone-200/70 p-5 md:p-7">
                {error && (
                  <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">{error}</div>
                )}

                {currentStep === 'contact' && (
                  <div>
                    <h2 className="font-heading text-lg font-bold text-ink">Contact details</h2>
                    <p className="mt-1 text-sm text-ink/55">We’ll send your order confirmation and updates here.</p>
                    <div className="mt-5 space-y-4">
                      <div>
                        <label htmlFor="email" className={labelClass}>Email</label>
                        <input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleInputChange} className={inputClass} placeholder="you@example.com" />
                      </div>
                      <div>
                        <label htmlFor="phone" className={labelClass}>Phone number</label>
                        <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={formData.phone} onChange={handleInputChange} className={inputClass} placeholder="10-digit mobile number" />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 'shipping' && (
                  <div>
                    <h2 className="font-heading text-lg font-bold text-ink">Delivery address</h2>
                    <p className="mt-1 text-sm text-ink/55">Where should we send your little one’s outfit?</p>
                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className={labelClass}>First name</label>
                        <input id="firstName" name="firstName" type="text" autoComplete="given-name" value={formData.firstName} onChange={handleInputChange} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="lastName" className={labelClass}>Last name</label>
                        <input id="lastName" name="lastName" type="text" autoComplete="family-name" value={formData.lastName} onChange={handleInputChange} className={inputClass} />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="addressLine1" className={labelClass}>Address</label>
                        <input id="addressLine1" name="addressLine1" type="text" autoComplete="street-address" value={formData.addressLine1} onChange={handleInputChange} className={inputClass} placeholder="House no., building, street, area" />
                      </div>
                      <div>
                        <label htmlFor="city" className={labelClass}>City</label>
                        <input id="city" name="city" type="text" autoComplete="address-level2" value={formData.city} onChange={handleInputChange} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="state" className={labelClass}>State</label>
                        <input id="state" name="state" type="text" autoComplete="address-level1" value={formData.state} onChange={handleInputChange} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="postalCode" className={labelClass}>PIN code</label>
                        <input id="postalCode" name="postalCode" type="text" inputMode="numeric" autoComplete="postal-code" value={formData.postalCode} onChange={handleInputChange} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="country" className={labelClass}>Country</label>
                        <input id="country" name="country" type="text" autoComplete="country-name" value={formData.country} onChange={handleInputChange} className={inputClass} />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 'payment' && (
                  <div>
                    <h2 className="font-heading text-lg font-bold text-ink">Payment</h2>
                    <p className="mt-1 text-sm text-ink/55">You’ll complete payment securely in the Razorpay window.</p>
                    <div className="mt-5 flex items-center gap-4 rounded-2xl bg-primary/5 ring-2 ring-primary px-4 py-4">
                      <span className="w-5 h-5 rounded-full border-[6px] border-primary bg-white shrink-0" aria-hidden />
                      <div className="flex-1">
                        <p className="font-semibold text-ink">UPI, cards & more</p>
                        <p className="text-xs text-ink/55">Powered by Razorpay</p>
                      </div>
                      <CreditCard className="text-primary" size={22} />
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-7 flex items-center justify-between gap-4">
                  {currentStep !== 'contact' ? (
                    <button onClick={goBack} disabled={loading} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-primary disabled:opacity-40">
                      <ArrowLeft size={16} /> Back
                    </button>
                  ) : <span />}

                  {currentStep === 'payment' ? (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="h-13 min-h-[52px] px-7 rounded-full bg-primary hover:bg-primary-hover text-white font-semibold shadow-lg shadow-primary/25 inline-flex items-center gap-2 transition-colors disabled:opacity-60 tabular-nums"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <><Lock size={16} /> Pay {rupees(grandTotal)}</>}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextStep}
                      disabled={loading}
                      className="min-h-[52px] px-7 rounded-full bg-primary hover:bg-primary-hover text-white font-semibold shadow-lg shadow-primary/25 inline-flex items-center gap-2 transition-colors disabled:opacity-60"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <>Continue to {currentStep === 'contact' ? 'address' : 'payment'} <ArrowRight size={16} /></>}
                    </button>
                  )}
                </div>
              </div>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink/50">
                <ShieldCheck size={14} /> Your payment details are handled securely by Razorpay
              </p>
            </div>

            {/* Desktop: order summary */}
            <aside className="hidden lg:block lg:col-span-5 lg:sticky lg:top-28">{summary}</aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

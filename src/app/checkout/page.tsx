"use client"
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock, CreditCard, Truck, User, Mail } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { CheckoutStep } from '@/types/checkout'

export default function CheckoutPage() {
  const { items, totals, totalItems } = useCartStore()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact')
  
  // Redirect if cart is empty
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
    { id: 'review', name: 'Review', icon: User },
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

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
                  <div className="flex justify-between items-center">
                    {steps.map((step, index) => {
                      const StepIcon = step.icon
                      const isActive = index === currentStepIndex
                      const isCompleted = index < currentStepIndex
                      
                      return (
                        <div key={step.id} className="flex items-center">
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
                            ml-2 text-sm font-medium
                            ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'}
                          `}>
                            {step.name}
                          </span>
                          {index < steps.length - 1 && (
                            <div className={`
                              w-16 h-0.5 mx-4
                              ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}
                            `} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Step Content */}
                <div className="p-6">
                  {currentStep === 'contact' && <ContactStep />}
                  {currentStep === 'shipping' && <ShippingStep />}
                  {currentStep === 'payment' && <PaymentStep />}
                  {currentStep === 'review' && <ReviewStep />}
                </div>

                {/* Navigation */}
                <div className="p-6 border-t border-gray-100 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const prevIndex = Math.max(0, currentStepIndex - 1)
                      setCurrentStep(steps[prevIndex].id as CheckoutStep)
                    }}
                    disabled={currentStepIndex === 0}
                  >
                    Previous
                  </Button>
                  
                  <Button
                    onClick={() => {
                      if (currentStepIndex < steps.length - 1) {
                        const nextIndex = currentStepIndex + 1
                        setCurrentStep(steps[nextIndex].id as CheckoutStep)
                      } else {
                        // Handle order submission
                        console.log('Submit order')
                      }
                    }}
                    className="bg-primary hover:bg-primary/90 text-black"
                  >
                    {currentStepIndex === steps.length - 1 ? 'Place Order' : 'Continue'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <h2 className="font-semibold text-ink mb-4">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{item.product.name}</p>
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
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-text">Tax</span>
                    <span className="text-ink">₹{totals.tax.toLocaleString()}</span>
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

// Step Components (placeholder implementations)
function ContactStep() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-ink">Contact Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Phone Number</label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Enter your phone number"
          />
        </div>
      </div>
    </div>
  )
}

function ShippingStep() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-ink">Shipping Address</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">First Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="First name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Last Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Last name"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-ink mb-2">Address</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Street address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">City</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="City"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Postal Code</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Postal code"
          />
        </div>
      </div>
    </div>
  )
}

function PaymentStep() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-ink">Payment Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <button className="p-4 border-2 border-primary bg-primary/10 rounded-lg text-center">
            <CreditCard className="mx-auto mb-2" size={20} />
            <span className="text-sm font-medium">Card</span>
          </button>
          <button className="p-4 border-2 border-gray-300 rounded-lg text-center hover:border-primary">
            <div className="mx-auto mb-2 w-5 h-5 bg-primary rounded" />
            <span className="text-sm font-medium">UPI</span>
          </button>
          <button className="p-4 border-2 border-gray-300 rounded-lg text-center hover:border-primary">
            <div className="mx-auto mb-2 w-5 h-5 bg-green-500 rounded" />
            <span className="text-sm font-medium">COD</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function ReviewStep() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-ink">Review Your Order</h2>
      <p className="text-muted-text">Please review your order details before placing your order.</p>
    </div>
  )
}
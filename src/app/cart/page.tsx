'use client'

import { useEffect } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'

// Disable static generation (uses cart state)
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default function CartPage() {
  const { items, totals, updateQuantity, removeItem, clearCart, totalItems, fetchCart } = useCartStore()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  if (totalItems === 0) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-cream/30">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-ink mb-2">Your cart is empty</h2>
              <p className="text-muted-text mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link href="/products">
                <Button className="bg-primary hover:bg-primary/90 text-black">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-cream">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-[var(--font-heading)] font-bold text-ink mb-2">Shopping Cart</h1>
              <p className="text-gray-600">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>

            <Link
              href="/products"
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Clear Cart Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-ink text-lg">Cart Items</h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>

              {/* Cart Item Cards */}
              {items.map((item, index) => (
                <div key={`${item.product.id}-${item.size}`} className="bg-white rounded-lg p-4 sm:p-6 shadow-card">
                  <div className="flex flex-col max-[400px]:items-center sm:flex-row gap-4">
                    {/* Product Image */}
                    <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
                      <div className="w-full max-[400px]:aspect-square max-[400px]:h-auto sm:w-24 sm:h-24 md:w-32 md:h-32 w-24 h-24 rounded-lg overflow-hidden bg-cream relative">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-semibold text-ink hover:text-primary transition-colors block line-clamp-2 break-words text-sm sm:text-base"
                          >
                            {item.product.name}
                          </Link>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs sm:text-sm text-gray-600">
                            <span>Size: <span className="font-medium">{item.size}</span></span>
                            <span className="capitalize">Category: {item.product.category}</span>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-bold text-ink">
                              ₹{(item.product.price || 0).toLocaleString()}
                            </span>
                            {item.product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between sm:justify-start gap-4 mt-2 sm:mt-0">
                          <div className="flex items-center border border-gray-200 rounded-lg h-9 sm:h-auto">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                              className="p-1 sm:p-2 hover:bg-gray-50 transition-colors w-8 sm:w-auto h-full flex items-center justify-center"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} className="sm:w-4 sm:h-4" />
                            </button>
                            <span className="px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base font-medium min-w-[2.5rem] sm:min-w-[3rem] text-center border-x border-gray-100 flex items-center justify-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                              className="p-1 sm:p-2 hover:bg-gray-50 transition-colors w-8 sm:w-auto h-full flex items-center justify-center"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} className="sm:w-4 sm:h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.product.id, item.size)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors ml-auto sm:ml-0"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Item Subtotal */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="font-bold text-ink">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-card sticky top-24">
                <h2 className="font-semibold text-ink text-lg mb-6">Order Summary</h2>

                <div className="space-y-4">
                  {/* Items Summary */}
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({totalItems}):</span>
                    <span>₹{totals.subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span className="text-green-600 font-medium">
                      {totals.shipping > 0 ? `₹${totals.shipping.toLocaleString()}` : 'Free'}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax:</span>
                    <span>₹{totals.tax.toLocaleString()}</span>
                  </div>

                  <hr className="border-gray-200" />

                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold text-ink">
                    <span>Total:</span>
                    <span>₹{totals.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <button
                    className="w-full mt-6 bg-primary hover:bg-primary/90 text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={20} />
                    Proceed to Checkout
                  </button>
                </Link>

                {/* Continue Shopping Link */}
                <Link
                  href="/products"
                  className="block text-center mt-4 text-primary hover:text-primary/80 font-medium"
                >
                  Continue Shopping
                </Link>

                {/* Shipping Info */}
                <div className="mt-6 p-4 bg-mint rounded-lg">
                  <h3 className="font-medium text-primary mb-2">Free Shipping</h3>
                  <p className="text-sm text-gray-600">
                    Enjoy free shipping on all orders. Delivery within 3-5 business days.
                  </p>
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

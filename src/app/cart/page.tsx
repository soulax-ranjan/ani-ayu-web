'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore()

  const handleQuantityChange = (productId: string, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId, size)
    } else {
      updateQuantity(productId, size, newQuantity)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        
        <main className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-8">
              <ShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
              <h1 className="text-2xl font-[var(--font-heading)] font-bold text-ink mb-2">Your cart is empty</h1>
              <p className="text-gray-600">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
            </div>
            
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
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
          <div className="flex items-center justify-between mb-8">
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
                <div key={`${item.product.id}-${item.size}`} className="bg-white rounded-lg p-6 shadow-card">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-cream">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Link 
                            href={`/products/${item.product.id}`}
                            className="font-semibold text-ink hover:text-primary transition-colors block truncate"
                          >
                            {item.product.name}
                          </Link>
                          
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>Size: <span className="font-medium">{item.size}</span></span>
                            <span className="capitalize">Category: {item.product.category}</span>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-bold text-ink">
                              ₹{item.product.price.toLocaleString()}
                            </span>
                            {item.product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.size, item.quantity - 1)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-3 py-2 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.size, item.quantity + 1)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.product.id, item.size)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
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
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax:</span>
                    <span>₹0</span>
                  </div>
                  
                  <hr className="border-gray-200" />
                  
                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold text-ink">
                    <span>Total:</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <button 
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => alert('Checkout functionality coming soon!')}
                >
                  <ShoppingBag size={20} />
                  Proceed to Checkout
                </button>
                
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

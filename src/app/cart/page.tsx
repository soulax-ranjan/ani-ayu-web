'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Lock, Scissors, RefreshCw, Tag } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'

// Disable static generation (uses cart state)
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

const rupees = (n: number) => `₹${(n || 0).toLocaleString('en-IN')}`

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, totals, removeItem, clearCart, totalItems, fetchCart, error } = useCartStore()

  useEffect(() => {
    setMounted(true)
    fetchCart()
  }, [fetchCart])

  if (!mounted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#fdfbf7]">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              {[1, 2].map((i) => <div key={i} className="h-36 rounded-2xl bg-stone-100 animate-pulse" />)}
            </div>
            <div className="lg:col-span-4 h-72 rounded-3xl bg-stone-100 animate-pulse" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (totalItems === 0) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] bg-[#fdfbf7] flex items-center">
          <div className="max-w-md mx-auto px-4 py-16 text-center">
            <div className="relative mx-auto w-40 aspect-[683/596] opacity-70">
              <Image src="/assets/mascot-sketch.webp" alt="" fill sizes="160px" className="object-contain" />
            </div>
            <h1 className="mt-6 font-heading text-2xl md:text-3xl font-bold text-ink">Your bag is empty</h1>
            <p className="mt-2 text-ink/60">Find something your little one will love to twirl in.</p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-7 py-3.5 font-semibold shadow-lg shadow-primary/25 transition-colors">
                Start shopping <ArrowRight size={18} />
              </Link>
            </div>
            <div className="mt-4 flex justify-center gap-5 text-sm">
              <Link href="/products?category=girls" className="font-medium text-primary hover:underline underline-offset-4">Shop girls</Link>
              <Link href="/products?category=boys" className="font-medium text-primary hover:underline underline-offset-4">Shop boys</Link>
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

      <main className="min-h-screen bg-[#fdfbf7] pb-24 lg:pb-0">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
          {/* Page header */}
          <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-ink">Your bag</h1>
              <p className="mt-1 text-sm text-ink/60 tabular-nums">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            </div>
            <Link href="/products" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4">
              <ArrowLeft size={16} /> Continue shopping
            </Link>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Items */}
            <div className="lg:col-span-8">
              {error && (
                <div className="mb-4 flex items-start justify-between gap-4 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700 ring-1 ring-red-100">
                  <span>{error}</span>
                  <button onClick={() => useCartStore.setState({ error: null })} className="text-red-400 hover:text-red-600" aria-label="Dismiss">×</button>
                </div>
              )}

              <ul className="rounded-3xl bg-white ring-1 ring-stone-200/70 divide-y divide-stone-200/70">
                {items.map((item) => (
                  <li key={`${item.product.id}-${item.size}`} className="flex gap-4 p-4 md:p-5">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="relative w-24 md:w-28 aspect-[4/5] shrink-0 rounded-2xl overflow-hidden bg-gradient-to-b from-[#fbf6ee] to-[#f1e7da]"
                    >
                      <Image src={item.product.image} alt={item.product.name} fill sizes="112px" className="object-cover object-[center_15%]" />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="font-heading font-semibold text-ink hover:text-primary transition-colors line-clamp-2 text-sm md:text-base"
                        >
                          {item.product.name}
                        </Link>
                        <p className="shrink-0 font-heading font-bold text-ink tabular-nums">{rupees(item.product.price * item.quantity)}</p>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-ink/70">Age: <span className="font-semibold text-ink">{item.size}</span></span>
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-ink/70 tabular-nums">Qty: <span className="font-semibold text-ink">{item.quantity}</span></span>
                      </div>

                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <div className="flex items-baseline gap-2 text-sm tabular-nums">
                          <span className="text-ink/70">{rupees(item.product.price)}</span>
                          {(item.product.originalPrice ?? 0) > item.product.price && (
                            <span className="text-xs text-ink/40 line-through">{rupees(item.product.originalPrice!)}</span>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink/50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between">
                <Link href="/products" className="sm:hidden inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  <ArrowLeft size={16} /> Continue shopping
                </Link>
                <button onClick={clearCart} className="ml-auto text-sm font-medium text-ink/50 hover:text-red-600 underline underline-offset-4">
                  Clear bag
                </button>
              </div>
            </div>

            {/* Summary */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="rounded-3xl bg-white ring-1 ring-stone-200/70 p-5 md:p-6">
                <h2 className="font-heading text-lg font-bold text-ink">Order summary</h2>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-ink/70">
                    <dt>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</dt>
                    <dd className="tabular-nums">{rupees(totals.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-ink/70">
                    <dt>Shipping</dt>
                    <dd className={totals.shipping > 0 ? 'tabular-nums' : 'font-medium text-primary'}>
                      {totals.shipping > 0 ? rupees(totals.shipping) : 'Free'}
                    </dd>
                  </div>
                  {totals.tax > 0 && (
                    <div className="flex justify-between text-ink/70">
                      <dt>Tax</dt>
                      <dd className="tabular-nums">{rupees(totals.tax)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline border-t border-stone-200/70 pt-4">
                    <dt className="font-semibold text-ink">Total</dt>
                    <dd className="font-heading text-2xl font-bold text-ink tabular-nums">{rupees(totals.total)}</dd>
                  </div>
                  <p className="text-xs text-ink/50">Inclusive of all taxes</p>
                </dl>

                <div className="mt-5 flex items-center gap-2.5 rounded-2xl bg-[#e6c88a]/15 px-4 py-3 text-xs text-[#6f5429]">
                  <Tag size={16} className="shrink-0" />
                  <span>First order? Use <strong className="tracking-wider">FIRSTBUY10</strong> at checkout for 10% off.</span>
                </div>

                <Link
                  href="/checkout"
                  className="mt-5 hidden lg:flex w-full h-14 items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white font-semibold shadow-lg shadow-primary/25 transition-colors"
                >
                  <Lock size={16} /> Checkout securely
                </Link>

                <ul className="mt-5 space-y-3 border-t border-stone-200/70 pt-5 text-xs text-ink/65">
                  <li className="flex items-start gap-2.5">
                    <Scissors size={16} className="shrink-0 text-primary" strokeWidth={1.75} />
                    <span>Crafted to order and dispatched within 7 business days. <Link href="/help/shipping" className="text-primary hover:underline">Shipping info</Link></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <RefreshCw size={16} className="shrink-0 text-primary" strokeWidth={1.75} />
                    <span>Size exchanges available. <Link href="/help/returns" className="text-primary hover:underline">Exchange policy</Link></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShoppingBag size={16} className="shrink-0 text-primary" strokeWidth={1.75} />
                    <span>Secure payments via Razorpay</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Mobile checkout bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center gap-3">
        <div>
          <p className="text-xs text-ink/55">Total</p>
          <p className="font-heading text-lg font-bold text-ink leading-none tabular-nums">{rupees(totals.total)}</p>
        </div>
        <Link href="/checkout" className="ml-auto h-12 px-6 rounded-full bg-primary text-white font-semibold flex items-center gap-2">
          <Lock size={16} /> Checkout
        </Link>
      </div>

      <Footer />
    </>
  )
}

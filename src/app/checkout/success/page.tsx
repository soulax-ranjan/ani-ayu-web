'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
    CheckCircle, Package, ArrowRight, MapPin,
    CreditCard, Calendar, ShoppingBag, Clock, Truck
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { apiClient } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { trackEvent } from '@/lib/mixpanel'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

function OrderSuccessContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const clearCart = useCartStore(state => state.clearCart)

    useEffect(() => {
        if (orderId) {
            apiClient.getOrder(orderId)
                .then(data => {
                    const orderData = data.order || data
                    setOrder(orderData)
                    clearCart()
                    trackEvent('Purchase Completed', {
                        order_id: orderId,
                        total_amount: orderData.total_amount || orderData.totalAmount || orderData.amount || 0,
                        currency: 'INR'
                    })
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [orderId, clearCart])

    if (!orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Invalid Order ID</p>
            </div>
        )
    }

    const shortId = orderId.split('-')[0].toUpperCase()
    const orderDate = order?.created_at
        ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

    const estimatedDelivery = (() => {
        const d = new Date()
        d.setDate(d.getDate() + 5)
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })
    })()

    const totalAmount = order?.total_amount || order?.totalAmount || order?.amount || 0
    const items = order?.items || order?.orderItems || order?.order_items || []
    const address = order?.shippingAddress || order?.shipping_address || order?.address || null
    const paymentStatus = order?.payment_status || order?.paymentStatus || 'paid'

    return (
        <main className="min-h-screen bg-[#f7f4f0] py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-4">

                {/* ── Success Header ── */}
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-stone-100">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle className="text-primary w-10 h-10" strokeWidth={2} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-ink mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        Order Confirmed! 🎉
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base mb-5">
                        Thank you for shopping with <span className="font-semibold text-ink">Ani & Ayu</span>. Your little one is going to look amazing!
                    </p>

                    {/* Order meta row */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-full text-gray-600">
                            <Package size={14} className="text-primary" />
                            <span>Order <strong className="text-ink">#{shortId}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-full text-gray-600">
                            <Calendar size={14} className="text-primary" />
                            <span>{orderDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-full text-gray-600">
                            <CreditCard size={14} className="text-primary" />
                            <span className="capitalize">{paymentStatus === 'paid' ? '✓ Payment Received' : paymentStatus}</span>
                        </div>
                    </div>
                </div>

                {/* ── What Happens Next ── */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-stone-100">
                    <h2 className="font-semibold text-ink mb-4 text-sm uppercase tracking-wider">What happens next</h2>
                    <div className="space-y-4">
                        {[
                            { icon: CheckCircle, label: 'Order Confirmed', sub: 'Your order has been received', done: true },
                            { icon: Package, label: 'Packing', sub: 'We\'re carefully packing your order', done: false },
                            { icon: Truck, label: 'Shipped', sub: 'Tracking details will be sent to your email', done: false },
                            { icon: Clock, label: `Delivered by ${estimatedDelivery}`, sub: '3–5 business days', done: false },
                        ].map((step, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-primary text-white' : 'bg-stone-100 text-stone-400'}`}>
                                    <step.icon size={14} />
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${step.done ? 'text-ink' : 'text-gray-500'}`}>{step.label}</p>
                                    <p className="text-xs text-gray-400">{step.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Items Ordered ── */}
                {!loading && items.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-stone-100">
                        <h2 className="font-semibold text-ink mb-4 text-sm uppercase tracking-wider">Items Ordered</h2>
                        <div className="space-y-4">
                            {items.map((item: any, i: number) => {
                                const product = item.product || item
                                const name = product?.name || item.name || item.product_name || 'Product'
                                const image = product?.image_url || item.image || item.image_url || null
                                const size = item.size || item.selectedSize || '—'
                                const qty = item.quantity || 1
                                const price = item.price || item.unit_price || product?.price || 0
                                return (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0 relative">
                                            {image ? (
                                                <Image src={image} alt={name} fill className="object-cover" sizes="56px" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag size={20} className="text-stone-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-ink truncate">{name}</p>
                                            <p className="text-xs text-gray-400">Size: {size} · Qty: {qty}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-primary flex-shrink-0">
                                            ₹{(price * qty).toLocaleString()}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Total */}
                        <div className="border-t border-stone-100 mt-4 pt-4 flex justify-between items-center">
                            <span className="text-sm text-gray-500">Order Total</span>
                            <span className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                                ₹{Number(totalAmount).toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}

                {/* ── Shipping Address ── */}
                {address && (
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-stone-100">
                        <h2 className="font-semibold text-ink mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                            <MapPin size={14} className="text-primary" /> Delivering To
                        </h2>
                        <p className="text-sm text-ink font-medium">{address.full_name || address.fullName}</p>
                        <p className="text-sm text-gray-500">{address.address_line1 || address.addressLine1}</p>
                        <p className="text-sm text-gray-500">
                            {[address.city, address.state, address.postal_code || address.postalCode].filter(Boolean).join(', ')}
                        </p>
                        {(address.phone || address.contact) && (
                            <p className="text-sm text-gray-500 mt-1">📞 {address.phone || address.contact}</p>
                        )}
                    </div>
                )}

                {/* ── CTAs ── */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/orders" className="flex-1">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2">
                            <Package size={18} />
                            Track My Order
                        </Button>
                    </Link>
                    <Link href="/products" className="flex-1">
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                            <ShoppingBag size={18} />
                            Continue Shopping
                            <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-gray-400 pb-4">
                    A confirmation email will be sent to your registered email address. For any queries, reach us at{' '}
                    <a href="mailto:hello@aniayu.in" className="text-primary underline">hello@aniayu.in</a>
                </p>
            </div>
        </main>
    )
}

export default function OrderSuccessPage() {
    return (
        <>
            <Header />
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#f7f4f0]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            }>
                <OrderSuccessContent />
            </Suspense>
            <Footer />
        </>
    )
}

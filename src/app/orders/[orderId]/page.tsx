'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { apiClient } from '@/lib/api'
import { Loader2, ArrowLeft, MapPin, CreditCard, Clock, Package, CheckCircle, Truck, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function OrderDetailsPage() {
    const { orderId } = useParams()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (orderId) {
            setLoading(true)
            // The id in URL is a string, params are possibly string[]
            const id = Array.isArray(orderId) ? orderId[0] : orderId
            apiClient.getOrder(id)
                .then(data => {
                    // API might return { order: ... } or just order object
                    setOrder(data.order || data)
                })
                .catch(err => {
                    console.error('Failed to fetch order', err)
                    setError('Failed to load order details. You typically need to be in the same session (browser) used to purchase, or track via the tracking page.')
                })
                .finally(() => setLoading(false))
        }
    }, [orderId])

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-cream/30">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <Footer />
            </>
        )
    }

    if (error || !order) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-cream/30 px-4">
                    <div className="text-center max-w-md">
                        <div className="bg-red-50 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-ink mb-2">Order Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || "We couldn't locate this order."}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/orders">
                                <Button variant="outline">Try Tracking Page</Button>
                            </Link>
                            <Link href="/">
                                <Button>Go Home</Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    const { items, address, status, created_at, total_amount, amount, payment_method, payment_status } = order
    const displayTotal = total_amount || amount || 0

    const statusSteps = ['pending', 'processing', 'shipped', 'delivered']
    const currentStepIndex = statusSteps.indexOf(status?.toLowerCase()) >= 0
        ? statusSteps.indexOf(status?.toLowerCase())
        : status === 'cancelled' ? -1 : 0

    return (
        <>
            <Header />
            <main className="min-h-screen bg-cream/30 py-8 px-4">
                <div className="container mx-auto max-w-5xl">

                    {/* Header & Nav */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <Link href="/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ArrowLeft size={20} className="text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-ink">Order #{order.id.slice(0, 8)}</h1>
                                <p className="text-gray-500 text-sm">
                                    Placed on {new Date(created_at).toLocaleDateString("en-IN", {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => window.print()}>
                                Download Invoice
                            </Button>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Order Status */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-ink mb-6">Order Status</h3>

                                {status === 'cancelled' ? (
                                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3">
                                        <AlertCircle />
                                        <span className="font-medium">Order Cancelled</span>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full" />
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 -z-10 rounded-full transition-all duration-1000"
                                            style={{ width: `${(Math.max(0, currentStepIndex) / (statusSteps.length - 1)) * 100}%` }} />

                                        <div className="flex justify-between">
                                            {statusSteps.map((step, idx) => {
                                                const isCompleted = idx <= currentStepIndex
                                                const isCurrent = idx === currentStepIndex

                                                let Icon = Package
                                                if (step === 'processing') Icon = Clock
                                                if (step === 'shipped') Icon = Truck
                                                if (step === 'delivered') Icon = CheckCircle

                                                return (
                                                    <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                                            ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'}
                                        `}>
                                                            <Icon size={18} />
                                                        </div>
                                                        <span className={`text-xs font-medium capitalize ${isCurrent ? 'text-ink' : 'text-gray-500'}`}>
                                                            {step}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-ink mb-4">Items ({items?.length || 0})</h3>
                                <div className="divide-y divide-gray-100">
                                    {items.map((item: any) => (
                                        <div key={item.id} className="py-4 flex gap-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                {item.product.image && (
                                                    <Image
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-ink truncate">{item.product.name}</h4>
                                                <div className="text-sm text-gray-500 mt-1 space-y-1">
                                                    <p>Size: {item.size}</p>
                                                    <p>Qty: {item.quantity} x ₹{item.product.price?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-ink">₹{((item.price || item.product.price) * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Sidebar info */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Order Summary */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-ink mb-4">Order Summary</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{displayTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-ink">
                                        <span>Total</span>
                                        <span>₹{displayTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Details */}
                            {address && (
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
                                        <MapPin size={18} className="text-primary" />
                                        Shipping Details
                                    </h3>
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p className="font-medium text-ink">{address.full_name}</p>
                                        <p>{address.address_line1}</p>
                                        <p>{address.city}, {address.state} {address.postal_code}</p>
                                        <p>{address.country}</p>
                                        <div className="pt-2 mt-2 border-t border-gray-100">
                                            <p className="font-medium text-ink">Contact</p>
                                            <p>{address.phone}</p>
                                            <p>{address.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payment Info */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
                                    <CreditCard size={18} className="text-primary" />
                                    Payment Information
                                </h3>
                                <div className="text-sm">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Method</span>
                                        <span className="font-medium capitalize">{payment_method || 'Card'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status</span>
                                        <span className={`font-medium capitalize px-2 py-0.5 rounded text-xs ${payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {payment_status || 'Pending'}
                                        </span>
                                    </div>
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

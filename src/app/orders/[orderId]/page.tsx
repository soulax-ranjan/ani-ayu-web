'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { apiClient } from '@/lib/api'
import {
    Loader2,
    ArrowLeft,
    MapPin,
    CreditCard,
    Clock,
    Package,
    CheckCircle,
    Truck,
    AlertCircle,
    Receipt,
    Calendar,
    ChevronRight,
    ShoppingBag
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const runtime = 'edge'

export default function OrderDetailsPage() {
    const params = useParams()
    const urlOrderId = params?.orderId
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (urlOrderId) {
            setLoading(true)
            const id = Array.isArray(urlOrderId) ? urlOrderId[0] : urlOrderId
            // Use GET /orders/track/:orderId as the primary endpoint
            apiClient.trackOrderById(id)
                .then(data => {
                    setOrder(data.order || data)
                })
                .catch(() => {
                    // Fallback to getOrder if track endpoint fails
                    return apiClient.getOrder(id).then(data => {
                        setOrder(data.order || data)
                    })
                })
                .catch(err => {
                    console.error('Failed to fetch order', err)
                    setError('Could not load this order. Please try tracking from your orders page.')
                })
                .finally(() => setLoading(false))
        }
    }, [urlOrderId])

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-cream/50 to-white">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                        </div>
                        <p className="text-gray-500 font-medium animate-pulse">Loading order details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-cream/50 to-white px-4 py-12">
                    <div className="text-center w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100/50 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                        <div className="bg-red-50 text-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <AlertCircle size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-ink mb-3 tracking-tight">Order Not Found</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">{error || "We couldn't locate this order. It might have been removed or the ID is incorrect."}</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/orders" className="flex-1">
                                <Button variant="outline" className="w-full rounded-xl py-6 hover:bg-gray-50 transition-all">Try Tracking again</Button>
                            </Link>
                            <Link href="/" className="flex-1">
                                <Button className="w-full rounded-xl py-6 shadow-md hover:shadow-lg transition-all">Go back Home</Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    const orderIdStr: string = order.id || order.order_id || order.razorpay_order_id || order._id || ''
    const { items, address, status, created_at, total_amount, amount, payment_method, payment_status, discount_amount } = order
    const displayTotal = total_amount || amount || 0
    const displayDiscount = discount_amount || 0;

    const statusObj = status?.toLowerCase() || 'pending'
    const statusSteps = ['pending', 'processing', 'shipped', 'delivered']
    let currentStepIndex = statusSteps.indexOf(statusObj)
    if (currentStepIndex < 0) {
        if (statusObj === 'cancelled') currentStepIndex = -1
        else currentStepIndex = 0
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#faf9f6]">
            <Header />
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <Link href="/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm font-medium group">
                                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                                    <ArrowLeft size={16} />
                                </div>
                                Back to Tracking
                            </Link>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight flex items-center gap-3">
                                    Order <span className="text-primary font-mono text-2xl md:text-3xl bg-primary/10 px-3 py-1 rounded-lg">#{orderIdStr.slice(0, 8).toUpperCase()}</span>
                                </h1>
                                <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm font-medium">
                                    <div className="flex items-center gap-1.5"><Calendar size={16} />
                                        {new Date(created_at).toLocaleDateString("en-IN", {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                    <div className="flex items-center gap-1.5"><Clock size={16} />
                                        {new Date(created_at).toLocaleTimeString("en-IN", {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => window.print()}
                            className="rounded-full px-6 bg-white border-gray-200 shadow-sm hover:border-primary hover:text-primary transition-all flex items-center gap-2"
                        >
                            <Receipt size={16} />
                            Download Invoice
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column - Main Details */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* Visual Status Tracker */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-ink mb-8 flex items-center gap-2">
                                    <Package className="text-primary" size={24} />
                                    Tracking Status
                                </h3>

                                {statusObj === 'cancelled' ? (
                                    <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 text-center">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                                            <AlertCircle size={32} className="text-red-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold">Order Cancelled</h4>
                                            <p className="text-red-600/80 text-sm mt-1">This order has been cancelled and will not be shipped.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative px-4 sm:px-10 mt-10 mb-6">
                                        {/* Background Track */}
                                        <div className="absolute left-[10%] sm:left-[12%] right-[10%] sm:right-[12%] top-6 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            {/* Fill Track */}
                                            <div
                                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-1000 ease-out rounded-full"
                                                style={{ width: `${(Math.max(0, currentStepIndex) / (statusSteps.length - 1)) * 100}%` }}
                                            />
                                        </div>

                                        <div className="relative flex justify-between z-10">
                                            {statusSteps.map((step, idx) => {
                                                const isCompleted = idx <= currentStepIndex
                                                const isCurrent = idx === currentStepIndex

                                                let Icon = Package
                                                if (step === 'processing') Icon = Clock
                                                if (step === 'shipped') Icon = Truck
                                                if (step === 'delivered') Icon = CheckCircle

                                                return (
                                                    <div key={step} className="flex flex-col items-center gap-3 group">
                                                        <div className={`
                                                            w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-[3px] transition-all duration-500 bg-white
                                                            ${isCompleted
                                                                ? 'border-primary text-primary shadow-md shadow-primary/20 scale-110'
                                                                : 'border-gray-100 text-gray-300'
                                                            }
                                                            ${isCurrent ? 'ring-4 ring-primary/10' : ''}
                                                        `}>
                                                            <Icon size={24} className={isCompleted && !isCurrent ? "" : "animate-[pulse_2s_ease-in-out_infinite]"} style={{ animationPlayState: isCurrent ? 'running' : 'paused' }} />
                                                        </div>
                                                        <div className="text-center">
                                                            <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider block transition-colors ${isCurrent ? 'text-primary' : isCompleted ? 'text-ink' : 'text-gray-400'}`}>
                                                                {step}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-ink flex items-center gap-2">
                                        <ShoppingBag className="text-primary" size={24} />
                                        Items Ordered
                                    </h3>
                                    <span className="bg-gray-100 text-gray-600 text-sm font-bold px-3 py-1 rounded-full">{items?.length || 0}</span>
                                </div>

                                <div className="space-y-6">
                                    {items?.map((item: any) => {
                                        const product = item.product || {}
                                        const imageUrl = product.images?.[0] || product.image || '/placeholder-product.png'
                                        const price = item.price_at_purchase || item.price || product.price || 0
                                        const itemTotal = price * (item.quantity || 1)

                                        return (
                                            <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-4 rounded-2xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                                <div className="w-24 h-32 sm:w-28 sm:h-36 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative shadow-sm border border-gray-100">
                                                    <Image
                                                        src={imageUrl}
                                                        alt={product.name || 'Product Image'}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <h4 className="text-lg font-bold text-ink line-clamp-2 leading-tight mb-2">{product.name || 'Unknown Product'}</h4>

                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {item.size && (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-semibold text-gray-600">
                                                                Size: {item.size}
                                                            </span>
                                                        )}
                                                        {item.color && (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-semibold text-gray-600">
                                                                Color: {item.color}
                                                            </span>
                                                        )}
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-semibold text-gray-600">
                                                            Qty: {item.quantity || 1}
                                                        </span>
                                                    </div>

                                                    <div className="mt-auto flex items-center justify-between sm:justify-start gap-4">
                                                        <p className="text-gray-500 text-sm">₹{price.toLocaleString()} each</p>
                                                        <p className="font-extrabold text-ink text-lg sm:hidden">₹{itemTotal.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="hidden sm:flex flex-col items-end justify-center pl-4 border-l border-gray-100">
                                                    <p className="text-sm text-gray-400 font-medium mb-1">Total</p>
                                                    <p className="font-extrabold text-ink text-xl">₹{itemTotal.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary & Details */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Summary Card */}
                            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light"></div>
                                <h3 className="text-lg font-bold text-ink mb-6">Payment Summary</h3>

                                <div className="space-y-4 text-sm font-medium">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span className="text-ink">₹{(displayTotal + displayDiscount).toLocaleString()}</span>
                                    </div>
                                    {displayDiscount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>-₹{displayDiscount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-500">
                                        <span>Shipping</span>
                                        <span className="text-primary bg-primary/10 px-2 py-0.5 rounded text-xs uppercase tracking-wider font-bold">Free</span>
                                    </div>
                                    <div className="pt-4 border-t border-dashed border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-base text-gray-800 font-bold">Total Amount</span>
                                            <span className="text-2xl font-extrabold text-ink">₹{displayTotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Shipping Details */}
                            {address && (
                                <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold text-ink mb-5 flex items-center gap-2">
                                        <MapPin size={20} className="text-primary" />
                                        Shipping Address
                                    </h3>

                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100/50">
                                        <p className="font-bold text-ink text-base mb-2">{address.full_name}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                            {address.address_line1}<br />
                                            {address.address_line2 && <>{address.address_line2}<br /></>}
                                            {address.city}, {address.state} {address.postal_code}<br />
                                            {address.country}
                                        </p>

                                        <div className="space-y-2 pt-4 border-t border-gray-200/60">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <div className="w-6 text-center text-gray-400">📞</div>
                                                {address.phone}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 break-all">
                                                <div className="w-6 text-center text-gray-400">✉️</div>
                                                {address.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Need Help */}
                            <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 text-center">
                                <h4 className="font-bold text-ink mb-2">Need help with your order?</h4>
                                <p className="text-xs text-gray-600 mb-4">Our support team is available Monday to Friday, 9AM to 6PM</p>
                                <Button variant="outline" className="w-full bg-white hover:bg-primary hover:text-white transition-colors rounded-xl font-bold shadow-sm">
                                    Contact Support
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { apiClient, TrackedOrder } from '@/lib/api'
import { Loader2, Package, Calendar, ChevronRight, AlertCircle, Phone, CheckCircle, Truck, Clock, MapPin, XCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

// Same rules as the API: 10 digits, optionally prefixed with +91 / 91 / 0
function normalizePhone(input: string): string | null {
    let digits = input.replace(/\D/g, '')
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
    else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
    return /^\d{10}$/.test(digits) ? digits : null
}

const STEPS = [
    { status: 'pending', label: 'Placed', icon: Clock },
    { status: 'processing', label: 'Processing', icon: Package },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle },
] as const

const STATUS_BADGE: Record<string, string> = {
    delivered: 'bg-green-50 text-green-700 border border-green-200',
    shipped: 'bg-blue-50 text-blue-700 border border-blue-200',
    cancelled: 'bg-red-50 text-red-700 border border-red-200',
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusTracker({ status }: { status: TrackedOrder['status'] }) {
    if (status === 'cancelled') {
        return (
            <div className="flex items-center gap-3 bg-red-50 text-red-700 rounded-2xl px-4 py-3 text-sm font-medium">
                <XCircle size={18} className="shrink-0" /> This order was cancelled.
            </div>
        )
    }

    const current = Math.max(0, STEPS.findIndex(step => step.status === status))
    return (
        <ol className="flex items-start">
            {STEPS.map((step, index) => {
                const done = index <= current
                const Icon = step.icon
                return (
                    <li key={step.status} className="flex-1 flex flex-col items-center relative">
                        {index > 0 && (
                            <span className={`absolute top-4 right-1/2 w-full h-0.5 ${done ? 'bg-primary' : 'bg-gray-200'}`} />
                        )}
                        <span className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <Icon size={16} />
                        </span>
                        <span className={`mt-2 text-xs font-semibold ${done ? 'text-ink' : 'text-gray-400'}`}>{step.label}</span>
                    </li>
                )
            })}
        </ol>
    )
}

function OrderCard({ order }: { order: TrackedOrder }) {
    const { delivery } = order
    const place = [delivery.city, delivery.state?.trim(), delivery.postalCode].filter(Boolean).join(', ')

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Order Header */}
            <div className="px-6 md:px-8 py-5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/30">
                <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Order</p>
                    <p className="font-mono text-base font-bold text-primary">{order.orderNumber || '—'}</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide self-start sm:self-auto ${STATUS_BADGE[order.status] || 'bg-primary/5 text-primary border border-primary/20'}`}>
                    {order.status}
                </div>
            </div>

            {/* Progress */}
            <div className="px-6 md:px-8 py-6 border-b border-gray-50">
                <StatusTracker status={order.status} />
            </div>

            {/* Items */}
            <ul className="px-6 md:px-8 py-4 divide-y divide-gray-50 border-b border-gray-50">
                {order.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-4 py-3">
                        <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden relative shrink-0">
                            {item.image
                                ? <Image src={item.image} alt={item.name || 'Product'} fill sizes="64px" className="object-cover" />
                                : <Package className="w-6 h-6 text-gray-300 absolute inset-0 m-auto" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-ink text-sm truncate">{item.name || 'Product'}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {[item.size && `Size ${item.size}`, item.color, `Qty ${item.quantity}`].filter(Boolean).join(' · ')}
                            </p>
                        </div>
                        {item.price != null && (
                            <p className="text-sm font-bold text-ink shrink-0">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        )}
                    </li>
                ))}
            </ul>

            {/* Meta */}
            <div className="px-6 md:px-8 py-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Calendar size={14} className="text-primary" />
                        <p className="text-xs font-bold uppercase tracking-wider">Placed on</p>
                    </div>
                    <p className="text-ink font-bold text-sm">{order.createdAt ? formatDate(order.createdAt) : '—'}</p>
                </div>
                <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <MapPin size={14} className="text-primary" />
                        <p className="text-xs font-bold uppercase tracking-wider">Delivering to</p>
                    </div>
                    <p className="text-ink font-bold text-sm">{delivery.name || '—'}</p>
                    {place && <p className="text-xs text-gray-500">{place}</p>}
                </div>
                <div className="sm:text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total</p>
                    <p className="text-xl font-extrabold text-ink">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                    {!!order.discountAmount && (
                        <p className="text-xs text-green-600 font-medium">You saved ₹{Number(order.discountAmount).toLocaleString('en-IN')}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function TrackOrderPage() {
    const [phoneInput, setPhoneInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState<TrackedOrder[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        const phone = normalizePhone(phoneInput)
        if (!phone) {
            setError('Please enter the 10-digit mobile number you used at checkout')
            return
        }

        setLoading(true)
        setError(null)
        setOrders(null)

        try {
            const res = await apiClient.lookupOrdersByPhone(phone)
            setOrders(res.orders || [])
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#faf9f6]">
            <Header />
            <main className="flex-1 py-16 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">

                    {/* Page Header */}
                    <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center mx-auto mb-5 relative group">
                            <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                            <Package className="text-primary w-8 h-8 relative z-10 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-ink mb-4 tracking-tight">Track Your Order</h1>
                        <p className="text-gray-500 text-base max-w-sm mx-auto leading-relaxed">Enter the mobile number you used at checkout to see all your orders and their status.</p>
                    </div>

                    {/* Search Form */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 p-6 md:p-10 mb-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 delay-100 max-w-2xl mx-auto">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light hidden md:block"></div>

                        <form onSubmit={handleTrack} className="space-y-6 relative z-10">
                            <div>
                                <label htmlFor="track-phone" className="block text-sm font-bold text-ink mb-3 uppercase tracking-wider">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="track-phone"
                                        type="tel"
                                        inputMode="tel"
                                        value={phoneInput}
                                        onChange={(e) => setPhoneInput(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 md:py-5 border border-gray-200 rounded-2xl hover:border-gray-300 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-base tracking-wide bg-gray-50/50 focus:bg-white placeholder:text-gray-400"
                                        placeholder="e.g. 98765 43210"
                                        autoComplete="tel"
                                        maxLength={16}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-3 flex gap-1.5 items-start">
                                    <span className="text-primary">💡</span> Use the number from your delivery address.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle size={20} className="shrink-0 text-red-500" />
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-white py-4 md:py-6 rounded-2xl text-base font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading
                                    ? <><Loader2 className="animate-spin" size={20} /> Searching...</>
                                    : <>Track Order <ChevronRight size={18} /></>
                                }
                            </Button>
                        </form>
                    </div>

                    {/* Results */}
                    {orders && orders.length > 0 && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <p className="text-sm text-gray-500 font-medium">
                                {orders.length} order{orders.length !== 1 ? 's' : ''} found
                            </p>
                            {orders.map((order, index) => <OrderCard key={`${order.orderNumber}-${index}`} order={order} />)}
                        </div>
                    )}

                    {orders && orders.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                <Package className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-ink mb-2">No Orders Found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">We couldn&apos;t find any orders for this number. Please check it matches the one on your delivery address.</p>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    )
}

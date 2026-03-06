'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/api'
import { Loader2, Package, Calendar, ChevronRight, AlertCircle, ShoppingBag, Search, CheckCircle, Truck, Clock } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default function TrackOrderPage() {
    const [inputOrderId, setInputOrderId] = useState('')
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [searched, setSearched] = useState(false)

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = inputOrderId.trim()
        if (!trimmed) {
            setError('Please enter your Order ID')
            return
        }

        setLoading(true)
        setError(null)
        setOrder(null)
        setSearched(false)

        try {
            const res = await apiClient.trackOrderById(trimmed)
            const orderData = res.order || res
            setOrder(orderData)
            setSearched(true)
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'No order found with this ID. Please check and try again.')
            setSearched(true)
        } finally {
            setLoading(false)
        }
    }

    const { items, address, status, created_at, total_amount, amount, payment_method, payment_status, discount_amount } = order || {}
    const displayTotal = total_amount || amount || 0
    const orderIdStr: string = order?.id || order?.order_id || order?.razorpay_order_id || order?._id || ''

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
                        <p className="text-gray-500 text-base max-w-sm mx-auto leading-relaxed">Enter your Order ID below to get real-time updates on your shipment status.</p>
                    </div>

                    {/* Search Form */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 p-6 md:p-10 mb-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 delay-100 max-w-2xl mx-auto">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light hidden md:block"></div>

                        <form onSubmit={handleTrack} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-sm font-bold text-ink mb-3 uppercase tracking-wider">Order Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={inputOrderId}
                                        onChange={(e) => setInputOrderId(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 md:py-5 border border-gray-200 rounded-2xl hover:border-gray-300 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-mono text-base bg-gray-50/50 focus:bg-white placeholder:text-gray-400"
                                        placeholder="e.g. order_..."
                                        autoComplete="off"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-3 flex gap-1.5 items-start">
                                    <span className="text-primary">💡</span> Your Order ID was shared in the confirmation email and after checkout.
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

                    {/* Result */}
                    {searched && order && (
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 hover:shadow-xl transition-shadow group max-w-2xl mx-auto">
                            {/* Order Header */}
                            <div className="px-6 md:px-8 py-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Order Summary</p>
                                    <p className="font-mono text-xl font-extrabold text-ink bg-primary/10 px-3 py-1 rounded-lg inline-block text-primary">#{orderIdStr.slice(0, 8).toUpperCase()}</p>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide self-start sm:self-auto
                                    ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                                        order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                            order.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                'bg-primary/5 text-primary border border-primary/20'
                                    }`}>
                                    {order.status === 'delivered' && <CheckCircle size={16} />}
                                    {order.status === 'shipped' && <Truck size={16} />}
                                    {order.status === 'processing' && <Clock size={16} />}
                                    {order.status === 'pending' && <Clock size={16} />}
                                    {order.status === 'cancelled' && <AlertCircle size={16} />}
                                    {order.status || 'Processing'}
                                </div>
                            </div>

                            {/* Order Meta */}
                            <div className="px-6 md:px-8 py-6 grid grid-cols-2 gap-6 border-b border-gray-50">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <Calendar size={16} className="text-primary" />
                                        <p className="text-xs font-bold uppercase tracking-wider">Date Placed</p>
                                    </div>
                                    <p className="text-ink font-bold text-base">
                                        {order.created_at
                                            ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : '—'}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <ShoppingBag size={16} className="text-primary" />
                                        <p className="text-xs font-bold uppercase tracking-wider">Total Items</p>
                                    </div>
                                    <p className="text-ink font-bold text-base">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</p>
                                </div>
                            </div>

                            {/* Total + CTA */}
                            <div className="px-6 md:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white group-hover:bg-gray-50/50 transition-colors">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                                    <p className="text-2xl font-extrabold text-ink">₹{Number(displayTotal).toLocaleString()}</p>
                                </div>
                                <Link href={`/orders/${orderIdStr}`} className="w-full sm:w-auto">
                                    <Button variant="outline" className="w-full sm:w-auto bg-white hover:bg-primary hover:border-primary hover:text-white py-6 px-6 sm:px-8 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold shadow-sm group/btn">
                                        View Full Details <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}

                    {searched && !order && !error && (
                        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                <Package className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-ink mb-2">No Order Found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">We couldn't find an order matching that ID. Please check the spelling and try again.</p>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    )
}

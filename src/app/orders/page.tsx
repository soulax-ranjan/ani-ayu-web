'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/api'
import { Loader2, Package, Calendar, ChevronRight, AlertCircle, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function TrackOrderPage() {
    const [formData, setFormData] = useState({ email: '', phone: '' })
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)
    const [searched, setSearched] = useState(false)

    useEffect(() => {
        const fetchSessionOrders = async () => {
            try {
                setLoading(true)
                const res = await apiClient.getMyOrders()
                const orderList = Array.isArray(res) ? res : (res as any).orders || []

                if (orderList.length > 0) {
                    setOrders(orderList)
                    setSearched(true)
                }
            } catch (err) {
                // Session invalid or no orders, just show form
            } finally {
                setLoading(false)
            }
        }

        fetchSessionOrders()
    }, [])

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.email || !formData.phone) {
            setError('Please enter both email and phone number')
            return
        }

        setLoading(true)
        setError(null)
        setOrders([])

        try {
            const res = await apiClient.trackOrder(formData)
            // The API returns an array of orders directly or wrapped in an object
            // Based on prompt "Returns a list/array of orders"
            const orderList = Array.isArray(res) ? res : (res as any).orders || []
            setOrders(orderList)
            setSearched(true)
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Failed to track orders. Please check your details.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-cream/30 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-ink mb-2">Track Your Order</h1>
                        <p className="text-gray-600">Enter your email and phone number to view your order history.</p>
                    </div>

                    {/* Tracking Form */}
                    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 max-w-md mx-auto mb-12 border border-gray-100">
                        <form onSubmit={handleTrack} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-ink mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="e.g., john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-ink mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="e.g., +91 9876543210"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-black py-3"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Find Orders'}
                            </Button>
                        </form>
                    </div>

                    {/* Results */}
                    {searched && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-ink text-center mb-6">
                                found {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                            </h2>

                            {orders.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-ink mb-1">No orders found</h3>
                                    <p className="text-gray-500 mb-6">We couldn't find any orders matching these details.</p>
                                    <Link href="/products">
                                        <Button variant="outline">Start Shopping</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {orders.map((order) => (
                                        <Link href={`/orders/${order.id}`} key={order.id} className="block group">
                                            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all hover:border-primary/30 h-full">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="bg-primary/10 text-primary-dark px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                                                        {order.status}
                                                    </div>
                                                    <span className="text-xs text-gray-400 font-mono">#{order.id.slice(0, 8)}</span>
                                                </div>

                                                <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                                    <Calendar size={16} />
                                                    {new Date(order.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>

                                                <div className="flex items-center gap-3 text-sm text-gray-600 mb-6">
                                                    <ShoppingBag size={16} />
                                                    {order.items?.length || 0} items
                                                </div>

                                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                                    <span className="font-bold text-lg text-ink">
                                                        ₹{(order.total_amount || order.amount || 0).toLocaleString()}
                                                    </span>
                                                    <span className="text-primary group-hover:translate-x-1 transition-transform">
                                                        <ChevronRight size={20} />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}

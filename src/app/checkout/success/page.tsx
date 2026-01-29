'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { apiClient } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'

// Disable static generation for this page (it needs query params)
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

function OrderSuccessContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const orderId = searchParams.get('orderId')
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const clearCart = useCartStore(state => state.clearCart)

    useEffect(() => {
        if (orderId) {
            // Fetch order details
            apiClient.getOrder(orderId)
                .then(data => {
                    setOrder(data.order || data)
                    // Ensure cart is cleared (though backend probably did it, local store might need sync)
                    clearCart()
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
                <p>Invalid Order ID</p>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-cream/30 py-16 px-4">
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-600 w-10 h-10" />
                </div>

                <h1 className="text-3xl font-bold text-ink mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for shopping with Ani & Ayu. Your order <span className="font-semibold">#{orderId}</span> has been confirmed.
                </p>

                {!loading && order && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
                        <p className="text-sm text-gray-500 mb-1">Order Total</p>
                        <p className="text-lg font-bold text-ink mb-4">₹{order.total_amount || order.totalAmount || order.amount || 0}</p>
                        <p className="text-sm text-gray-500">We will send tracking details to your email shortly.</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/products">
                        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-black">
                            Continue Shopping
                        </Button>
                    </Link>
                    <Link href="/orders">
                        <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
                            <Package size={18} />
                            Track Order
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default function OrderSuccessPage() {
    return (
        <>
            <Header />
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-cream/30">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            }>
                <OrderSuccessContent />
            </Suspense>
            <Footer />
        </>
    )
}

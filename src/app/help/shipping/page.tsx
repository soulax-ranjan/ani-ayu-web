import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Truck, Clock, Currency, Package } from 'lucide-react'

export const runtime = 'edge'

export default function ShippingInfoPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#faf9f6]">
            <Header />
            <main className="flex-1 py-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center mx-auto mb-5 relative group">
                            <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                            <Truck className="text-primary w-8 h-8 relative z-10 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-ink mb-4 tracking-tight">Shipping Information</h1>
                        <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">Everything you need to know about our order processing, shipping times, and delivery policies.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 p-8 md:p-12 mb-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 delay-100">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light"></div>

                        <div className="space-y-12 text-gray-600 leading-relaxed max-w-3xl mx-auto">

                            {/* Processing */}
                            <section className="relative">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                                        <Clock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-ink mb-4">Order Processing & Customization</h2>
                                        <p className="mb-4">
                                            All our outfits are carefully crafted and customized, which requires time to ensure the perfect finish and quality.
                                        </p>
                                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-4">
                                            <p className="font-bold text-primary">
                                                Each order requires up to 7 business days for processing and customization before it is shipped.
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Orders placed on weekends or public holidays will be processed on the next working day.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Delivery Time */}
                            <section>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                        <Truck className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="w-full">
                                        <h2 className="text-2xl font-bold text-ink mb-4">Shipping & Delivery Time</h2>
                                        <p className="mb-6">Once your order is ready and dispatched, the estimated delivery timeline is:</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center transition-all hover:shadow-md hover:border-gray-200">
                                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Metro Cities</p>
                                                <p className="font-extrabold text-ink text-xl">2–4</p>
                                                <p className="text-sm text-gray-500 font-medium">business days</p>
                                            </div>
                                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center transition-all hover:shadow-md hover:border-gray-200">
                                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Other Cities</p>
                                                <p className="font-extrabold text-ink text-xl">3–6</p>
                                                <p className="text-sm text-gray-500 font-medium">business days</p>
                                            </div>
                                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center transition-all hover:shadow-md hover:border-gray-200">
                                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Remote Areas</p>
                                                <p className="font-extrabold text-ink text-xl">5–8</p>
                                                <p className="text-sm text-gray-500 font-medium">business days</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-2xl p-4 border-l-4 border-ink">
                                            <p className="font-bold text-ink">
                                                Total delivery time may take 7–12 business days including customization and shipping.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>



                            {/* Tracking */}
                            <section>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                                        <Package className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-ink mb-4">Order Tracking</h2>
                                        <p className="text-lg">
                                            Once your order is shipped, you will receive a tracking link via email or SMS to track your shipment. You can also view real-time updates on our tracking page.
                                        </p>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

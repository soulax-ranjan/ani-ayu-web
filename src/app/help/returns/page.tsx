import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { RefreshCcw, XCircle, ListChecks, Truck, ShieldAlert, MessageCircle, Check, Info } from 'lucide-react'

export const runtime = 'edge'

export default function ReturnsPolicyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#faf9f6]">
            <Header />
            <main className="flex-1 py-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center mx-auto mb-5 relative group">
                            <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                            <RefreshCcw className="text-primary w-8 h-8 relative z-10 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-ink mb-4 tracking-tight">Returns & Exchange Policy</h1>
                        <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">Everything you need to know about our returns, exchanges, and damaged item procedures.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 p-8 md:p-12 mb-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 delay-100">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light"></div>

                        <div className="space-y-12 text-gray-600 leading-relaxed max-w-3xl mx-auto">

                            {/* No Returns */}
                            <section className="relative">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-ink mb-4">No Returns</h2>
                                        <p className="mb-4">
                                            Since all our outfits are customized and made with special care, we do not accept returns or offer refunds once an order has been placed and delivered.
                                        </p>
                                        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex gap-3">
                                            <Info className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                            <p className="text-gray-600 text-sm">
                                                We strongly encourage customers to carefully check size, color, and product details before placing the order.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Exchange Policy */}
                            <section>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                                        <RefreshCcw className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="w-full">
                                        <h2 className="text-2xl font-bold text-ink mb-4">Exchange Policy</h2>
                                        <p className="mb-4 font-medium text-ink">We offer exchanges only for size-related issues.</p>
                                        <p className="mb-6 bg-primary/5 text-primary font-bold px-4 py-3 rounded-xl border border-primary/10 inline-block">
                                            Please contact us within 48 hours of receiving your order to request a size exchange.
                                        </p>

                                        <h3 className="font-bold text-ink mb-3 uppercase text-xs tracking-wider text-gray-400">Eligibility for Exchange</h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                <span>The item must be unused, unwashed, and in original condition</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                <span>All tags and packaging must be intact</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                <span>The exchange request must be raised within 48 hours of delivery</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Exchange Process */}
                            <section>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                        <ListChecks className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="w-full">
                                        <h2 className="text-2xl font-bold text-ink mb-4">Exchange Process</h2>

                                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                            {/* Step 1 */}
                                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">1</div>
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                    <p className="text-sm">Contact us via email with your <strong className="text-ink">order number</strong> and reason for exchange.</p>
                                                </div>
                                            </div>

                                            {/* Step 2 */}
                                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-50 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">2</div>
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                    <p className="text-sm">Once approved, you will receive instructions for sending the product back.</p>
                                                </div>
                                            </div>

                                            {/* Step 3 */}
                                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-50 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">3</div>
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                    <p className="text-sm">After we receive and inspect the item, the replacement size will be shipped.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Exchange Shipping */}
                            <section>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
                                        <Truck className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-ink mb-4">Exchange Shipping</h2>
                                        <div className="space-y-4">
                                            <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex items-start gap-3">
                                                <span className="text-orange-500 shrink-0 mt-0.5">•</span>
                                                <p>Customers are responsible for the return shipping cost for exchanges.</p>
                                            </div>
                                            <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex items-start gap-3">
                                                <span className="text-orange-500 shrink-0 mt-0.5">•</span>
                                                <p>We will cover the shipping cost for sending the replacement product once.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Damaged or Incorrect Product */}
                            <section>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                                        <ShieldAlert className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-ink mb-4">Damaged or Incorrect Product</h2>
                                        <p className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100 text-ink">
                                            If you receive a damaged or incorrect item, please contact us within <strong className="text-purple-700">24 hours</strong> of delivery with photos of the product and packaging. We will arrange a replacement.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Contact Us */}
                            <section>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                                        <MessageCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="w-full">
                                        <h2 className="text-2xl font-bold text-ink mb-4">Contact Us</h2>
                                        <p className="mb-4">For exchange requests or support:</p>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <a href="mailto:support@aniayu.com" className="flex-1 flex items-center gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all group">
                                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                                    📧
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Email</p>
                                                    <p className="font-medium text-ink">support@aniayu.com</p>
                                                </div>
                                            </a>
                                        </div>
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

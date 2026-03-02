import { Suspense } from 'react'
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata = {
    title: "Terms of Service | Ani & Ayu",
    description: "Terms of Service for Ani & Ayu",
}

export default function TermsOfServicePage() {
    return (
        <>
            <Suspense fallback={<div className="h-16 md:h-20 bg-cream" />}>
                <Header />
            </Suspense>
            <main className="flex flex-col min-h-screen bg-cream px-4 py-12 md:py-20 text-ink">
                <div className="max-w-4xl mx-auto w-full bg-white rounded-2xl shadow-sm p-6 md:p-12">
                    <h1 className="text-3xl md:text-5xl font-[var(--font-heading)] font-bold mb-8 text-center text-primary">
                        Terms of Service
                    </h1>

                    <div className="prose prose-slate max-w-none space-y-6 md:space-y-8">
                        <p className="text-lg text-slate-700">
                            Welcome to <strong>Ani & Ayu</strong>. These Terms of Service (“Terms”) govern your use of our website, products, and services operated by <strong>Aarunya Threads</strong>. By accessing or purchasing from our website, you agree to these Terms.
                        </p>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">1. General Information</h3>
                            <p className="text-slate-700 mb-4">
                                This website is operated by <strong>Aarunya Threads</strong>. Throughout the site, the terms “we,” “us,” and “our” refer to Aarunya Threads and the brand <strong>Ani & Ayu</strong>.
                            </p>
                            <p className="text-slate-700">
                                By using this website, you confirm that you are at least 18 years old or using the website under the supervision of a parent or legal guardian.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">2. Products & Services</h3>
                            <p className="text-slate-700 mb-4">
                                We offer children’s clothing and related accessories designed for comfort, style, and everyday use.
                            </p>
                            <p className="text-slate-700 mb-4">
                                We make every effort to display product colors, designs, and details accurately. However, we cannot guarantee that your device’s display will reflect the exact product color or texture.
                            </p>
                            <p className="text-slate-700">
                                All products are subject to availability, and we reserve the right to discontinue or modify items at any time without prior notice.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">3. Pricing & Payments</h3>
                            <p className="text-slate-700 mb-4">
                                All prices are listed in <strong>Indian Rupees (INR)</strong> unless stated otherwise and include applicable taxes as per Indian regulations.
                            </p>
                            <p className="text-slate-700 mb-4">
                                We reserve the right to change pricing at any time without prior notice.
                            </p>
                            <p className="text-slate-700">
                                Payments are processed through secure third-party payment gateways. We do not store your payment card or banking details.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">4. Orders & Acceptance</h3>
                            <p className="text-slate-700 mb-4">
                                We reserve the right to refuse or cancel any order for reasons including but not limited to:
                            </p>
                            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                                <li>Product availability issues</li>
                                <li>Errors in product pricing or description</li>
                                <li>Suspected fraudulent or unauthorized transactions</li>
                                <li>Violation of our Terms</li>
                            </ul>
                            <p className="text-slate-700">
                                If your order is canceled after payment, a full refund will be processed.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">5. Shipping & Delivery</h3>
                            <p className="text-slate-700 mb-4">
                                Shipping timelines provided during checkout are estimates and may vary depending on delivery location, courier service delays, or unforeseen circumstances.
                            </p>
                            <p className="text-slate-700">
                                Aarunya Threads is not responsible for delays caused by third-party logistics providers.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">6. Returns & Refunds</h3>
                            <p className="text-slate-700 mb-4">
                                Please refer to our Return & Refund Policy for complete details.
                            </p>
                            <p className="text-slate-700">
                                In general, items must be unused, unwashed, and returned in original packaging within the specified return window to qualify for a refund or exchange.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">7. User Accounts</h3>
                            <p className="text-slate-700 mb-4">
                                If you create an account on our website, you are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.
                            </p>
                            <p className="text-slate-700">
                                We reserve the right to suspend or terminate accounts that violate these Terms.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">8. Intellectual Property</h3>
                            <p className="text-slate-700 mb-4">
                                All website content including logos, product images, designs, text, graphics, and branding related to <strong>Ani & Ayu</strong> are the intellectual property of <strong>Aarunya Threads</strong> and protected under applicable laws.
                            </p>
                            <p className="text-slate-700">
                                Unauthorized use, reproduction, or distribution is prohibited without written permission.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">9. Product Use & Safety</h3>
                            <p className="text-slate-700 mb-4">
                                Our products are designed for children; however, adult supervision is recommended where applicable. Customers are responsible for ensuring appropriate size selection and safe usage.
                            </p>
                            <p className="text-slate-700">
                                Aarunya Threads is not liable for damages resulting from misuse, improper care, or failure to follow product instructions.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">10. Limitation of Liability</h3>
                            <p className="text-slate-700 mb-4">
                                To the maximum extent permitted by law, Aarunya Threads shall not be liable for:
                            </p>
                            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                                <li>Indirect or incidental damages</li>
                                <li>Allergic reactions or fabric sensitivities</li>
                                <li>Delivery delays beyond our control</li>
                                <li>Misuse of products</li>
                            </ul>
                            <p className="text-slate-700">
                                Our liability is limited to the amount paid for the purchased product.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">11. Privacy</h3>
                            <p className="text-slate-700">
                                Your use of our website is also governed by our Privacy Policy, which explains how we collect, use, and protect your information.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">12. Third-Party Links</h3>
                            <p className="text-slate-700">
                                Our website may contain links to third-party services or websites. We are not responsible for their content, policies, or practices.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">13. Governing Law</h3>
                            <p className="text-slate-700">
                                These Terms shall be governed by and interpreted in accordance with the laws of <strong>India</strong>. Any disputes shall fall under the jurisdiction of the competent courts of <strong>Hyderabad, Telangana</strong>.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">14. Changes to Terms</h3>
                            <p className="text-slate-700">
                                We reserve the right to update or modify these Terms at any time. Changes will be effective immediately upon posting on this page.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">15. Contact Information</h3>
                            <p className="text-slate-700 mb-2">
                                <strong>Aarunya Threads</strong>
                            </p>
                            <p className="text-slate-700 mb-4">
                                Brand: <strong>Ani & Ayu</strong>
                            </p>
                            <p className="text-slate-700 mb-4">
                                <strong>Email:</strong> <a href="mailto:support@aniayu.in" className="text-primary hover:underline">support@aniayu.in</a>
                            </p>
                            <div className="text-slate-700">
                                <p className="font-semibold mb-2">Business Address:</p>
                                <p>Floor No.: 5th Floor</p>
                                <p>Building No./Flat No.: Plot No 125, Sy No -55</p>
                                <p>Name Of Premises/Building: ARKA HELIGHTS, Lumbani Layout</p>
                                <p>Road/Street: Gachibowli Road</p>
                                <p>Nearby Landmark: Gachibli Sub Post Office</p>
                                <p>Locality/Sub Locality: Gachibowli</p>
                                <p>City/Town/Village: Hyderabad</p>
                                <p>District: Rangareddy</p>
                                <p>State: Telangana</p>
                                <p>PIN Code: 500032</p>
                            </div>
                        </section>

                        <hr className="border-slate-200" />

                        <p className="text-lg text-slate-700 text-center font-medium mt-8">
                            By using this website, you agree to these Terms of Service.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

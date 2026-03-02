import { Suspense } from 'react'
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata = {
    title: "Privacy Policy | Ani & Ayu",
    description: "Privacy Policy for Ani & Ayu",
}

export default function PrivacyPolicyPage() {
    return (
        <>
            <Suspense fallback={<div className="h-16 md:h-20 bg-cream" />}>
                <Header />
            </Suspense>
            <main className="flex flex-col min-h-screen bg-cream px-4 py-12 md:py-20 text-ink">
                <div className="max-w-4xl mx-auto w-full bg-white rounded-2xl shadow-sm p-6 md:p-12">
                    <h1 className="text-3xl md:text-5xl font-[var(--font-heading)] font-bold mb-8 text-center text-primary">
                        Privacy Policy
                    </h1>

                    <div className="prose prose-slate max-w-none space-y-6 md:space-y-8">
                        <p className="text-lg text-slate-700">
                            Welcome to <strong>Ani & Ayu</strong>, operated by <strong>Aarunya Threads</strong>. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.
                        </p>

                        <p className="text-slate-700">
                            By using our website, you agree to the terms of this Privacy Policy.
                        </p>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">1. Information We Collect</h3>
                            <p className="text-slate-700 mb-2">We may collect the following types of personal information:</p>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-2">Personal Details</h4>
                                    <ul className="list-disc pl-6 text-slate-700 space-y-1">
                                        <li>Name</li>
                                        <li>Email address</li>
                                        <li>Phone number</li>
                                        <li>Shipping and billing address</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-2">Order Information</h4>
                                    <ul className="list-disc pl-6 text-slate-700 space-y-1">
                                        <li>Products purchased</li>
                                        <li>Payment transaction details (processed securely via third-party providers)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-2">Technical Information</h4>
                                    <ul className="list-disc pl-6 text-slate-700 space-y-1">
                                        <li>IP address</li>
                                        <li>Browser type</li>
                                        <li>Device information</li>
                                        <li>Website usage data through cookies and analytics tools</li>
                                    </ul>
                                </div>
                            </div>

                            <p className="text-slate-700 mt-4">
                                We do <strong>not</strong> store your payment card or banking details.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">2. How We Use Your Information</h3>
                            <p className="text-slate-700 mb-2">We use your information to:</p>
                            <ul className="list-disc pl-6 text-slate-700 space-y-2">
                                <li>Process and deliver your orders</li>
                                <li>Communicate order updates and customer support</li>
                                <li>Improve our website and services</li>
                                <li>Send promotional offers, discounts, or marketing communications (only if you opt-in)</li>
                                <li>Prevent fraudulent transactions and enhance security</li>
                            </ul>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">3. Sharing of Information</h3>
                            <p className="text-slate-700 mb-2">We may share your information with trusted third parties only when necessary, including:</p>
                            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                                <li>Payment gateway providers</li>
                                <li>Shipping and logistics partners</li>
                                <li>Website hosting and analytics providers</li>
                                <li>Legal authorities if required by law</li>
                            </ul>
                            <p className="text-slate-700">
                                We do not sell, rent, or trade your personal information to third parties.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">4. Cookies & Tracking Technologies</h3>
                            <p className="text-slate-700 mb-4">
                                Our website may use cookies and similar technologies to enhance your browsing experience, remember preferences, and analyze website traffic.
                            </p>
                            <p className="text-slate-700">
                                You can choose to disable cookies through your browser settings, though some features of the website may not function properly.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">5. Data Security</h3>
                            <p className="text-slate-700 mb-4">
                                We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, misuse, or disclosure.
                            </p>
                            <p className="text-slate-700">
                                However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">6. Your Rights</h3>
                            <p className="text-slate-700 mb-2">You have the right to:</p>
                            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                                <li>Access the personal data we hold about you</li>
                                <li>Request correction or updates to your information</li>
                                <li>Request deletion of your data (subject to legal obligations)</li>
                                <li>Opt-out of marketing communications at any time</li>
                            </ul>
                            <p className="text-slate-700">
                                To exercise these rights, please contact us using the details below.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">7. Children’s Privacy</h3>
                            <p className="text-slate-700">
                                Our products are intended for purchase by adults for children. We do not knowingly collect personal information directly from children under the age of 18.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">8. Third-Party Links</h3>
                            <p className="text-slate-700">
                                Our website may contain links to external websites. We are not responsible for the privacy practices or content of third-party sites.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">9. Changes to This Policy</h3>
                            <p className="text-slate-700">
                                We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated policy.
                            </p>
                        </section>

                        <hr className="border-slate-200" />

                        <section>
                            <h3 className="text-2xl font-[var(--font-heading)] font-semibold text-slate-800 mb-4">10. Contact Information</h3>
                            <p className="text-slate-700 mb-4">
                                If you have questions about this Privacy Policy or how your data is handled, please contact us:
                            </p>
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
                                <p>Nearby Landmark: Gachibowli Sub Post Office</p>
                                <p>Locality/Sub Locality: Gachibowli</p>
                                <p>City/Town/Village: Hyderabad</p>
                                <p>District: Rangareddy</p>
                                <p>State: Telangana</p>
                                <p>PIN Code: 500032</p>
                            </div>
                        </section>

                        <hr className="border-slate-200" />

                        <p className="text-lg text-slate-700 text-center font-medium mt-8">
                            By using our website, you consent to this Privacy Policy.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}


import type { Metadata } from "next"
import "./globals.css"
import { quicksand, pacifico } from "@/styles/fonts"
import { Poppins } from "next/font/google"
import Script from "next/script"
import SessionInit from "@/components/SessionInit"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-heading" })

export const metadata: Metadata = {
  title: "Ani & Ayu — Indian Ethnic Kidswear",
  description: "Modern yet classical ethnicwear for kids 2–13.",
  icons: {
    icon: '/assets/logo/small-logo.png',
    apple: '/assets/logo/small-logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${quicksand.variable} ${pacifico.variable}`}>
      <body className="min-h-screen font-[var(--font-quicksand)] text-ink antialiased">
        <SessionInit />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <div style={{ width: '100vw', maxWidth: '100vw', margin: 0, padding: 0, overflowX: 'hidden' }}>
          {children}
        </div>
      </body>
    </html>
  )
}

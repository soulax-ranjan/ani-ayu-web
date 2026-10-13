
import type { Metadata } from "next"
import "./globals.css"
import { quicksand, pacifico } from "@/styles/fonts"
import { Poppins } from "next/font/google"
import Script from "next/script"
import SessionInit from "@/components/SessionInit"
import AnalyticsInit from "@/components/AnalyticsInit"
import { GOOGLE_ADS_ID, GA4_MEASUREMENT_ID, CLARITY_PROJECT_ID } from "@/lib/gtag"

const poppins = Poppins({ subsets: ["latin", "devanagari"], weight: ["400", "500", "600", "700"], variable: "--font-heading" })

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
        <AnalyticsInit />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        {/* Google tag (gtag.js) - Google Ads + Google Analytics 4 */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} strategy="afterInteractive" />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');
gtag('config', '${GA4_MEASUREMENT_ID}');`}
        </Script>
        {/* Microsoft Clarity - heatmaps and session recordings (form fields are masked by Clarity) */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
        </Script>
        <div style={{ width: '100%', maxWidth: '100vw', margin: 0, padding: 0, overflowX: 'hidden' }}>
          {children}
        </div>
      </body>
    </html>
  )
}

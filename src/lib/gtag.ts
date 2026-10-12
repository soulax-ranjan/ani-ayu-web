// Google Ads (gtag.js)
export const GOOGLE_ADS_ID = 'AW-18431207193'

// Label of the "Purchase" conversion action (Google Ads → Goals → Conversions → Purchase → Tag setup).
// The full send_to looks like 'AW-18431207193/AbC-D_efG-h12_34-567'; paste only the part after the slash.
export const PURCHASE_CONVERSION_LABEL = 'jO7ACJqrvJQdEJnO19RE'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/** Report a completed purchase to Google Ads. transaction_id stops the same order being counted twice. */
export function trackPurchaseConversion({ value, orderId }: { value: number; orderId: string }) {
  if (typeof window === 'undefined' || !window.gtag || !PURCHASE_CONVERSION_LABEL) return
  window.gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/${PURCHASE_CONVERSION_LABEL}`,
    value,
    currency: 'INR',
    transaction_id: orderId,
  })
}

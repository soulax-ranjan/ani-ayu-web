// Google tag (gtag.js): Google Ads + Google Analytics 4
export const GOOGLE_ADS_ID = 'AW-18431207193'
export const GA4_MEASUREMENT_ID = 'G-SBH9MS9121'

// Microsoft Clarity (heatmaps + session recordings)
export const CLARITY_PROJECT_ID = 'yww5cpadij'

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

// ---- GA4 ecommerce events (https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)

export interface GaItem {
  item_id: string
  item_name: string
  price: number
  quantity: number
  item_variant?: string
  item_category?: string
}

export function toGaItem(
  product: { id: string; name?: string | null; price?: number | null },
  options: { size?: string | null; quantity?: number; category?: string } = {}
): GaItem {
  return {
    item_id: product.id,
    item_name: product.name || product.id,
    price: Number(product.price || 0),
    quantity: options.quantity ?? 1,
    ...(options.size ? { item_variant: options.size } : {}),
    ...(options.category ? { item_category: options.category } : {}),
  }
}

export function gaEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', name, { currency: 'INR', ...params })
}

export interface Testimonial {
  /** Customer photo - put files in /public/assets/testimonial/ (get the parent's permission first) */
  image: string
  /** The parent's own words */
  quote: string
  name: string
  city?: string
  /** What they bought, optionally linked to the product page */
  product?: string
  productLink?: string
  /** 1-5 */
  rating: number
  /**
   * Set to true once the customer has approved the quote and use of their photo.
   * Unapproved entries are shown in development only, never on the live site.
   */
  approved: boolean
}

/** Total families served - update as it grows */
export const PARENTS_SERVED = 1200

export const TESTIMONIALS: Testimonial[] = [
  {
    image: '/assets/testimonial/testimonial-1.png',
    // DRAFT - send to the parent to approve or rewrite in their own words, then set approved: true
    quote:
      "My daughter refused to take it off! The fabric is so soft that she played in it all evening, and it still looked beautiful in every photo. Finally, ethnic wear that's made for how kids actually move.",
    name: 'Ankita',
    city: 'Hyderabad',
    product: 'Floral one-shoulder top & pink skirt',
    rating: 5,
    approved: false,
  },
  {
    image: '/assets/testimonial/testimonial-2.png',
    // DRAFT - send to the parent to approve or rewrite in their own words, then set approved: true
    quote:
      "We bought the lilac jacket set for a family function and he wore it from morning till night without a single complaint. Comfortable enough to sit on the floor and play, smart enough for every photo. The sequin work is so fine!",
    name: 'Swarnima',
    city: 'Bangalore',
    product: 'Lilac sequin Nehru jacket & kurta set',
    rating: 5,
    approved: false,
  },
  {
    image: '/assets/testimonial/testimonial-3-graded.jpg',
    // DRAFT - send to the parent to approve or rewrite in their own words, then set approved: true
    quote:
      "He calls it his 'jungle jacket' and wants to wear it everywhere! The lion and tiger embroidery is so detailed, and the fit is perfect with room to move. Easily the most complimented outfit at the party.",
    name: 'Ananya',
    city: 'Patna',
    product: 'Black embroidered animal-motif Nehru jacket set',
    rating: 5,
    approved: false,
  },
]

export const visibleTestimonials = () =>
  TESTIMONIALS.filter((t) => t.approved || process.env.NODE_ENV !== 'production')

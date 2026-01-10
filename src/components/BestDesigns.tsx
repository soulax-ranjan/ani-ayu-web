'use client'

import Image from "next/image"
import Link from "next/link"
import { useBestSellers } from "@/lib/hooks"

export default function BestDesigns() {
  const { data: bestSellersData, loading, error } = useBestSellers(6) // Get top 6

  // Use API data only
  const designs = bestSellersData?.bestSellers || []

  if (loading) {
    return (
      <section className="w-full py-6 bg-cream">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className="mb-10 text-center md:mb-12">
            <h2 className="mb-3 text-3xl font-[var(--font-heading)] font-bold text-ink md:mb-4 md:text-4xl">
              Our Best Picks
            </h2>
            <p className="mx-auto max-w-2xl text-ink/70">
              Loading our handpicked favorites...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full py-6 bg-cream">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-3 text-3xl font-[var(--font-heading)] font-bold text-ink md:mb-4 md:text-4xl">
              Our Best Picks
            </h2>
            <p className="text-red-600">Error loading best sellers: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (designs.length === 0) {
    return (
      <section className="w-full py-6 bg-cream">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-3 text-3xl font-[var(--font-heading)] font-bold text-ink md:mb-4 md:text-4xl">
              Our Best Picks
            </h2>
            <p className="text-gray-600">No best sellers available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }
  return (
  <section className="w-full py-6 bg-cream">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-10 text-center md:mb-12">
          <h2 className="mb-3 text-3xl font-[var(--font-heading)] font-bold text-ink md:mb-4 md:text-4xl">
            Our Best Picks
          </h2>
          <p className="mx-auto max-w-2xl text-ink/70">
            Handpicked traditional outfits kids love to wear — crafted for comfort and style.
          </p>
        </div>

        {/* Grid: 1 / 2 / 3 columns (3 on desktop+) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {designs.map((d, index) => (
            <Link key={d.id} href={`/products/${d.id}`}>
              <article
                className="group overflow-hidden rounded-3xl bg-white ring-1 ring-amber-100/70 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              >
              {/* Image wrapper MUST have a fixed height when using `fill` */}
              <div className="relative w-full h-72 sm:h-80 lg:h-96">
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index === 0}
                />

                {/* gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-[var(--font-heading)] font-semibold text-ink md:text-xl">{d.name}</h3>
                
                {/* Preorder badge */}
                <div className="mt-2 mb-3">
                  <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    Preorder
                  </span>
                </div>
                
                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-ink/80 overflow-hidden" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as any
                }}>
                  {d.description}
                </p>
                
                {/* Age Range and Stock Info */}
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-ink/60 font-medium">
                    Age: {d.ageRange}
                  </p>
                  {/* Stock indicator could be added here if needed */}
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <Stars value={d.rating} />
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary md:text-2xl">₹{d.price.toLocaleString()}</p>
                    {d.originalPrice > d.price && (
                      <p className="text-sm text-gray-500 line-through">₹{d.originalPrice.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stars({ value = 4.5 }: { value?: number }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <div className="flex items-center gap-0.5 text-amber-600" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const type = i < full ? "full" : i === full && half ? "half" : "empty"
        return (
          <span key={i} className="select-none text-sm leading-none">
            {type === "full" ? "★" : "☆"}
          </span>
        )
      })}
    </div>
  )
}

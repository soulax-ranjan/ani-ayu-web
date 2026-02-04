'use client'

import Image from "next/image"
import Link from "next/link"
import { useBestSellers } from "@/lib/hooks"

import { BestSeller } from "@/lib/api"

interface BestDesignsProps {
  bestSellers?: BestSeller[]
}

export default function BestDesigns({ bestSellers: serverBestSellers }: BestDesignsProps) {
  const { data: bestSellersData, loading, error } = useBestSellers(6) // Get top 6

  // Use API data only
  const designs = serverBestSellers || bestSellersData?.bestSellers || []
  const isLoading = !serverBestSellers && loading
  const errorMessage = !serverBestSellers ? error : null

  if (isLoading) {
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

  if (errorMessage) {
    return (
      <section className="w-full py-6 bg-cream">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-3 text-3xl font-[var(--font-heading)] font-bold text-ink md:mb-4 md:text-4xl">
              Our Best Picks
            </h2>
            <p className="text-red-600">Error loading best sellers: {errorMessage}</p>
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
    <section className="w-full py-12 md:py-16 lg:py-20 bg-cream">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-4 text-2xl font-[var(--font-heading)] font-bold text-ink md:text-3xl lg:text-4xl">
            Our Best Picks
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-ink/70 md:text-base leading-relaxed">
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


                  {/* Preorder badge overlay */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-md">
                      Preorder
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-[var(--font-heading)] font-semibold text-ink md:text-xl line-clamp-2 mb-3">{d.name}</h3>

                  {/* Price */}
                  <div className="flex flex-col mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-gray-900 tracking-tight">
                        ₹{d.price.toLocaleString()}
                      </span>
                    </div>
                    {d.originalPrice > d.price && (
                      <span className="text-xs text-gray-400 line-through font-medium">
                        ₹{d.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* View Details Hint */}
                  <div className="mt-4 text-sm text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Details →
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

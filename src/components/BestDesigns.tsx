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
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <SectionHeader />
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
      <section className="w-full py-12 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <SectionHeader />
          <p className="text-center text-red-500 mt-4">Error loading best sellers: {errorMessage}</p>
        </div>
      </section>
    )
  }

  if (designs.length === 0) {
    return (
      <section className="w-full py-12 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <SectionHeader />
          <p className="text-center text-gray-400 mt-4">No best sellers available at the moment.</p>
        </div>
      </section>
    )
  }
  return (
    <section className="w-full py-8 md:py-12">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <SectionHeader />

        {/* Grid: 2 / 3 / 4 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4">
          {designs.map((d, index) => (
            <Link key={d.id} href={`/products/${d.id}`}>
              <article
                className="group overflow-hidden rounded-xl bg-white ring-1 ring-stone-200/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full h-52 sm:h-56 lg:h-60">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index === 0}
                  />
                </div>

                {/* Content */}
                <div className="px-3 pt-3.5 pb-2.5">
                  <h3
                    className="text-[14px] text-[#09090b] line-clamp-1 leading-snug mb-2"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      letterSpacing: '0em',
                      textRendering: 'optimizeLegibility',
                      WebkitFontSmoothing: 'antialiased',
                    }}
                  >
                    {d.name}
                  </h3>

                  {/* Price row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="text-sm text-[#111827]"
                        style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
                      >
                        ₹{d.price.toLocaleString()}
                      </span>
                      {d.originalPrice > d.price && (
                        <span className="text-[11px] text-[#a8a29e] line-through">
                          ₹{d.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {d.originalPrice > d.price && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {Math.round(((d.originalPrice - d.price) / d.originalPrice) * 100)}% off
                      </span>
                    )}
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

function SectionHeader() {
  return (
    <div className="mb-6 md:mb-8">
      {/* Pill badge */}
      <div className="flex items-center gap-2 mb-5">
        <span
          className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
          </span>
          Curated for you
        </span>
      </div>

      {/* Editorial headline */}
      <div className="flex items-end justify-between gap-4">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-heading)] leading-tight text-ink"
          style={{ letterSpacing: '-0.02em' }}
        >
          <span className="font-light italic text-amber-600">Loved</span>{' '}
          <span className="font-black">by little ones</span>
        </h2>
        {/* Decorative ruled line */}
        <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent mb-2" />
      </div>
    </div>
  )
}

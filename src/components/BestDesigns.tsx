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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {designs.map((d, index) => {
            const discount = d.originalPrice > d.price
              ? Math.round(((d.originalPrice - d.price) / d.originalPrice) * 100)
              : 0

            return (
              <Link key={d.id} href={`/products/${d.id}`} className="group block">
                <article
                  className="h-full overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/70 shadow-[0_2px_12px_-4px_rgba(120,90,50,0.12)] transition-all duration-500 ease-out hover:-translate-y-1 hover:ring-amber-200 hover:shadow-[0_22px_40px_-18px_rgba(120,90,50,0.35)] cursor-pointer"
                >
                  {/* Image - warm ivory backdrop, gently brightened for a clean studio look */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-b from-[#fdfbf7] to-[#f4ede3]">
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      loading={index === 0 ? 'eager' : 'lazy'}
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZjVmMWViIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZThlMGQ1Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
                      quality={90}
                      className="object-cover brightness-[1.04] contrast-[1.03] saturate-[1.1] transition duration-700 ease-out group-hover:scale-105 group-hover:brightness-[1.08]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority={index === 0}
                    />

                    {/* Soft top light */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent" />

                    {/* Light sheen that sweeps across on hover */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-[150%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[250%]" />

                    {discount > 0 && (
                      <span
                        className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-primary shadow-sm tabular-nums"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="px-3.5 pt-3.5 pb-3">
                    <h3
                      className="text-[14px] text-[#09090b] line-clamp-1 leading-snug mb-1.5 transition-colors group-hover:text-primary"
                      style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}
                    >
                      {d.name}
                    </h3>

                    {/* Price row */}
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-lg tabular-nums"
                        style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#3a7d6e' }}
                      >
                        ₹{d.price.toLocaleString()}
                      </span>
                      {discount > 0 && (
                        <span className="text-[12px] text-[#a8a29e] line-through tabular-nums" style={{ fontFamily: 'var(--font-heading)' }}>
                          ₹{d.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
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
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
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
          <span className="font-light italic text-primary">Loved</span>{' '}
          <span className="font-bold">by little ones</span>
        </h2>
        {/* Decorative ruled line */}
        <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent mb-2" />
      </div>
    </div>
  )
}

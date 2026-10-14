"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { useBanners } from "@/lib/hooks"

import { Banner } from "@/lib/api"

interface HeroBannerProps {
  banners?: Banner[]
}

const bannerHref = (link?: string | null) => (link && link.trim() !== '' ? link : '/products')

export default function HeroBanner({ banners: serverBanners }: HeroBannerProps) {
  const { data: bannersData, loading, error } = useBanners()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Use server data if available, otherwise fell back to client fetch
  const banners = serverBanners || bannersData?.banners || []
  const isLoading = !serverBanners && loading
  const errorMessage = !serverBanners ? error : null

  // Auto-rotate carousel
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [banners.length])

  if (isLoading) {
    return (
      <section className="w-screen !m-0 !border-none !p-0 relative">
        <div className="relative w-full aspect-[2/3] max-h-[82vh] md:aspect-[2/1] md:max-h-none lg:aspect-[5/2] lg:max-h-[860px] !m-0 !border-none !p-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/30 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          <div className="absolute inset-x-0 bottom-8 text-center">
            <div className="bg-gradient-to-r from-primary to-accent h-12 w-32 rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="w-screen !m-0 !border-none !p-0">
        <div className="relative w-full aspect-[2/3] max-h-[82vh] md:aspect-[2/1] md:max-h-none lg:aspect-[5/2] lg:max-h-[860px] !m-0 !border-none !p-0 bg-red-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 font-semibold">Error loading banners</p>
            <p className="text-sm text-red-500">{errorMessage}</p>
          </div>
        </div>
      </section>
    )
  }

  if (banners.length === 0) {
    return (
      <section className="w-screen !m-0 !border-none !p-0">
        <div className="relative w-full aspect-[2/3] max-h-[82vh] md:aspect-[2/1] md:max-h-none lg:aspect-[5/2] lg:max-h-[860px] !m-0 !border-none !p-0 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-600">No banners available</p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-white px-3 py-3 md:px-6 md:py-5 lg:px-8">
      {/* Inset banner at the upload shapes (2:3 phone, 5:2 desktop) - whole image visible, at most ~560px tall */}
      <div className="relative w-full max-w-[1400px] mx-auto aspect-[2/3] max-h-[72vh] md:aspect-[2/1] md:max-h-none lg:aspect-[5/2] rounded-2xl md:rounded-3xl overflow-hidden group">
        {/* Carousel Container */}
        <div
          className="flex transition-all duration-700 ease-out w-full h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={banner.id} className="relative w-full h-full flex-shrink-0">
              {/* Main Image - mobile image on small screens, web image as the fallback */}
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={index === 0}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                sizes={banner.mobileImage ? "(max-width: 767px) 1px, (max-width: 1400px) 100vw, 1400px" : "(max-width: 767px) 350vw, (max-width: 1400px) 100vw, 1400px"}
                className={`w-full h-full object-cover object-[center_25%] ${banner.mobileImage ? 'hidden md:block' : ''}`}
              />
              {banner.mobileImage && (
                <Image
                  src={banner.mobileImage}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  sizes="(max-width: 767px) 100vw, 1px"
                  className="w-full h-full object-cover object-[center_20%] md:hidden"
                />
              )}

              {/* Whole banner is clickable */}
              <Link
                href={bannerHref(banner.ctaLink)}
                aria-label={banner.title?.trim() || banner.ctaText || 'Explore collection'}
                className="absolute inset-0"
              />

              {/* Soft warm shade along the bottom, behind the text only - keeps the photo bright */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[rgba(45,30,15,0.58)] via-[rgba(45,30,15,0.22)] to-transparent"></div>

              {/* Content - centred at the bottom */}
              <div className="pointer-events-none absolute inset-0 flex items-end justify-center">
                <div className="w-full px-5 md:px-8 pb-14 md:pb-11">
                  <div className="mx-auto max-w-xl text-center text-white">
                    {banner.title?.trim() && (
                      <h1 className={`font-[family-name:var(--font-display)] font-medium text-[1.65rem] md:text-[2.35rem] lg:text-[2.6rem] leading-[1.12] tracking-[-0.01em] [text-shadow:0_1px_12px_rgba(45,30,15,0.35)] ${banner.subtitle?.trim() ? 'mb-2 md:mb-2.5' : 'mb-4 md:mb-5'}`}>
                        {banner.title}
                      </h1>
                    )}
                    {banner.subtitle?.trim() && (
                      <p className="mx-auto max-w-md text-[11px] md:text-xs font-semibold uppercase tracking-[0.28em] mb-4 md:mb-5 text-white/90 [text-shadow:0_1px_8px_rgba(45,30,15,0.5)]">
                        {banner.subtitle}
                      </p>
                    )}
                    <Link
                      href={bannerHref(banner.ctaLink)}
                      className="group/cta pointer-events-auto inline-flex items-center gap-3 rounded-full bg-[#fffaf2]/95 backdrop-blur-sm pl-5 md:pl-6 pr-1.5 py-1.5 ring-1 ring-white/80 shadow-[0_10px_28px_-10px_rgba(45,30,15,0.55)] text-ink text-sm md:text-[15px] font-semibold tracking-[0.02em] transition-all duration-200 hover:bg-white hover:shadow-[0_14px_32px_-10px_rgba(45,30,15,0.6)] active:scale-95"
                    >
                      {banner.ctaText || 'Explore Collection'}
                      <span className="grid place-items-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#c2621d] text-white shadow-sm transition-transform duration-300 group-hover/cta:translate-x-0.5" aria-hidden>
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide indicators - centred under the button */}
        {banners.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-6 md:bottom-4 z-20">
            <div className="flex justify-center gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`pointer-events-auto h-1.5 rounded-full transition-all duration-500 ${
                    index === currentSlide ? 'w-8 bg-white' : 'w-3 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentSlide}
                />
              ))}
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-110 z-20"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-110 z-20"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  )
}

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
        <div className="relative w-full aspect-[16/9] !m-0 !border-none !p-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/30 animate-pulse">
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
        <div className="relative w-full aspect-[16/9] !m-0 !border-none !p-0 bg-red-100 flex items-center justify-center">
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
        <div className="relative w-full aspect-[16/9] !m-0 !border-none !p-0 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-600">No banners available</p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <div className="relative w-full h-[500px] md:h-[560px] lg:h-[min(72vh,700px)] overflow-hidden group">
        {/* Carousel Container */}
        <div
          className="flex transition-all duration-700 ease-out w-full h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={banner.id} className="relative w-full h-full flex-shrink-0">
              {/* Main Image */}
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={index === 0}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                sizes="100vw"
                className="w-full h-full object-cover object-center"
              />

              {/* Soft warm shade in the bottom-left corner, behind the text only - keeps the photo bright */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_0%_100%,rgba(45,30,15,0.5)_0%,rgba(45,30,15,0.18)_45%,transparent_75%)]"></div>

              {/* Content - bottom-left, aligned with the page content */}
              <div className="absolute inset-0 flex items-end">
                <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 pb-12 md:pb-16">
                  <div className="max-w-[16rem] sm:max-w-xs lg:max-w-sm text-left text-white">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 leading-[1.1] [text-shadow:0_2px_16px_rgba(45,30,15,0.45)]">
                      {banner.title}
                    </h1>
                    <p className="text-sm md:text-lg mb-5 md:mb-7 text-white/95 leading-relaxed [text-shadow:0_1px_10px_rgba(45,30,15,0.5)]">
                      {banner.subtitle}
                    </p>
                    <Link
                      href={banner.ctaLink && banner.ctaLink.trim() !== '' ? banner.ctaLink : '/products'}
                      className="inline-flex items-center justify-center px-6 md:px-8 py-2.5 md:py-3.5 bg-white text-ink font-semibold rounded-full hover:bg-[#e6c88a] transition-colors duration-300 shadow-lg shadow-black/10 text-sm md:text-base"
                    >
                      {banner.ctaText || 'Explore Collection'}
                      <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide indicators - bottom-right, aligned with the page content */}
        {banners.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-5 md:bottom-7 z-20">
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 flex justify-end gap-2">
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

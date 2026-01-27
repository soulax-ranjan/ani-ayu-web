"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { useBanners } from "@/lib/hooks"

export default function HeroBanner() {
  const { data: bannersData, loading, error } = useBanners()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Use all banners from API data
  const banners = bannersData?.banners || []

  // Auto-rotate carousel
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [banners.length])

  if (loading) {
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

  if (error) {
    return (
      <section className="w-screen !m-0 !border-none !p-0">
        <div className="relative w-full aspect-[16/9] !m-0 !border-none !p-0 bg-red-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 font-semibold">Error loading banners</p>
            <p className="text-sm text-red-500">{error}</p>
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
      <div className="relative w-full h-[500px] md:h-[550px] overflow-hidden group">
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
                sizes="100vw"
                className="w-full h-full object-cover object-center"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>

              {/* Content Overlay - Bottom Aligned */}
              <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-16">
                <div className="text-center text-white max-w-4xl px-4 md:px-8">
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-sm md:text-lg lg:text-xl mb-4 md:mb-6 text-white/90 leading-relaxed max-w-2xl mx-auto">
                    {banner.subtitle}
                  </p>
                  <div className="flex justify-center">
                    <Link
                      href={banner.ctaLink}
                      className="inline-flex items-center justify-center px-6 md:px-8 py-2.5 md:py-3.5 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30 text-sm md:text-base"
                    >
                      {banner.ctaText}
                      <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modern Carousel Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`relative w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${index === currentSlide
                  ? 'bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/50 scale-110'
                  : 'bg-white/60 hover:bg-white/80 backdrop-blur-sm'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === currentSlide && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse"></div>
                )}
              </button>
            ))}
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

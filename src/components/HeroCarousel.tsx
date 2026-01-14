"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
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
        <div className="relative w-full aspect-[18/7] !m-0 !border-none !p-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/30 animate-pulse">
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
        <div className="relative w-full aspect-[18/7] !m-0 !border-none !p-0 bg-red-100 flex items-center justify-center">
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
        <div className="relative w-full aspect-[18/7] !m-0 !border-none !p-0 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-600">No banners available</p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-screen !m-0 !border-none !p-0 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none z-10"></div>
      
      <div className="relative w-full aspect-[18/7] min-h-[220px] md:min-h-[400px] !m-0 !border-none !p-0 overflow-hidden group">
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
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Vibrant Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-60"></div>
              
              {/* Dynamic Color Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              
              {/* Animated Border */}
              <div className="absolute inset-0 border-4 border-gradient-to-r from-primary/50 to-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Modern Carousel Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`relative w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                  index === currentSlide 
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
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-110 z-20"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-110 z-20"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  )
}

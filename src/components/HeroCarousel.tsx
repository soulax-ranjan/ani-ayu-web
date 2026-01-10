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
      <section className="w-screen !m-0 !border-none !p-0">
        <div className="relative w-full aspect-[18/7] !m-0 !border-none !p-0 bg-gray-200 animate-pulse">
          <div className="absolute inset-x-0 bottom-8 text-center">
            <div className="bg-gray-300 h-12 w-32 rounded-full mx-auto"></div>
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
    <section className="w-screen !m-0 !border-none !p-0">
      <div className="relative w-full aspect-[18/7] min-h-[220px] md:min-h-[400px] !m-0 !border-none !p-0 overflow-hidden">
        {/* Carousel Container */}
        <div 
          className="flex transition-transform duration-500 ease-in-out w-full h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={banner.id} className="relative w-full h-full flex-shrink-0">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* Carousel Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentSlide 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

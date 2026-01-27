import Image from "next/image"

export default function SingleImageBanner() {
  return (
    <section className="w-full py-6 md:py-8 lg:py-12">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        <div className="relative w-full h-[300px] md:h-[450px] lg:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl group">
          <Image
            src="/assets/bottom-banner.png"
            alt="Premium Collection"
            fill
            className="object-cover"
            sizes="100vw"
            priority
            quality={95}
          />

          {/* Stronger Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          {/* Tagline Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-4xl px-4 md:px-8">
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-serif font-light leading-tight tracking-wide md:tracking-wider">
                <span className="block bg-gradient-to-r from-white via-amber-50 to-white bg-clip-text text-transparent" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.5)', WebkitTextStroke: '0.3px rgba(255,255,255,0.3)' }}>
                  Wrapped in Culture.
                </span>
                <span className="block mt-2 md:mt-3 bg-gradient-to-r from-amber-100 via-primary to-amber-100 bg-clip-text text-transparent font-normal italic" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.5)', WebkitTextStroke: '0.3px rgba(255,200,100,0.3)' }}>
                  Styled with Love.
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

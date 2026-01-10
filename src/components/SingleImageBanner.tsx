import Image from "next/image"

export default function SingleImageBanner() {
  return (
    <section className="w-full py-8 md:py-12">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/assets/placeholders/festive-version-2.png"
            alt="Premium Collection"
            fill
            className="object-cover"
            sizes="100vw"
            priority
            quality={95}
          />
        </div>
      </div>
    </section>
  )
}

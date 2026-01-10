import Image from "next/image"

const images = [
  "/assets/designs/design-1.jpg",
  "/assets/designs/design-1.jpg",
  "/assets/designs/design-1.jpg"
]

export default function DesignsThreeGrid() {
  return (
  <section className="w-full py-6">
      <div className="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-6 lg:px-8">
        {images.map((src, idx) => (
          <div key={idx} className="rounded-xl overflow-hidden shadow-lg">
            <Image
              src={src}
              alt={`Design ${idx + 1}`}
              width={600}
              height={800}
              className="object-cover w-full h-auto"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

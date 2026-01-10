
import { Button } from "@/components/ui/Button"
import Image from "next/image"

const banners = [
  { src: "/assets/banners/boys-wide.jpg",  alt: "Boys Wide" },
  { src: "/assets/banners/girls-wide.jpg", alt: "Girls Wide" },
]

export default function WideDesignsTwoUp() {
  return (
  <section className="py-6">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
        {banners.map((b, i) => (
          <div key={i} className="relative min-h-[220px] h-[220px] md:min-h-[340px] md:h-[380px] rounded-2xl overflow-hidden ring-1 ring-black/5">
            <Image src={b.src} alt={b.alt} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 50vw" priority />
            <div className="absolute left-4 bottom-4">
              <Button size="sm">Shop Now</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

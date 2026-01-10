import Image from "next/image"
import { Button } from "@/components/ui/Button"

export default function AboutSplit() {
  return (
  <section className="py-6">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
        <div className="relative w-full h-[360px] rounded-2xl overflow-hidden ring-1 ring-black/5 bg-placeholder">
          <Image src="/assets/designs/design-3.webp" alt="About Ani & Ayu" fill className="object-cover" />
        </div>
        <div>
          <h3 className="font-[var(--font-heading)] text-2xl md:text-3xl">Global Style, Indian Soul</h3>
          <p className="mt-3 text-ink/80">Soft, breathable, twirl-ready ethnicwear crafted for kids 2–13.</p>
          <Button className="mt-5">Learn More</Button>
        </div>
      </div>
    </section>
  )
}

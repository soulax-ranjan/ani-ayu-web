import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Card, CardBody } from "@/components/ui/Card"

const designs = [
  { src: "/assets/designs/design-1.jpg", alt: "Design 1" },
  { src: "/assets/designs/design-2.jpg", alt: "Design 2" },
  { src: "/assets/designs/design-3.jpg", alt: "Design 3" },
]

export default function DesignsThreeUp() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <h2 className="font-[var(--font-heading)] text-2xl md:text-3xl mb-6">Our Best 25 Designs</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {designs.map((d, idx) => (
            <Card key={idx} className="overflow-hidden">
              <div className="relative aspect-[4/5] w-full bg-placeholder">
                <Image src={d.src} alt={d.alt} fill className="object-cover" />
              </div>
              <CardBody>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Design Name</p>
                  <Button size="sm">Shop Now</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

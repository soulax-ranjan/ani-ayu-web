import Image from "next/image"
import { Button } from "@/components/ui/Button"

export default function Newsletter() {
  return (
  <section className="bg-primary py-6">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-12 text-white grid md:grid-cols-[auto,1fr] gap-6 items-center">
        {/* tiny mascot = use same logo as decorative */}
        <Image src="/assets/logo-ani-ayu.png" alt="Mascot" width={64} height={64} className="rounded-full bg-white/10 p-1" />
        <div>
          <p className="text-lg font-[var(--font-heading)]">Join the Twirl Club</p>
          <form className="mt-3 flex gap-2 max-w-md">
            <input type="email" required placeholder="you@example.com"
              className="flex-1 rounded-xl px-4 text-ink bg-white h-11 outline-none ring-2 ring-transparent focus:ring-accent" />
            <Button className="h-11">Subscribe</Button>
          </form>
        </div>
      </div>
    </section>
  )
}

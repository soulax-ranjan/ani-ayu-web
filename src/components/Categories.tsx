
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function Categories() {
  const cats = [
    { title: "Boys",  href: "/collections/boys"  },
    { title: "Girls", href: "/collections/girls" },
  ]
  return (
  <section className="py-6">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
        {cats.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="h-48 w-full rounded-2xl text-lg font-[var(--font-heading)] bg-placeholder hover:ring-2 hover:ring-primary flex items-center justify-center transition"
          >
            {c.title}
          </Link>
        ))}
      </div>
    </section>
  )
}

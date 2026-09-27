import { Feather, Scissors, Landmark, Heart, type LucideIcon } from "lucide-react"

interface Value {
  icon: LucideIcon
  title: string
  description: string
}

const VALUES: Value[] = [
  {
    icon: Feather,
    title: "Comfort First",
    description: "Soft, breathable fabrics and easy fits, made for little ones who never sit still.",
  },
  {
    icon: Scissors,
    title: "Crafted with Care",
    description: "Traditional craftsmanship and fine detailing in every stitch, sequin and print.",
  },
  {
    icon: Landmark,
    title: "Rooted in Heritage",
    description: "Classic Indian silhouettes, reimagined in playful colours for today's kids.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Named after Ani and Ayu, every piece gets the care we'd want for our own family.",
  },
]

export default function OurValues() {
  return (
    <div className="relative mt-12 md:mt-14 overflow-hidden rounded-3xl bg-[#1f4a41] text-white px-5 py-9 md:px-12 md:py-12">
      {/* Soft decorative glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#d9b36c]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-primary/40 blur-3xl" />

      {/* Header */}
      <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e6c88a] mb-3">Our Values</p>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-heading)] font-bold leading-tight">
            What we <span className="font-light italic text-[#e6c88a]">stand for</span>
          </h3>
        </div>
        <p className="text-white/70 max-w-sm md:text-right">
          The principles behind every piece we design, from the first sketch to the final stitch.
        </p>
      </div>

      {/* Values */}
      <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 border-t border-white/10">
        {VALUES.map(({ icon: Icon, title, description }, index) => (
          <div
            key={title}
            className="group relative flex sm:block gap-4 py-5 px-1 sm:p-6 md:p-8 border-b border-white/10 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:[&:not(:last-child)]:border-r transition-colors duration-300 hover:bg-white/5"
          >
            <div className="shrink-0 flex items-start justify-between sm:mb-6">
              <div className="w-12 h-12 rounded-full ring-1 ring-[#e6c88a]/50 flex items-center justify-center text-[#e6c88a] transition-colors duration-300 group-hover:bg-[#e6c88a] group-hover:text-[#1f4a41]">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <span className="hidden sm:block font-heading text-4xl font-light text-white/15 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div>
              <h4 className="font-heading text-base sm:text-lg font-semibold mb-1 sm:mb-2">{title}</h4>
              <p className="text-sm text-white/70 leading-relaxed">{description}</p>
            </div>
            {/* Gold underline that grows on hover */}
            <div className="hidden sm:block mt-5 h-px w-10 bg-[#e6c88a]/60 transition-all duration-500 group-hover:w-20 group-hover:bg-[#e6c88a]" />
          </div>
        ))}
      </div>
    </div>
  )
}

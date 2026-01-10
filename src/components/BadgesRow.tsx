import { Shield, Leaf, RotateCcw } from "lucide-react"

const data = [
  { icon: Leaf,  text: "Natural Fabrics" },
  { icon: Shield, text: "Kid-Safe Finishes" },
  { icon: RotateCcw, text: "Easy Returns" },
]

export default function BadgesRow() {
  return (
  <section className="bg-mint py-6">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-8 grid md:grid-cols-3 gap-4">
        {data.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 bg-white rounded-xl px-4 py-4 ring-1 ring-black/5">
            <div className="grid place-items-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              <Icon size={20} />
            </div>
            <p className="font-[var(--font-heading)]">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

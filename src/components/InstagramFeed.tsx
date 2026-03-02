import Link from "next/link"
import { Instagram } from "lucide-react"

export default function InstagramFeed() {
  return (
    <section className="w-full py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 mb-6">
              <Instagram size={26} className="text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-[var(--font-heading)] font-bold text-ink mb-3">
              Follow Us on Instagram
            </h2>
            <p className="text-ink/70 mb-8 leading-relaxed">
              Tag us <strong className="text-primary">@_aniayu_store</strong> and use{" "}
              <strong className="text-primary">#AniAyuMoments</strong> to be featured on our page!
              We love seeing your little ones shine in our outfits.
            </p>

            <Link
              href="https://www.instagram.com/_aniayu_store/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Instagram size={20} />
              Follow @_aniayu_store
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
import Image from "next/image"
import Link from "next/link"
import { Instagram, Play, ArrowUpRight } from "lucide-react"
import ReelVideo from "@/components/ReelVideo"
import { INSTAGRAM_HANDLE, INSTAGRAM_POSTS, INSTAGRAM_PROFILE_URL } from "@/lib/instagram"

// Static class names so Tailwind can pick them up
const LG_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
}

export default function InstagramGallery() {
  if (INSTAGRAM_POSTS.length === 0) return null

  const cols = Math.min(INSTAGRAM_POSTS.length, 5)

  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-6 md:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
              <Instagram size={16} />
              @{INSTAGRAM_HANDLE}
            </div>
            <h2 className="text-3xl md:text-4xl font-[var(--font-heading)] font-bold text-ink leading-tight">
              #AniAyuMoments
            </h2>
            <p className="text-ink/70 mt-2 max-w-xl">
              Real little ones, real celebrations. See how our families style Ani & Ayu.
            </p>
          </div>

          <Link
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start md:self-auto border border-ink/15 hover:border-primary hover:text-primary text-ink px-6 py-3 rounded-full font-semibold transition-colors"
          >
            View on Instagram
            <ArrowUpRight size={18} />
          </Link>
        </div>

        {/* Posts - swipeable row on mobile, vertical reel tiles in a grid on desktop */}
        <div
          className={`flex md:grid md:grid-cols-3 ${LG_COLS[cols]} md:mx-auto gap-3 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 px-4 md:px-0 pb-2 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
          style={{ maxWidth: cols * 300 }}
        >
          {INSTAGRAM_POSTS.map((post, index) => (
            <Link
              key={`${post.image}-${index}`}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={post.caption}
              className="group relative shrink-0 w-[60%] sm:w-[40%] md:w-auto snap-start aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 60vw, 300px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {post.video && (
                <ReelVideo
                  src={post.video}
                  poster={post.image}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}

              {post.isReel && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <Play size={14} className="text-white fill-white ml-0.5" />
                </div>
              )}

              {/* Caption - always visible on touch, on hover for desktop */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 via-black/10 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2 text-white">
                  <Instagram size={16} className="shrink-0" />
                  <p className="text-sm font-medium line-clamp-2">{post.caption}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

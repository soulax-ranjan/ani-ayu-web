import Image from "next/image"
import Link from "next/link"
import { Instagram, Heart, MessageCircle } from "lucide-react"

export default function InstagramFeed() {
  // Mock Instagram posts data - replace with real Instagram API data
  const instagramPosts = [
    {
      id: 1,
      image: "/assets/designs/design-1.jpg",
      caption: "Little prince in our royal blue kurta! ✨ #AniAyu #TraditionalWear",
      likes: 247,
      comments: 18,
      url: "https://instagram.com/aniayu"
    },
    {
      id: 2,
      image: "/assets/designs/design-2.jpg",
      caption: "Looking gorgeous in our beautiful lehenga collection 🌸",
      likes: 189,
      comments: 12,
      url: "https://instagram.com/aniayu"
    },
    {
      id: 3,
      image: "/assets/designs/design-4.webp",
      caption: "Handcrafted with love, worn with pride 💕",
      likes: 332,
      comments: 25,
      url: "https://instagram.com/aniayu"
    },
    {
      id: 4,
      image: "/assets/designs/design-5.webp",
      caption: "Every stitch tells a story of tradition ✨",
      likes: 298,
      comments: 31,
      url: "https://instagram.com/aniayu"
    },
    {
      id: 5,
      image: "/assets/designs/design-3.webp",
      caption: "Comfortable elegance for your little ones 👶",
      likes: 156,
      comments: 8,
      url: "https://instagram.com/aniayu"
    },
    {
      id: 6,
      image: "/assets/designs/design-1.jpg",
      caption: "Where tradition meets modern comfort 🏺",
      likes: 421,
      comments: 42,
      url: "https://instagram.com/aniayu"
    }
  ]

  const socialStats = [
    { number: "50K+", label: "Happy Customers", icon: "👶" },
    { number: "25K+", label: "Instagram Followers", icon: "📸" },
    { number: "4.9/5", label: "Customer Rating", icon: "⭐" },
    { number: "15K+", label: "Products Sold", icon: "👕" }
  ]

  return (
    <section className="w-full py-16 md:py-20 bg-gradient-to-br from-mint/20 to-cream/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-medium text-sm mb-4">
            <Instagram size={16} />
            Follow Our Journey
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-heading)] font-bold text-ink mb-4">
            See Us on 
            <span className="text-primary"> Instagram</span>
          </h2>
          <p className="text-lg text-ink/70 max-w-2xl mx-auto mb-8">
            Join our community of happy parents sharing their little ones' beautiful moments in Ani & Ayu outfits
          </p>
          
          {/* Social Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {socialStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-ink/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram Posts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {instagramPosts.map((post) => (
            <Link
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between text-white text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Heart size={14} className="fill-white" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                  
                  {/* Caption Preview */}
                  <p className="text-white text-xs line-clamp-2 opacity-90">
                    {post.caption}
                  </p>
                </div>
              </div>
              
              {/* Instagram Icon */}
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Instagram size={16} className="text-white" />
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl max-w-2xl mx-auto">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-2xl md:text-3xl font-[var(--font-heading)] font-bold text-ink mb-4">
              Share Your Story
            </h3>
            <p className="text-ink/70 mb-6 leading-relaxed">
              Tag us <strong className="text-primary">@aniayu</strong> and use <strong className="text-primary">#AniAyuMoments</strong> 
              to be featured on our page! We love seeing your little ones shine in our outfits.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="https://instagram.com/aniayu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Instagram size={20} />
                Follow @AniAyu
              </Link>
              
              <div className="text-sm text-ink/60">
                Join <span className="font-semibold text-primary">25,000+</span> followers
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
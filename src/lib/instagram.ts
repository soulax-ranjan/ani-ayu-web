export const INSTAGRAM_HANDLE = 'aniayukids'
export const INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`

export interface InstagramPost {
  /** Image shown on the tile (poster frame for reels) - put files in /public/assets/instagram/ */
  image: string
  /** Link to the post or reel, e.g. https://www.instagram.com/reel/XXXX/ */
  url: string
  caption: string
  /** Shows a play icon on the tile */
  isReel?: boolean
  /** Optional reel clip (mp4, H.264, ~4s) - plays muted on loop, `image` is used as its poster */
  video?: string
}

// Curated posts for the home page gallery. Tiles are vertical (9:16), like the Instagram reels tab.
// To add a reel: trim it to ~4s, export as H.264 mp4 (540x960 is plenty), save it with a cover frame in /public/assets/instagram/.
export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    image: '/assets/instagram/reel-2-cover.jpg',
    video: '/assets/instagram/reel-2.mp4',
    url: INSTAGRAM_PROFILE_URL,
    caption: 'Sunshine in yellow florals',
    isReel: true,
  },
  {
    image: '/assets/instagram/reel-4-cover.jpg',
    video: '/assets/instagram/reel-4.mp4',
    url: INSTAGRAM_PROFILE_URL,
    caption: 'Pretty in pink - flamingo lehenga set',
    isReel: true,
  },
  {
    image: '/assets/instagram/reel-1-cover.jpg',
    video: '/assets/instagram/reel-1.mp4',
    url: INSTAGRAM_PROFILE_URL,
    caption: 'Welcome to my world - tiered tulle & sequins',
    isReel: true,
  },
  {
    image: '/assets/instagram/reel-5-cover.jpg',
    video: '/assets/instagram/reel-5.mp4',
    url: INSTAGRAM_PROFILE_URL,
    caption: 'Festive gold in a mustard lehenga',
    isReel: true,
  },
  {
    image: '/assets/instagram/reel-3-cover.jpg',
    video: '/assets/instagram/reel-3.mp4',
    url: INSTAGRAM_PROFILE_URL,
    caption: 'Playtime in printed kurta sets',
    isReel: true,
  },
]

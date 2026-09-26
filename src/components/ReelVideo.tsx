"use client"
import { useEffect, useRef, useState } from "react"

interface ReelVideoProps {
  src: string
  poster: string
  /** Loop back to the start after this many seconds */
  maxSeconds?: number
  className?: string
}

// Muted, looping reel preview. Loads only when near the viewport and pauses when scrolled away.
export default function ReelVideo({ src, poster, maxSeconds = 4, className }: ReelVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      aria-hidden
      onTimeUpdate={(e) => {
        if (e.currentTarget.currentTime >= maxSeconds) e.currentTarget.currentTime = 0
      }}
      className={className}
    />
  )
}

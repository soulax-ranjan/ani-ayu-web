import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2592000, // 30 days - uploaded image URLs are timestamped, so they never change in place
    formats: ['image/avif', 'image/webp'], // serve AVIF/WebP to supporting browsers
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920], // mobile-first breakpoints
    qualities: [75, 90, 95], // fix Next.js 16 quality warning
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ldfykcszxyjrferywgjb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**', // covers both /public/** and /sign/**
      },
      {
        protocol: 'https',
        hostname: 'product-images.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ani-ayu-products-images.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      }
    ]
  }
};

export default nextConfig;

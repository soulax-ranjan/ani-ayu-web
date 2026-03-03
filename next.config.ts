import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 86400, // cache images for 24h to reduce Supabase round-trips
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

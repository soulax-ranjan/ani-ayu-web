import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'ldfykcszxyjrferywgjb.supabase.co',
      'product-images.s3.amazonaws.com',
      'ani-ayu-products-images.s3.ap-south-1.amazonaws.com',
      'example.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ldfykcszxyjrferywgjb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
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

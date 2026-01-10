import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'ldfykcszxyjrferywgjb.supabase.co',
      'product-images.s3.amazonaws.com'
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
      }
    ]
  }
};

export default nextConfig;

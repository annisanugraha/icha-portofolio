import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Supabase Storage
        protocol: 'https',
        hostname: 'ophiunagbzffqisbngit.supabase.co',
        pathname: '/storage/**',
      },
      {
        // Placeholder images
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        // Wildcard: allow any external HTTPS domain
        // Needed for certificates from universities, competitions, etc.
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'bcryptjs'],
};

export default nextConfig;

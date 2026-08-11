import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Generate a standard Next.js app so Netlify handles SSR
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
}

export default nextConfig

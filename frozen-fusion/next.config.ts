import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Generate a static site (plain HTML/CSS/JS) so Netlify
  // can serve it without a Node.js server.
  output: "export",

  // Next.js image optimisation requires a server at runtime.
  // In static-export mode we disable it so <Image> tags work.
  images: {
    unoptimized: true,
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

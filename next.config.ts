import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Allow local /public images via next/image */
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

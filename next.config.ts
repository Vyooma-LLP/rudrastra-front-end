import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Allow local /public images via next/image */
    unoptimized: false,
  },
};

export default nextConfig;

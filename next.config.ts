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
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "@supabase/supabase-js"],
  },
  allowedDevOrigins: ["192.168.1.33", "0.0.0.0", "localhost:3000"],
};

export default nextConfig;

// next.config.ts
import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  webpack: (config: Configuration) => {
    // Fix for leaflet import issues
    config.resolve!.fallback = { fs: false, path: false };
    return config;
  },
};

export default nextConfig;

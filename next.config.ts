// next.config.ts
import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config: Configuration) => {
    // Fix for leaflet import issues
    config.resolve!.fallback = { fs: false, path: false };
    return config;
  },
};

export default nextConfig;

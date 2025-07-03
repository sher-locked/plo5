import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production deployment
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Ensure static optimization
  trailingSlash: false,
  // Enable compression
  compress: true,
};

export default nextConfig;

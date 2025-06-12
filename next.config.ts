import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Canvas configuration for PDF.js
    if (isServer) {
      config.externals.push({
        canvas: 'commonjs canvas',
      });
    }

    config.resolve.alias.canvas = false;

    // Fallbacks for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      encoding: false,
    };

    return config;
  },
};

export default nextConfig;

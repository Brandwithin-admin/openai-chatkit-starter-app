// next.config.ts
import type { NextConfig } from "next";

const allowedAncestors = [
  "https://thrivingpractitioners.com",
  "https://www.thrivingpractitioners.com",
].join(" ");

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
    };
    return config;
  },

  // 👇 Add headers to allow your site to iframe this app
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${allowedAncestors}`,
          },
          // NOTE: DO NOT set X-Frame-Options at all
        ],
      },
    ];
  },
};

export default nextConfig;

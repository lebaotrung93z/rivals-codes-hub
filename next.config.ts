import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Faster static asset caching for hero avatars / landing art
  headers: async () => [
    {
      source: "/images/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/ads.txt",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=3600",
        },
      ],
    },
  ],
};

export default nextConfig;

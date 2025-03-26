import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/public-data/hospital/:path*",
        destination: `${process.env.NEXT_PUBLIC_DATA_HOSPITAL_BASE_URL}/:path*`,
      },
      {
        source: "/api/public-data/pharmacy/:path*",
        destination: `${process.env.NEXT_PUBLIC_DATA_PHARMACY_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;

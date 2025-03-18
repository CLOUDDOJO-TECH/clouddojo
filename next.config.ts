import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  transpilePackages: ['react-element-to-jsx-string'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "3441c44ci2.ufs.sh", 
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", 
        pathname: "/*",
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
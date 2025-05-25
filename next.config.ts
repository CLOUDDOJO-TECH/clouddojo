import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['react-element-to-jsx-string'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: [
    "page.tsx",
    "page.ts",
    // FIXME: Next.js has a bug which does not resolve not-found.page.tsx correctly
    // Instead, use `not-found.ts` as a workaround
    // "ts" is required to resolve `not-found.ts`
    // https://github.com/vercel/next.js/issues/65447
    "ts"
],
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
      }
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
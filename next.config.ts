import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'the-zoha-522196013281-ap-south-1-an.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**', // This allows Next to optimize any image within any folder of the bucket
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb"
    }
  }
};

export default nextConfig;

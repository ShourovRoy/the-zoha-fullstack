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
  allowedDevOrigins: ['uniformed-anthology-huskiness.ngrok-free.dev'],
  
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb"
    }
  },
  
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental : {
    serverActions: {
      bodySizeLimit: "4mb", // 4 Megabytes
    }
  },
  images : {
    // Whitelist the image paths
    remotePatterns:[
      {
        protocol : "https",
        // hostname : "pBWntAx3aQNQqZAa.public.blob.vercel-storage.com"
        hostname : "pbwntax3aqnqqzaa.public.blob.vercel-storage.com"
      }
    ]
  }
};

export default nextConfig;

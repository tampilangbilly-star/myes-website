/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "aiqbntsculcwmzwxlftn.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;

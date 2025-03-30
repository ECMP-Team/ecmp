/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5500/api/:path*", // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;

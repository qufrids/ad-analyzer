/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ["sharp", "satori", "@resvg/resvg-js"],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs", "mathjs"],
  },
  images: {
    domains: [],
  },
};

module.exports = nextConfig;

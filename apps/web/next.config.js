/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@healthbridge/ui', '@healthbridge/types', '@healthbridge/validation', '@healthbridge/config'],
};

module.exports = nextConfig;

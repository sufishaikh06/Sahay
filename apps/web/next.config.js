const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@healthbridge/ui', '@healthbridge/types', '@healthbridge/validation', '@healthbridge/config'],
};

module.exports = nextConfig;

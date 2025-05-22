/** @type {import('next').NextConfig} */

const nextConfig = {
  optimizeFonts: true,
  reactStrictMode: false,
  swcMinify: false,
  compress: true,
  images: {
    domains: [
      "localhost",
      "spotapi.alwin.io",
      "demob5walletapi.wearedev.team",
      "userapi.b5exchange.com",
      "walletapi.b5exchange.com",
      "spotapi.b5exchange.com",
      "derivativeapi.b5exchange.com",
    ], // Domain name,
    unoptimized: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

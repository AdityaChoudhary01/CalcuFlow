import type {NextConfig} from 'next';
/** @type {import('@ducanh2912/next-pwa').PWAConfig} */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const isDev = process.env.NODE_ENV === 'development'

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  ...(isDev && {
    experimental: {
      allowedDevOrigins: [
        "https://*.cluster-nle52mxuvfhlkrzyrq6g2cwb52.cloudworkstations.dev"
      ],
    },
  })
};

export default isDev ? nextConfig : withPWA(nextConfig);

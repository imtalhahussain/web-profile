/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This allows you to use external images (like from a CMS or GitHub) 
  // for your project thumbnails.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Essential if you use libraries like 'canvas' or certain AI SDKs 
  // that have issues with Next.js's default bundling.
  webpack: (config) => {
    config.externals.push({
      'sharp': 'commonjs sharp',
      'canvas': 'commonjs canvas',
    });
    return config;
  },
  turbopack: {},
};

export default nextConfig;
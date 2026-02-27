/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: process.env.MINIO_ENDPOINT || 'minio-jkw8448c4kk0048wos40044s.72.60.219.81.sslip.io',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
}

export default nextConfig

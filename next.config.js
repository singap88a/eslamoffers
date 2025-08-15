/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '147.93.126.19',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.eslamoffers.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.almowafir.com',
        pathname: '/**',
      },
      
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
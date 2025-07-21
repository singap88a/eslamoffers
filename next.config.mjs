/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: '147.93.126.19',
            port: '8080',
            pathname: '/**',
          },
          { protocol: 'https', hostname: 'cdn.almowafir.com', pathname: '/**' },
          { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com', pathname: '/**' },
          { protocol: 'https', hostname: 'media.licdn.com', pathname: '/**' },
          { protocol: 'https', hostname: 'cdn-icons-png.flaticon.com', pathname: '/**' },
          { protocol: 'https', hostname: 'www.freeiconspng.com', pathname: '/**' },
          { protocol: 'https', hostname: 'marketplace.canva.com', pathname: '/**' },
          { protocol: 'https', hostname: 'cdn-icons-png.freepik.com', pathname: '/**' },
          { protocol: 'https', hostname: 'png.pngtree.com', pathname: '/**' },
        ],
      },
};

export default nextConfig;

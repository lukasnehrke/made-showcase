/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'oss.cs.fau.de',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ws2324',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;

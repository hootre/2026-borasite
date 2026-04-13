/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-markdown'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.vimeocdn.com' },
      { protocol: 'https', hostname: 'vimeocdn.com' },
      { protocol: 'https', hostname: 'f.vimeocdn.com' },
    ],
  },
};

module.exports = nextConfig;

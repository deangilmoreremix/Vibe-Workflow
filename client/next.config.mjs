/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['workflow-builder'],
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

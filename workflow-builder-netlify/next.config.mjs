/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['workflow-builder'],
  trailingSlash: false,
};

export default nextConfig;
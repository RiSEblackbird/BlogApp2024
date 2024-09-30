/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'blog-app2024-1mkyidmp1-areyakoreya.vercel.app'],
  },
  async rewrites() {
    return [
      {
        source: '/posts/images/:path*',
        destination: '/api/images/:path*',
      },
    ]
  },
}

export default nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['blog-app2024-1mkyidmp1-areyakoreya.vercel.app'],
    },
    // 静的画像を扱うための設定
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/_next',
              name: 'static/media/[name].[hash].[ext]',
            },
          },
        ],
      });
  
      return config;
    },
  };
  
  export default nextConfig;
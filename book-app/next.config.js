// Không cần import type nữa
const NextFederationPlugin = require('@module-federation/nextjs-mf');

// Bỏ type annotation ': NextConfig'
const nextConfig = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    // Cấu hình Module Federation giữ nguyên
    config.plugins.push(
      new NextFederationPlugin({
        name: 'bookApp', // Phải khớp với tên trong remotes của host
        filename: 'static/chunks/remoteEntry.js', // Đường dẫn output cho remote entry
        exposes: {
          // Expose trang /book
          './BookPage': './src/pages/book.tsx', // Đường dẫn đến trang bạn muốn expose
        },
        shared: {
          // Chia sẻ dependencies với host app
          react: {
            singleton: true,
            requiredVersion: false, // Dùng phiên bản của host
            eager: true,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: false,
            eager: true,
          },
          '@mantine/core': {
            singleton: true,
            requiredVersion: false,
            eager: true,
          },
        },
        extraOptions: {
          // Bật tự động xử lý async boundary
          // automaticAsyncBoundary: true,
          // Tùy chọn: Chế độ debug để log chi tiết hơn
          debug: false,
          // Tùy chọn: Bỏ qua chia sẻ các module nội bộ của Next.js (đặt true nếu gặp vấn đề)
          skipSharingNextInternals: false,
        },
      })
    );

    return config;
  },
};

// Sử dụng module.exports thay vì export default
module.exports = nextConfig;
const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
// Trong Webpack 5, bạn có thể không cần ContextReplacementPlugin cho moment nếu dùng phiên bản mới
// hoặc có cấu hình khác tốt hơn. Để tạm ở đây nhưng lưu ý kiểm tra.
// const MomentContextReplacementPlugin = require('webpack.ContextReplacementPlugin');

module.exports = (env, argv) => {
  // Kiểm tra mode (development/production)
  const isDevelopment = argv.mode === 'development';

  return {
    // Mode tự động cấu hình nhiều thứ cho bạn
    mode: argv.mode || 'development', // Sử dụng mode từ argv

    entry: './index.js', // Điểm vào chính của ứng dụng

    output: {
      path: path.resolve(__dirname, 'dist'),
      // Sử dụng [name] cho filename để hỗ trợ code splitting tốt hơn trong tương lai
      filename: isDevelopment ? '[name].bundle.js' : '[name].[contenthash].bundle.js',
      publicPath: '/',
      clean: true, // Webpack 5 có tích hợp CleanWebpackPlugin
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: { esmodules: true } }], // Cấu hình preset-env nếu cần
                '@babel/preset-react'
              ],
              plugins: [
                // Đảm bảo các plugins này tương thích với Babel và môi trường Webpack 5
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                '@babel/plugin-proposal-class-properties',
                // 'graphql-tag', // Plugin này có thể cần kiểm tra lại với phiên bản graphql/apollo mới
                ['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }] // Kiểm tra lại style 'css' hoặc 'less'
              ]
            }
          }
        },
        {
          test: /\.css$/,
          // Loại trừ các file CSS Modules nếu bạn có
          exclude: /\.module\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDevelopment, // Source map chỉ cần trong dev
                modules: { // Cú pháp cấu hình CSS Modules trong css-loader v3+
                   localIdentName: isDevelopment ? '[name]__[local]___[hash:base64:5]' : '[hash:base64]',
                },
              }
            },
            {
              loader: 'less-loader',
              options: {
                 // Thêm các tùy chọn less-loader nếu cần, ví dụ: modifyVars cho Ant Design
                 // javascriptEnabled: true, // Nếu Ant Design cần JS trong less
                 // modifyVars: { '@primary-color': '#1DA57A' }, // Ví dụ đổi màu chủ đạo
              }
            }
          ],
           // Có thể cần thêm exclude: /node_modules/ nếu bạn không muốn xử lý less trong node_modules bằng CSS Modules
        },
        // --- Bắt đầu sử dụng Asset Modules (thay thế url-loader và file-loader) ---
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i, // Thêm các loại file ảnh bạn dùng
          type: 'asset/resource', // 'asset/resource' tương đương file-loader, 'asset/inline' tương đương url-loader
          // type: 'asset', // Webpack tự động chọn giữa resource và inline (mặc định base64 nếu < 8KB)
          // generator: { // Tùy chọn cấu hình tên file output
          //   filename: 'images/[hash][ext][query]'
          // }
        },
        {
           test: /\.(woff|woff2|eot|ttf|otf)$/i, // Thêm các loại file font nếu dùng
           type: 'asset/resource',
           // generator: {
           //   filename: 'fonts/[hash][ext][query]'
           // }
        },
        // --- Kết thúc sử dụng Asset Modules ---
      ]
    },

    // Optimization defaults tốt hơn trong Webpack 5
    optimization: {
      minimize: !isDevelopment, // Minimize trong production, không trong development
      // Cấu hình splitChunks để tối ưu chia nhỏ bundle (thường defaults là đủ tốt)
      // splitChunks: {
      //   chunks: 'all',
      // },
    },

    resolve: {
      extensions: ['*', '.mjs', '.js', '.jsx'], // .mjs có thể không cần thiết nữa
      // alias: { // Cấu hình alias nếu có
      //   '@': path.resolve(__dirname, 'src/'),
      // }
    },

    devServer: {
      // Cấu trúc devServer trong Webpack 5
      static: { // Tùy chọn static thay cho contentBase
        directory: path.join(__dirname, 'public'),
      },
      // publicPath: '/', // Tùy chọn này đã chuyển vào output.publicPath
      compress: true, // Bật gzip compression
      port: 3000,
      open: true,
      historyApiFallback: true, // Quan trọng cho SPA
      proxy: {
        '/api': 'http://localhost:8080'
      },
      // client: { // Cấu hình hiển thị lỗi overlay, log, v.v.
      //   overlay: true,
      // },
      // headers: { 'Access-Control-Allow-Origin': '*' }, // Nếu cần CORS headers
    },

    plugins: [
      // ContextReplacementPlugin cho moment có thể không cần hoặc cần cấu hình khác trong W5
      // new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
      new HtmlWebPackPlugin({
        template: './public/index.html',
        // minify options mặc định tốt trong production mode của HtmlWebpackPlugin v4/v5
        // minify: !isDevelopment ? { /* ... options ... */ } : false,
      }),
      // Đảm bảo dotenv-webpack tương thích W5
      new Dotenv({
        path: path.resolve(__dirname, '.env'),
        systemvars: true,
        // defaults: './.env.defaults' // Nếu có file default
      }),
      // Hot Module Replacement (HMR) được bật mặc định trong dev mode của W5 Dev Server
      // Nếu cần cấu hình thêm: new webpack.HotModuleReplacementPlugin(),
    ],

    // Thêm source maps tốt hơn cho development
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
  };
};
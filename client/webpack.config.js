const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = (env, argv) => ({
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true, // Cleans the output directory before each build
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              '@babel/plugin-proposal-class-properties',
              'graphql-tag',
              ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }], // Changed style: 'css' to true for antd v5
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.png$/,
        type: 'asset/resource', // Replaces url-loader
        generator: {
          filename: 'assets/[name][ext][query]', // Output path for assets
        },
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true, // Required for antd
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: argv.mode === 'production', // Minimize only in production
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs', '.json'], // Simplified extensions
  },
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    ],
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    new HtmlWebPackPlugin({
      template: './public/index.html',
    }),
    new Dotenv({
      path: path.resolve(__dirname, '.env'),
      systemvars: true,
    }),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery', // Cung cấp cả $ và jQuery
    // }),
    new ModuleFederationPlugin({
      name: 'hostApp', // Tên Host App
      remotes: {
        // Trỏ đến remoteEntry.js của Next.js Remote App
        // Lưu ý đường dẫn có thể là _next/static/chunks/remoteEntry.js
        bookApp: 'bookApp@http://localhost:3001/_next/static/chunks/remoteEntry.js',
      },
      shared: {
        // CỰC KỲ QUAN TRỌNG: Phải khớp chính xác với shared của Remote App
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
         // Share Mantine nếu cả 2 cùng dùng và muốn dùng chung instance/theme
        '@mantine/core': { singleton: true, requiredVersion: deps['@mantine/core'] },
      },
    }),
  ],

  // devtool: isDevelopment ? 'eval-source-map' : 'source-map',
});
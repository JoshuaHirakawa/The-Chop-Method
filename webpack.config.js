const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, /// make sure we can handle certain image files when bundling
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
    }),
    // new BundleAnalyzerPlugin(),
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'public'), /// make sure we can serve static files from public folder
      },
      {
        directory: path.join(__dirname, 'dist'), /// and also from the dist folder
      },
    ],
    port: 3000,
    hot: true,
  },
  performance: {
    hints: false, /// Suppress performance warnings
  },
  resolve: {
    extensions: ['.js', '.jsx'], ///  Add file extensions as needed
  },
  // fallback: {
  //   fs: false, // Disable 'fs' as it's not required in the browser
  //   path: require.resolve('path-browserify'),
  // },
};

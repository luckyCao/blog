/**
 * Created by luckyCao on 17/2/6.
 */
var webpack = require('webpack'),
  path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin');
var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    './src/App.js'
  ],
  output: {
    path: path.join(__dirname, '/build/'),
    filename: 'build/[name].[hash:4].js',
    chunkFilename: 'build/chunk.[id].[hash:4].js',
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    }, {
      test: /pixi\.js/, use: ['expose-loader?PIXI']
    }, {
      test: /phaser-split\.js$/, use: ['expose-loader?Phaser']
    }, {
      test: /p2\.js/, use: ['expose-loader?p2']
    }]
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
      'src/assets'
    ],
    extensions: ['.js', '.png'],
    alias: {
      'phaser': phaser,
      'pixi.js': pixi,
      'p2': p2,
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: 'body',
      template: "src/index.html"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin({
      minSizeReduce: 1.5,
      moveToParents: true
    })
  ],
  devtool: 'source-map'
};
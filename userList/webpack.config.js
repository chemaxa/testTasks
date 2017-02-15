'use strict';
let path = require('path');
let webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js'],
    moduleDirectories: ['node_modules']
  },
  resolveLoader: {
    extensions: ['', '.js'],
    moduleDirectories: ['node_modules'],
    moduleTemplates: ['*-loader']
  },
  entry: [
    './app/main'
  ],
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    //new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js?$/,
      loader: 'babel',
      exclude: /node_modules/,
      include: path.join(__dirname, '/app'),
      query: {
        presets: ['es2015']
      },
      plugins: ['transform-runtime']
    }]
  },
  node: {
    fs: "empty"
  },
  devServer: {
    publicPath: '/',
    hot: false,
    inline: false,
    contentBase: './public',
    historyApiFallback: true,
    stats: {
      colors: true
    },
    quiet: false,
    noInfo: false,
    port: 1337
  }
};
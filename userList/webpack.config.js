'use strict';
let path = require('path');
let webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js']
  },
  entry: [
    './app/main',
    'webpack-dev-server/client?http://localhost:1337',
    'webpack/hot/only-dev-server'
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: path.join(__dirname, '/app'),
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};


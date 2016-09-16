'use strict';
let path = require('path');
let webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  resolve: {
    extensions: ['', '.js']
  },
  entry: [
    'webpack-dev-server/client?http://localhost:1337',
    'webpack/hot/only-dev-server',
    './app/main'
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
        loader: 'babel?presets[]=es2015',
        exclude: /node_modules/,
        include: path.join(__dirname, '/app')
      }
    ]
  },
};
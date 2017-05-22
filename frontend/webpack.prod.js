const path = require('path');
const merge = require('webpack-merge');
const base = require('./webpack.base');

module.exports = merge({}, base, {
  entry: {
    analitics: './src/analitics.js',
  },


  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/public',
  },
});

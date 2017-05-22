const merge = require('webpack-merge');
const base = require('./webpack.base');

module.exports = merge({}, base, {
  entry: null,

  output: {},

  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        enforce: 'post',
        test: /src\/.+\.js$/,
        exclude: [
          /node_modules/,
          /\.test\.js$/,
        ],
        loader: 'istanbul-instrumenter-loader',
        options: {
          esModules: true,
        },
      },
    ],
  },
});

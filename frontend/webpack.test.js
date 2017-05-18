const path = require('path');
const merge = require('webpack-merge');
const base = require('./webpack.base');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge({}, base, {
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitError: true,
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(lodash)/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]--[hash:base64:5]',
              importLoaders: 1,
            },
          }, {
            loader: 'postcss-loader',
            options: {
              config: {
                ctx: {
                  cssnext: {},
                  cssnano: {},
                },
              },
            },
          }],
        }),
      },
      {
        test: /src\/.+\.js$/,
        exclude: /(node_modules|\.spec\.ts$)/,
        loader: 'istanbul-instrumenter-loader',
        enforce: 'post',
        options: {
          esModules: true,
        },
      },
    ],
  },
});

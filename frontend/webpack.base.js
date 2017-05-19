const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],

    extensions: ['.js', '.json', '.css'],
  },

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
    ],
  },

  plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      title: 'npm check name',
      filename: './index.html',
      inject: 'body',
      hash: true,
      minify: {
      },
    }),
  ],
};

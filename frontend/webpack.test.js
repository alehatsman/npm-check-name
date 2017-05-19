const merge = require('webpack-merge');
const base = require('./webpack.base');

module.exports = merge({}, base, {
  module: {
    rules: [
      {
        test: /src\/.+\.js$/,
        exclude: /(node_modules|\.test\.js$)/,
        loader: 'istanbul-instrumenter-loader',
        enforce: 'post',
        options: {
          esModules: true,
        },
      },
    ],
  },
});

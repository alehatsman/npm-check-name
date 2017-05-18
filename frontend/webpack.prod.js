const merge = require('webpack-merge');
const base = require('./webpack.base');

module.exports = merge({}, base, {
  entry: {
    analitics: './src/analitics.js',
  },
});

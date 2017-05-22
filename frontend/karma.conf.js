const path = require('path');
const webpack = require('./webpack.test');

const TEST_PATH = './tests.webpack.js';

module.exports = function karmaConfig(config) {
  config.set({
    reporters: ['mocha', 'coverage-istanbul'],

    browsers: ['ChromeCanary'],

    frameworks: ['mocha'],

    files: [
      { pattern: TEST_PATH, watched: true },
    ],

    preprocessors: {
      [TEST_PATH]: ['webpack', 'sourcemap'],
    },

    coverageIstanbulReporter: {
      reports: ['text-summary', 'html'],
      dir: path.join(__dirname, 'reports/coverage', 'outputs'),
      skipFilesWithNoCoverage: true,
    },

    webpack,
  });
};


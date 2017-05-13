module.exports = ({ file, options, env }) => ({
  plugins: {
    'postcss-import': { root: file.dirname },
    'postcss-cssnext': options.cssnext ? options.cssnext : false,
    autoprefixer: env === 'production' ? options.autoprefixer : false,
    cssnano: env === 'production' ? options.cssnano : false,
  },
});

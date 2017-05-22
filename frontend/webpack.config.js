module.exports = function (env) {
  console.log(`ENV: ${env}`);
  return require(`./webpack.${env}.js`);
};

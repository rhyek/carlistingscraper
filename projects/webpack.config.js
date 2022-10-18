/* eslint-disable @typescript-eslint/no-var-requires */
// https://docs.nestjs.com/faq/serverless
const nodeExternals = require('webpack-node-externals');

module.exports = function (options) {
  return {
    ...options,
    externals: [nodeExternals()],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
  };
};

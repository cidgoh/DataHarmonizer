const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname),
  entry: {
    schemas: './schemas.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'dist-schemas'),
    filename: '[name].js',
    globalObject: 'this',
    library: {
      name: 'schemas',
      type: 'umd',
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          context: 'templates',
          from: '**/*.pdf',
          to: '../templates/[path][name][ext]',
        },
        {
          context: 'templates',
          from: '**/schema.yaml',
          to: '../templates/[path][name][ext]',
        },
        {
          context: 'templates',
          from: '**/exampleInput/*.*',
          to: '../templates/[path][name][ext]',
        },
      ],
    }),
  ],
};

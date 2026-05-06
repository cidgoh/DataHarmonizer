const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname),
  entry: {
    schemas: './schemas.js',
  },
  module: {
    rules: [
      {
        // Bundle schema.yaml files as raw text strings (asset/source) so that
        // getSchemaYaml() can return them without fetch() in file:// contexts.
        test: /schema\.yaml$/,
        type: 'asset/source',
      },
    ],
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
          // schema.json as a static file so the HTTP JSON fallback in
          // fetchSchema() can fetch it directly without the webpack bundle.
          context: 'templates',
          from: '**/schema.json',
          to: '../templates/[path][name][ext]',
          noErrorOnMissing: true,
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

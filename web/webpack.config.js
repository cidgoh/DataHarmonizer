const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const DirectoryTreePlugin = require('directory-tree-webpack-plugin');

module.exports = (env, argv) => {
  var config = {
    context: path.resolve(__dirname),
    entry: './index.js',
    resolve: {
      alias: {
        '@/lib/images': path.resolve(__dirname, 'dist/assets'),
        '@': path.dirname(path.resolve(__dirname)), // this sets '@/' as an alias for the projectroot
      },
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'scripts/[name].js',
    },
    plugins: [
      // necessary for templates.js
      new DirectoryTreePlugin({
        dir: './web/templates',
        path: './web/templates/manifest.json',
        extensions: /\.md|\.json|\.yaml/,
        enhance: (item, options) => {
          item.path = item.path.replace('web', '');
        },
      }),
      new HtmlWebpackPlugin({
        template: './index.html',
      }),
      new CopyPlugin({
        patterns: [
          {
            context: 'templates',
            from: '**/*.pdf',
            to: 'templates/[path][name][ext]',
          },
          {
            context: 'templates',
            from: '**/schema.yaml',
            to: 'templates/[path][name][ext]',
          },
          {
            context: 'templates',
            from: '**/schema.json',
            to: 'templates/[path][name][ext]',
          },
          {
            context: 'templates',
            from: '**/exampleInput/*',
            to: 'templates/[path][name][ext]',
          },
          {
            from: 'main.html',
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.ya?ml$/,
          use: 'yaml-loader',
        },
        { test: /\.xlsx$/, loader: 'webpack-xlsx-loader' },
        {
          test: /\.(c|d|t)sv$/, // load all .csv, .dsv, .tsv files with dsv-loader
          use: ['dsv-loader'], // or dsv-loader?delimiter=,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.html$/,
          exclude: path.resolve(__dirname, 'index.html'),
          type: 'asset/source',
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: '../[file]',
            emit: false,
          },
        },
      ],
    },
    devServer: {
      hot: true,
      watchFiles: [path.resolve(__dirname, 'index.html')],
    },
  };

  if (argv.mode === 'development') {
    config.devtool = 'eval-source-map';
  }
  return config;
};

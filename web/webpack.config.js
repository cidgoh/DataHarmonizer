const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  var config = {
    context: path.resolve(__dirname),
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'scripts/[name].js',
      assetModuleFilename: 'assets/[hash][ext][query]',
    },
    plugins: [
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

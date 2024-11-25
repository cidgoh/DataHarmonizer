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
    },
    externals: {
      schemas: 'schemas',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
      }),
      new CopyPlugin({
        patterns: [
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
          generator: {
            // Will throw a file not found error if ``dist`` folder not in
            // ``{project root}/web/``.
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
    config.resolve = {
      alias: {
        'schemas': path.resolve(__dirname, 'schemas.js'),
      },
    }
    delete config.externals;
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            context: 'templates',
            from: '**/*.pdf',
            to: 'templates/[path][name][ext]',
          },
        ],
      }),
    );
    for (const rule of config.module.rules) {
      if (rule.hasOwnProperty('generator')) {
        delete rule.generator.filename;
        delete rule.generator.emit;
      }
    }
  }

  return config;
};

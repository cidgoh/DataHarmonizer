const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
//const DirectoryTreePlugin = require('directory-tree-webpack-plugin');

module.exports = (env, argv) => {
  var config = {
    context: path.resolve(__dirname),
    entry: './index.js',
    resolve: {
      alias: {
        '@': path.dirname(path.resolve(__dirname)), // this sets '@/' as an alias for the projectroot
      },
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'scripts/[name].js',
    },
    externals: {
      // Without declaring `schemas` as external, Webpack will attempt to look
      // for the `schemas` library and bundle it. However, we want our schemas
      // bundle to be separate from this one. This external config tells webpack
      // that the schemas library will instead be supplied at runtime. External
      // libraries can be provided in multiple ways, but we provide it through a
      // script reference in the HTML file outputted by this bundle.
      // https://webpack.js.org/configuration/externals/#externals
      schemas: 'schemas',
    },
    plugins: [
      /* necessary for templates.js
      new DirectoryTreePlugin({
        dir: './web/templates',
        path: './web/templates/manifest.json',
        extensions: /\.md|\.json/,
        enhance: (item, options) => {
          item.path = item.path.replace('web', '');
        },
      }),
      */
      new HtmlWebpackPlugin({
        template: './index.html',
      }),
      new CopyPlugin({ // Covers all schema.json including locales
        patterns: [
          {
            context: 'templates',
            from: '**/schema.json',
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

  // Difficult to run two webpack instances on a single dev server (i.e., this
  // file, and the other webpack file that builds schemas). So for dev servers,
  // we will stick to a singular build that concatenates both application and
  // schema content. This is fine, because the whole point of having a separate
  // build for schema content was to reduce production build times when users
  // are only editing schema files (and not the rest of the application), but
  // the dev server already gets around this problem through hot loading.
  if (argv.mode === 'development') {
    config.devtool = 'eval-source-map';
    // The external schemas lib is replaced by a direct reference to the
    // schemas entrypoint. When you directly reference the schemas entrypoint in
    // this bundle, a separate schemas library is not needed, because this
    // bundle will now include all schema content as well.
    config.resolve = {
      alias: {
        schemas: path.resolve(__dirname, 'schemas.js'),
      },
    };
    delete config.externals;
    // Need pdf SOPs that schema build previously supplied
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            context: 'templates',
            from: '**/*.pdf',
            to: 'templates/[path][name][ext]',
          },
        ],
      })
    );
    // False emits don't play nice with dev servers either
    for (const rule of config.module.rules) {
      if (rule.hasOwnProperty('generator')) {
        delete rule.generator.filename;
        delete rule.generator.emit;
      }
    }
  }
  return config;
};

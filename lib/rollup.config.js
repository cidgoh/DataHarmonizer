import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import styles from 'rollup-plugin-styles';
import { terser } from 'rollup-plugin-terser';
import { string } from 'rollup-plugin-string';
import image from '@rollup/plugin-image';
import { babel } from '@rollup/plugin-babel';

export default {
  input: 'lib/index.js',
  output: [
    {
      dir: 'lib/dist/es',
      assetFileNames: '[name][extname]',
      format: 'es',
    },
    {
      dir: 'lib/dist/umd',
      assetFileNames: '[name][extname]',
      format: 'umd',
      name: 'DataHarmonizer',
      exports: 'named',
      globals: {
        jquery: '$',
      },
    },
  ],
  external: ['jquery'],
  plugins: [
    json(),
    nodeResolve(),
    image(),
    string({
      include: '**/*.html',
    }),
    styles({
      mode: 'extract',
    }),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    terser(),
  ],
};

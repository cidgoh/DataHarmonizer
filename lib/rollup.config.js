export default {
  input: 'lib/index.js',
  output: [
    {
      file: 'lib/dist/data-harmonizer.es.js',
      format: 'es'
    },
    {
      file: 'lib/dist/data-harmonizer.umd.js',
      format: 'umd',
      name: 'DataHarmonizer'
    }
  ]
}
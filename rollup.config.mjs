import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

const babelOptions = {
  babelHelpers: 'runtime',
  exclude: 'node_modules/**'
}

export default [
  // One CommonJS file per source file (dist/tokenizer.js, dist/global.js), the
  // same layout `babel src -d dist` produced. Dependencies stay as require()s.
  {
    input: ['src/tokenizer.js', 'src/global.js'],
    external: [/node_modules/, 'axios', 'js-base64', /^@babel\/runtime/],
    plugins: [babel(babelOptions)],
    output: {
      dir: 'dist',
      format: 'cjs',
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: 'src'
    }
  },
  // Self-contained browser bundles that set window.tokenizer. Bundled
  // dependencies (axios) are transpiled too, so the hosted script stays ES5.
  {
    input: 'src/global.js',
    plugins: [
      nodeResolve({ browser: true }),
      commonjs(),
      babel({ ...babelOptions, exclude: /node_modules\/(@babel\/runtime|core-js)\// })
    ],
    output: [
      { file: 'dist/blockchyp-tokenizer-all.js', format: 'iife' },
      { file: 'dist/blockchyp-tokenizer-all.min.js', format: 'iife', plugins: [terser()] }
    ]
  }
]

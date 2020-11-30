import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'

const name = pkg.name.split('/')[1].replace(/-(\w)/g, (_, $1) => $1.toUpperCase())

const isDev = process.env.NODE_ENV === 'development'

function getOutPut() {
  const devOutPut = [
    {
      file: `public/index.js`,
      format: 'iife',
      name: '$',
    },
  ]
  const prodOutPut = [
    {
      file: `lib/${name}.esm.js`,
      format: 'esm',
      exports: 'auto',
    },
    {
      file: `lib/${name}.cjs.js`,
      format: 'cjs',
      exports: 'auto',
    },
    {
      file: `lib/${name}.min.js`,
      format: 'iife',
      name: '$',
    },
  ]
  return isDev ? devOutPut : prodOutPut
}

const config = {
  input: 'src',
  output: getOutPut(),
  plugins: [resolve({ browser: true }), commonjs({ exclude: 'node_modules' }), babel({ babelHelpers: 'bundled' })],
}
if (!isDev) {
  config.plugins.push(terser())
}

export default [config]

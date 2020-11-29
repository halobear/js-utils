import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const pkg = require('./package.json')

const isDev = process.env.NODE_ENV === 'development'

const version = isDev ? '' : `${pkg.version}.`
const name = pkg.name.split('/')[1].replace(/-(\w)/, (_, $1) => $1.toUpperCase())

const devOutput = [
  {
    file: 'public/index.js',
    format: 'iife',
  },
]

const prodOutput = [
  {
    file: 'lib/index.esm.js',
    format: 'esm',
  },
  {
    file: 'lib/index.cjs.js',
    format: 'cjs',
  },
  {
    file: `lib/${name}.${version}js`,
    format: 'iife',
    name,
  },
]

const config = {
  input: 'src/index.ts',
  output: isDev ? devOutput : prodOutput,
  plugins: [resolve(), commonjs({ exclude: 'node_modules' }), json(), typescript()],
}

if (!isDev) {
  config.plugins.push(terser())
}

export default [config]

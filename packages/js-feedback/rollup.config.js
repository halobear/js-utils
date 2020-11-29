import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const pkg = require('./package.json')

const isDev = process.env.NODE_ENV === 'development'

const version = isDev ? '' : `${pkg.version}.`
const name = pkg.name.split('/')[0]

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/index.js',
      format: 'es',
    },
    {
      file: `lib/${name}.${version}js`,
      format: 'iife',
      name,
    },
  ],
  plugins: [resolve(), commonjs({ exclude: 'node_modules' }), json(), typescript()],
}

if (!isDev) {
  config.plugins.push(terser())
}

export default [config]

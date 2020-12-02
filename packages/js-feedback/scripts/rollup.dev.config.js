import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'

import pkg from '../package.json'

const name = (pkg.name.includes('/') ? pkg.name.split('/')[1] : pkg.name).replace(
  /-(\w)/,
  (_, $1) => $1.toUpperCase()
)

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: 'public/index.js',
      format: 'iife',
      name,
    },
  ],
  plugins: [
    resolve({ browser: true }),
    commonjs({ exclude: 'node_modules' }),
    postcss(),
    json(),
    typescript({ tsconfigOverride: { compilerOptions: { module: 'es2015' } } }),
  ],
}

export default [config]

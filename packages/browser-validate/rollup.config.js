import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import { babel } from '@rollup/plugin-babel'
import pkg from './package.json'
import commonjs from '@rollup/plugin-commonjs'

const name = pkg.name.replace(/@/g, '').replace(/(-|\/)(\w)/g, (_, $1, $2) => $2.toUpperCase())

const isDev = process.env.NODE_ENV === 'development'

function getOutPut() {
  const devOutPut = [
    {
      file: `public/index.js`,
      format: 'iife',
      name,
    },
  ]
  const prodOutPut = [
    {
      file: `lib/${name}.cjs.js`,
      format: 'cjs',
      exports: 'auto',
    },
    {
      file: `lib/${name}.min.js`,
      format: 'iife',
      name,
    },
    {
      file: `lib/${name}.esm.js`,
      format: 'esm',
    },
  ]
  return isDev ? devOutPut : prodOutPut
}

const config = {
  input: 'src',
  output: getOutPut(),
  plugins: [
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
    }),
    resolve({ browser: true }),
    commonjs(),
  ],
}
if (!isDev) {
  config.plugins.push(terser())
}

export default [config]

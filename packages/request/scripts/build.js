const path = require('path')
const fs = require('fs')
const rollup = require('rollup')
const { default: resolve } = require('@rollup/plugin-node-resolve')
const typescript = require('rollup-plugin-typescript2')
const { terser } = require("rollup-plugin-terser")
const Terser = require('terser')
const commonjs = require('@rollup/plugin-commonjs')

const pkg = require('../package.json')

const isDev = process.env.NODE_ENV === 'production'
const outDir = isDev ? 'lib' : 'public'

const name = (pkg.name.includes('/') ? pkg.name.split('/')[1] : pkg.name).replace(
  /-(\w)/,
  (_, $1) => $1.toUpperCase()
)

const date = {
  day: new Date().getDate(),
  month: 'January February March April May June July August September October November December'.split(
    ' '
  )[new Date().getMonth()],
  year: new Date().getFullYear(),
}

const version = process.env.VERSION || pkg.version

const banner = `
/**
 * ${pkg.name} ${version}
 * Released on: ${date.month} ${date.day}, ${date.year}
 */
`.trim()

const config = {
  input: path.resolve(__dirname, '../src/index.ts'),
  plugins: [resolve(), commonjs(), typescript()],
  external: ['axios', '@halobear/js-feedback'],
}

function buildUMD() {
  rollup
    .rollup(config)
    .then((bundle) => {
      return bundle.write({
        strict: true,
        name,
        format: 'umd',
        file: path.resolve(__dirname, `../${outDir}/index.umd.js`),
        banner,
        globals: { axios: 'axios', '@halobear/js-feedback': 'jsFeedback' },
        exports: 'auto',
      })
    })
    .then((bundle) => {
      const result = bundle.output[0]
      const minified = Terser.minify(result.code, {
        sourceMap: {
          filename: `index.umd.min.js`,
        },
        output: {
          preamble: banner,
        },
      })
      fs.writeFileSync(path.resolve(__dirname, `../${outDir}/index.umd.min.js`), minified.code)
    })
    .catch((err) => {
      console.log(err)
    })
}

function buildESM() {
  rollup
    .rollup({
      ...config,
      plugins: [...config.plugins, terser()]
    })
    .then((bundle) => {
      return bundle.write({
        strict: true,
        format: 'esm',
        file: path.resolve(__dirname, `../${outDir}/index.esm.min.js`),
        sourcemap: false,
        banner,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

buildUMD()
buildESM()

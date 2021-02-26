const path = require('path')
const fs = require('fs')
const rollup = require('rollup')
const { default: resolve } = require('@rollup/plugin-node-resolve')
const typescript = require('rollup-plugin-typescript2')
const Terser = require('terser')
const commonjs = require('@rollup/plugin-commonjs')

const pkg = require('../package.json')

const isDev = process.env.NODE_ENV === 'production'
const outDir = isDev ? 'lib' : 'public'

const name = 'Lazyload'

// const name = (pkg.name.includes('/') ? pkg.name.split('/')[1] : pkg.name).replace(
//   /-(\w)/,
//   (_, $1) => $1.toUpperCase()
// )

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

function buildUMD() {
  rollup
    .rollup({
      input: path.resolve(__dirname, '../src/index.ts'),
      plugins: [resolve(), commonjs(), typescript()],
      // external: ['axios'],
    })
    .then((bundle) => {
      return bundle.write({
        strict: true,
        name,
        format: 'umd',
        file: path.resolve(__dirname, `../${outDir}/index.umd.js`),
        banner,
        // globals: { axios: 'axios' },
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
      input: path.resolve(__dirname, '../src/index.ts'),
      plugins: [resolve(), commonjs(), typescript()],
      external: ['axios'],
    })
    .then((bundle) => {
      return bundle.write({
        strict: true,
        format: 'esm',
        file: path.resolve(__dirname, `../${outDir}/index.esm.js`),
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

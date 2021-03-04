/*
NODE_ENV=production node scripts/build --formats esm -t // build
*/

const path = require("path")
const fs = require("fs-extra")
const chalk = require("chalk")
const execa = require('execa')

const args = require("minimist")(process.argv.slice(2))
const formats = args.formats || args.f
const sourceMap = args.sourcemap || args.s
const buildTypes = args.types || args.t

console.log(args)
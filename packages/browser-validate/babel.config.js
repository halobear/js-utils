module.exports = {
  presets: [['@babel/preset-env', { loose: true }]],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
  ],
}

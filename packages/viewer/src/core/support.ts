const supportTouch = 'ontouchstart' in (typeof window !== 'undefined' ? window : {})

// const supportsPassive = (() => {
//   let supportsPassive = false
//   try {
//     const opts = Object.defineProperty({}, 'passive', {
//       // eslint-disable-next-line
//       get() {
//         supportsPassive = true
//       },
//     })
//     window.addEventListener('testPassiveListener', () => {}, opts)
//   } catch (e) {
//     // No support
//   }
//   return supportsPassive
// })()

export default {
  touch: supportTouch,
  // passiveListener: supportsPassive,
}

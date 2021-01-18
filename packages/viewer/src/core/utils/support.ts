import { default as win } from './window'

interface SupportWin extends Window {
  DocumentTouch?: any
}
const window = win as SupportWin

export default {
  // passiveListener: (() => {
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
  // })(),
  touch: !!('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch)),
}

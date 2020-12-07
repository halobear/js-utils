import { getWindow } from 'ssr-window'

interface SupportWin extends Window {
  DocumentTouch?: any
  PointerEvent?: any
}

const window = getWindow() as SupportWin

export default {
  touch: !!(
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof window.DocumentTouch)
  ),
}

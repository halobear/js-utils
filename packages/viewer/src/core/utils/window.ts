import { getWindow } from 'ssr-window'

interface Win extends Window {
  DocumentTouch?: any
  WebKitCSSMatrix?: any
}

export default getWindow() as Win

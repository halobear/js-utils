import window from './window'

// 获取当前时间
export const now = () => new Date().getTime()

// 页面x、y
export const getPointer = (e: TouchEvent | MouseEvent) => {
  const { pageX, pageY } = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0] : (e as MouseEvent)
  return { pageX, pageY }
}

// 获取手指距离
export function getDistanceBetweenTouches(e: TouchEvent) {
  if (e.targetTouches.length < 2) return 1
  const x1 = e.targetTouches[0].pageX
  const y1 = e.targetTouches[0].pageY
  const x2 = e.targetTouches[1].pageX
  const y2 = e.targetTouches[1].pageY
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  return distance
}

// 获取translate
export function getTranslate(el: HTMLElement, axis = 'x') {
  let matrix
  let curTransform
  let transformMatrix

  const curStyle = window.getComputedStyle(el, null)

  if ('WebKitCSSMatrix' in window) {
    curTransform = curStyle.transform || curStyle.webkitTransform
    if (curTransform.split(',').length > 6) {
      curTransform = curTransform
        .split(', ')
        .map((a) => a.replace(',', '.'))
        .join(', ')
    }
    // Some old versions of Webkit choke when 'none' is passed; pass
    // empty string instead in this case
    transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform)
  } else {
    const cs = curStyle as any
    transformMatrix =
      cs.MozTransform ||
      cs.OTransform ||
      cs.MsTransform ||
      cs.msTransform ||
      cs.transform ||
      cs.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,')
    matrix = transformMatrix.toString().split(',')
  }

  if (axis === 'x') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41
    // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[12])
    // Normal Browsers
    else curTransform = parseFloat(matrix[4])
  }
  if (axis === 'y') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42
    // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[13])
    // Normal Browsers
    else curTransform = parseFloat(matrix[5])
  }
  return curTransform || 0
}

/**
 * 缓冲函数
 * @param value 当前值
 * @param min 最小
 * @param max 最大
 * @param a 系数
 */
export function easing(value = 0, min = 0, max = 100, a = 0.8) {
  if (value < min) {
    value = min + 1 - (min - value + 1) ** a
  }
  if (value > max) {
    value = max - 1 + (value - max + 1) ** a
  }
  return value
}

import $ from '@halobear/dom'
import support from './support'

// 页面pageX, pageY
export const getPointer = (e: TouchEvent | MouseEvent) => {
  const { clientX, clientY, pageX, pageY } =
    'changedTouches' in e ? (e as TouchEvent).changedTouches[0] : (e as MouseEvent)
  return { clientX, clientY, pageX, pageY }
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

/**
 * 阻力函数
 * @param value 当前值
 * @param min 最小
 * @param max 最大
 * @param a 系数
 */
export function resistance(value = 0, min = 0, max = 100, a = 0.8) {
  if (value < min) {
    value = min + 1 - (min - value + 1) ** a
  }
  if (value > max) {
    value = max - 1 + (value - max + 1) ** a
  }
  return value
}

/**
 * 限制最大最小
 * @param value
 * @param min
 * @param max
 */
export function range(value = 0, min = 0, max = 100) {
  if (value < min) return min
  if (value > max) return max
  return value
}

// 显示图片预览
export function showViewer(container: HTMLDivElement, e?: TouchEvent | MouseEvent) {
  const clientWidth = document.documentElement.clientWidth || document.body.clientWidth
  const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
  const { clientX, clientY } = e ? getPointer(e) : { clientX: clientWidth / 2, clientY: clientHeight / 2 }
  const diffX = clientX - clientWidth / 2
  const diffY = clientY - clientHeight / 2
  const $container = $(container)
  $container.transition(0).transform(`translate3d(${diffX}px, ${diffY}px,0) scale(0)`).css({ opacity: '0' })
  setTimeout(() => {
    $container.transition(150).transform(`translate3d(0,0,0) scale(1)`).css({ opacity: '1' })
  })
}

// 隐藏图片预览
export function hideViewer(container: HTMLDivElement) {
  const $container = $(container)
  container.classList.add('hide')
  setTimeout(() => {
    $container.transition(80).css({ opacity: '0' })
    $container.on('webkitTransitionEnd transitionend', function () {
      container.parentNode && $container.remove()
    })
  })
}

export function listenOption(capture = false, passive = false) {
  return support.passive ? { passive, capture } : capture
}

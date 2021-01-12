import $, { HaloDom } from '@halobear/dom'
import support from './support'

// Calc Scale From Multi-touches
export function getDistanceBetweenTouches(e: TouchEvent) {
  if (e.targetTouches.length < 2) return 1
  const x1 = e.targetTouches[0].pageX
  const y1 = e.targetTouches[0].pageY
  const x2 = e.targetTouches[1].pageX
  const y2 = e.targetTouches[1].pageY
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  return distance
}

interface ZoomInOptions {
  scale: number
  img: HTMLImageElement
  wrap: HTMLElement | null
  $img?: HaloDom
  $wrap?: HaloDom
}

export function zoomIn(e: TouchEvent | MouseEvent, options: ZoomInOptions) {
  const { scale, img, wrap = img.parentElement, $img = $(img), $wrap = $(wrap) } = options
  if (!wrap) throw new Error('缺少zoomable-wrap包裹')
  const { pageX, pageY } = support.touch ? (e as TouchEvent).changedTouches[0] : (e as MouseEvent)
  const slideWidth = wrap.offsetWidth
  const slideHeight = wrap.offsetHeight
  const rect = wrap.getBoundingClientRect()
  const diffX = rect.left + slideWidth / 2 - pageX
  const diffY = rect.top + slideHeight / 2 - pageY
  const scaledWidth = img.offsetWidth * scale
  const scaledHeight = img.offsetHeight * scale
  const translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0)
  const translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0)
  const translateMaxX = -translateMinX
  const translateMaxY = -translateMinY

  let translateX = diffX * scale
  let translateY = diffY * scale

  if (translateX < translateMinX) {
    translateX = translateMinX
  }
  if (translateX > translateMaxX) {
    translateX = translateMaxX
  }

  if (translateY < translateMinY) {
    translateY = translateMinY
  }
  if (translateY > translateMaxY) {
    translateY = translateMaxY
  }
  $wrap.transition(300).transform(`translate3d(${translateX}px, ${translateY}px,0)`)
  $img.transition(300).transform(`translate3d(0,0,0) scale(${scale})`)
}

export function zoomOut($img: HaloDom, $wrap: HaloDom) {
  $wrap.transition(300).transform('translate3d(0,0,0)')
  $img.transition(300).transform('translate3d(0,0,0) scale(1)')
}

export function showViewer(e: TouchEvent | MouseEvent, container: HTMLElement) {
  const { pageX, pageY } = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0] : (e as MouseEvent)
  const clientWidth = document.documentElement.clientWidth || document.body.clientWidth
  const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
  const diffX = pageX - clientWidth / 2
  const diffY = pageY - clientHeight / 2
  const $container = $(container)
  $container.transition(0).transform(`translate3d(${diffX}px, ${diffY}px,0) scale(0)`)
  setTimeout(() => {
    $container.transition(300).transform(`translate3d(0,0,0) scale(1)`)
  })
}

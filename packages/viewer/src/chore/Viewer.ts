import $, { Ret } from '@halobear/dom'
import { now } from './utils'
import support from './utils/support'

interface Params {
  maxRatio?: number
}

type Method = 'on' | 'off'
class Viewer {
  private wrap: HTMLElement
  private $img: Ret
  private $wrap: Ret
  private touchEventsData = {
    lastClickTime: 0,
    touchStartTime: 0,
  }
  private zoom = {
    scale: 1,
    currentScale: 1,
  }
  private params = {
    maxRatio: 3,
  }
  constructor(
    private img: HTMLImageElement,
    params: Params,
    wrap: HTMLElement | null = img.parentElement
  ) {
    if (!wrap) throw new Error('Wrap Not Found')
    Object.assign(this.params, params)
    this.$img = $(this.img)
    this.wrap = wrap
    this.$wrap = $(this.wrap)
    this.bindEvent()
  }
  // 绑定事件
  bindEvent = (method: Method = 'on') => {
    if (support.touch) {
      this.$img[method]('touchstart', this.touchstart)
      this.$img[method]('touchend', this.touchend)
    } else {
      this.$img[method]('mousedown', this.touchstart)
      this.$img[method]('mouseup', this.touchend)
    }
  }
  // 取消绑定事件
  unbindEvent = () => {
    this.bindEvent('off')
  }
  // 触摸开始事件
  touchstart = (e: MouseEvent | TouchEvent) => {
    this.touchEventsData.touchStartTime = now()
  }
  // 触摸结束事件
  touchend = (e: MouseEvent | TouchEvent) => {
    const touchEndTime = now()
    const data = this.touchEventsData
    const timeDiff = touchEndTime - data.touchStartTime
    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      this.doubleTap(e)
    }
    data.lastClickTime = touchEndTime
  }
  // 双击事件
  doubleTap = (e: MouseEvent | TouchEvent) => {
    this.toggle(e)
  }
  // 切换放大/1缩小
  toggle = (e: MouseEvent | TouchEvent) => {
    this.zoom.scale === 1 ? this.zoomIn(e) : this.zoomOut()
  }
  // 放大进入
  zoomIn = (e: MouseEvent | TouchEvent) => {
    const { zoom, img, wrap, params } = this
    zoom.scale = zoom.currentScale = params.maxRatio
    const { pageX, pageY } = support.touch ? (e as TouchEvent).changedTouches[0] : (e as MouseEvent)
    const slideWidth = wrap.offsetWidth
    const slideHeight = wrap.offsetHeight
    const rect = wrap.getBoundingClientRect()
    const diffX = rect.left + slideWidth / 2 - pageX
    const diffY = rect.top + slideHeight / 2 - pageY
    const scaledWidth = img.offsetWidth * zoom.scale
    const scaledHeight = img.offsetHeight * zoom.scale
    const translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0)
    const translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0)
    const translateMaxX = -translateMinX
    const translateMaxY = -translateMinY

    let translateX = diffX * zoom.scale
    let translateY = diffY * zoom.scale

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
    this.$wrap.transition(300).transform(`translate3d(${translateX}px, ${translateY}px,0)`)
    this.$img.transition(300).transform(`translate3d(0,0,0) scale(${zoom.scale})`)
  }
  // 恢复缩放
  zoomOut() {
    this.zoom.scale = this.zoom.currentScale = 1
    this.$wrap.transition(300).transform('translate3d(0,0,0)')
    this.$img.transition(300).transform('translate3d(0,0,0) scale(1)')
  }
}

export default Viewer

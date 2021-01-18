import $, { HaloDom } from '@halobear/dom'

import support from './support'
import { getDistanceBetweenTouches, getPointer, getTranslate } from './util'

interface ZoomOptions {
  maxRatio: number
  minRatio: number
}

const defaults: ZoomOptions = {
  maxRatio: 3,
  minRatio: 0.5,
}

class Zoomable {
  el: HTMLElement
  options: ZoomOptions

  wrap: HTMLElement
  $el: HaloDom
  $wrap: HaloDom

  isScaling = false // 是否在缩放
  scaleStart = 1 // 按下手指距离
  scaleMove = 1 // 移动手指距离
  currentScale = 1 // 缩放开始时候的缩放比例
  scale = 1 // 缩放比例
  width = 100 // 缩放元素尺寸
  height = 100 // 缩放元素尺寸
  startX = 0 // 滑动开始
  startY = 0 // 滑动开始Y
  minX = 0 // 最小移动x
  minY = 0 // 最小移动Y
  maxX = 0 // 最大移动X
  maxY = 0 // 最大移动Y
  currentX = 0 // 当前pagex
  currentY = 0 // 当前pagey
  wrapWidth = 100 // 缩放父元素尺寸
  wrapHeight = 100 // 缩放父元素尺寸
  constructor(el: HTMLElement, options?: Partial<ZoomOptions>) {
    this.el = el
    this.options = { ...defaults, ...options }

    this.$el = $(el)
    this.wrap = el.parentElement as HTMLElement
    this.$wrap = $(this.wrap)

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onGestureEnd = this.onGestureEnd.bind(this)
    this.init()
  }

  init() {
    if (!support.touch) return
    this.wrap.addEventListener('touchstart', this.onTouchStart)
    this.wrap.addEventListener('touchmove', this.onTouchMove)
    this.wrap.addEventListener('touchend', this.onGestureEnd)
    this.wrap.addEventListener('touchcancel', this.onGestureEnd)
  }

  destroy() {
    if (!support.touch) return
    this.wrap.removeEventListener('touchstart', this.onTouchStart)
    this.wrap.removeEventListener('touchmove', this.onGestureChange)
    this.wrap.removeEventListener('touchend', this.onGestureEnd)
    this.wrap.removeEventListener('touchcancel', this.onGestureEnd)
  }

  onTouchStart(e: TouchEvent) {
    e.preventDefault()
    if (this.isScaling || e.targetTouches.length > 1) {
      e.stopPropagation()
    }
    this.width = this.el.offsetWidth
    this.height = this.el.offsetHeight
    this.wrapWidth = this.wrap.offsetWidth
    this.wrapHeight = this.wrap.offsetHeight
    this.startX = getTranslate(this.el, 'x') || 0
    this.startY = getTranslate(this.el, 'y') || 0
    this.onGestureStart(e)
  }

  onTouchMove(e: TouchEvent) {
    e.preventDefault()
    this.onGestureChange(e)

    if (!this.isScaling || e.touches.length !== 1) return

    // 如果图片在放大状态，则支持拖动
    const scaledWidth = this.width * this.scale
    const scaledHeight = this.height * this.scale

    if (scaledWidth < this.wrapWidth && scaledHeight < this.wrapHeight) return

    this.minX = Math.min(this.wrapWidth / 2 - scaledWidth / 2, 0)
    this.maxX = -this.minX
    this.minY = Math.min(this.wrapWidth / 2 - scaledHeight / 2, 0)
    this.maxY = -this.minY
    const { pageX, pageY } = getPointer(e)
    this.currentX = pageX
    this.currentY = pageY
  }

  onGestureStart(e: TouchEvent) {
    this.$el.transition(0)
    if (e.targetTouches.length < 2) return
    this.isScaling = true
    this.scaleStart = getDistanceBetweenTouches(e)
  }

  onGestureChange(e: TouchEvent) {
    if (e.targetTouches.length < 2) return
    if (!this.isScaling) return
    e.stopPropagation()
    this.scaleMove = getDistanceBetweenTouches(e)
    this.scale = (this.scaleMove / this.scaleStart) * this.currentScale
    const { maxRatio, minRatio } = this.options
    if (this.scale > maxRatio) {
      this.scale = maxRatio - 1 + (this.scale - maxRatio + 1) ** 0.5
    }
    if (this.scale < minRatio) {
      this.scale = minRatio + 1 - (minRatio - this.scale + 1) ** 0.5
    }
    this.$el.transform(`translate3d(0,0,0) scale(${this.scale})`)
  }

  onGestureEnd(e: TouchEvent) {
    e.preventDefault()
    if (e.targetTouches.length > 1) {
      e.stopPropagation()
    }
    const { maxRatio, minRatio } = this.options
    let scale = Math.max(Math.min(this.scale, maxRatio), minRatio)
    if (Math.abs(scale - 1) < 0.05) {
      scale = 1
    }
    this.currentScale = this.scale = scale
    this.$el.transition(300).transform(`translate3d(0,0,0) scale(${this.scale})`)
    if (scale === 1) {
      this.isScaling = false
    }
  }
}

export default (el: HTMLElement, options?: Partial<ZoomOptions>) => {
  new Zoomable(el, options)
}

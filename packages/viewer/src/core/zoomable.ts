import $, { HaloDom } from '@halobear/dom'

import support from './support'
import { getDistanceBetweenTouches, getPointer, resistance, range, listenOption } from './util'

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
  disabledMove = false // 禁止滑动
  scaleStart = 1 // 按下手指距离
  scaleMove = 1 // 移动手指距离
  currentScale = 1 // 缩放开始时候的缩放比例
  scale = 1 // 缩放比例
  width = 100 // 缩放元素尺寸
  height = 100 // 缩放元素尺寸
  wrapWidth = 100 // 缩放父元素尺寸
  wrapHeight = 100 // 缩放父元素尺寸
  startX = 0 // 滑动开始X
  startY = 0 // 滑动开始Y
  minX = 0 // 最小移动x
  minY = 0 // 最小移动Y
  maxX = 0 // 最大移动X
  maxY = 0 // 最大移动Y
  startPageX = 0 // 开始pageX
  startPageY = 0 // 开始pageY
  pageX = 0 // 当前pagex
  pageY = 0 // 当前pagey
  currentX = 0 // 当前移动X
  currentY = 0 // 当前移动Y
  touchEventsData = {
    touchStartTime: 0,
    touchEndTime: 0,
    lastClickTime: 0,
  }
  constructor(el: HTMLElement, options?: Partial<ZoomOptions>) {
    this.el = el
    this.options = { ...defaults, ...options }

    this.$el = $(el)
    this.wrap = el.parentElement as HTMLElement
    this.$wrap = $(this.wrap)

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.init()
  }

  init() {
    if (!support.touch) return
    const o = listenOption()
    this.wrap.addEventListener('touchstart', this.onTouchStart, o)
    this.wrap.addEventListener('touchmove', this.onTouchMove, o)
    this.wrap.addEventListener('touchend', this.onTouchEnd, o)
    this.wrap.addEventListener('touchcancel', this.onTouchEnd, o)
  }

  destroy() {
    if (!support.touch) return
    this.wrap.removeEventListener('touchstart', this.onTouchStart)
    this.wrap.removeEventListener('touchmove', this.onTouchMove)
    this.wrap.removeEventListener('touchend', this.onTouchEnd)
    this.wrap.removeEventListener('touchcancel', this.onTouchEnd)
  }

  onTouchStart(e: TouchEvent) {
    e.preventDefault()
    if (e.targetTouches.length > 1 || this.isScaling) {
      e.stopPropagation()
    }
    // 防止缩放和滑动冲突
    if (e.targetTouches.length > 1) {
      this.disabledMove = true
    }
    // 保存当前点击时间
    if (e.targetTouches.length === 1) {
      this.touchEventsData.touchStartTime = Date.now()
      this.width = this.el.offsetWidth
      this.height = this.el.offsetHeight
      this.wrapWidth = this.wrap.offsetWidth
      this.wrapHeight = this.wrap.offsetHeight
      this.startX = this.currentX
      this.startY = this.currentY
      const { pageX, pageY } = getPointer(e)
      this.startPageX = pageX
      this.startPageY = pageY
    }
    this.$wrap.transition(0)
    this.onGestureStart(e)
  }

  onTouchMove(e: TouchEvent) {
    e.preventDefault()
    if (e.targetTouches.length > 1 || this.isScaling) {
      e.stopPropagation()
    }
    this.onGestureChange(e)

    if (this.disabledMove || !this.isScaling || e.targetTouches.length !== 1) return

    // 如果图片在放大状态，则支持拖动
    const scaledWidth = this.width * this.scale
    const scaledHeight = this.height * this.scale

    if (scaledWidth < this.wrapWidth && scaledHeight < this.wrapHeight) return

    this.minX = Math.min(this.wrapWidth / 2 - scaledWidth / 2, 0)
    this.maxX = -this.minX
    this.minY = Math.min(this.wrapWidth / 2 - scaledHeight / 2, 0)
    this.maxY = -this.minY
    const { pageX, pageY } = getPointer(e)
    this.pageX = pageX
    this.pageY = pageY
    const currentX = this.pageX - this.startPageX + this.startX
    const currentY = this.pageY - this.startPageY + this.startY
    this.currentX = resistance(currentX, this.minX, this.maxX)
    this.currentY = resistance(currentY, this.minY, this.maxY)
    this.$wrap.transform(`translate3d(${this.currentX}px, ${this.currentY}px,0)`)
  }

  onTouchEnd(e: TouchEvent) {
    e.preventDefault()
    const touchesLen = e.changedTouches.length
    if (touchesLen > 1 || this.isScaling) {
      e.stopPropagation()
    }
    if (!e.targetTouches.length) {
      this.disabledMove = false
    }
    // 判断双击事件
    const touchEndTime = Date.now()
    const data = this.touchEventsData
    const timeDiff = touchEndTime - data.touchStartTime
    const lastClickTime = data.lastClickTime
    data.lastClickTime = touchEndTime
    if (timeDiff < 300 && touchEndTime - lastClickTime < 300) {
      this.scale === 1 ? this.zoomIn(e) : this.zoomOut()
    } else {
      this.onGestureEnd(e)
    }
    // 滑动超出距离返回
    const currentX = range(this.currentX, this.minX, this.maxX)
    const currentY = range(this.currentY, this.minY, this.maxY)
    if (currentX === this.currentX && currentY === this.currentY) return
    this.currentX = currentX
    this.currentY = currentY
    this.$wrap.transition(300).transform(`translate3d(${currentX}px, ${currentY}px,0)`)
  }

  onGestureStart(e: TouchEvent) {
    this.$el.transition(0)
    if (e.targetTouches.length < 2) return
    this.isScaling = true
    this.scaleStart = getDistanceBetweenTouches(e)
  }

  onGestureChange(e: TouchEvent) {
    if (e.targetTouches.length < 2 || !this.isScaling) return
    this.scaleMove = getDistanceBetweenTouches(e)
    const scale = (this.scaleMove / this.scaleStart) * this.currentScale
    const { maxRatio, minRatio } = this.options
    // 缩放阻力
    this.scale = resistance(scale, minRatio, maxRatio, 0.5)
    this.$el.transform(`translate3d(0,0,0) scale(${this.scale})`)
  }

  onGestureEnd(e: TouchEvent) {
    const { maxRatio, minRatio } = this.options
    let scale = range(this.scale, minRatio, maxRatio)
    if (Math.abs(scale - 1) < 0.05) scale = 1
    if (scale === 1) this.isScaling = false
    if (scale <= 1) {
      if (this.currentX === 0 && this.currentY === 0) return
      this.$wrap.transition(300).transform('translate3d(0,0,0)')
    }
    if (this.scale === scale && this.currentScale === scale) return
    this.currentScale = this.scale = scale
    this.$el.transition(300).transform(`translate3d(0,0,0) scale(${this.scale})`)
  }

  zoomIn(e: TouchEvent) {
    const { pageX, pageY } = getPointer(e)
    this.wrapWidth = this.wrap.offsetWidth
    this.wrapHeight = this.wrap.offsetHeight
    const rect = this.wrap.getBoundingClientRect()
    const diffX = rect.left + this.wrapWidth / 2 - pageX
    const diffY = rect.top + this.wrapHeight / 2 - pageY
    const scale = this.options.maxRatio
    const scaledWidth = this.el.offsetWidth * scale
    const scaledHeight = this.el.offsetHeight * scale
    this.minX = Math.min(this.wrapWidth / 2 - scaledWidth / 2, 0)
    this.minY = Math.min(this.wrapHeight / 2 - scaledHeight / 2, 0)
    this.maxX = -this.minX
    this.maxY = -this.minY

    this.currentX = range(diffX * scale, this.minX, this.maxX)
    this.currentY = range(diffY * scale, this.minY, this.maxY)
    this.currentScale = this.scale = scale
    this.isScaling = true
    this.$wrap.transition(300).transform(`translate3d(${this.currentX}px, ${this.currentY}px,0)`)
    this.$el.transition(300).transform(`translate3d(0,0,0) scale(${scale})`)
  }

  zoomOut() {
    this.currentX = this.startX = this.currentY = this.startY = 0
    this.currentScale = this.scale = 1
    this.isScaling = false
    this.$el.transition(300).transform('translate3d(0,0,0) scale(1)')
    this.$wrap.transition(300).transform('translate3d(0,0,0)')
  }
}

export default (el: HTMLElement, options?: Partial<ZoomOptions>) => {
  const az = new Zoomable(el, options)
  return function () {
    az.destroy()
  }
}

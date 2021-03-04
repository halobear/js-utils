// 下滑关闭

import $, { HaloDom } from '@halobear/dom'
import support from './support'
import { getPointer, listenOption } from './util'

type ChangeOpacityFn = (opacity: number) => void

class Closeable {
  private el: HTMLDivElement
  private $el: HaloDom
  private closeHeight: number
  private startX: number = 0
  private startY: number = 0
  private diffX: number = 0
  private diffY: number = 0
  private opacity: number = 1
  private changeOpacity: ChangeOpacityFn
  private isStart: boolean = false
  private direction: 'vertical' | 'horizontal' | '' = ''
  constructor(el: HTMLDivElement, closeHeight: number = 200, changeOpacity: ChangeOpacityFn) {
    this.el = el
    this.$el = $(el)
    this.closeHeight = closeHeight
    this.changeOpacity = changeOpacity

    this.init = this.init.bind(this)
    this.touchstart = this.touchstart.bind(this)
    this.touchmove = this.touchmove.bind(this)
    this.touchend = this.touchend.bind(this)
    this.init()
  }
  init() {
    const o = listenOption()
    if (support.touch) {
      this.el.addEventListener('touchstart', this.touchstart, o)
      window.addEventListener('touchmove', this.touchmove, o)
      window.addEventListener('touchend', this.touchend, o)
      window.addEventListener('touchcancel', this.touchend, o)
    } else {
      this.el.addEventListener('mousedown', this.touchstart, o)
      window.addEventListener('mousemove', this.touchmove, o)
      window.addEventListener('mouseup', this.touchend, o)
    }
  }
  destroy() {
    if (support.touch) {
      this.el.removeEventListener('touchstart', this.touchstart)
      window.removeEventListener('touchmove', this.touchmove)
      window.removeEventListener('touchend', this.touchend)
      window.removeEventListener('touchcancel', this.touchend)
    } else {
      this.el.removeEventListener('mousedown', this.touchstart)
      window.removeEventListener('mousemove', this.touchmove)
      window.removeEventListener('mouseup', this.touchend)
    }
  }
  touchstart(e: TouchEvent | MouseEvent) {
    if (((e as TouchEvent).touches || []).length > 1) return
    this.isStart = true
    if (e.cancelable) {
      e.preventDefault()
    }
    const pointer = getPointer(e)
    this.startX = pointer.clientX
    this.startY = pointer.clientY
    this.diffY = 0
    this.diffY = 0
    this.direction = ''
    this.$el.transition(0)
  }
  touchmove(e: TouchEvent | MouseEvent) {
    if (!this.isStart) return
    if (e.cancelable) {
      e.preventDefault()
    }
    if (this.direction !== 'horizontal') {
      e.stopPropagation()
    }
    const xy = getPointer(e)
    this.diffY = xy.clientY - this.startY
    if (!this.direction) {
      this.diffX = xy.clientX - this.startX
      this.direction = Math.abs(this.diffY) > Math.abs(this.diffX) ? 'vertical' : 'horizontal'
    }
    if (this.direction === 'vertical') {
      this.opacity = Math.min(1, 1 - this.diffY / this.closeHeight)
      this.$el.transform(`translate3d(0,${this.diffY}px,0)`)
      this.changeOpacity(this.opacity)
    }
  }
  touchend(e: TouchEvent | MouseEvent) {
    if (!this.isStart) return
    this.$el.transition(300)
    if (this.direction === 'vertical') {
      if (this.opacity < 0.4) {
        this.opacity = 0
      } else {
        this.opacity = 1
      }
      this.diffY = 0
      this.$el.transform(`translate3d(0,${this.diffY}px,0)`)
      this.changeOpacity(this.opacity)
    }
    this.isStart = false
  }
}

export default (el: HTMLDivElement, closeHeight: number, changeOpacity: ChangeOpacityFn) => {
  const cba = new Closeable(el, closeHeight, changeOpacity)
  return () => cba.destroy()
}

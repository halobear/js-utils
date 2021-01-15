// 下滑关闭

import $, { HaloDom } from '@halobear/dom'
import support from './support'
import { getPointer } from './index'

type ChangeOpacityFn = (opacity: number) => void

class Closeable {
  private el: HTMLDivElement
  private $el: HaloDom
  private screenHeight: number
  private startX: number = 0
  private startY: number = 0
  private diffX: number = 0
  private diffY: number = 0
  private opacity: number = 1
  private changeOpacity: ChangeOpacityFn
  private isStart: boolean = false
  private direction: 'vertical' | 'horizontal' | '' = ''
  constructor(el: HTMLDivElement, screenHeight: number, changeOpacity: ChangeOpacityFn) {
    this.el = el
    this.$el = $(el)
    this.screenHeight = screenHeight
    this.changeOpacity = changeOpacity

    this.init = this.init.bind(this)
    this.touchstart = this.touchstart.bind(this)
    this.touchmove = this.touchmove.bind(this)
    this.touchend = this.touchend.bind(this)
    this.init()
  }
  init() {
    if (support.touch) {
      this.el.addEventListener('touchstart', this.touchstart)
      this.el.addEventListener('touchmove', this.touchmove)
      this.el.addEventListener('touchend', this.touchend)
      this.el.addEventListener('touchcancel', this.touchend)
    } else {
      this.el.addEventListener('mousedown', this.touchstart)
      this.el.addEventListener('mousemove', this.touchmove)
      this.el.addEventListener('mouseup', this.touchend)
    }
  }
  touchstart(e: TouchEvent | MouseEvent) {
    if (((e as TouchEvent).touches || []).length > 1) return
    this.isStart = true
    e.preventDefault()
    const xy = getPointer(e)
    this.startX = xy.pageX
    this.startY = xy.pageY
    this.diffY = 0
    this.diffY = 0
    this.direction = ''
    this.$el.transition(0)
  }
  touchmove(e: TouchEvent | MouseEvent) {
    if (!this.isStart) return
    e.preventDefault()
    if (this.direction !== 'horizontal') {
      e.stopPropagation()
    }
    const xy = getPointer(e)
    this.diffY = xy.pageY - this.startY
    if (!this.direction) {
      this.diffX = xy.pageX - this.startX
      this.direction = Math.abs(this.diffY) > Math.abs(this.diffX) ? 'vertical' : 'horizontal'
    }
    if (this.direction === 'vertical') {
      this.opacity = Math.min(1, 1 - this.diffY / (this.screenHeight - this.startY))
      this.$el.transform(`translate3d(0,${this.diffY}px,0)`)
      this.changeOpacity(this.opacity)
    }
  }
  touchend(e: TouchEvent | MouseEvent) {
    if (!this.isStart) return
    this.$el.transition(300)
    if (this.direction === 'vertical') {
      if (this.opacity < 0.6) {
        this.diffY = this.screenHeight
        this.opacity = 0
      } else {
        this.diffY = 0
        this.opacity = 1
      }
      this.$el.transform(`translate3d(0,${this.diffY}px,0)`)
      this.changeOpacity(this.opacity)
    }
    this.isStart = false
  }
}

export default (el: HTMLDivElement, screenHeight: number, changeOpacity: ChangeOpacityFn) => {
  new Closeable(el, screenHeight, changeOpacity)
}

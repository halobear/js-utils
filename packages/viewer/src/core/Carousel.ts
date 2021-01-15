import { HaloDom, default as $ } from '@halobear/dom'
import { getPointer } from './utils'
import support from './utils/support'
import closeable from './utils/closeable'

interface CarouselOptions {
  index: number
  maxIndex: number
  maxLeft: number
  gap: number
  screenWidth: number
  screenHeight: number
}

export default class Carousel {
  private container: HTMLDivElement

  private options: CarouselOptions
  private index: number
  private left: number

  private $wrap: HaloDom

  private startX = 0
  private diffX = 0
  private isStart = false

  timer: NodeJS.Timeout | null = null

  constructor(container: HTMLDivElement, options: CarouselOptions) {
    this.container = container

    this.options = options
    this.index = options.index
    this.left = options.index * options.screenWidth

    this.$wrap = $('.viewer-wrap', container)

    this.resize = this.resize.bind(this)
    this.handleStart = this.handleStart.bind(this)
    this.handleMove = this.handleMove.bind(this)
    this.handleEnd = this.handleEnd.bind(this)
    this.changeOpacity = this.changeOpacity.bind(this)
    this.init()
  }
  init() {
    window.addEventListener('resize', this.resize)
    if (support.touch) {
      this.container.addEventListener('touchstart', this.handleStart)
      window.addEventListener('touchmove', this.handleMove)
      window.addEventListener('touchend', this.handleEnd)
      window.addEventListener('touchcancel', this.handleEnd)
    } else {
      this.container.addEventListener('mousedown', this.handleStart)
      window.addEventListener('mousemove', this.handleMove)
      window.addEventListener('mouseup', this.handleEnd)
    }
    this.container.querySelectorAll('.viewer-item').forEach((el) => {
      closeable(el as HTMLDivElement, this.options.screenHeight, this.changeOpacity)
    })
  }
  changeOpacity(opacity: number) {
    this.container.style.opacity = `${opacity}`
    if (opacity === 0) {
      setTimeout(() => {
        this.destroy()
        this.container.parentNode?.removeChild(this.container)
      }, 300)
    }
  }
  destroy() {
    window.removeEventListener('resize', this.resize)
    if (support.touch) {
      this.container.removeEventListener('touchstart', this.handleStart)
      window.removeEventListener('touchmove', this.handleMove)
      window.removeEventListener('touchend', this.handleEnd)
      window.removeEventListener('touchcancel', this.handleEnd)
    } else {
      this.container.removeEventListener('mousedown', this.handleStart)
      window.removeEventListener('mousemove', this.handleMove)
      window.removeEventListener('mouseup', this.handleEnd)
    }
  }
  handleStart(e: TouchEvent | MouseEvent) {
    if (((e as TouchEvent).touches || []).length > 1) return
    e.preventDefault()
    const { pageX } = getPointer(e)
    this.startX = pageX
    this.isStart = true
    this.$wrap.transition(0)
  }
  handleMove(e: TouchEvent | MouseEvent) {
    if (!this.isStart) return
    const { pageX } = getPointer(e)
    let diffX = pageX - this.startX

    if (this.left >= 0 && diffX > 0) {
      diffX = this.easing(diffX)
    } else if (this.left <= -this.options.maxLeft && diffX < 0) {
      diffX = -this.easing(-diffX)
    }
    this.diffX = diffX

    this.$wrap.transform(`translate3d(${diffX + this.left}px,0,0)`)
  }
  handleEnd() {
    if (!this.isStart) return
    if (Math.abs(this.diffX) > 100) {
      if (this.diffX > 0) {
        this.index -= 1
      } else {
        this.index += 1
      }
    }
    this.diffX = 0
    this.slideTo(Math.min(this.options.maxIndex, Math.max(0, this.index)))
  }
  resize() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      const { gap, maxIndex } = this.options
      const screenWidth = document.documentElement.clientWidth || document.body.clientWidth
      this.options.screenWidth = screenWidth
      this.$wrap.css({
        width: `${(screenWidth + gap) * (maxIndex + 1) - gap}px`,
      })
      this.slideTo(this.index)
    }, 150)
  }
  slideTo(index = 0) {
    this.index = index
    this.$wrap.transition(300)
    this.left = -index * (this.options.screenWidth + this.options.gap)
    this.$wrap.transform(`translate3d(${this.left}px,0,0)`)
    this.isStart = false
  }
  /**
   * 拖拽的缓动公式 - easeOutSine
   * Link http://easings.net/zh-cn#
   * t: current time（当前时间）；
   * b: beginning value（初始值）；
   * c: change in value（变化量）；
   * d: duration（持续时间）。
   */
  easing(distance: number) {
    const t = distance
    const b = 0
    const d = this.options.screenWidth // 允许拖拽的最大距离
    const c = d / 2.5 // 提示标签最大有效拖拽距离

    return c * Math.sin((t / d) * (Math.PI / 2)) + b
  }
}

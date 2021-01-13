import { HaloDom, default as $ } from '@halobear/dom'
import { getXY } from './utils'

interface CarouselOptions {
  index: number
  maxIndex: number
  maxLeft: number
  gap: number
  screenWidth: number
  screenHeight: number
  container: HTMLDivElement
}

export default class Carousel {
  private index: number
  private maxIndex: number
  private maxLeft: number
  private gap: number
  private screenWidth: number
  private $wrap: HaloDom
  private $items: HaloDom
  private left: number

  private startX = 0
  private diffX = 0
  private isStart = false
  constructor(options: CarouselOptions) {
    this.index = options.index
    this.maxIndex = options.maxIndex
    this.left = options.index * options.screenWidth
    this.maxLeft = options.maxLeft
    this.gap = options.gap
    this.screenWidth = options.screenWidth
    this.$wrap = $('.viewer-wrap', options.container)
    this.$items = $('.viewer-item', options.container)

    this.handleStart = this.handleStart.bind(this)
    this.handleMove = this.handleMove.bind(this)
    this.handleEnd = this.handleEnd.bind(this)
    this.init()
  }
  init() {
    console.log(this.gap, this.screenWidth, this.$wrap, this.$items, this.diffX)
    this.$wrap.on('touchstart mousedown', this.handleStart)
    this.$wrap.on('touchmove mousemove', this.handleMove)
    this.$wrap.on('touchend touchcancel mouseup', this.handleEnd)
  }
  handleStart(e: TouchEvent | MouseEvent) {
    if (((e as TouchEvent).touches || []).length > 1) return
    e.preventDefault()
    const { pageX } = getXY(e)
    this.startX = pageX
    this.isStart = true
    this.$wrap.transition(0)
  }
  handleMove(e: TouchEvent | MouseEvent) {
    if (!this.isStart) return
    const { pageX } = getXY(e)
    let diffX = pageX - this.startX

    if (this.left >= 0 && diffX > 0) {
      diffX = this.easing(diffX)
    } else if (this.left <= -this.maxLeft && diffX < 0) {
      diffX = -this.easing(-diffX)
    }
    this.diffX = diffX

    this.$wrap.transform(`translate3d(${diffX + this.left}px,0,0)`)
  }
  handleEnd() {
    if (Math.abs(this.diffX) > 80) {
      if (this.diffX > 0) {
        this.index -= 1
      } else {
        this.index += 1
      }
    }
    this.index = Math.min(this.maxIndex, Math.max(0, this.index))
    this.$wrap.transition(300)
    this.left = -this.index * (this.screenWidth + this.gap)
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
    const d = this.screenWidth // 允许拖拽的最大距离
    const c = d / 2.5 // 提示标签最大有效拖拽距离

    return c * Math.sin((t / d) * (Math.PI / 2)) + b
  }
}

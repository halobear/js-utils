import { HaloDom, default as $ } from '@halobear/dom'
import { getPointer, range, resistance, listenOption } from './util'
import support from './support'
import closeable from './closeable'
import zoomable from './zoomable'

interface CarouselOptions {
  index: number
  maxIndex: number
  maxLeft: number
  gap: number
  screenWidth: number
  screenHeight: number
  onChange?: (index: number) => void
}

type voidFn = () => void
export default class Carousel {
  private container: HTMLDivElement
  private counterEl: HTMLDivElement | null

  private options: CarouselOptions
  private index: number
  private left: number

  private $wrap: HaloDom

  private startX = 0
  private diffX = 0
  private isStart = false

  private removeContainer: () => void

  timer: NodeJS.Timeout | null = null
  destroyFns: voidFn[] = []

  constructor(container: HTMLDivElement, options: CarouselOptions, removeContainer: () => void) {
    this.container = container

    this.options = options
    this.index = options.index
    this.left = options.index * options.screenWidth

    this.removeContainer = removeContainer

    this.$wrap = $('.viewer-wrap', container)
    this.counterEl = container.querySelector('.num')

    this.resize = this.resize.bind(this)
    this.handleStart = this.handleStart.bind(this)
    this.handleMove = this.handleMove.bind(this)
    this.handleEnd = this.handleEnd.bind(this)
    this.handleKeyup = this.handleKeyup.bind(this)
    this.changeOpacity = this.changeOpacity.bind(this)
    this.init()
  }
  init() {
    if (this.index) {
      this.slideTo(this.index)
    }
    window.addEventListener('resize', this.resize, listenOption(true))
    const o = listenOption()
    if (support.touch) {
      this.container.addEventListener('touchstart', this.handleStart, o)
      window.addEventListener('touchmove', this.handleMove, o)
      window.addEventListener('touchend', this.handleEnd, o)
      window.addEventListener('touchcancel', this.handleEnd, o)
    } else {
      this.container.addEventListener('mousedown', this.handleStart, o)
      window.addEventListener('mousemove', this.handleMove, o)
      window.addEventListener('mouseup', this.handleEnd, o)
    }
    window.addEventListener('keyup', this.handleKeyup, o)
    // 手指下滑关闭
    this.container.querySelectorAll('.viewer-item').forEach((el) => {
      this.destroyFns.push(
        closeable(el as HTMLDivElement, this.options.screenHeight, this.changeOpacity)
      )
    })
    // 双指缩放功能
    this.container.querySelectorAll('.viewer-item .viewer-image').forEach((el) => {
      this.destroyFns.push(zoomable(el as HTMLElement))
    })
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
    window.removeEventListener('keyup', this.handleKeyup)
    // 清空关闭和缩放事件
    this.destroyFns.forEach((destory) => {
      destory()
    })
    setTimeout(() => {
      $(this.container).transition(300)
      this.removeContainer()
    })
  }
  handleKeyup(e: KeyboardEvent) {
    const { maxIndex } = this.options

    if (e.key === 'ArrowLeft') {
      return this.slideTo(this.index ? this.index - 1 : maxIndex)
    }
    if (e.key === 'ArrowRight') {
      return this.slideTo(this.index === maxIndex ? 0 : this.index + 1)
    }
    if (e.key === 'Escape') {
      return this.destroy()
    }
  }
  changeOpacity(opacity: number) {
    if (opacity === 0) {
      this.container.style.opacity = '0'
      this.destroy()
    } else {
      this.container.style.opacity = `${opacity}`
    }
  }
  handleStart(e: TouchEvent | MouseEvent) {
    if (((e as TouchEvent).touches || []).length > 1) return
    if (e.cancelable) {
      e.preventDefault()
    }
    const { pageX } = getPointer(e)
    this.startX = pageX
    this.isStart = true
    this.$wrap.transition(0)
  }
  handleMove(e: TouchEvent | MouseEvent) {
    if (!this.isStart) return
    const { pageX } = getPointer(e)
    let diffX = pageX - this.startX
    this.diffX = diffX
    // 设置阻力
    const l = resistance(diffX + this.left, -this.options.maxLeft, 0, 0.8)
    this.$wrap.transform(`translate3d(${l}px,0,0)`)
  }
  handleEnd() {
    if (!this.isStart) return
    let index = this.index
    if (Math.abs(this.diffX) > 100) {
      if (this.diffX > 0) {
        index -= 1
      } else {
        index += 1
      }
    }
    this.diffX = 0
    const current = range(index, 0, this.options.maxIndex)
    this.slideTo(current)
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
  slideTo(index = 0, duration = 300) {
    if (index !== this.index && typeof this.options.onChange === 'function') {
      this.options.onChange(index)
    }
    this.index = index
    this.$wrap.transition(duration)
    this.left = -index * (this.options.screenWidth + this.options.gap)
    this.$wrap.transform(`translate3d(${this.left}px,0,0)`)
    this.isStart = false
    if (this.counterEl) {
      this.counterEl.textContent = `${index + 1}`
    }
  }
}

import $, { HaloDom } from '@halobear/dom'
import { now } from './utils'
import support from './utils/support'
import * as Zoom from './utils/zoom'

interface Params {
  maxRatio: number
}

type Method = 'on' | 'off'
class Viewer {
  private wrap: HTMLElement
  private $img: HaloDom
  private $wrap: HaloDom
  private touchEventsData = {
    lastClickTime: 0,
    touchStartTime: 0,
  }
  private options = {
    scale: 1,
    currentScale: 1,
    scaleStart: 1,
    scaleMove: 1,
    gestureTouched: false,
    gestureMoved: false,
  }
  private params = {
    speed: 300,
    maxRatio: 3,
    minRatio: 1,
  }
  constructor(
    private img: HTMLImageElement,
    params: Partial<Params>,
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
      this.$img[method]('touchmove', this.touchmove)
      this.$img[method]('touchend', this.touchend)
      this.$img[method]('touchcancel', this.touchend)
    } else {
      this.$img[method]('mousedown', this.touchstart)
      this.$img[method]('mousemove', this.touchmove)
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
    if (e instanceof TouchEvent) {
      this.gestureStart(e)
    }
  }
  touchmove = (e: MouseEvent | TouchEvent) => {
    if (e instanceof TouchEvent) {
      this.gestureChange(e)
    }
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
    if (e instanceof TouchEvent) {
      this.gestureEnd(e)
    }
  }
  // 双击事件
  doubleTap = (e: MouseEvent | TouchEvent) => {
    this.toggle(e)
  }
  // 切换放大/1缩小
  toggle = (e: MouseEvent | TouchEvent) => {
    this.options.scale === 1 ? this.zoomIn(e) : this.zoomOut()
  }
  // 放大进入
  zoomIn = (e: MouseEvent | TouchEvent) => {
    const { options, img, wrap, params, $img, $wrap } = this
    const scale = (options.scale = options.currentScale = params.maxRatio)
    Zoom.zoomIn(e, { img, wrap, $img, $wrap, scale })
  }
  // 恢复缩放
  zoomOut() {
    this.options.scale = this.options.currentScale = 1
    Zoom.zoomOut(this.$img, this.$wrap)
  }
  // 手动缩放
  gestureStart(e: TouchEvent) {
    if (
      e.type !== 'touchstart' ||
      (e.type === 'touchstart' && (e as TouchEvent).targetTouches.length < 2)
    ) {
      return
    }
    this.options.scaleStart = Zoom.getDistanceBetweenTouches(e)
    this.$img.transition(0)
  }
  gestureChange(e: TouchEvent) {
    if (e.type !== 'touchmove' || (e.type === 'touchmove' && e.targetTouches.length < 2)) {
      return
    }
    const { options, params } = this
    options.scaleMove = Zoom.getDistanceBetweenTouches(e)
    options.scale = (options.scaleMove / options.scaleStart) * options.currentScale
    if (options.scale > params.maxRatio) {
      options.scale = params.maxRatio - 1 + (options.scale - params.maxRatio + 1) ** 0.5
    }
    if (options.scale < params.minRatio) {
      options.scale = params.minRatio + 1 - (params.minRatio - options.scale + 1) ** 0.5
    }
    console.log(options.scale)
    this.$img.transform(`translate3d(0,0,0) scale(${options.scale})`)
  }
  gestureEnd(e: TouchEvent) {
    const { options, params, $img } = this
    if (!options.gestureTouched || !options.gestureMoved) return
    if (e.type !== 'touchend' || (e.type === 'touchend' && e.changedTouches.length < 2)) {
      return
    }
    options.gestureMoved = options.gestureTouched = false
    options.scale = Math.max(Math.min(options.scale, params.maxRatio), params.minRatio)
    $img.transition(params.speed).transform(`translate3d(0,0,0) scale(${options.scale})`)
    options.currentScale = options.scale
  }
}

export default Viewer

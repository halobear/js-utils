import $, { Ret } from '@halobear/dom'
import { now } from './utils'
import { zoomIn, zoomOut } from './utils/zoom'
import support from './utils/support'

interface Params {
  maxRatio?: number
}

class Viewer {
  private $img: Ret
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
    private wrap: HTMLElement | null = img.parentElement
  ) {
    if (!this.wrap) throw new Error('Wrap Not Found')
    Object.assign(this.params, params)
    this.$img = $(this.img)
    this.bindEvent()
  }
  // 绑定事件
  bindEvent = () => {
    if (support.touch) {
      this.$img.on('touchstart', this.touchstart)
      this.$img.on('touchend', this.touchend)
    } else {
      this.$img.on('mousedown', this.touchstart)
      this.$img.on('mouseup', this.touchend)
    }
  }
  // 取消绑定事件
  unbindEvent = () => {
    if (support.touch) {
      this.$img.off('touchstart', this.touchstart)
      this.$img.off('touchend', this.touchend)
    } else {
      this.$img.off('mousedown', this.touchstart)
      this.$img.off('mouseup', this.touchend)
    }
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
    if (this.zoom.scale === 1) {
      this.zoom.scale = this.zoom.currentScale = this.params.maxRatio
      zoomIn(e, this.img, this.wrap)
    } else {
      this.zoom.scale = this.zoom.currentScale = 1
      zoomOut(this.img, this.wrap)
    }
  }
}

export default Viewer

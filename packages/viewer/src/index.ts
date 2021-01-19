import './index.css'

import createUI from './core/createUI'
import { showViewer, hideViewer } from './core/util'
import Carousel from './core/Carousel'

interface ViewerOptions {
  data: string[]
  container?: HTMLDivElement
  gap?: number
  screenWidth?: number
  screenHeight?: number
  index?: number
  onChange?: (index: number) => void
}

export default (options: ViewerOptions, e?: MouseEvent | TouchEvent) => {
  let {
    data,
    gap = 10,
    screenWidth = document.documentElement.clientWidth || document.body.clientWidth,
    screenHeight = document.documentElement.clientHeight || document.body.clientHeight,
    index = 0,
    container,
    onChange,
  } = options

  const config = {
    index,
    maxIndex: data.length - 1,
    maxLeft: (screenWidth + gap) * (data.length - 1),
    gap,
    screenWidth,
    screenHeight,
    onChange,
  }

  if (!container) {
    container = createUI(data, config)
    showViewer(container, e)
  }

  const removeContainer = function () {
    container && hideViewer(container, e)
  }

  const carousel = new Carousel(container, config, removeContainer)

  const destroy = () => {
    carousel.destroy()
  }

  const header = container.querySelector('.viewer-header') as HTMLDivElement
  header.ontouchstart = function (e) {
    e.stopPropagation()
  }
  const closeBtn = container.querySelector('.viewer-close') as HTMLDivElement
  closeBtn.onclick = function (e) {
    e.stopPropagation()
    destroy()
  }

  return destroy
}

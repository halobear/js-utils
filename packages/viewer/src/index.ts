import './index.css'

import $ from '@halobear/dom'
import createUI from './core/createUI'
import { showViewer } from './core/util'
import Carousel from './core/Carousel'

interface ViewerOptions {
  data: string[]
  container?: HTMLDivElement
  gap?: number
  screenWidth?: number
  screenHeight?: number
  index?: number
}

export default (options: ViewerOptions, e?: MouseEvent | TouchEvent) => {
  let {
    data,
    gap = 10,
    screenWidth = document.documentElement.clientWidth || document.body.clientWidth,
    screenHeight = document.documentElement.clientHeight || document.body.clientHeight,
    index = 0,
    container,
  } = options

  const config = {
    index,
    maxIndex: data.length - 1,
    maxLeft: (screenWidth + gap) * (data.length - 1),
    gap,
    screenWidth,
    screenHeight,
  }

  if (!container) {
    container = createUI(data, config)
    showViewer(container, e)
  }

  const carousel = new Carousel(container, config)

  return () => {
    carousel.destroy()
    $(container).remove()
  }
}

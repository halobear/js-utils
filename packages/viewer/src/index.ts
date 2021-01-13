import './index.css'

import $ from '@halobear/dom'
import createUI from './chore/utils/createUI'
import Carousel from './chore/Carousel'

interface ViewerOptions {
  data: string[]
  gap?: number
  screenWidth?: number
  screenHeight?: number
  index?: number
}

export default (options: ViewerOptions) => {
  const {
    data,
    gap = 10,
    screenWidth = document.documentElement.clientWidth || document.body.clientWidth,
    screenHeight = document.documentElement.clientHeight || document.body.clientHeight,
    index = 0,
  } = options
  const container = createUI(data, screenWidth, gap)
  const $container = $(container)
  new Carousel({
    index,
    maxIndex: data.length - 1,
    maxLeft: (screenWidth + gap) * (data.length - 1),
    gap,
    screenWidth,
    screenHeight,
    container,
  })
  return () => {
    $container.remove()
  }
}

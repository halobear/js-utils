import './index.css'

import createUI from './chore/createUI'

interface ViewerOptions {
  data: string[]
  gap?: number
  screenWidth?: number
  screenHeight?: number
}

export default (options: ViewerOptions) => {
  const {
    data,
    gap = 10,
    screenWidth = document.documentElement.clientWidth || document.body.clientWidth,
    screenHeight = document.documentElement.clientHeight || document.body.clientHeight,
  } = options
  createUI(data, screenWidth, gap)

  console.log(data, screenWidth, screenHeight)
}

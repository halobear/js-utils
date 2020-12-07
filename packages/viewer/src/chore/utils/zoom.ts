import $ from '@halobear/dom'

// Calc Scale From Multi-touches
export function getDistanceBetweenTouches(e: TouchEvent) {
  if (e.targetTouches.length < 2) return 1
  const x1 = e.targetTouches[0].pageX
  const y1 = e.targetTouches[0].pageY
  const x2 = e.targetTouches[1].pageX
  const y2 = e.targetTouches[1].pageY
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  return distance
}

export function zoomIn(
  e: TouchEvent | MouseEvent,
  img: HTMLImageElement,
  wrap: HTMLElement | null = img.parentElement
) {
  if (!wrap) throw new Error('缺少zoomable-wrap包裹')
  wrap.classList.add('zoomable-wrap')

  const image = {
    touchesStart: {
      x: undefined,
      y: undefined,
    },
  }
  const params = {
    maxRatio: 3,
    minRatio: 1,
  }
  const zoom = {
    scale: 1,
    currentScale: 1,
  }

  let touchX: number = 0
  let touchY: number
  let offsetX
  let offsetY
  let diffX
  let diffY
  let translateX
  let translateY
  let imageWidth
  let imageHeight
  let scaledWidth
  let scaledHeight
  let translateMinX
  let translateMinY
  let translateMaxX
  let translateMaxY
  let slideWidth
  let slideHeight

  if (!image.touchesStart.x && e) {
    if (e.type === 'touchend') {
      touchX = (e as TouchEvent).changedTouches[0].pageX
      touchY = (e as TouchEvent).changedTouches[0].pageY
    } else {
      touchX = (e as MouseEvent).pageX
      touchY = (e as MouseEvent).pageY
    }
  } else {
    touchX = image.touchesStart.x || 0
    touchY = image.touchesStart.y || 0
  }

  zoom.scale = params.maxRatio
  zoom.currentScale = params.maxRatio
  if (e) {
    slideWidth = wrap.offsetWidth
    slideHeight = wrap.offsetHeight
    const rect = wrap.getBoundingClientRect()
    offsetX = rect.left
    offsetY = rect.top
    diffX = offsetX + slideWidth / 2 - touchX
    diffY = offsetY + slideHeight / 2 - touchY

    imageWidth = img.offsetWidth
    imageHeight = img.offsetHeight
    scaledWidth = imageWidth * zoom.scale
    scaledHeight = imageHeight * zoom.scale

    translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0)
    translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0)
    translateMaxX = -translateMinX
    translateMaxY = -translateMinY

    translateX = diffX * zoom.scale
    translateY = diffY * zoom.scale

    if (translateX < translateMinX) {
      translateX = translateMinX
    }
    if (translateX > translateMaxX) {
      translateX = translateMaxX
    }

    if (translateY < translateMinY) {
      translateY = translateMinY
    }
    if (translateY > translateMaxY) {
      translateY = translateMaxY
    }
  } else {
    translateX = 0
    translateY = 0
  }
  $(wrap).transition(300).transform(`translate3d(${translateX}px, ${translateY}px,0)`)
  $(img).transition(300).transform(`translate3d(0,0,0) scale(${zoom.scale})`)
}

export function zoomOut(img: HTMLImageElement, wrap: HTMLElement | null = img.parentElement) {
  $(wrap).transition(300).transform('translate3d(0,0,0)')
  $(img).transition(300).transform('translate3d(0,0,0) scale(1)')
}

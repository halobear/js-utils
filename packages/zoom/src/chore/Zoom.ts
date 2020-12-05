// function zoomIn(e: TouchEvent | MouseEvent, wrap: HTMLDivElement, img: HTMLImageElement) {
//   const gesture = { wrap, img }
//   const image = {
//     touchesStart: {
//       x: undefined,
//       y: undefined,
//     },
//   }
//   const params = {}
//   const zoom = {
//     enabled: false,
//     maxRatio: 3,
//     minRatio: 1,
//     toggle: true,
//     containerClass: 'swiper-zoom-container',
//     zoomedSlideClass: 'swiper-slide-zoomed',
//   }

//   let touchX: Number
//   let touchY: number
//   let offsetX
//   let offsetY
//   let diffX
//   let diffY
//   let translateX
//   let translateY
//   let imageWidth
//   let imageHeight
//   let scaledWidth
//   let scaledHeight
//   let translateMinX
//   let translateMinY
//   let translateMaxX
//   let translateMaxY
//   let slideWidth
//   let slideHeight

//   if (typeof image.touchesStart.x === 'undefined' && e) {
//     if (e.type === 'touchend') {
//       touchX = (e as TouchEvent).changedTouches[0].pageX
//       touchY = (e as TouchEvent).changedTouches[0].pageY
//     } else {
//       touchX = (e as MouseEvent).pageX
//       touchY = (e as MouseEvent).pageY
//     }
//   } else {
//     touchX = image.touchesStart.x || 0
//     touchY = image.touchesStart.y || 0
//   }

//   zoom.scale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio
//   zoom.currentScale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio
//   if (e) {
//     slideWidth = gesture.$slideEl[0].offsetWidth
//     slideHeight = gesture.$slideEl[0].offsetHeight
//     offsetX = gesture.$slideEl.offset().left
//     offsetY = gesture.$slideEl.offset().top
//     diffX = offsetX + slideWidth / 2 - touchX
//     diffY = offsetY + slideHeight / 2 - touchY

//     imageWidth = gesture.$imageEl[0].offsetWidth
//     imageHeight = gesture.$imageEl[0].offsetHeight
//     scaledWidth = imageWidth * zoom.scale
//     scaledHeight = imageHeight * zoom.scale

//     translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0)
//     translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0)
//     translateMaxX = -translateMinX
//     translateMaxY = -translateMinY

//     translateX = diffX * zoom.scale
//     translateY = diffY * zoom.scale

//     if (translateX < translateMinX) {
//       translateX = translateMinX
//     }
//     if (translateX > translateMaxX) {
//       translateX = translateMaxX
//     }

//     if (translateY < translateMinY) {
//       translateY = translateMinY
//     }
//     if (translateY > translateMaxY) {
//       translateY = translateMaxY
//     }
//   } else {
//     translateX = 0
//     translateY = 0
//   }
//   gesture.$imageWrapEl.transition(300).transform(`translate3d(${translateX}px, ${translateY}px,0)`)
//   gesture.$imageEl.transition(300).transform(`translate3d(0,0,0) scale(${zoom.scale})`)
// }

// export default zoomIn

export default {}

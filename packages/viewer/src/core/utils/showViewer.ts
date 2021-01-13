import $ from '@halobear/dom'

export default function showViewer(container: HTMLElement, e?: TouchEvent | MouseEvent) {
  const clientWidth = document.documentElement.clientWidth || document.body.clientWidth
  const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
  let pageX
  let pageY
  if (e) {
    const res = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0] : (e as MouseEvent)
    pageX = res.pageX
    pageY = res.pageY
  } else {
    pageX = clientWidth / 2
    pageY = clientHeight / 2
  }
  const diffX = pageX - clientWidth / 2
  const diffY = pageY - clientHeight / 2
  const $container = $(container)
  $container.transition(0).transform(`translate3d(${diffX}px, ${diffY}px,0) scale(0)`).css({ opacity: '0' })
  setTimeout(() => {
    $container.transition(300).transform(`translate3d(0,0,0) scale(1)`).css({ opacity: '1' })
  })
}

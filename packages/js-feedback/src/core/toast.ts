import loading from './loading'

let elem:Element|null
let timer:NodeJS.Timeout|null

/**
 * toast
 * @param text 提示文字
 * @param time 提示时间
 */
function toast (text:string, time = 2000) {
  if (!text) return ''
  loading.hide()
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (!elem) {
    elem = document.createElement('div')
    elem.className = 'fd-container'
    elem.innerHTML = `<div class="text">${text}</div>`
    document.body.appendChild(elem)
  }
  timer = setTimeout(() => {
    elem?.parentNode?.removeChild(elem)
    timer = elem = null
  }, time)
}

export default toast
let elem:Element|null
let timer:NodeJS.Timeout|null

/**
 * 显示loading
 * @param time ms 
 */
function showLoading(time:number = 0) {
  if (typeof window === 'undefined') return
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (!elem) {
    elem = document.createElement('div')
    elem.className = 'fd-container fd-loading'
    document.body.appendChild(elem)
  }
  if (time) {
    setTimeout(hideLoading, time)
  }
}

function hideLoading() {
  elem?.parentNode?.removeChild(elem)
  timer = elem = null
}

export default {
  show: showLoading,
  hide: hideLoading
}
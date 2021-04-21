import browserCheck from './browserCheck'

const browserValidteRet = browserCheck()

console.log(browserValidteRet)

if (!browserValidteRet.valid) {
  function docReady(fn) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      fn()
    } else {
      document.addEventListener('DOMContentLoaded', fn)
    }
  }

  docReady(() => {
    const dialog = document.getElementById('browser-validate-dialog')
    console.log(dialog)
    dialog && (dialog.style.display = 'block')
    if (window.browserValidteCallback) window.browserValidteCallback(browserValidteRet)
  })
}

export { browserCheck }

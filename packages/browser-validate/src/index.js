import browserCheck from './browserCheck'

const browserValidteRet = browserCheck()

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
    dialog && (dialog.style.display = 'block')
    if (window.browserValidteCallback) window.browserValidteCallback(browserValidteRet)
  })
}

export { browserCheck }

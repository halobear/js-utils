function createUI(data: string[], { maxIndex = 0, index = 1, gap = 20, screenWidth = 300 }) {
  const container = document.createElement('div')
  container.className = 'viewer--container'
  const len = maxIndex + 1

  const counter =
    len > 1
      ? `<div class="counter"><span class="num">${
          index + 1
        }</span><span> / </span><span>${len}</span></div>`
      : '<div class="counter"></div>'
  const header = `<div class="viewer-header">${counter}<div class="viewer-close"></div></div>`

  const items = data.map((url, i) => {
    const g = i === len - 1 ? 0 : gap
    return `<div class="viewer-item" style="margin-right: ${g}px"><div class="zoomable-wrap"><img class="viewer-image" src="${url}" /></div></div>`
  })
  const content = `<div class="viewer-wrap" style="width:${
    (screenWidth + gap) * len - gap
  }px;">${items.join('')}</div>`
  container.innerHTML = header + content
  document.body.appendChild(container)
  return container
}

export default createUI

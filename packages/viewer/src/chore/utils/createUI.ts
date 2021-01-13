function createUI(data: string[], screenWidth = 100, gap = 10) {
  const container = document.createElement('div')
  container.className = 'viewer--container'
  const len = data.length
  const items = data.map(
    (url, i) =>
      `<div class="viewer-item" style="margin-right: ${
        i === len - 1 ? 0 : gap
      }px"><div class="zoomable-wrap"><img class="viewer-image" src="${url}" /></div></div>`
  )
  const html = `<div class="viewer-wrap" style="width:${(screenWidth + gap) * len - gap}px">${items.join('')}</div>`
  container.innerHTML = html
  document.body.appendChild(container)
  return container
}

export default createUI

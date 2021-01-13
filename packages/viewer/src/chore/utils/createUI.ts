function createUI(data: string[], { maxIndex = 0, gap = 20, screenWidth = 300 }) {
  const container = document.createElement('div')
  container.className = 'viewer--container'
  const len = maxIndex + 1
  const items = data.map((url, i) => {
    const g = i === len - 1 ? 0 : gap
    return `<div class="viewer-item" style="margin-right: ${g}px"><div class="zoomable-wrap"><img class="viewer-image" src="${url}" /></div></div>`
  })
  const html = `<div class="viewer-wrap" style="width:${(screenWidth + gap) * len - gap}px">${items.join('')}</div>`
  container.innerHTML = html
  document.body.appendChild(container)
  return container
}

export default createUI

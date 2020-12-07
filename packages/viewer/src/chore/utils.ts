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

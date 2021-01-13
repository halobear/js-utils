// 获取当前时间
export const now = () => new Date().getTime()

// 页面x、y
export const getXY = (e: TouchEvent | MouseEvent) => {
  const { pageX, pageY } = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0] : (e as MouseEvent)
  return { pageX, pageY }
}

## @halobear/viewer

类似微信图片预览插件，支持缩放、手势、方向键翻页

[➡️ Live DEMO](https://halobear.github.io/js-utils/viewer/index.html)

## 使用

```js
import preview from "@halobear/viewer"

// var data = [
//   'https://www.luzhongkuan.cn/static/temp/0b97b79a76eb5d3e29582778ab2ea0bc.jpeg',
//   'https://www.luzhongkuan.cn/static/temp/41a3582cc2eb461e68ebfbc768ee81e1.jpeg',
//   'https://www.luzhongkuan.cn/static/temp/51a7c6fdb1a6de91e021d5faf951fcdc.jpeg',
//   'https://www.luzhongkuan.cn/static/temp/27b1d178d4a1d06d93866a3866843d03.jpeg',
// ]

interface ViewerOptions {
  data: string[]
  container?: HTMLDivElement
  gap?: number
  screenWidth?: number
  screenHeight?: number
  index?: number
  onChange?: (index: number) => void
}

// 预览
const destroy = preview(options: ViewerOptions, e?: MouseEvent | TouchEvent)

// 关闭
destory()
```

## [@halobear/viewer](https://cdn.jsdelivr.net/npm/@halobear/viewer)

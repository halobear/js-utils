## @halobear/lazyload

[lozyload.js](https://github.com/tuupola/lazyload/blob/2.x/lazyload.js) rewrite by ts

## 安装

```bash
yarn add @halobear/lazyload
# or
npm install @halobear/lazyload
```

## 使用

```html
<div data-src="images/1.jpg" class="lazyload"></div>
<img
  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2N49+7dfwAJYgPK+tLRowAAAABJRU5ErkJggg=="
  data-src="images/2.jpg"
  class="lazyload"
/>
```

```ts
import Lazyload from '@halobear/lazyload'

typeof Images: NodeListOf<HTMLImageElement | HTMLElement> | undefined

type LazyloadSetting = {
  src: string,
  srcset: string,
  selector: string,
  root: null,
  rootMargin: string,
  threshold: number,
}

// 初始化加载
const lazyload = new Lazyload(images: Images, setting: LazyloadSetting)

// 销毁
lazyload.destroy()

// 强制加载
lazyload.loadAndDestory()
```

const defaults = {
  src: 'data-src',
  srcset: 'data-srcset',
  selector: '.lazyload',
  root: null,
  rootMargin: '50px',
  threshold: 0,
}

type LazyloadSetting = typeof defaults

class Lazyload {
  images: NodeListOf<HTMLImageElement | HTMLElement>
  settings?: LazyloadSetting
  observer?: IntersectionObserver
  constructor(images: NodeListOf<HTMLImageElement | HTMLElement> | undefined, settings: Partial<LazyloadSetting>) {
    this.settings = { ...defaults, ...settings }
    this.images = images || document.querySelectorAll(this.settings.selector)
    this.init()
  }

  init() {
    // return if inited
    if (!this.settings) return
    // without IntersectionObserver Direct load images
    if (!window.IntersectionObserver) {
      return this.loadImages()
    }
    const observerConfig = {
      root: this.settings.root,
      rootMargin: this.settings.rootMargin,
      threshold: [this.settings.threshold],
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const { target } = entry
          this.observer?.unobserve(target)
          this.loadImg(target)
        }
      })
    }, observerConfig)

    this.images.forEach((image) => {
      this.observer?.observe(image)
    })
  }

  loadImg(target: HTMLImageElement | Element) {
    if (!this.settings) return
    const src = target.getAttribute(this.settings.src)
    const srcset = target.getAttribute(this.settings.srcset)
    if (target.tagName.toLocaleLowerCase() === 'img') {
      const img = target as HTMLImageElement
      src && (img.src = src)
      srcset && (img.srcset = srcset)
    } else {
      const div = target as HTMLElement
      src && (div.style.backgroundImage = `url(${src})`)
    }
  }

  loadImages() {
    if (!this.settings) return
    this.images.forEach((image) => this.loadImg(image))
  }

  destroy() {
    if (!this.settings) return
    this.observer?.disconnect()
    this.settings = undefined
  }

  loadAndDestory() {
    this.loadImages()
    this.destroy()
  }
}

export default Lazyload

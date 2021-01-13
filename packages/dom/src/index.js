import $ from 'balajs'

// 其实，$ 的原型就是一个数组，拥有数组的各种方法
// 这里只是库内部使用，所以通过文档约束，不做容错校验，达到代码最小化

Object.assign($.fn, {
  /**
   * 只能是一个 HTMLElement 元素或者 HTMLElement 数组，不支持字符串
   * @param {Element|Element[]} $child
   * @returns {append}
   */
  append($child) {
    if (!($child instanceof HTMLElement)) {
      $child = $child[0]
    }
    this.forEach(($element) => {
      $element.appendChild($child)
    })
    return this
  },
  /**
   *
   * @returns {remove}
   */
  remove() {
    this.forEach(($element) => {
      $element.parentNode.removeChild($element)
    })
    return this
  },
  /**
   *
   * @param selector
   * @returns {HTMLElement}
   */
  find(selector) {
    return $(selector, this)
  },
  /**
   *
   * @param {String} className
   * @returns {addClass}
   */
  addClass(className) {
    this.forEach(($element) => {
      // http://caniuse.com/#search=classList
      $element.classList.add(className)
    })
    return this
  },
  /**
   *
   * @param {String} className
   * @returns {removeClass}
   */
  removeClass(className) {
    this.forEach(($element) => {
      // http://caniuse.com/#search=classList
      $element.classList.remove(className)
    })
    return this
  },
  /**
   *
   * @param index
   * @returns {*|jQuery|HTMLElement}
   */
  eq(index) {
    return $(this[index])
  },
  /**
   *
   * @returns {show}
   */
  show() {
    this.forEach(($element) => {
      $element.style.display = 'block'
    })
    return this
  },
  /**
   *
   * @returns {hide}
   */
  hide() {
    this.forEach(($element) => {
      $element.style.display = 'none'
    })
    return this
  },
  /**
   *
   * @param html 目前只能接受字符串
   * @returns {html}
   */
  html(html) {
    this.forEach(($element) => {
      $element.innerHTML = html
    })
    return this
  },
  /**
   *
   * @param {Object} obj 目前只能接受object
   * @returns {css}
   */
  css(obj) {
    Object.keys(obj).forEach((key) => {
      this.forEach(($element) => {
        $element.style[key] = obj[key]
      })
    })
    return this
  },
  /**
   * @param {transform} string
   */
  transform(transform) {
    for (let i = 0;i < this.length;i += 1) {
      this[i].style.transform = transform
      this[i].style.WebkitTransform = transform
    }
    return this
  },
  /**
   * @param {transform} string | number
   */
  transition(duration) {
    for (let i = 0;i < this.length;i += 1) {
      const t = typeof duration !== 'string' ? `${duration}ms` : duration
      this[i].style.transitionDuration = t
      this[i].style.WebkitTransitionDuration = t
    }
    return this
  },
  /**
   *
   * @param eventType
   * @param selector
   * @param handler
   */
  on(eventType, selector, handler) {
    const isDelegate = typeof selector === 'string' && typeof handler === 'function'
    if (!isDelegate) {
      handler = selector
    }
    this.forEach(($element) => {
      eventType.split(' ').forEach((event) => {
        $element.addEventListener(event, function (evt) {
          if (isDelegate) {
            // http://caniuse.com/#search=closest
            if (this.contains(evt.target.closest(selector))) {
              handler.call(evt.target, evt)
            }
          }
          else {
            handler.call(this, evt)
          }
        })
      })
    })
    return this
  },
  /**
   *
   * @param {String} eventType
   * @param {String|Function} selector
   * @param {Function=} handler
   * @returns {off}
   */
  off(eventType, selector, handler) {
    if (typeof selector === 'function') {
      handler = selector
      selector = null
    }

    this.forEach(($element) => {
      eventType.split(' ').forEach((event) => {
        if (typeof selector === 'string') {
          $element.querySelectorAll(selector).forEach(($element) => {
            $element.removeEventListener(event, handler)
          })
        }
        else {
          $element.removeEventListener(event, handler)
        }
      })
    })
    return this
  },
  /**
   *
   * @returns {Number}
   */
  index() {
    const $element = this[0]
    const $parent = $element.parentNode
    return Array.prototype.indexOf.call($parent.children, $element)
  },
  /**
   * @desc 因为off方法目前不可以移除绑定的匿名函数，现在直接暴力移除所有listener
   * @returns {offAll}
   */
  offAll() {
    this.forEach(($element, index) => {
      var clone = $element.cloneNode(true)
      $element.parentNode.replaceChild(clone, $element)

      this[index] = clone
    })
    return this
  },
  /**
   *
   * @returns {*}
   */
  val() {
    if (arguments.length) {
      this.forEach(($element) => {
        $element.value = arguments[0]
      })
      return this
    }
    return this[0].value
  },
  /**
   *
   * @returns {*}
   */
  attr() {
    if (typeof arguments[0] == 'object') {
      const attrsObj = arguments[0]
      const that = this
      Object.keys(attrsObj).forEach((attr) => {
        that.forEach(($element) => {
          $element.setAttribute(attr, attrsObj[attr])
        })
      })
      return this
    }

    if (typeof arguments[0] == 'string' && arguments.length < 2) {
      return this[0].getAttribute(arguments[0])
    }

    this.forEach(($element) => {
      $element.setAttribute(arguments[0], arguments[1])
    })
    return this
  }
})

Object.assign($, {
  /**
   * noop
   */
  noop() { },
  /**
   * getStyle 获得元素计算后的样式值
   * (from http://stackoverflow.com/questions/2664045/how-to-get-an-html-elements-style-values-in-javascript)
   */
  getStyle(el, styleProp) {
    var value, defaultView = (el.ownerDocument || document).defaultView
    // W3C standard way:
    if (defaultView && defaultView.getComputedStyle) {
      // sanitize property name to css notation
      // (hypen separated words eg. font-Size)
      styleProp = styleProp.replace(/([A-Z])/g, '-$1').toLowerCase()
      return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp)
    } else if (el.currentStyle) { // IE
      // sanitize property name to camelCase
      styleProp = styleProp.replace(/\-(\w)/g, (str, letter) => {
        return letter.toUpperCase()
      })
      value = el.currentStyle[styleProp]
      // convert other units to pixels on IE
      if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
        return ((value) => {
          var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left
          el.runtimeStyle.left = el.currentStyle.left
          el.style.left = value || 0
          value = el.style.pixelLeft + 'px'
          el.style.left = oldLeft
          el.runtimeStyle.left = oldRsLeft
          return value
        })(value)
      }
      return value
    }
  }
})

export default $

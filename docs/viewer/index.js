var viewer = (function () {
  'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".viewer--container {\n  transform: translate3d(0, 0, 0);\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100vh;\n  background-color: black;\n  overflow: hidden;\n  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  z-index: 1000;\n}\n.viewer--container.hide {\n  background-color: transparent;\n}\n.viewer--container.hide .viewer-header {\n  background-color: transparent;\n}\n.viewer--container .viewer-wrap {\n  display: flex;\n  height: 100%;\n}\n.viewer--container .viewer-header {\n  height: 44px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  color: rgba(255, 255, 255, 0.8);\n  background-color: rgba(0, 0, 0, 0.3);\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  font-size: 13px;\n  text-align: center;\n  box-sizing: border-box;\n  padding-left: 15px;\n  z-index: 10;\n}\n.viewer--container .viewer-close {\n  width: 44px;\n  height: 44px;\n  position: relative;\n  cursor: pointer;\n}\n.viewer--container .viewer-close:hover {\n  opacity: 0.8;\n}\n.viewer--container .viewer-close:active {\n  opacity: 0.6;\n}\n.viewer--container .viewer-close::before,\n.viewer--container .viewer-close::after {\n  content: '';\n  display: block;\n  width: 18px;\n  height: 2px;\n  background-color: rgba(255, 255, 255, 0.8);\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  top: 0;\n  margin: auto;\n  transform: rotate(45deg);\n}\n.viewer--container .viewer-close::after {\n  transform: rotate(-45deg);\n}\n\n.viewer--container .viewer-item {\n  width: 100vw;\n  height: 100%;\n  flex: 1;\n  flex-shrink: 0;\n  box-sizing: border-box;\n  padding: 44px 0 20px;\n}\n.viewer--container .zoomable-wrap {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.viewer--container .viewer-image {\n  max-width: 100%;\n  max-height: 100%;\n  display: block;\n  -o-object-fit: contain;\n     object-fit: contain;\n}\n.viewer--container .viewer-image:active {\n  cursor: move;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n";
  styleInject(css_248z);

  function createUI(data, _a) {
      var _b = _a.maxIndex, maxIndex = _b === void 0 ? 0 : _b, _c = _a.index, index = _c === void 0 ? 1 : _c, _d = _a.gap, gap = _d === void 0 ? 20 : _d, _e = _a.screenWidth, screenWidth = _e === void 0 ? 300 : _e;
      var container = document.createElement('div');
      container.className = 'viewer--container';
      var len = maxIndex + 1;
      var counter = len > 1
          ? "<div class=\"counter\"><span class=\"num\">" + (index + 1) + "</span><span> / </span><span>" + len + "</span></div>"
          : '<div class="counter"></div>';
      var header = "<div class=\"viewer-header\">" + counter + "<div class=\"viewer-close\"></div></div>";
      var items = data.map(function (url, i) {
          var g = i === len - 1 ? 0 : gap;
          return "<div class=\"viewer-item\" style=\"margin-right: " + g + "px\"><div class=\"zoomable-wrap\"><img class=\"viewer-image\" src=\"" + url + "\" /></div></div>";
      });
      var content = "<div class=\"viewer-wrap\" style=\"width:" + ((screenWidth + gap) * len - gap) + "px;\">" + items.join('') + "</div>";
      container.innerHTML = header + content;
      document.body.appendChild(container);
      return container;
  }

  var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var n,e,r=(function(n){var e,r;e=t,r=function(t,n,e){function r(n,e,i){return i=Object.create(r.fn),n&&i.push.apply(i,n.addEventListener?[n]:""+n===n?/</.test(n)?((e=t.createElement(e)).innerHTML=n,e.children):e?(e=r(e)[0])?e.querySelectorAll(n):i:t.querySelectorAll(n):n),i}return r.fn=[],r.one=function(t,n){return r(t,n)[0]||null},r}(document),n.exports?n.exports=r:e.$=r;}(e={path:n,exports:{},require:function(t,n){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==n&&e.path)}},e.exports),e.exports);Object.assign(r.fn,{append:function(t){return t instanceof HTMLElement||(t=t[0]),this.forEach((function(n){n.appendChild(t);})),this},remove:function(){return this.forEach((function(t){t.parentNode.removeChild(t);})),this},find:function(t){return r(t,this)},addClass:function(t){return this.forEach((function(n){n.classList.add(t);})),this},removeClass:function(t){return this.forEach((function(n){n.classList.remove(t);})),this},eq:function(t){return r(this[t])},show:function(){return this.forEach((function(t){t.style.display="block";})),this},hide:function(){return this.forEach((function(t){t.style.display="none";})),this},html:function(t){return this.forEach((function(n){n.innerHTML=t;})),this},css:function(t){var n=this;return Object.keys(t).forEach((function(e){n.forEach((function(n){n.style[e]=t[e];}));})),this},transform:function(t){for(var n=0;n<this.length;n+=1)this[n].style.transform=t,this[n].style.webkitTransform=t;return this},transition:function(t){for(var n=0;n<this.length;n+=1){var e="string"!=typeof t?t+"ms":t;this[n].style.transitionDuration=e,this[n].style.webkitTransitionDuration=e;}return this},on:function(t,n,e){var r="string"==typeof n&&"function"==typeof e;return r||(e=n),this.forEach((function(i){t.split(" ").forEach((function(t){i.addEventListener(t,(function(t){r?this.contains(t.target.closest(n))&&e.call(t.target,t):e.call(this,t);}));}));})),this},off:function(t,n,e){return "function"==typeof n&&(e=n,n=null),this.forEach((function(r){t.split(" ").forEach((function(t){"string"==typeof n?r.querySelectorAll(n).forEach((function(n){n.removeEventListener(t,e);})):r.removeEventListener(t,e);}));})),this},index:function(){var t=this[0],n=t.parentNode;return Array.prototype.indexOf.call(n.children,t)},offAll:function(){var t=this;return this.forEach((function(n,e){var r=n.cloneNode(!0);n.parentNode.replaceChild(r,n),t[e]=r;})),this},val:function(){var t=arguments;return arguments.length?(this.forEach((function(n){n.value=t[0];})),this):this[0].value},attr:function(){var t=arguments;if("object"==typeof arguments[0]){var n=arguments[0],e=this;return Object.keys(n).forEach((function(t){e.forEach((function(e){e.setAttribute(t,n[t]);}));})),this}return "string"==typeof arguments[0]&&arguments.length<2?this[0].getAttribute(arguments[0]):(this.forEach((function(n){n.setAttribute(t[0],t[1]);})),this)}}),Object.assign(r,{noop:function(){},getStyle:function(t,n){var e,r=(t.ownerDocument||document).defaultView;return r&&r.getComputedStyle?(n=n.replace(/([A-Z])/g,"-$1").toLowerCase(),r.getComputedStyle(t,null).getPropertyValue(n)):t.currentStyle?(n=n.replace(/\-(\w)/g,(function(t,n){return n.toUpperCase()})),e=t.currentStyle[n],/^\d+(em|pt|%|ex)?$/i.test(e)?function(n){var e=t.style.left,r=t.runtimeStyle.left;return t.runtimeStyle.left=t.currentStyle.left,t.style.left=n||0,n=t.style.pixelLeft+"px",t.style.left=e,t.runtimeStyle.left=r,n}(e):e):void 0}});

  var supportTouch = 'ontouchstart' in (typeof window !== 'undefined' ? window : {});
  var supportsPassive = (function () {
      var supportsPassive = false;
      try {
          var opts = Object.defineProperty({}, 'passive', {
              // eslint-disable-next-line
              get: function () {
                  supportsPassive = true;
              },
          });
          window.addEventListener('testPassiveListener', function () { }, opts);
      }
      catch (e) {
          // No support
      }
      return supportsPassive;
  })();
  var support = {
      touch: supportTouch,
      passive: supportsPassive,
  };

  // 页面pageX, pageY
  var getPointer = function (e) {
      var _a = 'changedTouches' in e ? e.changedTouches[0] : e, pageX = _a.pageX, pageY = _a.pageY;
      return { pageX: pageX, pageY: pageY };
  };
  // 获取手指距离
  function getDistanceBetweenTouches(e) {
      if (e.targetTouches.length < 2)
          return 1;
      var x1 = e.targetTouches[0].pageX;
      var y1 = e.targetTouches[0].pageY;
      var x2 = e.targetTouches[1].pageX;
      var y2 = e.targetTouches[1].pageY;
      var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
      return distance;
  }
  /**
   * 阻力函数
   * @param value 当前值
   * @param min 最小
   * @param max 最大
   * @param a 系数
   */
  function resistance(value, min, max, a) {
      if (value === void 0) { value = 0; }
      if (min === void 0) { min = 0; }
      if (max === void 0) { max = 100; }
      if (a === void 0) { a = 0.8; }
      if (value < min) {
          value = min + 1 - Math.pow((min - value + 1), a);
      }
      if (value > max) {
          value = max - 1 + Math.pow((value - max + 1), a);
      }
      return value;
  }
  /**
   * 限制最大最小
   * @param value
   * @param min
   * @param max
   */
  function range(value, min, max) {
      if (value === void 0) { value = 0; }
      if (min === void 0) { min = 0; }
      if (max === void 0) { max = 100; }
      if (value < min)
          return min;
      if (value > max)
          return max;
      return value;
  }
  // 显示图片预览
  function showViewer(container, e) {
      var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
      var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      var _a = e ? getPointer(e) : { pageX: clientWidth / 2, pageY: clientHeight / 2 }, pageX = _a.pageX, pageY = _a.pageY;
      var diffX = pageX - clientWidth / 2;
      var diffY = pageY - clientHeight / 2;
      var $container = r(container);
      $container
          .transition(0)
          .transform("translate3d(" + diffX + "px, " + diffY + "px,0) scale(0)")
          .css({ opacity: '0' });
      setTimeout(function () {
          $container.transition(150).transform("translate3d(0,0,0) scale(1)").css({ opacity: '1' });
      });
  }
  // 隐藏图片预览
  function hideViewer(container, e) {
      var $container = r(container);
      if (!e) {
          $container.remove();
          return;
      }
      var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
      var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      var _a = e ? getPointer(e) : { pageX: clientWidth / 2, pageY: clientHeight / 2 }, pageX = _a.pageX, pageY = _a.pageY;
      var diffX = pageX - clientWidth / 2;
      var diffY = pageY - clientHeight / 2;
      container.classList.add('hide');
      setTimeout(function () {
          $container
              .transition(300)
              .transform("translate3d(" + diffX + "px, " + diffY + "px,0) scale(0)")
              .css({ opacity: '0' });
          $container.on('webkitTransitionEnd transitionend', function () {
              container.parentNode && $container.remove();
          });
      });
  }
  // 获取translate
  // export function getTranslate(el: HTMLElement, axis = 'x') {
  //   let matrix
  //   let curTransform
  //   let transformMatrix
  //   const curStyle = window.getComputedStyle(el, null)
  //   if ('WebKitCSSMatrix' in window) {
  //     curTransform = curStyle.transform || curStyle.webkitTransform
  //     if (curTransform.split(',').length > 6) {
  //       curTransform = curTransform
  //         .split(', ')
  //         .map((a) => a.replace(',', '.'))
  //         .join(', ')
  //     }
  //     // Some old versions of Webkit choke when 'none' is passed; pass
  //     // empty string instead in this case
  //     transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform)
  //   } else {
  //     const cs = curStyle as any
  //     transformMatrix =
  //       cs.MozTransform ||
  //       cs.OTransform ||
  //       cs.MsTransform ||
  //       cs.msTransform ||
  //       cs.transform ||
  //       cs.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,')
  //     matrix = transformMatrix.toString().split(',')
  //   }
  //   if (axis === 'x') {
  //     // Latest Chrome and webkits Fix
  //     if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41
  //     // Crazy IE10 Matrix
  //     else if (matrix.length === 16) curTransform = parseFloat(matrix[12])
  //     // Normal Browsers
  //     else curTransform = parseFloat(matrix[4])
  //   }
  //   if (axis === 'y') {
  //     // Latest Chrome and webkits Fix
  //     if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42
  //     // Crazy IE10 Matrix
  //     else if (matrix.length === 16) curTransform = parseFloat(matrix[13])
  //     // Normal Browsers
  //     else curTransform = parseFloat(matrix[5])
  //   }
  //   return curTransform || 0
  // }
  function listenOption(capture, passive) {
      if (capture === void 0) { capture = false; }
      if (passive === void 0) { passive = false; }
      return support.passive ? { passive: passive, capture: capture } : capture;
  }

  // 下滑关闭
  var Closeable = /** @class */ (function () {
      function Closeable(el, screenHeight, changeOpacity) {
          this.startX = 0;
          this.startY = 0;
          this.diffX = 0;
          this.diffY = 0;
          this.opacity = 1;
          this.isStart = false;
          this.direction = '';
          this.el = el;
          this.$el = r(el);
          this.screenHeight = screenHeight;
          this.changeOpacity = changeOpacity;
          this.init = this.init.bind(this);
          this.touchstart = this.touchstart.bind(this);
          this.touchmove = this.touchmove.bind(this);
          this.touchend = this.touchend.bind(this);
          this.init();
      }
      Closeable.prototype.init = function () {
          var o = listenOption();
          if (support.touch) {
              this.el.addEventListener('touchstart', this.touchstart, o);
              window.addEventListener('touchmove', this.touchmove, o);
              window.addEventListener('touchend', this.touchend, o);
              window.addEventListener('touchcancel', this.touchend, o);
          }
          else {
              this.el.addEventListener('mousedown', this.touchstart, o);
              window.addEventListener('mousemove', this.touchmove, o);
              window.addEventListener('mouseup', this.touchend, o);
          }
      };
      Closeable.prototype.destroy = function () {
          if (support.touch) {
              this.el.removeEventListener('touchstart', this.touchstart);
              window.removeEventListener('touchmove', this.touchmove);
              window.removeEventListener('touchend', this.touchend);
              window.removeEventListener('touchcancel', this.touchend);
          }
          else {
              this.el.removeEventListener('mousedown', this.touchstart);
              window.removeEventListener('mousemove', this.touchmove);
              window.removeEventListener('mouseup', this.touchend);
          }
      };
      Closeable.prototype.touchstart = function (e) {
          if ((e.touches || []).length > 1)
              return;
          this.isStart = true;
          if (e.cancelable) {
              e.preventDefault();
          }
          var xy = getPointer(e);
          this.startX = xy.pageX;
          this.startY = xy.pageY;
          this.diffY = 0;
          this.diffY = 0;
          this.direction = '';
          this.$el.transition(0);
      };
      Closeable.prototype.touchmove = function (e) {
          if (!this.isStart)
              return;
          if (e.cancelable) {
              e.preventDefault();
          }
          if (this.direction !== 'horizontal') {
              e.stopPropagation();
          }
          var xy = getPointer(e);
          this.diffY = xy.pageY - this.startY;
          if (!this.direction) {
              this.diffX = xy.pageX - this.startX;
              this.direction = Math.abs(this.diffY) > Math.abs(this.diffX) ? 'vertical' : 'horizontal';
          }
          if (this.direction === 'vertical') {
              this.opacity = Math.min(1, 1 - this.diffY / (this.screenHeight - this.startY));
              this.$el.transform("translate3d(0," + this.diffY + "px,0)");
              this.changeOpacity(this.opacity);
          }
      };
      Closeable.prototype.touchend = function (e) {
          if (!this.isStart)
              return;
          this.$el.transition(300);
          if (this.direction === 'vertical') {
              if (this.opacity < 0.6) {
                  // this.diffY = this.screenHeight
                  this.opacity = 0;
              }
              else {
                  // this.diffY = 0
                  this.opacity = 1;
              }
              this.diffY = 0;
              this.$el.transform("translate3d(0," + this.diffY + "px,0)");
              this.changeOpacity(this.opacity);
          }
          this.isStart = false;
      };
      return Closeable;
  }());
  var closeable = (function (el, screenHeight, changeOpacity) {
      var cba = new Closeable(el, screenHeight, changeOpacity);
      return function () { return cba.destroy(); };
  });

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  var defaults = {
      maxRatio: 3,
      minRatio: 0.5,
  };
  var Zoomable = /** @class */ (function () {
      function Zoomable(el, options) {
          this.isScaling = false; // 是否在缩放
          this.disabledMove = false; // 禁止滑动
          this.scaleStart = 1; // 按下手指距离
          this.scaleMove = 1; // 移动手指距离
          this.currentScale = 1; // 缩放开始时候的缩放比例
          this.scale = 1; // 缩放比例
          this.width = 100; // 缩放元素尺寸
          this.height = 100; // 缩放元素尺寸
          this.wrapWidth = 100; // 缩放父元素尺寸
          this.wrapHeight = 100; // 缩放父元素尺寸
          this.startX = 0; // 滑动开始X
          this.startY = 0; // 滑动开始Y
          this.minX = 0; // 最小移动x
          this.minY = 0; // 最小移动Y
          this.maxX = 0; // 最大移动X
          this.maxY = 0; // 最大移动Y
          this.startPageX = 0; // 开始pageX
          this.startPageY = 0; // 开始pageY
          this.pageX = 0; // 当前pagex
          this.pageY = 0; // 当前pagey
          this.currentX = 0; // 当前移动X
          this.currentY = 0; // 当前移动Y
          this.touchEventsData = {
              touchStartTime: 0,
              touchEndTime: 0,
              lastClickTime: 0,
          };
          this.el = el;
          this.options = __assign(__assign({}, defaults), options);
          this.$el = r(el);
          this.wrap = el.parentElement;
          this.$wrap = r(this.wrap);
          this.onTouchStart = this.onTouchStart.bind(this);
          this.onTouchMove = this.onTouchMove.bind(this);
          this.onTouchEnd = this.onTouchEnd.bind(this);
          this.init();
      }
      Zoomable.prototype.init = function () {
          if (!support.touch)
              return;
          var o = listenOption();
          this.wrap.addEventListener('touchstart', this.onTouchStart, o);
          this.wrap.addEventListener('touchmove', this.onTouchMove, o);
          this.wrap.addEventListener('touchend', this.onTouchEnd, o);
          this.wrap.addEventListener('touchcancel', this.onTouchEnd, o);
      };
      Zoomable.prototype.destroy = function () {
          if (!support.touch)
              return;
          this.wrap.removeEventListener('touchstart', this.onTouchStart);
          this.wrap.removeEventListener('touchmove', this.onTouchMove);
          this.wrap.removeEventListener('touchend', this.onTouchEnd);
          this.wrap.removeEventListener('touchcancel', this.onTouchEnd);
      };
      Zoomable.prototype.onTouchStart = function (e) {
          e.preventDefault();
          if (e.targetTouches.length > 1 || this.isScaling) {
              e.stopPropagation();
          }
          // 防止缩放和滑动冲突
          if (e.targetTouches.length > 1) {
              this.disabledMove = true;
          }
          // 保存当前点击时间
          if (e.targetTouches.length === 1) {
              this.touchEventsData.touchStartTime = Date.now();
              this.width = this.el.offsetWidth;
              this.height = this.el.offsetHeight;
              this.wrapWidth = this.wrap.offsetWidth;
              this.wrapHeight = this.wrap.offsetHeight;
              this.startX = this.currentX;
              this.startY = this.currentY;
              var _a = getPointer(e), pageX = _a.pageX, pageY = _a.pageY;
              this.startPageX = pageX;
              this.startPageY = pageY;
          }
          this.$wrap.transition(0);
          this.onGestureStart(e);
      };
      Zoomable.prototype.onTouchMove = function (e) {
          e.preventDefault();
          if (e.targetTouches.length > 1 || this.isScaling) {
              e.stopPropagation();
          }
          this.onGestureChange(e);
          if (this.disabledMove || !this.isScaling || e.targetTouches.length !== 1)
              return;
          // 如果图片在放大状态，则支持拖动
          var scaledWidth = this.width * this.scale;
          var scaledHeight = this.height * this.scale;
          if (scaledWidth < this.wrapWidth && scaledHeight < this.wrapHeight)
              return;
          this.minX = Math.min(this.wrapWidth / 2 - scaledWidth / 2, 0);
          this.maxX = -this.minX;
          this.minY = Math.min(this.wrapWidth / 2 - scaledHeight / 2, 0);
          this.maxY = -this.minY;
          var _a = getPointer(e), pageX = _a.pageX, pageY = _a.pageY;
          this.pageX = pageX;
          this.pageY = pageY;
          var currentX = this.pageX - this.startPageX + this.startX;
          var currentY = this.pageY - this.startPageY + this.startY;
          this.currentX = resistance(currentX, this.minX, this.maxX);
          this.currentY = resistance(currentY, this.minY, this.maxY);
          this.$wrap.transform("translate3d(" + this.currentX + "px, " + this.currentY + "px,0)");
      };
      Zoomable.prototype.onTouchEnd = function (e) {
          e.preventDefault();
          var touchesLen = e.changedTouches.length;
          if (touchesLen > 1 || this.isScaling) {
              e.stopPropagation();
          }
          if (!e.targetTouches.length) {
              this.disabledMove = false;
          }
          // 判断双击事件
          var touchEndTime = Date.now();
          var data = this.touchEventsData;
          var timeDiff = touchEndTime - data.touchStartTime;
          var lastClickTime = data.lastClickTime;
          data.lastClickTime = touchEndTime;
          if (timeDiff < 300 && touchEndTime - lastClickTime < 300) {
              this.scale === 1 ? this.zoomIn(e) : this.zoomOut();
          }
          else {
              this.onGestureEnd(e);
          }
          // 滑动超出距离返回
          var currentX = range(this.currentX, this.minX, this.maxX);
          var currentY = range(this.currentY, this.minY, this.maxY);
          if (currentX === this.currentX && currentY === this.currentY)
              return;
          this.currentX = currentX;
          this.currentY = currentY;
          this.$wrap.transition(300).transform("translate3d(" + currentX + "px, " + currentY + "px,0)");
      };
      Zoomable.prototype.onGestureStart = function (e) {
          this.$el.transition(0);
          if (e.targetTouches.length < 2)
              return;
          this.isScaling = true;
          this.scaleStart = getDistanceBetweenTouches(e);
      };
      Zoomable.prototype.onGestureChange = function (e) {
          if (e.targetTouches.length < 2 || !this.isScaling)
              return;
          this.scaleMove = getDistanceBetweenTouches(e);
          var scale = (this.scaleMove / this.scaleStart) * this.currentScale;
          var _a = this.options, maxRatio = _a.maxRatio, minRatio = _a.minRatio;
          // 缩放阻力
          this.scale = resistance(scale, minRatio, maxRatio, 0.5);
          this.$el.transform("translate3d(0,0,0) scale(" + this.scale + ")");
      };
      Zoomable.prototype.onGestureEnd = function (e) {
          var _a = this.options, maxRatio = _a.maxRatio, minRatio = _a.minRatio;
          var scale = range(this.scale, minRatio, maxRatio);
          if (Math.abs(scale - 1) < 0.05)
              scale = 1;
          if (scale === 1)
              this.isScaling = false;
          if (scale <= 1) {
              if (this.currentX === 0 && this.currentY === 0)
                  return;
              this.$wrap.transition(300).transform('translate3d(0,0,0)');
          }
          if (this.scale === scale && this.currentScale === scale)
              return;
          this.currentScale = this.scale = scale;
          this.$el.transition(300).transform("translate3d(0,0,0) scale(" + this.scale + ")");
      };
      Zoomable.prototype.zoomIn = function (e) {
          var _a = getPointer(e), pageX = _a.pageX, pageY = _a.pageY;
          this.wrapWidth = this.wrap.offsetWidth;
          this.wrapHeight = this.wrap.offsetHeight;
          var rect = this.wrap.getBoundingClientRect();
          var diffX = rect.left + this.wrapWidth / 2 - pageX;
          var diffY = rect.top + this.wrapHeight / 2 - pageY;
          var scale = this.options.maxRatio;
          var scaledWidth = this.el.offsetWidth * scale;
          var scaledHeight = this.el.offsetHeight * scale;
          this.minX = Math.min(this.wrapWidth / 2 - scaledWidth / 2, 0);
          this.minY = Math.min(this.wrapHeight / 2 - scaledHeight / 2, 0);
          this.maxX = -this.minX;
          this.maxY = -this.minY;
          this.currentX = range(diffX * scale, this.minX, this.maxX);
          this.currentY = range(diffY * scale, this.minY, this.maxY);
          this.currentScale = this.scale = scale;
          this.isScaling = true;
          this.$wrap.transition(300).transform("translate3d(" + this.currentX + "px, " + this.currentY + "px,0)");
          this.$el.transition(300).transform("translate3d(0,0,0) scale(" + scale + ")");
      };
      Zoomable.prototype.zoomOut = function () {
          this.currentX = this.startX = this.currentY = this.startY = 0;
          this.currentScale = this.scale = 1;
          this.isScaling = false;
          this.$el.transition(300).transform('translate3d(0,0,0) scale(1)');
          this.$wrap.transition(300).transform('translate3d(0,0,0)');
      };
      return Zoomable;
  }());
  var zoomable = (function (el, options) {
      var az = new Zoomable(el, options);
      return function () {
          az.destroy();
      };
  });

  var Carousel = /** @class */ (function () {
      function Carousel(container, options, removeContainer) {
          this.startX = 0;
          this.diffX = 0;
          this.isStart = false;
          this.timer = null;
          this.destroyFns = [];
          this.container = container;
          this.options = options;
          this.index = options.index;
          this.left = options.index * options.screenWidth;
          this.removeContainer = removeContainer;
          this.$wrap = r('.viewer-wrap', container);
          this.counterEl = container.querySelector('.num');
          this.resize = this.resize.bind(this);
          this.handleStart = this.handleStart.bind(this);
          this.handleMove = this.handleMove.bind(this);
          this.handleEnd = this.handleEnd.bind(this);
          this.handleKeyup = this.handleKeyup.bind(this);
          this.changeOpacity = this.changeOpacity.bind(this);
          this.init();
      }
      Carousel.prototype.init = function () {
          var _this = this;
          if (this.index) {
              this.slideTo(this.index);
          }
          window.addEventListener('resize', this.resize, listenOption(true));
          var o = listenOption();
          if (support.touch) {
              this.container.addEventListener('touchstart', this.handleStart, o);
              window.addEventListener('touchmove', this.handleMove, o);
              window.addEventListener('touchend', this.handleEnd, o);
              window.addEventListener('touchcancel', this.handleEnd, o);
          }
          else {
              this.container.addEventListener('mousedown', this.handleStart, o);
              window.addEventListener('mousemove', this.handleMove, o);
              window.addEventListener('mouseup', this.handleEnd, o);
          }
          window.addEventListener('keyup', this.handleKeyup, o);
          // 手指下滑关闭
          this.container.querySelectorAll('.viewer-item').forEach(function (el) {
              _this.destroyFns.push(closeable(el, _this.options.screenHeight, _this.changeOpacity));
          });
          // 双指缩放功能
          this.container.querySelectorAll('.viewer-item .viewer-image').forEach(function (el) {
              _this.destroyFns.push(zoomable(el));
          });
      };
      Carousel.prototype.destroy = function () {
          var _this = this;
          window.removeEventListener('resize', this.resize);
          if (support.touch) {
              this.container.removeEventListener('touchstart', this.handleStart);
              window.removeEventListener('touchmove', this.handleMove);
              window.removeEventListener('touchend', this.handleEnd);
              window.removeEventListener('touchcancel', this.handleEnd);
          }
          else {
              this.container.removeEventListener('mousedown', this.handleStart);
              window.removeEventListener('mousemove', this.handleMove);
              window.removeEventListener('mouseup', this.handleEnd);
          }
          window.removeEventListener('keyup', this.handleKeyup);
          // 清空关闭和缩放事件
          this.destroyFns.forEach(function (destory) {
              destory();
          });
          setTimeout(function () {
              _this.removeContainer();
          });
      };
      Carousel.prototype.handleKeyup = function (e) {
          var maxIndex = this.options.maxIndex;
          console.log(e.key, maxIndex);
          if (e.key === 'ArrowLeft') {
              return this.slideTo(this.index ? this.index - 1 : maxIndex);
          }
          if (e.key === 'ArrowRight') {
              return this.slideTo(this.index === maxIndex ? 0 : this.index + 1);
          }
      };
      Carousel.prototype.changeOpacity = function (opacity) {
          if (opacity === 0) {
              this.container.style.opacity = '1';
              this.destroy();
          }
          else {
              this.container.style.opacity = "" + opacity;
          }
      };
      Carousel.prototype.handleStart = function (e) {
          if ((e.touches || []).length > 1)
              return;
          if (e.cancelable) {
              e.preventDefault();
          }
          var pageX = getPointer(e).pageX;
          this.startX = pageX;
          this.isStart = true;
          this.$wrap.transition(0);
      };
      Carousel.prototype.handleMove = function (e) {
          if (!this.isStart)
              return;
          var pageX = getPointer(e).pageX;
          var diffX = pageX - this.startX;
          this.diffX = diffX;
          // 设置阻力
          var l = resistance(diffX + this.left, -this.options.maxLeft, 0, 0.8);
          this.$wrap.transform("translate3d(" + l + "px,0,0)");
      };
      Carousel.prototype.handleEnd = function () {
          if (!this.isStart)
              return;
          var index = this.index;
          if (Math.abs(this.diffX) > 100) {
              if (this.diffX > 0) {
                  index -= 1;
              }
              else {
                  index += 1;
              }
          }
          this.diffX = 0;
          var current = range(index, 0, this.options.maxIndex);
          this.slideTo(current);
      };
      Carousel.prototype.resize = function () {
          var _this = this;
          if (this.timer) {
              clearTimeout(this.timer);
          }
          this.timer = setTimeout(function () {
              var _a = _this.options, gap = _a.gap, maxIndex = _a.maxIndex;
              var screenWidth = document.documentElement.clientWidth || document.body.clientWidth;
              _this.options.screenWidth = screenWidth;
              _this.$wrap.css({
                  width: (screenWidth + gap) * (maxIndex + 1) - gap + "px",
              });
              _this.slideTo(_this.index);
          }, 150);
      };
      Carousel.prototype.slideTo = function (index, duration) {
          if (index === void 0) { index = 0; }
          if (duration === void 0) { duration = 300; }
          if (index !== this.index && typeof this.options.onChange === 'function') {
              this.options.onChange(index);
          }
          this.index = index;
          this.$wrap.transition(duration);
          this.left = -index * (this.options.screenWidth + this.options.gap);
          this.$wrap.transform("translate3d(" + this.left + "px,0,0)");
          this.isStart = false;
          if (this.counterEl) {
              this.counterEl.textContent = "" + (index + 1);
          }
      };
      return Carousel;
  }());

  var index = (function (options, e) {
      var data = options.data, _a = options.gap, gap = _a === void 0 ? 10 : _a, _b = options.screenWidth, screenWidth = _b === void 0 ? document.documentElement.clientWidth || document.body.clientWidth : _b, _c = options.screenHeight, screenHeight = _c === void 0 ? document.documentElement.clientHeight || document.body.clientHeight : _c, _d = options.index, index = _d === void 0 ? 0 : _d, container = options.container, onChange = options.onChange;
      var config = {
          index: index,
          maxIndex: data.length - 1,
          maxLeft: (screenWidth + gap) * (data.length - 1),
          gap: gap,
          screenWidth: screenWidth,
          screenHeight: screenHeight,
          onChange: onChange,
      };
      if (!container) {
          container = createUI(data, config);
          showViewer(container, e);
      }
      var removeContainer = function () {
          container && hideViewer(container, e);
      };
      var carousel = new Carousel(container, config, removeContainer);
      var destroy = function () {
          carousel.destroy();
      };
      var header = container.querySelector('.viewer-header');
      header.ontouchstart = function (e) {
          e.stopPropagation();
      };
      var closeBtn = container.querySelector('.viewer-close');
      closeBtn.onclick = function (e) {
          e.stopPropagation();
          destroy();
      };
      return destroy;
  });

  return index;

}());

## browser-update

modify from browser-update

代码临时使用，暂时不发布

### 使用

```html
<script src="halobearBrowserValidate.min.js"></script>
<h2>测试低版本浏览器检查</h2>
<div id="browser-validate-dialog" style="display: none;">
  <h2>浏览器版本过低</h2>
  <p>建议更新最新版本</p>
</div>
<script>
  function browserValidteCallback({ reasons }) {
    const [reason] = reasons
    reason && (document.querySelector('h2').innerHTML = reason)
  }
</script>
```

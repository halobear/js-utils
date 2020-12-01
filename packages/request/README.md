## request

简单包装一下 axios

## usage

```js
import { createApi } from '@halobear/request'
// axios对象，默认不开启loading和toast
const instance = createApi({ config: { shouldLoading: true, shouldToast: true } })

// 覆盖上配置
instance({
  url: '/api/test',
  method: 'post',
  shouldLoading: false,
  shouldToast: true,
})
instance.get('/api/test', { params: { id: 1 }, shouldLoading: true })
instance.post('/api/test', { data: { id: 1 }, shouldLoading: true })
instance.delete('/api/test', { data: { id: 1 }, shouldLoading: true })
```

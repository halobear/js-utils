import {AxiosError} from 'axios'
import {CreateApiOptions as Options} from '../types'

const erorrStatusMap = {
  400: '请求有错误',
  401: '没有权限',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '404 未找到',
  405: '请求method错误',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网络超时',
}

export function getErrMsg(e:AxiosError):string {
  const { status = '', data = {} } = e.response || {}
  return data.info || erorrStatusMap[status as keyof typeof erorrStatusMap] || '网络超时'
}

export function createErrorHandler(options: Options) {
  const {toast, loading} = options
  return (e: AxiosError) => {
    // 这里会多接受两个参数
    const {shouldToast, shouldLoading} = ((e.config || {}) as any)
    shouldToast && toast(getErrMsg(e))
    shouldLoading && loading.hide()
    options.errorHandler && options.errorHandler(e)
    return Promise.reject(e)
  }
}
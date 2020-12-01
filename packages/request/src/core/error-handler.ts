import {AxiosError} from 'axios'
import {CreateApiOptions as Options} from '../types'

const erorrStatusMap = {
  400: '请求有错误',
  401: '没有权限',
  403: '禁止访问',
  404: '资源未找到',
  405: '请求方法错误',
  406: '请求的无法解析',
  410: '请求的资源被永久删除',
  422: '请求验证错误',
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
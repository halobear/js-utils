import {AxiosResponse,AxiosError} from 'axios'
import {IRet, Loading} from '../types'

interface CustomError extends Error {
  response?: AxiosResponse<IRet>
  toJSON?: () => object,
  isAxiosError?: false
}

function handleResponse(response: AxiosResponse<IRet>, handleError: (e:AxiosError) => any, loading: Loading) {
  const {data, config} = response
  if (!data.success && !data.iRet) {
    const message = data.info || "服务端错误"; // 错误信息
    const e:CustomError = new Error(message); // eslint-disable-line
    e.toJSON = () => ({
      message: e.message,
      name: e.name,
      stack: e.stack,
      config: config,
    })
    e.response = response;
    // 统一错误处理
    return handleError(e as AxiosError);
  }
  const {shouldLoading} = ((config || {}) as any)
  shouldLoading && loading.hide()
  return data
}

export default handleResponse
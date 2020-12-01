import axios, {AxiosResponse, AxiosRequestConfig} from 'axios'
import {loading, toast} from '@halobear/js-feedback'

import {UserCreateApiOption as UserOptions, CreateApiOptions as Options} from '../types'

import requestHandler from './request-handler'
import responseHandler from './response-handler'
import {createErrorHandler} from './error-handler'

function createApi(handlers: UserOptions) {
  const options:Options = {loading, toast, ...handlers}
  const instance = axios.create(options.config)
  // request拦截/打开loaing
  const handleRequest = (config: AxiosRequestConfig) => requestHandler(config, options)
  instance.interceptors.request.use(handleRequest)
  // response拦截/关闭loading/错误提示
  const handleError = createErrorHandler(options)
  const handleRespose = (res: AxiosResponse) => responseHandler(res, handleError, options.loading)
  instance.interceptors.response.use(handleRespose, handleError)
  return instance
}

export default createApi
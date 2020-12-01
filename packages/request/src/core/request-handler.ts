import {AxiosRequestConfig} from 'axios'

import {CreateApiOptions} from '../types'

function requestHandler(config:AxiosRequestConfig, options: CreateApiOptions) {
  options.requestHandler && options.requestHandler(config)
  // 新增参数
  const {shouldLoading} = ((config || {}) as any)
  shouldLoading && options.loading.show()
  return config
}

export default requestHandler
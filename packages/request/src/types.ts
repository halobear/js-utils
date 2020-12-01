import {AxiosError, AxiosRequestConfig} from 'axios'

export interface Loading {
  show: (time?: number) => void
  hide: () => void;
}

export interface UserCreateApiOption {
  config: AxiosRequestConfig,
  errorHandler?: (e: AxiosError) => void,
  requestHandler?: (config: AxiosRequestConfig) => AxiosRequestConfig,
  loading?: Loading,
  toast?: (text: string, time?: number) => void;
}

export interface CreateApiOptions extends UserCreateApiOption {
  loading: Loading,
  toast: (text: string, time?: number) => void;
}

export interface IRet {
  iRet: boolean, // true 返回成功
  success: boolean, // true 返回成功
  info: string, // 错误信息
  data: object // 返回结果
}
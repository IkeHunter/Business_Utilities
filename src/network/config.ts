import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

const instance = axios.create({
  timeout: 3000
})

export const request = async (options: AxiosRequestConfig): Promise<any> => {
  const res = await instance.request(options)
  return res
}

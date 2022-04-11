import Theaxios from 'axios'

const axios = Theaxios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 20000 // 设置超时时间
})

export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url,
    params,
    method,
    data,
    headers
  })
}

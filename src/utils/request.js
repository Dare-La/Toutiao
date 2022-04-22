import Theaxios from 'axios'
// import router from '@/router/index'
import Notify from '@/ui/Notify'
import { getToken } from '@/utils/token'
// import { refreshTokenAPI } from '@/api/index'
import router from '@/router'

const axios = Theaxios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 20000 // 设置超时时间
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log(config)
  // 让请求的时候必须带上token
  // ?. 是链式操作符，当getToken()中没有length,整个表达式为undefined
  // 当getToken有length才执行 .length 来获取长度
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}` // 给请求头添加token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response
}, async function (error) {
  // 当状态码401时(token无效)，返回到登陆页面
  console.dir(error)
  if (error.response.status === 401) {
    // this.$router.push({ path: '/login' })  //this.$router中的this是vue实例对象，这里的this是undefined
    // 可以将this.$router替换成引入的router对象
    // Notify({ // 提示
    //   message: '登陆信息失效',
    //   color: '#fff',
    //   background: 'red'
    // })
    // 若手动修改token后token无效,清空token,才能让页面跳转到登陆页面
    // removeToken()

    // 这是方式一：token无效时，让用户重新登陆，获取新的token
    // router.currentRoute.fullPath获取当前路由对象的路径
    router.push(`/login?path=${router.currentRoute.fullPath}`)

    // 方式二：把refresh_token给token,用户感知不到的情况下刷新token
    // const res = await refreshTokenAPI()
    // console.log(res)
    // // 发现401状态码后，将拿到的refresh_token给token
    // setToken(res.data.data.token)
    // // 让这次的401错误重新发起新的请求,重新发起请求前需要现在请求头把token携带上
    // error.config.headers.Authorization = `Bearer ${getToken()}`
    // return axios(error.config) // error.config是上一次发失败请求的配置对象
  } else if (error.response.status === 500 && error.response.config.url === '/v1_0/authorizations' && error.response.config.method === 'put') {
    // refresh_token过期的时候
    // 重新到登陆页面重新登陆，获取refresh_token
    Notify({ // 提示
      message: '登陆信息失效',
      color: '#fff',
      background: 'red'
    })
    localStorage.clear() // 清除本地所有的存储
    router.replace('/login')
  }
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
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

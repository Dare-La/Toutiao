import axios from '@/utils/request'
import { getToken } from '@/utils/token'
export const getAllChannelsAPI = () => axios({
  url: '/v1_0/user/channels',
  method: 'GET'

})

/* 登陆接口 */
export const LoginAPI = ({ mobile, code }) => axios({
  url: '/v1_0/authorizations',
  method: 'POST',
  /* 请求体要传的参 */
  data: {
    mobile,
    code
  }
})

/* 获取用户频道 */
export const getUserChannelsAPI = () => axios({
  url: '/v1_0/user/channels',
  // 从封装token方法中拿到本地存储的token
  headers: {
    Authorization: `Bearer${getToken()}`
  }
})

/* 获取文章新闻推荐 */
export const getArticalAPI = ({ channel_id, timestamp }) => axios({
  url: '/v1_0/articles',
  params: { // Get传参用params
    channel_id,
    timestamp
  }
})

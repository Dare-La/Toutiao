import axios from '@/utils/request'
import { getStorage } from '@/utils/storage'
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

/* 拿到刷新的token */
export const refreshTokenAPI = () => axios({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${getStorage('refresh_token')}`
  }
})

/* 获取用户频道 */
export const getUserChannelsAPI = () => axios({
  url: '/v1_0/user/channels'
  // 从封装token方法中拿到本地存储的token
})

/* 获取所有频道 */
export const getAllChannelsAPI = () => axios({
  url: '/v1_0/channels'

})

/* 删除频道 */
export const delChannelAPI = (channelID) => axios({
  // url: '/v1_0/user/channels/:target',
  // :target说明要在url后面带参数,将频道id从外面传入
  url: `/v1_0/user/channels/${channelID}`,
  method: 'DELETE'
})

/* 获取文章新闻推荐 */
export const getArticalAPI = ({ channel_id, timestamp }) => axios({
  url: '/v1_0/articles',
  params: { // Get传参用params
    channel_id,
    timestamp
  }
})

/* 不喜欢文章 */
export const disLikeArticalAPI = (arcId) => axios({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: {
    target: arcId
  }
})

/* 举报文章 */
export const reportArticalAPI = (arcId, type) => axios({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target: arcId,
    type: type,
    remark: '其他问题'
  }
})

/* 更新文章 */
export const updateChannelAPI = (channels) => axios({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels
  }

})

/* 文章详情 */
export const articleDetail = ({ article_id }) => axios({
  url: `/v1_0/articles/${article_id}`,
  method: 'GET'
})

/* 对文章点赞 */
export const likeArticleAPI = ({ target }) => axios({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target
  }
})

/* 取消对文章点赞 */
export const unlikeArticleAPI = ({ target }) => axios({
  url: `/v1_0/article/likings/${target}`,
  method: 'DELETE'
})

/* 获取所有评论 */
export const allCommentAPI = ({ id, offset = null, limit = 10 }) => axios({
  url: '/v1_0/comments',
  // 使用axios的params中的键值对中的值若为空，则axios在URL的？号后会忽略该键值对
  params: {
    type: 'a', // a是对文章的评论，c是对评论的回复
    source: id,
    offset,
    limit
  }
})

/* 点赞评论 */
export const loveCommentAPI = ({ target }) => axios({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: {
    target
  }
})

/* 取消点赞评论 */
export const disloveCommentAPI = ({ target }) => axios({
  url: `/v1_0/comment/likings/${target}`,
  method: 'DELETE'
})

/* 对文章或者评论进行评论 */
export const sendCommentAPI = ({ id, content, art_id = null }) => {
  const obj = {
    target: id,
    content
  }
  if (art_id !== null) { // 如果传入第三个参数，就赋值，然后传给后台
    obj.art_id = art_id
  }
  return axios({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}

/* 关注用户 */
export const followUser = ({ target }) => axios({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target
  }
})
/* 取消关注 */
export const unfollowUser = ({ target }) => axios({
  url: `/v1_0/user/followings/${target}`,
  method: 'DELETE'
})

/* 搜索建议 */
export const searchSuggestAPI = (keyword) => axios({
  url: '/v1_0/suggestion',
  params: {
    q: keyword
  }

})

/* 搜索结果 */
export const searchResultApi = ({ page = 1, per_page = 10, q }) => axios({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    page,
    per_page,
    q
  }
})

/* 获取用户自己信息 */
export const getUserInfoAPI = () => axios({
  url: '/v1_0/user'

})

/* 获取用户个人资料 */
export const getProfileAPI = () => axios({
  url: '/v1_0/user/profile'
})

/* 编辑用户头像 */
export const editUserPhotoAPI = (FmD) => axios({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: FmD // Fmd是外部要传进来的一个FormData对象
})

/* 编辑用户个人资料 */
export const updateUserProfileAPI = (dataObj) => {
  const obj = {
    name: '',
    gender: 0,
    birthday: '',
    real_name: '',
    intro: ''
  }
  // 遍历obj
  for (const index in obj) {
    if (dataObj[index] === undefined) {
      delete obj[index]
    } else {
      obj[index] = dataObj[index]
    }
  }
  return axios({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: obj
  })
}

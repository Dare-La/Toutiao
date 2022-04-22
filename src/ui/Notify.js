// 基于vant进行二次封装
// 用于以后需要更改通知图标的方式
// import { Notify } from 'vant'

// export default Notify

import { Toast } from 'vant'
// 外面传进来的值不一样时,需要进行判断
export default ({ type, message }) => {
  if (type === 'warning') {
    type = 'fail'
  }
  Toast({
    type,
    message
  })
}

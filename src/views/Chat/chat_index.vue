<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="小思同学"
    ></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(item,index) in list" :key="index">
        <!-- 左侧是机器人小思 -->
        <div class="chat-item left" v-if="item.name !== 'me'">
          <van-image
            fit="cover"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div class="chat-pao">{{item.msg}}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-else>
          <div class="chat-pao">{{item.msg}}</div>
          <van-image
            fit="cover"
            round
            :src="$store.state.userPhoto"
          />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field placeholder="说点什么..." v-model="word" @keyup.enter="sendMsgFn">
        <template #button>
          <span style="font-size: 12px; color: #999" @click="sendMsgFn">发送</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'
import { getToken } from '@/utils/token'
export default {
  name: 'Chat',
  data () {
    return {
      word: '', // 输入框的内容
      // 所有的聊天消息
      list: [
        // 只根据 name 属性，即可判断出这个消息应该渲染到左侧还是右侧
        { name: 'xs', msg: 'hi,你好！我是小思' },
        { name: 'me', msg: '我是编程小王子' }
      ],
      socket: null // socket实例
    }
  },
  created () {
    this.socket = io('ws://geek.itheima.net', {
      query: {
        token: getToken() // 拿到token
      },
      transports: ['websocket']
    })
    // 测试连接,connect是内置固定的连接事件
    this.socket.on('connect', () => {
      console.log('连接成功')
    })
    // 拿到服务器传过来的,obj是服务器返回的一个对象，包含msg聊天内容和timestamp时间戳
    this.socket.on('message', (obj) => {
      this.list.push({ // 存入到数组中
        name: 'xs',
        msg: obj.msg
      })

      // 拿到数据后获取到最后一条数据，滚动到底部,数据是异步更新回来的，在这之前已经拿到了最后一个的div,
      // 所以需要把拿到最后一个DOM也做成异步
      this.$nextTick(() => {
        const theDiv = document.querySelector('.chat-list>div:last-child')
        theDiv.scrollIntoView({
          behavior: 'smooth'
        })
      })
    })
  },
  methods: {
    // 发送消息
    sendMsgFn () {
      // 从客户端向服务器发送数据
      // socket实例.emit() 用于向服务器发送消息
      this.socket.emit('message', {
        msg: this.word, // 获取当前输入框输入的内容
        timestamp: new Date().getTime() // 获取当前的时间戳
      })
      // 把输入的内容显示到页面
      this.list.push({ // 将内容添加到数组
        name: 'me',
        msg: this.word
      })
      // 清空输入框
      this.word = ''

      // 拿到数据后获取到最后一条数据，滚动到底部,数据是异步更新回来的，在这之前已经拿到了最后一个的div,
      // 所以需要把拿到最后一个DOM也做成异步
      this.$nextTick(() => {
        const theDiv = document.querySelector('.chat-list>div:last-child')
        theDiv.scrollIntoView({
          behavior: 'smooth'
        })
      })
    }
  },
  destroyed () {
    // 组件销毁的时候要关闭连接，避免资源浪费
    this.socket.close()
    this.socket = null
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>

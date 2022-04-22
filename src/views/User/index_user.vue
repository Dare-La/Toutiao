<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="objUser.photo" alt="" class="avatar" />
        </template>
        <template #title>
          <span :class="objUser.name">用户名</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ objUser.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ objUser.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ objUser.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_edit"/>
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat"/>
      <van-cell
        icon="warning-o"
        title="退出登录"
        is-link
        @click="quiteLoginFn"
      />
    </van-cell-group>
  </div>
</template>

<script>
import { getUserInfoAPI } from '@/api/index'
import { Dialog } from 'vant'
import { removeToken } from '@/utils/token.js'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      objUser: {}
    }
  },
  async created () {
    const res = await getUserInfoAPI()
    console.log(res)
    this.objUser = res.data.data
    // vuex直接使用的方式
    // this.$store.commit('SET_USERPHOTO', this.objUser.photo)
    this.SET_USERPHOTO(this.objUser.photo)
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO']), // 映射
    quiteLoginFn () {
      Dialog.confirm({
        message: '是否退出登录'
      }).then(() => {
        // 成功退出之后要清空当前的token，跳转到登陆页面
        removeToken()
        this.$router.replace('/login')
      })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style scoped lang="less">
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>

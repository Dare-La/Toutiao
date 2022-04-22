<template>
  <div>
      <van-nav-bar
  title="黑马头条"
/>
<!--
  v-form是整个表单
  @submit是提交表单验证的事件
-->
<van-form @submit="onSubmit">
  <!--
    每个Field组件代表一个表单项
    v-model是当前输入的值
    name是名称，提交表单的标识符
    左label是左侧文本
    rules是校验规则，这里是动态属性，= 号右边是一个表达式
   -->
  <van-field
    v-model="user.mobile"
    required
    name="mobile"
    label="手机号"
    placeholder="请输入11位手机号码"
    :rules="[{ required: true, message: '请输入正确的手机号',pattern : /^1[2-9]\d{9}$/ }]"
  />
  <van-field
    v-model="user.code"
    required
    type="password"
    name="code"
    label="密码"
    placeholder="密码"
    :rules="[{ required: true, message: '请填写正确的密码',pattern:/^\d{6}$/ }]"
  />
  <div style="margin: 16px;">
    <!--
      round是否为圆形按钮，:round="true"
      block是否为块级元素
      native-type是原生button上的type属性
     -->
    <van-button
    round
    block
    type="info"
    native-type="submit"
    :loading = 'isLoading'
    :disabled = 'isLoading'
    loading-text="加载中..."
    >提交</van-button>
  </div>
</van-form>
  </div>
</template>

<script>
import { LoginAPI } from '@/api/index'
import Notify from '@/ui/Notify'
import { setToken } from '@/utils/token'
import { setStorage } from '@/utils/storage'
export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '13888888888',
        code: '246810'
      },
      isLoading: false
    }
  },
  methods: {
    async onSubmit (values) {
      /* 启动加载状态 */
      this.isLoading = true
      try {
        console.log('submit', values)
        const res = await LoginAPI(this.user)
        console.log(res)
        // 将token存储到本地
        setToken(res.data.data.token)
        // 将refresh_token存储到本地
        setStorage('refresh_token', res.data.data.refresh_token)

        // 成功通知
        Notify({ type: 'success', message: '登陆成功' })
        // 登陆成功跳转
        this.$router.replace({
          path: this.$route.query.path || '/layout/home'
        })
      } catch (error) { // 捕获错误并提示
        Notify({
          type: 'warning',
          message: '账号或密码错误',
          color: '255, 98, 96',
          background: '255, 98, 96'
        })
      }
      /* 登陆/捕获完成后，禁用加载状态 */
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang='less'>
// /* lang='less' 指当前style标签内是less语法 */
//   .van-nav-bar{
//     background-color: #007bff;
//   }
//   /* /deep/ 是把hash值加到前面进行匹配类名 */
//  /deep/ .van-nav-bar__title{
//      /* 此选择器属于组件内部，scoped只对当前组件有效 */
//     color: white;
//   }
</style>

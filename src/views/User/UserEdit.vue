<template>
  <div>
    <div class="user-edit-container">
      <!-- Header 区域 -->
      <van-nav-bar
        title="编辑资料"
        left-arrow
        @click-left="$router.back()"
        fixed
      />

      <!-- 用户资料 -->
      <van-cell-group class="action-card">
        <van-cell title="头像" is-link center>
          <template #default>
            <van-image
              round
              class="avatar"
              :src="userEditObj.photo"
              @click="changeImgFn"
            />
            <input
              type="file"
              v-show="false"
              ref="iptFile"
              accept="image/*"
              @change="onFileChange"
            />
          </template>
        </van-cell>
        <van-cell
          title="名称"
          is-link
          :value="userEditObj.name"
          @click="clickUserName"
        />
        <van-cell title="生日" is-link :value="userEditObj.birthday" @click="birthdayFn"/>
      </van-cell-group>
    </div>
    <!-- 编辑名称弹窗 -->
    <van-dialog
      v-model="show"
      title="标题"
      show-cancel-button
      :beforeClose="closeBeforeFn"
    >
      <input type="text" v-model="inputUserName" class="inputDialog" v-fofo />
    </van-dialog>

    <van-popup v-model="TimePickershow" position="bottom" round>
    <!-- 时间选择 -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="cancelTimeFn"
      @confirm="confirmTimeFn"
    />
    </van-popup>
  </div>
</template>

<script>
import {
  getProfileAPI,
  editUserPhotoAPI,
  updateUserProfileAPI
} from '@/api/index'
import Notify from '@/ui/Notify'
import { TimeFormDate } from '@/utils/date.js'
export default {
  data () {
    return {
      userEditObj: {},
      show: false,
      inputUserName: '',
      TimePickershow: false, // 控制时间组件是否显示
      minDate: new Date(1920, 1, 1), // 最小 年 时间
      maxDate: new Date(), // 最大 年 时间
      currentDate: new Date(2021, 0, 17) // 默认显示的值，这里应该是用户的生日
    }
  },
  name: 'UserEdit',
  async created () {
    const res = await getProfileAPI()
    // console.log(res)
    this.userEditObj = res.data.data
  },
  methods: {
    async onFileChange (e) {
      // 用户没有选择图片文件
      if (e.target.files.length === 0) return
      console.log(e.target.files[0]) // 拿到文件对象
      const FmD = new FormData()
      FmD.append('photo', e.target.files[0]) // 往formdata对象中添加键值对，photo是接口文档指定的参数名
      const res = await editUserPhotoAPI(FmD)
      this.userEditObj.photo = res.data.data.photo // 将图片地址替换
      console.log(res)
    },
    // 更换图片
    changeImgFn () {
      this.$refs.iptFile.click() // 通过ref拿到input标签，然后触发它对应的click方法,模拟标签的事件触发
    },
    // 点击修改名称方法
    clickUserName () {
      this.show = true
      this.inputUserName = this.userEditObj.name
    },
    // 确认点击弹窗方法
    async closeBeforeFn (action, done) {
      // aciton是确认和取消的两个值,done用于控制弹窗的关闭
      if (action === 'confirm') {
        // 点击了确认
        // 定义一个1-7位的中英文数字的正则
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.inputUserName) === true) {
          // 如果匹配成功
          await updateUserProfileAPI({
            name: this.inputUserName // 传入输入框的值
          })
          this.userEditObj.name = this.inputUserName // 更新用户名字
          done() // 弹窗关闭
        } else {
          Notify('输入格式错误,请输入1-7位中英文数字')
          done(false) // 不让弹窗关闭
        }
      } else {
        done() // 弹窗关闭
      }
    },
    // 点击显示时间
    birthdayFn () {
      this.TimePickershow = true
      this.currentDate = new Date(this.userEditObj.birthday) // 将时间格式化后给组件默认的显示
    },
    // 时间选择---取消
    cancelTimeFn () {
      this.TimePickershow = false
    },
    // 时间选择---确认
    confirmTimeFn () {
      // 把选择的时间传到后台，需要格式转换，将时间对象转换为 YYYY-MM-DD 的格式
      this.userEditObj.birthday = TimeFormDate(this.currentDate)
      this.TimePickershow = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
/deep/ .van-dialog {
  text-align: center;
  .inputDialog {
    border: none;
    text-align: center;
  }
}
</style>

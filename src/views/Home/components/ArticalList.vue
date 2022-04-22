<template>
  <div>
    <!--
      key的ID重复报错问题：
       list默认会将标签结构挂载到页面上，然后等待数据传回来填充，但是这样会导致一开始就触底，执行onLoad函数
      immediate-check：是否在初始化立即执行滚动位置检查，默认值为true
      方式一：  :immediate-check="false"
      方式二： onLoad方法中的内部，先判断allArticalList数组长度是否为0，为0说明没有数据，则return
      方式三： 不要created，因为反正一开始就要拿到数据,这样就避免了ID重复
      offset是滚动条与底部距离小于 offset 时触发load事件，类型：number | string，默认值：300
     -->
     <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finshed="finshed"
      :immediate-check="false"
      offset="300"
      finished-text="没有更多了"
      @load="onLoad"
    >

      <ArticalItem
        :art_item="item"
        v-for="item in allArticalList"
        :key="item.art_id"
        @dislike="disLikeFn"
        @reportAct="reportActFn"
        @click.native="itemClickFn(item.art_id)"
      ></ArticalItem>
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticalAPI, disLikeArticalAPI, reportArticalAPI } from '@/api/index'
import ArticalItem from '../../../components/ArticalItem.vue'
import Notify from '@/ui/Notify'
export default {
  data () {
    return {
      allArticalList: [],
      loading: false, // 控制是否加载
      finshed: false, // 控制是否已加载所有数据
      theTime: new Date().getTime(),
      isLoading: false
    }
  },
  components: {
    ArticalItem
  },
  props: {
    channelId: Number
  },

  async created () {
    this.getArticalList()
    // const res1 = await getArticalAPI({
    //   channel_id: this.channelId, // 频道ID和v-model中的active进行绑定
    //   timestamp: this.theTime
    // })
    // console.log(res1)
    // this.allArticalList = res1.data.data.results
    // this.theTime = res1.data.data.pre_timestamp // 获取当前返回结果的最后一项时间戳，赋值给theTime
  },
  methods: {
    // 封装拿请求的函数，因为多个地方使用同样的代码，代码冗余
    async getArticalList () {
      const res1 = await getArticalAPI({
        channel_id: this.channelId, // 频道ID和v-model中的active进行绑定
        timestamp: this.theTime
      })
      // console.log(res1)
      this.allArticalList = [...this.allArticalList, ...res1.data.data.results] // 合并两次获取的数据
      this.theTime = res1.data.data.pre_timestamp // 获取当前返回结果的最后一项时间戳，赋值给theTime

      this.loading = false // 执行了loading后，加载事件会默认把loading的值改为true,要改回来才会执行下一次加载
      // 判断是否加载完所有数据
      if (res1.data.data.pre_timestamp === null) {
        this.finshed = true
      }
      this.isLoading = false // 更改v-model的值
    },
    async disLikeFn (arcId) { // 不喜欢文章
      await disLikeArticalAPI(arcId)
      // console.log(getToken())
      Notify({ // 提示
        message: '反馈成功',
        color: '#fff',
        background: '#00cc00'
      })
    },
    async reportActFn (id, value) { // 举报文章
      await reportArticalAPI(id, value)
      // console.log(res)
      Notify({ // 提示
        message: '举报成功',
        color: '#fff',
        background: '#00cc00'
      })
    },
    async onLoad () {
      // 如果当前数据为空，不执行onLoad
      if (this.allArticalList.length === 0) {
        this.loading = false
        return
      }
      this.getArticalList()
      // const res1 = await getArticalAPI({
      //   channel_id: this.channelId, // 频道ID和v-model中的active进行绑定
      //   timestamp: this.theTime
      // })
      // console.log(res1)

      // this.loading = false // 执行了loading后，加载事件会默认把loading的值改为true,要改回来才会执行下一次加载
      // 判断是否加载完所有数据
      // if (res1.data.data.pre_timestamp === null) {
      //   this.finshed = true
      // }
    },
    // 下拉刷新
    async  onRefresh () {
      this.allArticalList = [] // 让当前已有的为空
      this.getArticalList()
      // const res1 = await getArticalAPI({
      //   channel_id: this.channelId, // 频道ID和v-model中的active进行绑定
      //   timestamp: new Date().getTime()
      // })
      // console.log(res1)
      // this.allArticalList = [...this.allArticalList, ...res1.data.data.results] // 合并两次获取的数据
      // this.theTime = res1.data.data.pre_timestamp // 获取当前返回结果的最后一项时间戳，赋值给theTime
      // this.isLoading = false // 更改v-model的值
    },
    itemClickFn (id) {
      this.$router.push({
        path: `/detail?art_id=${id}`
      })
    }
  }
}
</script>

<style>
</style>

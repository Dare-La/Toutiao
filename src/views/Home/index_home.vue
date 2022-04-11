<template>
  <div>
    <!-- 顶部导航栏 -->
    <div>
      <!-- fixed将组件固定在顶部 -->
      <van-nav-bar left-arrow fixed>
        <template v-slot:left>
          <img src="@/assets/logo.png" alt="" class="logo" />
        </template>
        <template #right>
          <!-- postcss只能把style里面的px转换为rem,行内样式的大小不能转换,需要手动转换,
        当前px大小/根标签文字大小37.5, 18/37.5 -->
          <van-icon name="search" size="0.48rem" color="#fff" />
        </template>
      </van-nav-bar>
    </div>
    <!-- Tab标签页 -->
    <div  class="main">
      <!--
        van-tabs是flex容器，里面是van-tab按照flex布局排列
        active是控制谁高亮显示，高亮之外的active类名都display:none
       sticky是粘性布局，当滚动超出阀值，固定在顶部
       -->
      <van-tabs v-model="active" sticky offset-top=1.226rem >
        <!-- 循环铺设数据 -->
        <van-tab  :title="item.name" v-for="item in channelList" :key="item.id">
          <ArticalList :list="allArticalList"></ArticalList>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { getUserChannelsAPI, getArticalAPI } from '@/api/index'
import ArticalList from '@/views/Home/components/ArticalList.vue'
export default {
  data () {
    return {
      active: 0,
      channelList: [], // 准备一个空的数组接收数据
      allArticalList: []
    }
  },
  components: {
    ArticalList
  },
  async created () {
    /* 获取频道列表 */
    const res = await getUserChannelsAPI()
    // console.log(res)
    this.channelList = res.data.data.channels
    /* 获取推荐新闻 */
    const res1 = await getArticalAPI({
      channel_id: 0,
      timestamp: (new Date())
    })
    console.log(res1)
    this.allArticalList = res1.data.data.results
  }
}
</script>

<style>
.logo {
  width: 100px;
  height: 30px;
}
.main{
  padding-top: 46px;
}
</style>

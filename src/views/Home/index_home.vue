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
        <!-- 放大镜搜索图标 -->
          <van-icon name="search" size="0.48rem" color="#fff" @click="searchFn"/>
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
      <van-tabs v-model="active" sticky offset-top=1.226rem @change="changeChannelFn">
        <!-- 循环铺设数据 -->
        <van-tab :name="item.id"  :title="item.name" v-for="item in channelUserList" :key="item.id">
          <ArticalList :channelId="active"></ArticalList>
        </van-tab>
      </van-tabs>
          <!-- 编辑频道图标 -->
<van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="showFn"/>
    </div>
    <!-- get-container="body" 是设置挂载点 -->
  <van-popup v-model="show" class="channel_popup" get-container="body">
    <channelEdit
     :userList="channelUserList"
     :allChannelList="uncheckChannelList"
     @addChannelFn="addFn"
     @delUserChannel = 'delChannelFn'
     @closeF='closeFn'
     ref='EdisRef'
     v-model="active"
     ></channelEdit>
  </van-popup>

  </div>
</template>

<script>
import { getUserChannelsAPI, getAllChannelsAPI, updateChannelAPI, delChannelAPI } from '@/api/index'
import channelEdit from './channelEdit.vue'
import ArticalList from '@/views/Home/components/ArticalList.vue'
export default {
  data () {
    return {
      active: 0, // 频道的id
      channelUserList: [], // 准备一个空的数组接收数据
      channeAllList: [],
      show: false,
      channelScrollObj: {} // 保存每一个滚动频道
    }
  },
  components: {
    ArticalList,
    channelEdit
  },
  async created () {
    /* 获取用户频道列表 */
    const res = await getUserChannelsAPI()
    // console.log(res)
    this.channelUserList = res.data.data.channels

    /* 获取所有频道列表 */
    const res1 = await getAllChannelsAPI()
    // console.log('---------------' + res1)
    this.channeAllList = res1.data.data.channels
    // console.log(this.channelEditList)
  },
  methods: {
    // 改变频道的时候
    changeChannelFn () {
      // 对象中保存的当前频道的滚动值，给到当前滚动距离
      // this.$nextTick(() => {
      // })
      // 频道切换的时候，会把之前所在的容器的高度改为0，所以滚动位置又回到了顶部，值也为0
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channelScrollObj[this.active]
      })
    },
    showFn () {
      this.show = true
    },
    // 添加频道
    addFn (item) {
      this.channelUserList.push(item)

      const res = updateChannelAPI({
        channels: this.channelUserList
      })
      console.log(res)
    },
    // 删除频道
    async delChannelFn (item) {
      const index = this.channelUserList.findIndex(obj => obj.id === item.id)
      console.log(index)
      const res = await delChannelAPI(index)
      console.log(res)
      // this.channelUserList.splice(index, 1)
    },
    // 关闭频道管理面板
    closeFn () {
      this.show = false
      // 利用ref属性控制子组件的变量
      this.$refs.EdisRef.isEdit = false
    },
    // 搜索
    searchFn () {
      this.$router.push('/search') // 跳转路由
    },
    // 滚动时候的监听事件
    scrollFn () {
      // 获取页面滚动的距离
      this.$route.meta.scrollT = document.documentElement.scrollTop
      // 把每一个频道的滚动距离动态添加到channelScrollObj对象中存起来
      this.channelScrollObj[this.active] = document.documentElement.scrollTop
    }
  },
  // 缓存的组件处于激活状态时
  activated () {
    console.log(this.$route)
    window.addEventListener('scroll', this.scrollFn)
    // 立刻设置当前滚动条的位置
    // document.documentElement.scrollTop = this.$route.meta.scrollT
  },
  deactivated () {
    window.removeEventListener('scroll', this.scrollFn)
  },
  computed: {
    uncheckChannelList () {
      const newArr = this.channeAllList.filter(bigItem => {
        const index = this.channelUserList.findIndex(smallItem => {
          return bigItem.id === smallItem.id
        })
        if (index > -1) {
          return false
        } else {
          return true
        }
      })
      return newArr
    }
  }
}
</script>

<style lang='less'>
.logo {
  width: 100px;
  height: 30px;
}
.main{
  padding-top: 46px;
}
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
.channel_popup{
  width: 100vw;
  height: 100vh;
}
</style>

<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>
    <!-- 搜索列表 -->
    <div>
      <!-- 加载更多 -->
      <!-- :immediate-check="false" 用于是否上来就触底 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <ArticalItem
          v-for="item in ArticalItemList"
          :key="item.art_id"
          :art_item="item"
          :isShowX="false"
          @click.native="itemClickFn(item.art_id)"
        ></ArticalItem>
      </van-list>
    </div>
  </div>
</template>

<script>
import { searchResultApi } from '@/api/index'
import ArticalItem from '@/components/ArticalItem.vue'
export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1,
      loading: false, // 控制是否触发加载事件
      finished: false, // 数据加载完毕
      ArticalItemList: []
    }
  },
  components: {
    ArticalItem
  },
  async created () {
    const res = await searchResultApi({
      page: this.page,
      // 路由传参, this.$route.params.参数名  这里的参数名就是定义规则的 :keyword 中的keyword
      q: this.$route.params.keyword
    })
    this.ArticalItemList = res.data.data.results
    console.log(res)
  },
  methods: {
    async onLoad () {
      if (this.ArticalItemList.length > 0) {
        this.page++ // 拿下一页的数据
        const res = await searchResultApi({
          page: this.page,
          // 路由传参, this.$route.params.参数名  这里的参数名就是定义规则的 :keyword 中的keyword
          q: this.$route.params.keyword
        })
        // 当拿回来的内容为空时，加载完成
        if (res.data.data.results.length === 0) {
          this.finished = true
        }
        // 把已有的列表和最新拿到的列表进行拼接
        this.ArticalItemList = [...this.ArticalItemList, ...res.data.data.results]
        this.loading = false // 继续执行加载事件
      }
    },
    // 点击进入文章详情
    itemClickFn (id) {
      this.$router.push(`/detail?art_id=${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>

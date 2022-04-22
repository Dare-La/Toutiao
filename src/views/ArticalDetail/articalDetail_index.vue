<template>
  <div>
        <!-- Header 区域 -->
    <div>
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    </div>
       <!-- Loading加载 -->
    <van-loading size="24px" color="#1989fa" v-if="Object.keys(articleObj).length === 0">加载中...</van-loading>
  <!-- 内容区和评论区 -->
<div v-else>
    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{articleObj.title}}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="articleObj.aut_name" :label="timeAgo(articleObj.pubdate)">
        <template #icon>
          <img :src="articleObj.aut_photo" alt="" class="avatar">
        </template>
        <template #default>
          <div>
            <van-button
            type="info"
            size="mini"
             v-if="articleObj.is_followed"
             @click="followedFn(false)"
             >已关注</van-button>
            <van-button
            v-else
            icon="plus"
            type="info"
            size="mini"
            @click="followedFn(true)"
            plain
            >关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="articleObj.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞
        attitude：用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞
       -->
      <div class="like-box">
        <van-button @click="likeFn(false)" icon="good-job" type="danger" size="small" v-if="articleObj.attitude === 1">已点赞</van-button>
        <van-button  @click="likeFn(true)" icon="good-job-o" type="danger" plain size="small" v-else>点赞</van-button>
      </div>
    </div>

    <!-- 评论区 -->
    <div>
      <CommentList></CommentList>
    </div>

</div>

  </div>
</template>

<script>
import { timeAgo } from '@/utils/date'
import { articleDetail, followUser, unfollowUser, likeArticleAPI, unlikeArticleAPI } from '@/api/index'
import CommentList from './CommentList.vue'
export default {
  name: 'ArticalDetail',
  data () {
    return {
      articleObj: {} // 空的对象接收数据
    }
  },
  async created () {
    // console.log(this.$route.query.art_id)
    // 传值的时候看清除是传对象
    const res = await articleDetail(
      { article_id: this.$route.query.art_id }
    )
    // console.log(res)
    this.articleObj = res.data.data
  },
  methods: {
    timeAgo, // 时间转换函数
    // 关注/取关用户
    async followedFn (bool) {
      if (bool === false) {
        // 点击 已关注 按钮，业务逻辑是取消关注,调用取消关注接口
        this.articleObj.is_followed = false
        const res = unfollowUser({
          target: this.articleObj.aut_id
        })
        console.log(res)
      } else {
        // 点击 关注 按钮 ，业务逻辑是关注用户，调用关注接口
        this.articleObj.is_followed = true
        const res = followUser({
          target: this.articleObj.aut_id
        })
        console.log(res)
      }
    },
    // 对文章喜欢
    async likeFn (bool) {
      if (bool === false) {
        // 点击 已点赞 按钮，显示点赞按钮，实现取消点赞的业务，调用取消点赞的接口
        this.articleObj.attitude = 0
        const res = await unlikeArticleAPI({
          target: this.articleObj.art_id
        })
        console.log(res)
      } else {
        // 点击 点赞 按钮，显示已点赞按钮，实现点赞的业务，调用点赞的接口
        this.articleObj.attitude = 1

        const res = await likeArticleAPI({
          target: this.articleObj.art_id
        })
        console.log(res)
      }
    }
  },
  components: {
    CommentList
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
/deep/ img{
    width: 100%;
}
/deep/ pre {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
.van-loading.van-loading--circular {
  text-align: center;
  padding-top: 100px;
}
</style>

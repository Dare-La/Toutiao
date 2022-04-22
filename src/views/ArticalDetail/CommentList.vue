<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="onLoad"
    >
      <!-- 评论列表 -->
      <div
        class="cmt-list"
        :class="{
          'art-cmt-container-1': isShow,
          'art-cmt-container-2': !isShow,
        }"
        v-for="item in commentArr"
        :key="item.com_id"
      >
        <!-- 评论的 Item 项 -->
        <div class="cmt-item">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="item.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ item.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="item.is_liking === true"
                @click="likeCommentFn(false, item)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="likeCommentFn(true, item)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ item.content }}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeAgo(item.pubdate) }}</div>
        </div>
      </div>
    </van-list>
    <!-- 发布评论 -->
    <div>
      <!-- 底部添加评论区域 - 1 短的区域-->
      <div class="add-cmt-box van-hairline--top" v-if="isShow">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="toggleComFn">发表评论</div>
        <div class="icon-box">
          <!-- 数量徽标 -->
          <van-badge :content="totalCount === 0 ? '' : totalCount" max="99">
            <van-icon
              name="comment-o"
              size="0.53333334rem"
              @click="clickCommentFn"
            />
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 长的区域-->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea
          placeholder="友善评论、理性发言、阳光心灵"
          v-fofo
          @blur="isShowBlurFn"
          v-model.trim="commentCon"
        ></textarea>
        <van-button
          type="default"
          :disabled="commentCon.length < 0"
          @click="sendFn"
          >发布</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  allCommentAPI,
  loveCommentAPI,
  disloveCommentAPI,
  sendCommentAPI
} from '@/api/index'
import { timeAgo } from '@/utils/date'
export default {
  data () {
    return {
      offset: null,
      commentCon: '', // 评论内容
      isShow: true, // 先让短的显示
      totalCount: 0, // 评论数量
      commentArr: [],
      loading: false,
      finished: false,
      lastId: null
    }
  },
  async created () {
    const res = await allCommentAPI({
      id: this.$route.query.art_id // 获取文章的id
    })
    // console.log(res)
    this.totalCount = res.data.data.total_count // 拿到评论数量
    this.commentArr = res.data.data.results
    this.lastId = res.data.data.last_id

    // 当文章评论为空的时候,显示底部加载完毕的文字
    if (this.commentArr.length === 0) {
      this.finished = true
    }
  },
  methods: {
    timeAgo,
    // 喜欢评论和不喜欢评论
    async likeCommentFn (bool, item) {
      if (bool === false) {
        // 点击了红色的喜欢按钮，取消喜欢，红色爱心消失，拿取消喜欢评论的接口
        item.is_liking = false
        const res = await disloveCommentAPI()
        console.log(res)
      } else {
        // 点击了没有红色的爱心，喜欢这个评论，红色爱心出现，拿喜欢评论的接口
        item.is_liking = true
        const res = await loveCommentAPI()
        console.log(res)
      }
    },
    // 点击进行评论
    toggleComFn () {
      this.isShow = false
    },
    // 点击评论图标跳转到评论区
    clickCommentFn () {
      // 点击之后能直接跳转到评论区第一条评论的位置(无动画的情况)
      // article-container是装文章内容的盒子
      // const articleHeight = document.querySelector('.article-container').scrollHeight
      // window.scrollTo能使网页今天滚动，只需要设置相应的坐标
      // window.scrollTo(0, articleHeight)

      // 若要实现动画效果，css和JS都可以，但是比较复杂

      // 比较方便的方法，既滚动也带动画，
      // 原生标签.scrollIntoView(),让原生的标签滚动到屏幕的最上方
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 发布评论
    async sendFn () {
      const res = await sendCommentAPI({
        id: this.$route.query.art_id, // 文章的id
        content: this.commentCon
      })
      console.log(res)
      this.commentArr.unshift(res.data.data.new_obj)
      this.totalCount++ // 评论完了让评论数量+1
      this.commentCon = '' // 评论内容清空
    },
    // 失去焦点后不先执行，让它为异步任务
    isShowBlurFn () {
      setTimeout(() => {
        this.isShow = true
      }, 0)
    },
    // 加载更多
    async onLoad () {
      if (this.commentArr.length > 0) {
        const res = await allCommentAPI({
          id: this.$route.query.art_id, // 获取文章的id
          offset: this.lastId // 分页
        })
        // console.log(res)
        this.totalCount = res.data.data.total_count // 拿到评论数量
        this.commentArr = [...this.commentArr, ...res.data.data.results]
        this.lastId = res.data.data.last_id
        if (res.data.data.last_id === null) {
          this.finished = true
        }

        this.loading = false
      } else {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
/deep/ .van-list__finished-text{
  padding-bottom: 46px;
}
</style>

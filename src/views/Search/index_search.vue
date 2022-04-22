<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <!--
        v-fofo是定义的全局指令，用于聚焦
        input事件
       -->
      <van-search
        v-model.trim="kw"
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        v-fofo
        @input="inputFn"
        @search="searchFn(kw)"
      />
    </div>

    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div
        class="sugg-item"
        v-for="(item, index) in suggestList"
        :key="index"
        v-html="lightFn(item, kw)"
        @click="clickSuggestFn(item)"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearHis"/>
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
        class="history-item"
        v-for="(item,index) in history"
        :key="index"
        @click="historyListFn(item)"
        >
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
/*
  1.搜索框输入回车进入搜索结果
  2.点击联想关键词进入搜索结果
  3.点击历史记录进入搜索结果
*/
import { searchSuggestAPI } from '@/api/index'
import { getStorage, setStorage } from '@/utils/storage'
export default {
  name: 'Search',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null,
      suggestList: [],
      history: JSON.parse(getStorage('historyInput')) || [] // 搜索历史
    }
  },
  methods: {
    inputFn () {
      // input事件是当输入框内容发生变化会触发这个函数，用定时器做节流，在计时完成之前若输入框内容发生变化，那么就要重新执行该函数，清除之前的定时器，新的定时器重新计时
      clearTimeout(this.timer)
      if (this.kw.length === 0) {
        this.suggestList = []
      } else {
        this.timer = setTimeout(async () => {
          if (this.kw.length === 0) return // 输入框为空的时候，不往下执行
          const res = await searchSuggestAPI(this.kw)
          this.suggestList = res.data.data.options
          // console.log(this.suggestList)
          // console.log(res)
          // console.log(this.kw)
        }, 500)
      }
    },
    // 关键词高亮
    lightFn (originStr, targit) {
      // orrginStr是原字符串，targit是要替换的关键词
      // return originStr.replace(targit, `<span style="color:red">${targit}</span>`)
      // 利用构造函数创建正则表达式
      const reg = new RegExp(targit, 'ig')
      return originStr.replace(reg, (mathch) => {
        return `<span style="color:red">${mathch}</span>`
      })
    },
    // 输入回车进入搜索结果
    searchFn (str) {
      if (this.kw.length !== 0) { // 不让空值保存到历史记录中
        this.history.push(str)
        // 路由跳转在侦听器之前，所以给路由跳转设置一个定时器，变成异步任务，等侦听器执行完，再执行跳转路由
        setTimeout(() => {
          this.$router.push({
            path: `/searchresult/${str}`
          })
        }, 0)
      }
    },
    // 点击联想建议进入搜索结果
    clickSuggestFn (str) {
      this.history.push(str)
      setTimeout(() => {
        this.$router.push({
          path: `/searchresult/${str}`
        })
      }, 0)
    },
    // 点击历史记录进入搜索结果
    historyListFn (str) {
      this.$router.push({
        path: `/searchresult/${str}`
      })
    },
    // 清除历史记录
    clearHis () {
      this.history = []
    }
  },
  // 侦听器侦听历史记录数组
  watch: {
    history: {
      handler () {
        // 去掉重复的历史记录
        // 在es6中，新增了 Set和Map 两种引用类型
        // Set:无序不重复的Value集合体(无下角标)
        // 特点：如果传入的数组中有重复元素，则自动清除重复，返回一个无重复的Set对象
        // 如果数组元素是对象，则比较的是对象的地址
        const theSet = new Set(this.history)
        // 将Set类型转换为数组类型 Array.from(set对象)
        const arr = Array.from(theSet)
        // 侦听某个变量值的变化
        setStorage('historyInput', JSON.stringify(arr))
        console.log(this.history)
      },
      deep: true // 因为被侦听的是数组，所以需要深度侦听
    }
  }

}
</script>
<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
}
/*后退按钮*/
.goback {
  padding-left: 14px;
}
/*搜索组件*/
.van-search {
  flex: 1;
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>

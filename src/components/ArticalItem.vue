  <template>
   <div>
  <!-- 一条文章单元格 -->
  <van-cell>
    <!-- 标题区域的插槽 -->
    <template #title>
      <div class="title-box">
        <!-- 标题 -->
        <span>{{art_item.title}}</span>
        <!-- 单图 -->
        <van-image
        lazy-load
         class="thumb"
         v-if="art_item.cover.type === 1"
         :src="art_item.cover.images[0]" alt="" />
      </div>
      <!-- 三张图 -->
      <div class="thumb-box" v-if="art_item.cover.type > 1">
        <van-image
        lazy-load
         class="thumb"
         v-for="(item,index) in art_item.cover.images" :key="index"
         :src="item" alt="" />
      </div>

    </template>
    <!-- label 区域的插槽 -->
    <template #label>
      <div class="label-box">
        <div>
          <span>{{art_item.aut_name}}</span>
          <span>{{art_item.comm_count}}</span>
          <span>{{timeChange(art_item.pubdate)}}</span>
        </div>
        <!-- 反馈按钮 -->
        <van-icon name="cross" @click.stop="show = true" v-show="isShowX"/>
      </div>
    </template>
  </van-cell>
  <!-- 反馈面板 -->
  <van-action-sheet
  v-model="show"
  :actions="actions"
   @select="onSelect"
   @cancel="cancelFn"
  :cancel-text="bottomText"
  @close="closeFn"
    />
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date.js'
import { firstActions, secondActions } from '@/api/report'
/*
反馈面板思路：
  1.先看文档，把组件用过来
  2.给小 x  绑定点击事件，然后 show = true 决定面板的显示
  3.当点击 '反馈垃圾内容' 要显示二级面板的内容，onSelect (item, index)中，item是面板name，index是下标
  4.判断当点击了'反馈垃圾内容'，即name的值为这个，更换actions中的内容为一级面板
  5.当处于二级面板时，下方取消文字变为返回，点击返回能到一级面板，且下方文字变成取消
*/
export default {
  data () {
    return {
      show: false,
      actions: firstActions,
      bottomText: '取消'
    }
  },
  props: {
    art_item: Object,
    isShowX: {
      type: Boolean,
      default: true // 当外面不传isShowX进来,默认显示 x ,因为首页还要用这个 x
    }
  },
  methods: {
    timeChange: timeAgo,
    onSelect (item, index) {
      // console.log(item)  返回值是选项名称
      // console.log(index) 返回值是下标
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // this.show = false
      /* 当点击不喜欢文章的时候，要给用户反馈提示，并且关闭面板
          思路：
          1.先在api中用写接口方法，需要外部传递文章id
          2.ActicalItem将文章id传给ArticalList，子传父
          3.父自定义事件函数中调用接口方法并给出反馈
          4.子关闭面板
        */
      if (item.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.bottomText = '返回'
      } else if (item.name === '不感兴趣') {
        this.$emit('dislike', this.art_item.art_id)
        this.show = false // 关闭面板
      } else {
        this.$emit('reportAct', this.art_item.art_id, item.value)
        this.show = false // 关闭面板
      }
    },
    cancelFn () { // 点击下方取消文字时触发
      if (this.bottomText === '返回') {
        this.show = true // 留住面板
        this.actions = firstActions // 将面板显示的内容改为一级面板内容
        this.bottomText = '取消'
      }
    },
    closeFn () { // 关闭面板时候，面板内容回到一级面板
      this.actions = firstActions
      this.bottomText = '取消'
    }

  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span{
    margin: 0 3px;
    &:first-child{
        margin-left: 0;
    }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>

<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <template #right>
        <van-icon name="cross" size="0.37333334rem" color="white" @click="closeFn"/>
      </template>
    </van-nav-bar>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span>我的频道
          <span class="small-title">
            点击{{isEdit ? '删除':'进入'  }}频道
          </span>
        </span>
        <span @click="editFn">{{isEdit ? '返回':'编辑'  }}</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col span="6"  v-for="item in userList" :key="item.id" @click="delChannel(item)">
          <div class="channel-item van-hairline--surround">
            {{item.name}}
            <!-- 删除的徽标 -->
            <van-badge color="transparent" class="cross-badge" v-show="isEdit&& item.id !== 0">
              <template #content>
                <van-icon
                  name="cross"
                  class="badge-icon"
                  color="#cfcfcf"
                  size="0.32rem"
                />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col span="6"
          v-for="item in allChannelList"
          :key="item.id"
          @click="addChannel(item)"
          >
          <div class="channel-item van-hairline--surround" >{{item.name}}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userList: Array,
    allChannelList: Array
  },
  data: function () {
    return {
      isEdit: false // 用于控制小 x 的显示和隐藏
    }
  },
  methods: {
    editFn () {
      this.isEdit = !this.isEdit // 取反显示/隐藏 x
    },
    // 添加频道
    addChannel (item) {
      if (this.isEdit === true) {
        this.$emit('addChannelFn', item)
      }
    },
    // 删除频道
    delChannel (item) {
      if (this.isEdit === true) { // 处于编辑状态
        if (item.id !== 0) { // 不能是推荐
        // this.userList.push(item)
          this.$emit('delUserChannel', item)
        }
      } else {
        // 不出现小x ，点击用户的频道，能直接跳转到对应的首页
        // 利用父组件中的子组件标签的v-model中的channelId，改变它的值就能跳转到对应的频道,v-model本身就是一个@input事件，此时@input事件对应的是channel的值,就能把item.id的值赋给channelId,从而达到改变频道的效果
        this.$emit('input', item.id)
      }
    },
    /* 关闭频道管理面板 */
    closeFn () {
      this.$emit('closeF')
    }
  }

}

</script>

<style scoped lang="less">
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 90px;
  background-color: #007bff;
  color: white;
  text-align: center;
  font-size: 14px;
  position: relative;
  .title {
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
  }
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 10px;
  color: gray;
}
</style>

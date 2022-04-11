<template>
  <div>
      <ArticalItem
       :art_item="item"
       v-for="item in list" :key="item.art_id"
      ></ArticalItem>
  </div>
</template>

<script>
import ArticalItem from './ArticalItem.vue'
export default {
  components: {
    ArticalItem
  },
  props: {
    list: Array

  }
}
</script>

<style>

</style>

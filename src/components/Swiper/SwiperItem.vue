<!--
 * @Description: 
 * @Author: astar
 * @Date: 2020-09-01 21:45:23
 * @LastEditTime: 2020-09-02 02:43:37
 * @LastEditors: astar
-->
<template>
  <div class="swiper-item" :style="styles">
    <slot></slot>
  </div>
</template>
<script>
export default {
  data () {
    return {
      offset: 0
    }
  },
  computed: {
    styles () {
      return {
        transform: `translateX(${this.offset || 0}px)`
      };
    }
  }
}
</script>
<style lang="scss" scoped>
.swiper-item {
  display: inline-block;
}
</style>

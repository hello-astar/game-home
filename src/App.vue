<!--
 * @Description: 
 * @Author: astar
 * @Date: 2020-08-31 21:44:09
 * @LastEditTime: 2020-09-02 22:18:05
 * @LastEditors: astar
-->
<template>
<div id="app" class="swiper">
  <div class="swiper-bg">
    <img :src="currentBg" alt="">
  </div>
  <nav class="swiper-nav">
    <div class="swiper-nav__name">
      <img class="logo" src="@/assets/images/icons/logo.png" alt="">
      我的游戏
    </div>
    <div class="swiper-nav__info">
      <img class="avatar" src="@/assets/images/icons/avatar.png" alt="">
      <div class="user">astar</div>
      <img class="icon" src="@/assets/images/icons/setting.png" alt="">
      <img class="icon" src="@/assets/images/icons/login.png" alt="">
      <p class="time">{{currentTime}}</p>
    </div>
  </nav>
  <main class="swiper-main">
    <swiper v-show="!showFail" class="swiper-main__content swiper-main__scroll" ref="swiper">
      <swiper-item v-for="(item) in images" :key="item.id" class="swiper-main__scroll_item" :class="{'active':isItemActive(item)}">
        <div class="img-container" @mouseover="onHover(item)" @mouseout="onLeave">
          <img class="img" :src="item.origin" alt="">
          <div class="game-label">
            <p class="left" v-show="!isItemActive(item)">{{item.label}}</p>
            <p class="right" :class="{ active:isItemActive(item) }" @click="gotoStartGame">
              <img class="icon" :src="isItemActive(item) ? require('@/assets/images/icons/gamepad2.png') : require('@/assets/images/icons/gamepad.png')" alt="">
              <template v-if="isItemActive(item)">启动游戏</template>
            </p>
          </div>
        </div>
        <p class="label">{{item.label}}</p>
      </swiper-item>
    </swiper>
    <div class="swiper-main__content swiper-main__fail" v-show="showFail">
      <p>游戏启动失败</p>
      <p class="ptxt">游戏资源需要访问网络，请检查你的本地网络连接是否正常。</p>
      <button class="button" @click="showFail=false">确定</button>
    </div>
  </main>
  <footer class="swiper-footer">
    <div class="swiper-footer__tip">
      <img class="icon" src="@/assets/images/icons/inGame.png" alt="">
      进入游戏
    </div>
  </footer>
</div>
</template>

<script>
import { IMAGES } from './config'
import Swiper from '@/components/Swiper'
import SwiperItem from '@/components/Swiper/SwiperItem'

export default {
  data () {
    return {
      images: IMAGES, // 轮播图片
      currentTime: '', // 当前时间
      currentActive: null, // 当前hover的item
      timer: null, // 用于清除settimeout
      showFail: false // 是否启动游戏失败
    }
  },
  created () {
    this.getCurrentTime()
  },
  computed: {
    currentBg () {
      return this.currentActive
        ? this.images.find(item => item.id === this.currentActive).background
        : this.images[0].background
    }
  },
  methods: {
    // 获取当前时间
    getCurrentTime () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      let now = new Date()
      let hour = now.getHours()
      let minute = now.getMinutes()
      let second = now.getSeconds()
      this.currentTime = `${hour}:${(Array(2).join('0') + minute).slice(-2)}`
      this.timer = setTimeout(this.getCurrentTime, (60 - second) * 1000)
    },
    // 鼠标hover时停止轮播
    onHover (item) {
      this.currentActive = item.id
      this.$refs.swiper.stop()
    },
    // 鼠标离开时继续轮播
    onLeave () {
      this.$refs.swiper.start()
      this.currentActive = null
    },
    // 判断当前item是否被鼠标hover
    isItemActive (item) {
      return this.currentActive === item.id
    },
    // 启动游戏
    gotoStartGame () {
      this.showFail = true
    }
  },
  // 离开页面时清除定时器
  beforeRouteLeave () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },
  components: {
    Swiper,
    SwiperItem
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/common.scss";
@import "./index.scss";
</style>
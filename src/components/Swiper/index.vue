<template>
  <div ref="wrapper" class="swiper-wrapper">
    <div ref="box"
      class="swiper-wrapper__scroll"
      :style="boxStyles"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
const name = "swiper";
export default {
  name,
  data() {
    return {
      boxWidth: 0,
      timer: null,
      disArr: [], // 记录每个子组件的宽度
      offset: 0, // 记录box偏移量
      firstIndex: 0, // 可视区域排在第一的图片的索引
      // 手指滑动参数
      touching: false, // 是否手指滑动中
      startX: 0, // touchStart
      startY: 0,
      deltaX: 0, // 滑动距离
      deltaY: 0,
      touchActiveIndex: 0, // 滑动时的activeIndex
      leftOffset: 0 // 滑动时剩下的offset
    };
  },
  props: {
    duration: { // 切换间隔
      type: Number,
      default: 1000
    },
    animationTime: { // transition时长
      type: Number,
      default: 500
    }
  },

  mounted () {
    this.initialize();
    const _this = this;
    // 切换页面时，浏览器会自动清除本页面的js缓存，比如我们在做倒计时计时器时，当你切换页面时，原来倒计时是30秒的，回来后，还是30秒。这就起不到了倒计时的功效了。
    document.addEventListener('visibilitychange', function() {
      if(document.hidden){
        //当页面切换或隐藏时触发的代码,可以用来清除定时器
        _this.stop()
      } else{
        //当这个页面重新被唤醒的时候触发的代码,可以用来重新触发定时器
        _this.start()
      }
    })
  },

  computed: {
    // 滚动box样式
    boxStyles () {
      return {
        transitionDuration: `${!this.offset || this.touching ? 0 : this.animationTime}ms`,
        transform: `translateX(${this.offset}px)`
      };
    },
    swiperLen () {
      return this.disArr.length;
    }
  },

  methods: {
    initialize() {
      if (this.timer) this.clear();

      // box宽度大于wrapper宽度
      const wrapper = this.$refs.wrapper.getBoundingClientRect();
      const box = this.$refs.box.getBoundingClientRect();

      if (box.width <= wrapper.width) return;

      if (this.$children.length <= 1) return;

      this.boxWidth = box.width;

      this.$children.forEach(function(child) {
        child.offset = 0;
      });
      
      this.disArr = this.$children.map(item => {
        return item.$el.getBoundingClientRect().width;
      }); // 记录每个swiper-item的宽度,用于计算偏移量
      
      this.start();
    },

    // 开始滚动
    start() {
      const { duration } = this;
      if (this.timer) this.clear();
      // this.move(); // 直接滚动
      this.timer = setInterval(() => {
        this.move();
      }, duration);
    },

    // 结束滚动
    stop () {
      this.clear();
    },

    // 滚一张图片
    move() {
      this.offset += this.disArr[this.firstIndex] * -1;// 第一个
      this.firstIndex = ++this.firstIndex % this.swiperLen;
      if (this.firstIndex === 0) { // 走完一轮
        setTimeout(() => { // 为了动画衔接顺滑
          this.offset = 0;
          this.$children.forEach(item => { // 所有图片归位
            item.offset = 0;
          });
        }, this.animationTime);
      }
      if (this.firstIndex - 2 >= 0) { // 将上一张图片偏移
          this.$children[this.firstIndex - 2].offset = this.boxWidth;
      }
    },

    // 将firstIndex之前的图片offset
    offsetImgBeforeFirstIndex () {
      let i = this.firstIndex
      while (i--) {
        this.$children[i].offset = this.boxWidth;
      }
    },

    moveByTouch () {
      if (this.touching && this.deltaX < 0) {
        this.offset += this.deltaX; // 偏移box
        this.offset %= this.boxWidth;
        // 计算新的firstIndex
        let sum = 0;
        for (let j = 0; j < this.swiperLen; j++) { // 获取firstIndex
          if (sum + this.disArr[j] > Math.abs(this.offset)) {
            this.leftOffset = (sum + this.disArr[j]) - Math.abs(this.offset);
            this.firstIndex = j;
            if (this.firstIndex === 0) {
              this.offset = this.leftOffset ? -1 * this.disArr[this.firstIndex] - Math.abs(this.leftOffset) : 0; // 归位
              this.$children.forEach(item => { // 所有图片归位
                item.offset = 0;
              });
            }
            this.offsetImgBeforeFirstIndex()
            break;
          } else {
            sum += this.disArr[j];
          }
        }
      }
    },

    // 手指touchStart，获取初始点击位置
    onTouchStart(e) {
      this.stop(); // 停止轮播
      this.touching = true;
      const { clientX = 0, clientY = 0 } = e.touches && e.touches[0];
      this.startX = clientX;
      this.startY = clientY;
      this.deltaX = 0;
      this.deltaY = 0;
    },

    // // 获取偏移量,并移动图片
    onTouchMove(e) {
      const { clientX = 0, clientY = 0 } = e.touches && e.touches[0];
      this.deltaX = clientX - this.startX;
      this.deltaY = clientY - this.startY;
      this.startX = clientX;
      this.startY = clientY;

      if (Math.abs(this.deltaX) > Math.abs(this.deltaY) && Math.abs(this.deltaX) > 2) { // 手指水平滑动且至少滑动2px
        this.moveByTouch();
      }
    },

    onTouchEnd() {
      this.offset -= this.leftOffset;
      this.offset %= this.boxWidth;
      this.firstIndex = (this.leftOffset ? (++this.firstIndex) : this.firstIndex) % this.swiperLen;
      this.leftOffset = 0;
      if (this.firstIndex === 0) {
        this.offset = 0;
        this.$children.forEach(item => { // 所有图片归位
          item.offset = 0;
        });
      }
      this.offsetImgBeforeFirstIndex();
      this.start();
    },

    clear() {
      clearInterval(this.timer);
    }
  }
};
</script>
<style lang="scss" scoped>
.swiper-wrapper {
  overflow: hidden;
  &__scroll {
    display: inline-block;
    min-width: 100%;
    white-space: nowrap;
  }
}
</style>

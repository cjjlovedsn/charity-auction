<template>
  <div class="countdown">
    <div class="title">{{content}}</div>
    <div class="time">{{showTime}}</div>
  </div>
</template>

<script>
  export default {
    name: 'countdown',
    props: {
      title: {
        type: String,
        default () {
          return '倒计时：'
        }
      },
      end: {
        type: String,
        default () {
          return '已结束'
        }
      },
      time: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        now: +new Date(),
        timer: null
      }
    },
    computed: {
      content () {
        return !(this.time > 0) ? this.end : this.title
      },
      showTime () {
        let t = this.time
        let format = ''
        if (t > 0) {
          let day = Math.floor(t / 86400000)
          let hour = Math.floor((t / 3600000) % 24)
          let min = Math.floor((t / 60000) % 60)
          let sec = Math.floor((t / 1000) % 60)
          hour = hour < 10 ? '0' + hour : hour
          min = min < 10 ? '0' + min : min
          sec = sec < 10 ? '0' + sec : sec
          if (day > 0) {
            format = `${day}天${hour}小时${min}分${sec}秒`
          }
          if (day <= 0 && hour > 0) {
            format = `${hour}小时${min}分${sec}秒`
          }
          if (day <= 0 && hour <= 0) {
            format = `${min}分${sec}秒`
          }
        }
        return format
      }
    }
  }
</script>

<style lang="stylus">
  @import '~@/config/global.styl'
  .countdown
    padding: 4px;
    font-size: 20px;
    color: #666;
    border-radius: 4px;
    text-align: left;
    line-height: 1.5;
</style>
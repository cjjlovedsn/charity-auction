<template>
  <div class="container">
      <transition-group name="pieces" class="showpiece" tag="ul">
        <router-link tag="li" :to="{name: 'details', query: {src: item.src}}" v-for="(item, index) in imgs" class="item" :key="item.id">
          <div class="item-detail">
            <div class="img-box">
          	  <img src="" v-lazy="item.src" />
            </div>
            <div class="title">{{item.title}}</div>
        	  <div class="item-sub-title">{{item.info}}</div>
        	  <div class="price">{{item.price}}</div>
        	  <countdown title="距离结束：" :time="times[index]" end="已结束"></countdown>
          </div>
        </router-link>
      </transition-group>
  </div>
</template>

<script>
  import { Indicator } from 'mint-ui'
  import countdown from '@/components/countdown'
  export default {
    name: 'index',
    data () {
      return {
        imgs: [],
        now: new Date()
      }
    },
    computed: {
      times () {
        return this.imgs.map(item => {
          return new Date(item.end_date) - this.now
        })
      }
    },
    methods: {
      setTime () {
        this.now = new Date()
        requestAnimationFrame(this.setTime)
      }
    },
    components: {
      countdown
    },
    mounted () {
      Indicator.open('加载中...')
      this.$http.get('/imgs').then(res => {
        this.imgs = res.data
        Indicator.close()
      })
      requestAnimationFrame(this.setTime)
//    for (let i = 1; i <= 23; i++) {
//      this.imgs.push({
//        id: i,
//        src: require(`@/assets/${(i > 9 ? i : `0${i}`)}.jpg`),
//        title: '这是标题',
//        info: '一些描述'.repeat(10),
//        price: `$${(Math.random() * 100 + 10).toFixed(2)}`,
//        end_date: new Date().setDate(Math.round(Math.random() * 28 + 31))
//      })
//    }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/config/global.styl'
  .container
    .pieces-enter-active
    .pieces-leave-active
      transition: all 1s cubic-bezier(.55,0,.1,1);
    .pieces-enter  
    .pieces-leave-to
      opacity: 0;
      transform: translateY(30px);
    .showpiece
      .item
        float: left;
        padding: 6px;
        width 50%;
        height: 640px;
        .item-detail
          padding: 10px;
          height: 100%;
          background-color: #fff;
          .img-box
            width: 100%;
            height: 400px;
            overflow: hidden;
            overflow-x: auto;
            img
              height: 100%;
              &[lazy=loading]
                width: 100%;
                height: auto;
          .title
            margin: 10px 0;
          .item-sub-title
            margin: 10px 0;
            width: 100%;
            font-size: 12px;
            text-align: left;
            text-indent: 12px;
            overflow: hidden;
            text-overflow(2);
          .price
            text-align: left;
            color: #f00;
            border-bottom: 1px dashed #eee;
          .countdown
            margin-top: 10px;
</style>
<template>
  <div class="container">
        <mt-loadmore :bottom-method="loadMore" :bottom-all-loaded="allLoaded" ref="loadmore" @bottom-status-change="pulldownEvent">
          <transition-group name="pieces" class="showpiece clearfix" tag="ul">
            <router-link tag="li" :to="{name: 'details', params: { item }}" v-for="(item, index) in list" class="item" :key="item.item_id">
              <div class="item-detail">
                <div class="img-box">
              	  <img src="" v-lazy="item.item_img_path" />
                </div>
                <div class="title">{{item.item_name}}</div>
            	  <div class="item-sub-title">{{item.item_remark}}</div>
            	  <div class="price">￥{{item.init_price}}</div>
            	  <countdown title="距离结束：" :time="times[index]" end="已结束"></countdown>
              </div>
            </router-link>
          </transition-group>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'"><span :class="{ 'rotate': bottomStatus === 'drop' }">↑</span> 加载更多</span>
            <span v-show="bottomStatus === 'loading'">Loading...</span>
          </div>
        </mt-loadmore>
  </div>
</template>

<script>
  import { Indicator, Toast } from 'mint-ui'
  import countdown from '@/components/countdown'
  export default {
    name: 'index',
    data () {
      return {
        list: [],
        allLoaded: false, // 默认允许上拉加载
        bottomStatus: '',
        imgs: [],
        now: new Date()
      }
    },
    computed: {
      times () {
        return this.list.map(item => {
          return new Date(item.endtime) - this.now
        })
      }
    },
    methods: {
      setTime () {
        this.now = new Date()
        requestAnimationFrame(this.setTime)
      },
      loadMore () {
        this.allLoaded = true // 禁止上拉加载
        this.$http.get('/index.php/auction/editauction/editAuctionLists').then(res => {
          if (location.port === '8080') {
            res.data.forEach(function (item, index) {
              if (item.item_img_path) {
                item.item_img_path = 'http://47.94.241.38' + item.item_img_path
              }
            })
          }
          this.allLoaded = false
          Indicator.close()
          this.$refs.loadmore.onBottomLoaded()
          if (this.list.length) return // 暂无加载更多的功能
          this.list.push(...res.data)
        }).catch(err => {
          console.log(err)
          Toast('请求超时，请稍候重试')
        })
      },
      pulldownEvent (status) {
        this.bottomStatus = status
      }
    },
    components: {
      countdown
    },
    mounted () {
      Indicator.open('加载中...')
//    this.$http.get('/api/imgs').then(res => {
//      this.imgs = res.data
//      Indicator.close()
//    }).catch(err => {
//      console.log(err)
//      Toast('请求超时，请稍候重试')
//      Indicator.close()
//    })
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
            line-height: 400px;
            overflow: auto;
            img
              width: 100%;
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
<template>
  <div class="container">
        <mt-header title="公益爱拍" fixed :style="{backgroundColor: '#138a5c'}"></mt-header>
        <van-notice-bar mode="closeable" :left-icon="speaker" v-if="notice" class="notice-bar-narrow">{{ notice }}</van-notice-bar>
        <mt-loadmore :bottom-method="loadMore" :bottom-all-loaded="allLoaded" ref="loadmore" @bottom-status-change="pulldownEvent">
          <transition-group name="pieces" class="showpiece clearfix" tag="ul">
            <router-link tag="li" :to="{name: 'details', params: { item }}" v-for="(item, index) in list" class="item" :key="item.item_id">
              <div class="item-detail">
                <div class="img-box">
              	  <img src="" v-lazy="item.item_img_path[0]" />
                </div>
                <div class="title">{{item.item_name}}<span class="visit-total">{{ item.visit_num }}</span></div>
            	  <div class="max-price">当前竞拍价：<span class="price">￥{{item.max_price}}</span></div>
            	  <countdown title="距离结束：" :time="times[index]" end="已结束"></countdown>
              </div>
            </router-link>
          </transition-group>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'"><span :class="{ 'rotate': bottomStatus === 'drop' }">↑</span> 加载更多</span>
            <span v-show="bottomStatus === 'loading'">Loading...</span>
          </div>
        </mt-loadmore>
        <circle-menu type="bottom" :number="2" circle="circle" btn :colors="colors" :style="{position: 'fixed', left: 0, bottom: '30%'}" v-drag>
          <router-link to="/edit" slot="item_1" style="font-size: 10px;color:#fff">捐赠</router-link>
          <img :src="face" slot="item_2" style="width: 50%" v-tap="login"/>
        </circle-menu>
  </div>
</template>

<script>
  import { Indicator, Toast } from 'mint-ui'
  import countdown from '@/components/countdown'
  import _ from 'lodash'
  export default {
    name: 'index',
    data () {
      return {
        list: [],
        allLoaded: false, // 默认允许上拉加载
        bottomStatus: '',
        imgs: [],
        now: new Date(),
        notice: '',
        speaker: require(`@/assets/speaker.png`),
        face: require(`@/assets/face.png`),
        colors: ['#138a5c', '#26a2ff', '#e2bf40', '#26a2ff', '#26a2ff'],
        timer: null
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
      loadNotice () {
        this.$http.get('/index.php/auction/index/noticeLan?' + +new Date()).then(res => {
          if (_.isArray(res.data)) {
            this.notice = res.data.map(item => {
              return item.notice_content || ''
            }).join(' ★ ')
          }
        })
      },
      loadMore () {
        this.allLoaded = true // 禁止上拉加载
        this.$http.get('/index.php/auction/index/auctionLists?' + +new Date()).then(res => {
          this.allLoaded = false
          Indicator.close()
          this.$refs.loadmore.onBottomLoaded()
          if (this.list.length) return // 暂无加载更多的功能
          let data = res.data.map(function (val) {
            let imgPaths = val.item_img_path.match(/(\[[^\]]+\])/g)
            imgPaths = imgPaths ? JSON.parse(imgPaths[0]) : []
            val.item_img_path = imgPaths
            return val
          })
          this.list.push(...data)
        }).catch(err => {
          console.log(err)
          Indicator.close()
          Toast('请求超时，请稍候重试')
        })
      },
      pulldownEvent (status) {
        this.bottomStatus = status
      },
      login () {
        console.log(arguments)
      }
    },
    components: {
      countdown
    },
    mounted () {
      Indicator.open('加载中...')
      this.loadNotice()
      this.timer = setInterval(() => {
        this.now = new Date()
      }, 200)
    },
    destroyed () {
      clearInterval(this.timer)
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/config/global.styl'
  .container
    margin-top: 80px;
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
        height: 620px;
        .item-detail
          padding: 10px;
          height: 100%;
          background-color: #fff;
          line-height: 1.5;
          text-align: left;
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
            position: relative;
            margin: 10px 0;
            white-space: nowrap;
            padding-right: 50px;
            overflow: hidden;
            text-overflow ellipsis
            .visit-total
              position: absolute;
              top: 1em;
              right: 20px;
              min-width: 30px;
              min-height: 30px;
              font-size: 20px;
              text-align: center;
              color: #ccc;
              transform: scale(.8);
              line-height 1
              &::before
                content: '';
                position: absolute;
                top: -36px;
                left: 50%;
                width: 120%;
                height: 120%;
                transform: translate(-50%, 0);
                background-repeat: no-repeat;
                background-image: url('~@/assets/eye.png');
                background-size: 1.4rem 1.4rem;
                background-position: 50% 50%;
          .max-price
            .price
              color: #f40;
              border-bottom: 1px dashed #eee;
          .countdown
            margin-top: 10px;
</style>
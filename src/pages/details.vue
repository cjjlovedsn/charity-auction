<template>
  <transition name="detail">
    <div class="container">
      <mt-header :title="detail.item_name || '拍品详情'" fixed :style="{backgroundColor: '#138a5c'}">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
      <div class="goods-detail">
        <mt-swipe :auto="6000" class="img-box" :style="{height: maxHeight}">
          <mt-swipe-item v-for="(item, index) in detail.item_img_path" :key="index" class="img-item" :style="{lineHeight: maxHeight}">
            <img :src="item" v-tap="showImagePreview" ref="pic"/>
          </mt-swipe-item>
        </mt-swipe>
        <div class="detail-main"  v-show="!showBidModal">
          <div class="title">{{ detail.item_name }}</div>
          <div class="sub-title">{{ detail.item_remark }}</div>
          <div class="owner-name"><span>捐赠者：{{ detail.owner_name }}</span></div>
          <div class="base-price"><span>底价：</span><span class="price">￥<i>{{ detail.init_price }}</i></span></div>
          <div class="current-price"><span>当前竞拍价：</span><span class="price">￥ <i>{{ detail.max_price }}</i></span></div>
          <countdown title="距离结束：" :time="time" :style="{display: 'flex'}"></countdown>
          <div class="bidding" :class="{disabled: time < 0}" @click="openBidModal">出价</div>
        </div>
        <bidding-modal v-model="showBidModal" :base="basePrice" :lowest="1" :confirm="bitSubmit"></bidding-modal>
      </div>
      <div class="comments">
        <div class="comt-title">竞价列表</div>
        <ul class="comt-list" v-infinite-scroll="loadComt" infinite-scroll-disabled="loadDisabled" infinite-scroll-distance="10" >
          <li v-for="(item, index) in comtList" class="comt-item">
            <div class="nickname">{{item.username}}</div>
            <div class="bid">${{item.bid_price}}</div>
            <div class="comt-content">{{item.message}}</div>
            <div class="comt-date">{{item.bid_date | mmt('YYYY-MM-DD HH:mm:ss')}}</div>
          </li>
          <li class="comt-item" style="text-align: center;" v-show="loading"><mt-spinner type="fading-circle" style="display: inline-block;" color="#ccc"></mt-spinner><span>加载中...</span></li>
        </ul>
      </div>
      <!--<mt-popup v-model="showBidModal" position="right">
        <bidding-modal></bidding-modal>
      </mt-popup>-->
    </div>
  </transition>
</template>

<script>
  import countdown from '@/components/countdown'
  import biddingModal from '@/components/biddingModal'
  import { ImagePreview } from 'vant'
  import { Toast } from 'mint-ui'
  export default {
    name: 'details',
    data () {
      return {
        detail: {},
        comtList: [],
        loading: false,
        now: new Date(),
        showBidModal: false,
        loadDisabled: false,
        flag: false,
        maxHeight: 280
      }
    },
    computed: {
      time () {
        return new Date(this.detail.endtime) - this.now
      },
      basePrice () {
        return this.detail.max_price ? parseFloat(this.detail.max_price) : 0
      }
    },
    methods: {
      loadComt () {
        this.loading = true
        this.loadDisabled = true
        this.$http.get('/index.php/auction/index/lists', {
          params: {
            item_id: this.detail.item_id
          }
        }).then(res => {
          this.loading = false
          if (res.data.length) {
            this.$set(this.$data, 'comtList', res.data)
//          this.loadDisabled = false
          }
        }).catch(err => {
          console.log(err)
          this.loading = false
          this.loadDisabled = false
        })
      },
      setTime () {
        if (this.time > 0) {
          this.now = new Date()
          requestAnimationFrame(this.setTime)
        }
      },
      openBidModal () {
        if (this.time > 0) {
          this.showBidModal = true
        }
      },
      hideBidModal () {
        this.showBidModal = false
      },
      showImagePreview (e) {
        ImagePreview(this.detail.item_img_path)
      },
      bitSubmit ({ price, message }) {
        console.log(message)
        if (this.flag) return
        this.flag = true
        this.$http.get('/index.php/auction/index/save', {
          params: {
            item_id: this.detail.item_id,
            price,
            message
          }
        }).then(res => {
          let data = res.data
          let msg = typeof data.rows === 'string' ? data.rows : '操作失败'
          this.flag = false
          if (data.success) {
            msg = '出价成功'
            this.showBidModal = false
            this.disableCheck = false
            this.loadComt()
          }
          Toast({
            message: msg,
            position: 'middle',
            duration: 2000
          })
        }).catch(err => {
          console.log(err)
          Toast({
            message: '操作失败',
            position: 'middle',
            duration: 2000
          })
          this.flag = false
        })
      },
      visited () {
        this.$http.get('/index.php/auction/index/visitAdd', {
          params: {
            item_id: this.detail.item_id
          }
        })
      }
    },
    components: {
      countdown,
      biddingModal
    },
    mounted () {
      let detail = this.$route.params.item
      detail && sessionStorage.setItem('detail', JSON.stringify(detail))
      detail = detail || JSON.parse(sessionStorage.getItem('detail') || null)
      if (detail) {
        this.$set(this.$data, 'detail', detail)
        this.$nextTick(() => {
          let pics = this.$refs.pic
          if (pics.length) {
            let cw = document.body.clientWidth - 40
            this.maxHeight = pics.reduce((acc, img) => {
              return Math.max(acc, cw * img.height / img.width || 0)
            }, 0) + 'px'
          }
        })
        this.visited()
        requestAnimationFrame(this.setTime)
      } else {
        this.$router.replace({ name: 'index' })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/config/global.styl'
  .detail-enter-active
    transition: all .1s linear;
  .detail-enter
  .detail-leave-to
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  .container
    padding: 10px;
    margin-top: 80px;;
    text-align: left;
    .goods-detail
      position: relative;
      padding: 10px;
      box-shadow: 2px 3px 4px 0 #c4c4c4
      background-color: #fff;
      border-radius: 5px;
      .img-box
        width: 100%;
        height: 600px;
        padding: 20px;
        text-align: center;
        background-color: #f8f8f8;
        .img-item
          line-height: 600px;
          overflow: hidden;
          img
            width: 100%;
      div
        padding: 10px;
      .title
        padding: 10px;
        font-size: 44px;
        font-weight: 700;
        border-bottom: 1px solid #ccc;
      .sub-title
        font-size: 28px;
        color: #666;
        line-height: 1.5;
      .price
        font-style: normal;
        color: #f40;
        font-size: 44px;
        i
          font-weight: 700;
      .base-price
        font-size: 28px;
      .current-price
        font-size: 32px;
      .bidding
        position: absolute;
        bottom: 20px;
        right: 40px;
        padding: 0;
        width: 100px;
        height: 60px;
        line-height: 60px;
        border: 1px solid #138a5c;
        background-color: #138a5c;
        border-radius: 3px;
        color: #fff;
        text-align: center;
        &.disabled
          border: 1px solid #ccc;
          background-color: #ccc;
          color: #999;
    .comments
      margin-top: 10px;
      padding: 10px;
      .comt-title
        margin-bottom: 5px;
        padding: 20px;
        font-size: 40px;
        border-bottom: 3px solid #e8e8e8;
        background-color: #fff;
        border-radius: 5px;
      .comt-list
        .comt-item
          margin-bottom: 10px;
          padding: 5px;
          background-color: #fff;
          /*box-shadow: 0 1px 2px 0 #999;*/
          /*border-bottom: 1px dashed #e4e4e4;*/
          border-radius: 5px;
          div
            padding: 10px 5px;
          .nickname
            float: left;
            margin-right: 10px;
          .bid
            color: #f40;
</style>
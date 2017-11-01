<template>
  <div class="container">
    <div class="goods-detail" v-if="detail">
      <img src="" v-lazy="detail.item_img_path"/>
      <div class="detail-main"  v-show="!showBidModal">
        <div class="title">{{ detail.item_name }}</div>
        <div class="sub-title">{{ detail.item_remark }}</div>
        <div class="base-price"><span>底价：</span><i class="price">￥{{ detail.init_price }}</i></div>
        <div class="current-price"><span>当前竞拍价：</span><i class="price">$1000.00</i></div>
        <countdown title="距离结束：" :time="time"></countdown>
        <div class="bidding" :class="{disabled: time < 0}" @click="openBidModal">出价</div>
      </div>
      <bidding-modal v-model="showBidModal" :base="1000" :lowest="10"></bidding-modal>
    </div>
    <div class="comments">
      <div class="comt-title">评论区</div>
      <ul class="comt-list" v-infinite-scroll="loadComt" infinite-scroll-disabled="loading" infinite-scroll-distance="10" >
        <li class="comt-item">
          <div class="nickname">鹅粒思</div>
          <div class="bid">￥10000</div>
          <div class="comt-content">还有更高的吗！！！</div>
          <div class="comt-date">2017-10-24</div>
        </li>
        <li class="comt-item">
          <div class="nickname">秋刀鱼</div>
          <div class="bid">￥1000</div>
          <div class="comt-content">很不错啊！！！</div>
          <div class="comt-date">2017-10-24</div>
        </li>
        <li v-for="(item, index) in comtList" class="comt-item">
          <div class="nickname">{{item.nickname}}</div>
          <div class="bid">${{item.bid}}</div>
          <div class="comt-content">{{item.content}}</div>
          <div class="comt-date">{{item.comt_date | mmt('YYYY-MM-DD HH:mm:ss')}}</div>
        </li>
        <li class="comt-item" style="text-align: center;" v-show="loading"><mt-spinner type="fading-circle" style="display: inline-block;" color="#ccc"></mt-spinner><span>加载中...</span></li>
      </ul>
    </div>
    <!--<mt-popup v-model="showBidModal" position="right">
      <bidding-modal></bidding-modal>
    </mt-popup>-->
  </div>
</template>

<script>
  import countdown from '@/components/countdown'
  import biddingModal from '@/components/biddingModal'
  export default {
    name: 'details',
    data () {
      return {
        detail: {},
        comtList: [],
        id: 0,
        loading: false,
        now: new Date(),
        showBidModal: false,
        price: 0
      }
    },
    computed: {
      time () {
        return new Date(this.detail.endtime) - this.now
      }
    },
    methods: {
      loadComt () {
        this.loading = true
        this.$http.get('/api/comments', {
          params: {id: this.id}
        }).then(res => {
          this.comtList.push(...res.data)
          this.loading = false
          this.id++
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
      }
    },
    components: {
      countdown,
      biddingModal
    },
    mounted () {
      let detail = this.$route.params.item
      detail && sessionStorage.setItem('item', JSON.stringify(detail))
      detail = detail || JSON.parse(sessionStorage.getItem('item') || null)
      if (detail) {
        this.$set(this.$data, 'detail', detail)
        requestAnimationFrame(this.setTime)
      } else {
        this.$router.replace({ name: 'index' })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/config/global.styl'
  .container
    padding: 10px;
    text-align: left;
    .goods-detail
      position: relative;
      padding: 10px;
      box-shadow: 2px 3px 4px 0 #c4c4c4
      background-color: #fff;
      border-radius: 5px;
      img
        width: 100%;
      div
        padding: 10px;
      .title
        padding: 10px;
        font-size: 32px;
        font-weight: 700;
      .sub-title
        font-size: 28px;
        color: #666;
      .price
        font-style: normal;
        color: #f00;
      .base-price
        font-size: 30px;
      .bidding
        position: absolute;
        bottom: 20px;
        right: 40px;
        padding: 0;
        width: 100px;
        height: 60px;
        line-height: 60px;
        border: 1px solid #33a537;
        background-color: #33a537;
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
            color: #f00;
</style>
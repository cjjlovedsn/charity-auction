<template>
  <div class="container">
    <div class="goods-detail">
      <img :src="src"/>
      <div class="title">一个标题</div>
      <div class="sub-title">一些描述一些描述一些描述一些描述一些描述一些描述一些描述一些描述一些描述</div>
      <div class="base-price"><span>底价：</span><i class="price">$100.00</i></div>
      <div class="current-price"><span>当前竞拍价：</span><i class="price">$1000.00</i></div>
      <div class="bidding">出价</div>
    </div>
    <div class="comments">
      <div class="comt-title">评论区</div>
      <ul class="comt-list" v-infinite-scroll="loadComt" infinite-scroll-disabled="loading" infinite-scroll-distance="10" >
        <li v-for="(item, index) in comtList" class="comt-item">
          <div class="nickname">{{item.nickname}}</div>
          <div class="bid">${{item.bid}}</div>
          <div class="comt-content">{{item.content}}</div>
          <div class="comt-date">{{item.comt_date}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'details',
    data () {
      return {
        src: '',
        comtList: [],
        id: 0,
        loading: false
      }
    },
    methods: {
      loadComt () {
        this.loading = true
        this.$http.get('/comments', {
          params: {id: this.id}
        }).then(res => {
          this.comtList.push(...res.data)
          this.loading = false
          this.id++
        })
      }
    },
    mounted () {
      let src = this.$route.query.src
      if (src) {
        this.src = src
      }
//    this.loadComt()
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
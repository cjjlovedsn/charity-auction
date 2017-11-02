<template>
  <div class="container">
    <mt-header title="拍品一览" fixed>
      <router-link to="/" slot="left">
        <mt-button icon="back">首页</mt-button>
      </router-link>
    </mt-header>
    <mt-loadmore :bottom-method="loadMore" :bottom-all-loaded="allLoaded" ref="loadmore" @bottom-status-change="pulldownEvent">
      <ul class="list">
        <li v-for="(item, index) in list">
          <div class="img-box">
            <img src="" v-lazy="item.item_img_path"/>
          </div>
          <div class="detail">
            <div class="name">名称：{{ item.item_name }}</div>
            <div class="desc">详情：{{ item.item_remark }}</div>
            <div class="init_price">底价：{{ item.init_price }}</div>
            <div class="endtime">截止：{{ item.endtime }}</div>
          </div>
          <div class="tools">
            <router-link tag="div" class="btn edit" :to="{name: 'edit', params: {detail: item}}">编辑</router-link>
            <div class="btn del" @click="delEvent(item.item_id)">删除</div>
          </div>
        </li>
      </ul>
      <div slot="bottom" class="mint-loadmore-bottom">
        <span v-show="bottomStatus !== 'loading'"><span :class="{ 'rotate': bottomStatus === 'drop' }">↑</span> 加载更多</span>
        <span v-show="bottomStatus === 'loading'">Loading...</span>
      </div>
    </mt-loadmore>
    <router-link tag="div" class="add-item" :to="{name: 'edit', params: {add: true}}"><span>+添加拍品</span></router-link>
  </div>
</template>

<script>
  import { MessageBox, Toast } from 'mint-ui'
  export default {
    name: 'list',
    data () {
      return {
        list: [],
        allLoaded: false, // 默认允许上拉加载
        bottomStatus: ''
      }
    },
    methods: {
      loadMore () {
        this.allLoaded = true // 禁止上拉加载
        this.$http.get('/index.php/auction/editauction/editAuctionLists?' + +new Date()).then(res => {
          if (location.port === '8080') {
            res.data.forEach(function (item, index) {
              if (item.item_img_path) {
                item.item_img_path = 'http://47.94.241.38' + item.item_img_path
              }
            })
          }
          this.allLoaded = false
          this.$refs.loadmore.onBottomLoaded()
          if (this.list.length) return // 暂无加载更多的功能
          this.list.push(...res.data)
        }).catch(err => {
          console.log(err)
        })
      },
      pulldownEvent (status) {
        this.bottomStatus = status
      },
      delEvent (id) {
        MessageBox({
          title: '提示',
          message: '确定删除这条拍品吗？',
          showCancelButton: true
        }).then(type => {
          if (type === 'confirm') {
            this.$http.get('/index.php/auction/editauction/delete', {
              params: {
                item_id: id
              }
            }).then(res => {
              let data = res.data
              let msg = typeof data.rows === 'string' ? data.rows : '操作失败'
              if (data.success) {
                msg = '删除成功'
                let index = this.list.findIndex(function (item) {
                  return item.item_id === id
                })
                this.list.splice(index, 1)
              }
              Toast({
                message: msg,
                position: 'middle',
                duration: 2000
              })
            })
          }
        })
      }
    },
    mounted () {
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/config/global.styl'
  .container
    text-align: left;
    .add-item
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 100px;
      color: #fff;
      font-size: 30px;
      span
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: #33a537;
        border-radius: 5px;
    .list
      margin: 120px 0;
      li
        display: flex;
        margin: 20px 0;
        padding: 10px;
        flex-direction: row;
        flex-wrap: nowrap;
        background-color: #fff;
        border-bottom: 1px solid #eee;
        .img-box
          flex: 1;
          height: 140px;
          line-height: 140px;
          overflow: auto;
        .detail
          flex: 4;
        .tools
          display: flex;
          flex: 2;
          .btn
            display: flex;
            align-items:center;
            justify-content: center;
            flex: 1;
            height: 100%;
            min-height: 100px;
            background-color: #54c2ec;
            border-radius: 3px;
            color: #fff;
            text-align: center;
          .del
            background-color: #ccc;
            border-radius: 0 10px 10px 0;
          .edit
            border-radius: 10px 0 0 10px;
    img
      width: 100%;
</style>
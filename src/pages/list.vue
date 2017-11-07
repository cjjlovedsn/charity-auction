<template>
  <div class="container">
    <mt-header title="拍品一览" fixed>
      <router-link to="/" slot="left">
        <mt-button icon="back">首页</mt-button>
      </router-link>
    </mt-header>
    <mt-loadmore :bottom-method="loadMore" :bottom-all-loaded="allLoaded" ref="loadmore" @bottom-status-change="pulldownEvent">
      <ul class="list">
        <li v-for="(item, index) in list" :key="index">
          <mt-cell-swipe :right="[{content: '删除',style: {backgroundColor: '#f40',color: '#fff'},handler () {deleteItem(item.item_id, index)}}]">
            <router-link :to="{ name: 'edit', params: {detail: item }}">
              <div class="img-box">
                <img src="" v-lazy="item.item_img_path[0]"/>
              </div>
              <div class="detail">
                <div class="name">名称：{{ item.item_name }}</div>
                <div class="desc">详情：{{ item.item_remark }}</div>
                <div class="init_price">底价：{{ item.init_price }}</div>
                <div class="endtime">截止：{{ item.endtime }}</div>
              </div>
            </router-link>
            <mt-switch v-model="item.is_use" @change="changeEvent($event, item)"></mt-switch>
          </mt-cell-swipe>
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
  import _ from 'lodash'
  import { MessageBox, Toast, Indicator } from 'mint-ui'
  export default {
    name: 'list',
    data () {
      return {
        list: [],
        allLoaded: false, // 默认允许上拉加载
        bottomStatus: '',
        loading: false
      }
    },
    watch: {
      loading: {
        handler (val) {
          (val && Indicator.open('Loading...')) || Indicator.close()
        }
      }
    },
    methods: {
      tip (message = '', duration = 1000) {
        Toast({
          message,
          position: 'bottom',
          duration
        })
      },
      deleteItem (id, index) {
        if (this.loading) return
        MessageBox({
          title: '提示',
          message: '确定删除这条拍品吗？',
          showCancelButton: true
        }).then(type => {
          if (type === 'confirm') {
            this.loading = true
            this.$http.get('/index.php/auction/editauction/delete', {
              params: { item_id: id }
            }).then(res => {
              let data = res.data
              if (data.success) {
                this.list.splice(index, 1)
              }
              this.loading = false // 加载结束
              this.tip(data.success ? '删除成功' : '删除失败')
            }).catch(err => {
              console.log(err)
              this.loading = false // 加载结束
              this.tip('网络错误，请稍候重试')
            })
          }
        })
      },
      loadMore () {
        this.allLoaded = true // 禁止上拉加载
        this.$http.get('/index.php/auction/editauction/editAuctionLists?' + +new Date()).then(res => {
          this.allLoaded = false
          this.$refs.loadmore.onBottomLoaded()
          if (this.list.length) return // 暂无加载更多的功能
          if (_.isArray(res.data)) {
            res.data.forEach(function (item) {
              item.is_use = item.is_use === '1'
            })
            let data = res.data.map(function (val) {
              let imgPaths = val.item_img_path.match(/(\[[^\]]+\])/g)
              imgPaths = imgPaths ? JSON.parse(imgPaths[0]) : []
              if (location.port === '8080') {
                val.item_img_path = imgPaths.map(function (path) {
                  return `http://47.94.241.38${path}`
                })
              } else {
                val.item_img_path = imgPaths
              }
              return val
            })
            this.list.push(...data)
          }
        }).catch(err => {
          console.log(err)
          this.tip('网络错误，请稍候重试')
        })
      },
      pulldownEvent (status) {
        this.bottomStatus = status
      },
      changeEvent (unchecked, item) {
        if (this.loading) {
          this.$nextTick(function () {
            item.is_use = !unchecked
          })
          return
        }
        this.loading = true
        if (item.item_id) {
          this.$http.get('/index.php/auction/editauction/isUsed', {
            params: {
              item_id: item.item_id,
              is_use: item.is_use ? 1 : 2
            }
          }).then(res => {
            this.loading = false // 加载结束
            if (res.data.success) {
              this.tip(item.is_use ? '开启成功' : '关闭成功')
            } else {
              this.tip(item.is_use ? '开启失败' : '关闭失败')
            }
          }).catch(err => {
            this.loading = false // 加载结束
            console.log(err)
            this.tip('网络错误，请稍候重试')
          })
        }
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
        background-color: #fff;
        a
          display: flex;
          flex: 5;
          flex-direction: row;
          flex-wrap: nowrap;
          .img-box
            flex: 1;
            height: 140px;
            line-height: 140px;
            overflow: auto;
          .detail
            flex: 4;
            .desc
              max-width: 440px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
        .mint-cell
          padding: 10px;
      label  
        flex: 1;
    img
      width: 100%;
</style>
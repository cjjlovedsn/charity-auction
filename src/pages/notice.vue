<template>
  <div class="notice">
    <mt-header title="公告一览" fixed>
      <router-link to="/list" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <ul class="notice-list">
      <v-longtap tag="li" :method="deleteNotice" exclude="input|textarea|label" :param="index"  v-for="(item, index) in list" :key="index" class="notice-item" :class="{disabled: item.is_use}" >
        <mt-field label="公告内容：" type="textarea" :attr="{style: 'resize: none'}" :disabled="item.is_use" :style="{backgroundColor: 'transparent'}" v-model="item.notice_content"></mt-field>
        <mt-switch v-model="item.is_use" @change="changeEvent($event, item)"></mt-switch>
      </v-longtap>
    </ul>
    <mt-button size="small" type="default" @click.native.capture="addNotice">新增一条公告</mt-button>
  </div>
</template>

<script>
  import _ from 'lodash'
  import { Toast, MessageBox, Indicator } from 'mint-ui'
  export default {
    name: 'notice',
    data () {
      return {
        list: [],
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
      fetchNoticeList () {
        this.loading = true
        this.$http.get('/index.php/auction/notice/noticelists?' + +new Date()).then(res => {
          this.loading = false // 加载结束
          if (_.isArray(res.data)) {
            res.data.forEach(function (item) {
              item.is_use = item.is_use === '1'
            })
            this.$set(this.$data, 'list', res.data)
          } else {
            this.tip('网络错误，请稍候重试')
          }
        }).catch(err => {
          console.log(err)
          this.loading = false // 加载结束
          this.tip('网络错误，请稍候重试')
        })
      },
      addNotice () {
        this.list.push({
          notice_content: '',
          is_use: false
        })
      },
      deleteNotice (event, index) {
        MessageBox({
          message: '确定删除吗？',
          showCancelButton: true
        }).then(type => {
          if (type === 'confirm') {
            this.loading = true // 加载中
            let id = this.list[index].id
            if (id) {
              this.$http('/index.php/auction/notice/noticeDelelte', {
                params: { id }
              }).then(res => {
                this.loading = false // 加载结束
                if (res.data.success) {
                  this.tip('操作成功')
                  this.list.splice(index, 1)
                } else {
                  this.tip('操作失败')
                }
              }).catch(err => {
                this.loading = false // 加载结束
                console.log(err)
                this.tip('网络错误，请稍候重试')
              })
            } else {
              this.list.splice(index, 1)
            }
          }
        })
      },
      changeEvent (unchecked, item) {
        if (this.loading) {
          this.$nextTick(() => {
            item.is_use = !unchecked
          })
          return
        }
        this.loading = true // 加载中
        if (!unchecked && !item.notice_content) {
          this.$nextTick(() => {
            item.is_use = false
            this.tip('请输入公告内容')
          })
        } else if (item.id) {
          this.$http('/index.php/auction/notice/changeOrStart', {
            params: {
              id: item.id,
              content: item.notice_content,
              is_use: item.is_use ? 1 : 2
            }
          }).then(res => {
            if (res.data.success) {
              this.tip('操作成功')
              this.fetchNoticeList()
            } else {
              this.tip('操作失败')
            }
          }).catch(err => {
            console.log(err)
            this.tip('网络错误，请稍候重试')
          })
        } else if (item.notice_content) {
          this.$http.get('/index.php/auction/notice/noticeAdd', {
            params: {
              content: item.notice_content
            }
          }).then(res => {
            if (res.data.success) {
              this.tip('操作成功')
              this.fetchNoticeList()
            } else {
              this.tip('操作失败')
            }
          }).catch(err => {
            console.log(err)
            this.tip('网络错误，请稍候重试')
          })
        }
      }
    },
    mounted () {
      this.fetchNoticeList()
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/config/global.styl'
  .notice
    .notice-list
      margin-top: 80px;
      .notice-item
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
        padding-right: 20px;
        border: 1px dashed #ddd;
        background-color: rgba(210, 210, 200, .5);
        &.disabled
          background-color: #fff;
</style>
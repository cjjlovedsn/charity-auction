<template>
  <div class="edit-container">
    <mt-header :title="defaultData.item_name || '拍品编辑'" fixed>
      <router-link :to="backUrl" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="form">
      <input type="hidden" name="item_id" id="" :value="formData.item_id" />
      <mt-field label="拍品名称" placeholder="请输入拍品名称" :attr="{name: 'item_name'}" v-model="formData.item_name"></mt-field>
      <mt-field label="拍品描述" type="textarea" placeholder="请输入拍品描述" v-model="formData.item_remark" :attr="{name: 'item_remark', style: 'resize: none'}"></mt-field>
      <mt-field label="捐赠者" placeholder="请输入捐赠者姓名" :attr="{name: 'owner_name'}" v-model="formData.owner_name"></mt-field>
      <mt-field label="拍品底价(￥)" type="number" :attr="{name: 'init_price', min: 0, step: formData.lowest_price}" v-model="formData.init_price"></mt-field>
      <!--<mt-field label="最低加价(￥)" type="number" :attr="{name: 'lowest_price', min: 0}" v-model="formData.lowest_price"></mt-field>-->
      <mt-field label="截止时间" @click.native="openPicker" readonly :value="formatEndTime(endDate)" :attr="{name: 'endtime'}"></mt-field>
      <mt-datetime-picker ref="picker" type="datetime" v-model="endDate" @confirm="" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" hour-format="{value} 时" minute-format="{value} 分"></mt-datetime-picker>
    	<mt-field label="拍品照片">
    	  <input type="file" name="file[]" id="" value="" v-on:change="uploadImg" multiple="multiple" accept="image/*" />
    	</mt-field>
  	  <mt-swipe :auto="0" class="preview">
  	    <mt-swipe-item v-for="(item, index) in preImgs" :key="index" class="preview-item">
  	      <img src="" v-lazy="item"/>
  	    </mt-swipe-item>
	    </mt-swipe>
	    <div class="footer">
        <mt-button size="large" type="primary" @click.native.capture="submit" >提交</mt-button>
        <mt-button size="large" type="default" @click.native.capture="cancel">取消</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast, MessageBox, Indicator } from 'mint-ui'
  import _ from 'lodash'
  const defaultImg = require(`@/assets/error.png`)
  const whiteList = ['item_img_path', 'endtime']
  export default {
    name: 'edit',
    data () {
      return {
        defaultData: {
          item_name: '',
          item_remark: '',
          init_price: 0,
          endtime: '',
          owner_name: '匿名'
        },
        formData: {
          item_name: '',
          item_remark: '',
          init_price: 0,
          endtime: '',
          owner_name: '匿名'
        },
        imgFiles: [],
        endDate: new Date(),
        preImgs: [defaultImg],
        rule: {
          item_name: '拍品名称不能为空',
          item_remark: '请输入拍品描述',
          init_price: '请输入起拍价',
          endtime: '请输入拍卖截止时间'
        },
        backUrl: '/',
        isChanged: false,
        loading: false
      }
    },
    computed: {
      isEdit () {
        let fd = this.formData
        return !!(fd.name || fd.remark || fd.init_price || this.preImgs.length > 1)
      }
    },
    watch: {
      formData: {
        handler (val, oldVal) {
          if (this.isChanged) return
          for (let k in val) {
            if (whiteList.indexOf(k) > -1) continue
            if (val[k] !== this.defaultData[k]) {
              this.isChanged = true
              break
            }
          }
        },
        deep: true
      },
      loading (val) {
        if (val) {
          Indicator.open('上传中...')
        } else {
          Indicator.close()
        }
      }
    },
    methods: {
      msg (message = '', duration = 2000) {
        Toast({ message, duration, position: 'bottom' })
      },
      formatEndTime (t) {
        let time = t ? this.$moment(t).format('YYYY-MM-DD HH:mm') : ''
        this.formData.endtime = time
        if (!this.defaultData.endtime) {
          this.defaultData.endtime = time
        }
        return time
      },
      uploadImg ({target}) {
        let self = this
        let files = Array.from(target.files)
        this.imgFiles = files
        this.preImgs.splice(0)
        if (typeof FileReader === 'function') {
          files.forEach(function (file, index) {
            let fr = new FileReader()
            fr.readAsDataURL(file)
            fr.onload = function () {
              self.preImgs.push(this.result)
              if (!self.isChanged) {
                self.isChanged = true
              }
            }
          })
        }
      },
      openPicker (e) {
        this.$refs.picker.open()
      },
      valide (callback) {
        let isValide = true
        for (let k in this.formData) {
          if (this.rule[k] && this.formData[k] === '') {
            callback && callback(k)
            isValide = false
            break
          }
        }
        return isValide
      },
      submit (e) {
        let isValide = true
        isValide = this.valide(k => {
          this.msg(this.rule[k])
        })
        if (isValide && this.preImgs[0] === defaultImg) {
          this.msg('请至少上传一张拍品照片')
          isValide = false
        }
        if (isValide) {
          let formData = new FormData()
          Object.keys(this.formData).forEach(name => {
            formData.append(name, this.formData[name])
          })
          this.imgFiles.forEach(img => {
            formData.append('file[]', img)
          })
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          this.loading = true
          this.$http.post('/index.php/auction/EditAuction/upload', formData, config).then(res => {
            let { success, rows } = res.data
            this.loading = false
            ;(typeof rows === 'string') && this.msg(rows)
            if (success) {
              this.isChanged = false
              this.$router.go(-1)
            }
          }).catch(err => {
            console.log(err)
            this.loading = false
            this.msg('网络错误，请稍候重试！')
          })
        }
      },
      cancel () {
        this.$router.go(-1)
      }
    },
    beforeRouteLeave (to, from, next) {
      if (this.isChanged) {
        return MessageBox({
          title: '提示',
          message: '当前编辑的信息未提交，是否放弃修改？',
          showCancelButton: true
        }).then(type => {
          if (type === 'confirm') {
            next()
          }
        })
      }
      next()
    },
    mounted () {
      let detail = this.$route.params.detail
      let item = JSON.parse(sessionStorage.getItem('item') || null)
      let add = this.$route.params.add
      if (add) {
        this.backUrl = '/list'
        sessionStorage.removeItem('item')
        return
      }
      item = detail || item
      if (item) {
        this.backUrl = '/list'
        detail && sessionStorage.setItem('item', JSON.stringify(detail))
        item.endtime = this.$moment(item.endtime).format('YYYY-MM-DD HH:mm')
        _.merge(this.formData, item)
        _.merge(this.defaultData, item)
        this.preImgs.splice(0)
        this.preImgs.push(...item.item_img_path)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/config/global.styl'
  .edit-container
    height: 100%;
    background-color: #fff;
    .form
      margin-top: 80px;
    .preview
      margin: 0 auto;
      width: 600px;
      height: 500px;
      border: 1px dashed #aaa;
      .preview-item
        padding: 10px;
        line-height: 480px;
        overflow: auto;
        img
          width: 100%;
    .footer
      padding: 20px 0;
      width: 100%;
      button
        margin: 10px 0;
</style>
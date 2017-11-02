<template>
  <div class="edit-container">
    <mt-header :title="defaultData.item_name || '拍品编辑'" fixed>
      <router-link to="/list" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <form action="/index.php/auction/EditAuction/upload" method="post" @submit="upload" enctype="multipart/form-data" name="edit">
      <input type="hidden" name="item_id" id="" :value="formData.item_id" />
      <mt-field label="拍品名称" placeholder="请输入拍品名称" :attr="{name: 'name'}" v-model="formData.item_name"></mt-field>
      <mt-field label="拍品描述" type="textarea" placeholder="请输入拍品描述" v-model="formData.item_remark" :attr="{name: 'remark', style: 'resize: none'}"></mt-field>
      <mt-field label="拍品底价(￥)" type="number" :attr="{name: 'init_price', min: 0, step: formData.lowest_price}" v-model="formData.init_price"></mt-field>
      <!--<mt-field label="最低加价(￥)" type="number" :attr="{name: 'lowest_price', min: 0}" v-model="formData.lowest_price"></mt-field>-->
      <mt-field label="截止时间" @click.native="openPicker" readonly :value="formatEndTime(endDate)" :attr="{name: 'end_time'}"></mt-field>
      <mt-datetime-picker ref="picker" type="datetime" v-model="endDate" @confirm="" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" hour-format="{value} 时" minute-format="{value} 分"></mt-datetime-picker>
    	<mt-field label="拍品照片">
    	  <input type="file" name="file" id="" value="" v-on:change="uploadImg" multiple="multiple" accept="image/*" />
    	</mt-field>
  	  <mt-swipe :auto="0" class="preview">
  	    <mt-swipe-item v-for="(item, index) in preImgs" :key="index" class="preview-item">
  	      <img src="" v-lazy="item"/>
  	    </mt-swipe-item>
	    </mt-swipe>
	    
    	<input type="submit" value="提交"/>
    </form>
    <!--<iframe id="id_iframe" name="nm_iframe" style="display:none;"></iframe>-->
  </div>
</template>

<script>
  import { Toast, MessageBox } from 'mint-ui'
  import _ from 'lodash'
  const defaultImg = require(`@/assets/error.png`)
  export default {
    name: 'edit',
    data () {
      return {
        defaultData: {
          item_name: '',
          item_remark: '',
          init_price: 0,
          endtime: ''
        },
        formData: {
          item_name: '',
          item_remark: '',
          init_price: 0,
          endtime: ''
        },
        endDate: new Date(),
        preImgs: [defaultImg],
        rule: {
          item_name: '拍品名称不能为空',
          item_remark: '请输入拍品描述',
          init_price: '请输入起拍价',
          endtime: '请输入拍卖截止时间'
        }
      }
    },
    computed: {
      isEdit () {
        let fd = this.formData
        return !!(fd.name || fd.remark || fd.init_price || this.preImgs.length > 1)
      }
    },
    methods: {
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
        this.preImgs.splice(0)
        if (typeof FileReader === 'function') {
          files.forEach(function (file, index) {
            let fr = new FileReader()
            fr.readAsDataURL(file)
            fr.onload = function () {
              self.preImgs.push(this.result)
            }
          })
        }
      },
      openPicker (e) {
        this.$refs.picker.open()
      },
      valide (callback) {
        let isValid = false
        for (let k in this.formData) {
          if (this.rule[k] && this.formData[k] === '') {
            callback && callback(k)
            isValid = true
            break
          }
        }
        return isValid
      },
      upload (e) {
        let isValid = false
        isValid = this.valide(k => {
          Toast({
            message: this.rule[k],
            position: 'middle',
            duration: 2000
          })
        })
        if (!isValid && this.preImgs[0] === defaultImg) {
          Toast({
            message: '请至少上传一张拍品照片',
            position: 'middle',
            duration: 2000
          })
          isValid = true
        }
        if (isValid) {
          e.preventDefault()
        } else {
          console.log(1)
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      for (let k in this.defaultData) {
        if (this.formData[k] !== this.defaultData[k]) {
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
      }
      next()
    },
    mounted () {
      let detail = this.$route.params.detail
      let item = JSON.parse(sessionStorage.getItem('item') || null)
      let add = this.$route.params.add
      if (add) {
        sessionStorage.removeItem('item')
        return
      }
      item = detail || item
      if (item) {
        detail && sessionStorage.setItem('item', JSON.stringify(detail))
        item.endtime = this.$moment(item.endtime).format('YYYY-MM-DD HH:mm')
        this.$set(this.$data, 'formData', _.clone(item))
        this.$set(this.$data, 'defaultData', _.clone(item))
        this.preImgs[0] = item.item_img_path
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/config/global.styl'
  .edit-container
    height: 100%;
    background-color: #fff;
    form[name=edit]
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
    input[type=submit]
      display: flex;
      align-items: center;
      justify-content: center;
      width: 300px;
      height: 100px;
      margin: 20px auto;
      background-color: #33a537;
      border: 0;
      color: #fff;
      font-size: 40px;
      font-weight: 700;
      letter-spacing: 20px;
      border-radius: 5px;
</style>
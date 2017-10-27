<template>
  <div class="edit-container">
    <mt-header title="拍品编辑"></mt-header>
    <form action="/index.php/auction/EditAuction/upload" method="post">
      <mt-field label="拍品名称" placeholder="请输入拍品名称" :attr="{name: 'name'}"></mt-field>
      <mt-field label="拍品描述" type="textarea" placeholder="请输入拍品描述" :attr="{name: 'desc', style: 'resize: none'}"></mt-field>
      <mt-field label="拍品底价(￥)" type="number" :attr="{name: 'price', min: 0}"></mt-field>
      <mt-field label="截止时间" @click.native="openPicker" readonly :value="endDate" :attr="{name: 'end_date'}"></mt-field>
      <mt-datetime-picker ref="picker" type="datetime"
         v-model="pickerValue"
          year-format="{value} 年"
           month-format="{value}月"
            date-format="{value}日"
             hour-format="{value}时"
              minute-format="{value}分" @confirm=""></mt-datetime-picker>
    	<mt-field label="拍品照片">
    	  <input type="file" name="pic" id="" value="" v-on:change="uploadImg" multiple="multiple" accept="image/*" />
    	</mt-field>
  	  <mt-swipe :auto="0" class="preview">
  	    <mt-swipe-item v-for="(item, index) in preImgs" :key="index" class="preview-item">
  	      <img :src="item"/>
  	    </mt-swipe-item>
	    </mt-swipe>
	    
    	<input type="submit" value="提交"/>
    </form>
    <!--<iframe id="id_iframe" name="nm_iframe" style="display:none;"></iframe>-->
  </div>
</template>

<script>
  const defaultImg = require(`@/assets/error.png`)
  export default {
    name: 'edit',
    data () {
      return {
        username: '',
        pickerValue: new Date(),
        preImgs: [defaultImg]
      }
    },
    computed: {
      endDate () {
        return this.$moment(this.pickerValue).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    methods: {
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
      openPicker () {
        console.log('1')
        this.$refs.picker.open()
      }
    },
    mounted () {
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/config/global.styl'
  .edit-container
    height: 100%;
    .preview
      height: 500px;
      background-color: #fff;
      border: 1px dashed #aaa;
      .preview-item
        padding: 10px;
        img
          height: 100%;
</style>
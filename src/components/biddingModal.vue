<template>
  <transition name="bidding">
    <div class="bidding-modal clearfix" v-show="value">
      <div class="header">竞拍出价</div>
      <div class="content">
        <mt-field label="出价(￥)：" type="number" :attr="{name: 'price', min: 0}" v-model.trim="price" @blur.native.capture="limitNumber" @focus.native.capture="selectAll"></mt-field>
        <mt-field label="留言：" type="textarea" placeholder="" v-model="comt" @focus.native.capture="selectAll" :attr="{name: 'comt', style: 'resize: none'}"></mt-field>
      </div>
      <div class="footer pull-right">
        <mt-button size="small" type="primary" @click.native.capture="comfirm">确定</mt-button>
        <mt-button size="small" type="default"@click.native.capture="cancel">取消</mt-button>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'bidding',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      base: {
        default: 0
      },
      lowest: {
        default: 0
      }
    },
    data () {
      return {
        price: this.base + this.lowest,
        comt: ''
      }
    },
    methods: {
      selectAll ({ target }) {
        setTimeout(() => {
          target.select()
        }, 0)
      },
      limitNumber ({ target }) {
//      let reg = /^\d+(?:.\d+)?$/
        let lowestValue = this.base + this.lowest
        if (!(target.value > lowestValue)) {
          setTimeout(() => {
            target.value = lowestValue
          }, 0)
        }
      },
      comfirm () {
        this.$emit('input', false)
      },
      cancel () {
        this.$emit('input', false)
      }
    }
  }
</script>

<style scoped lang="stylus">
@import '~@/config/global.styl'
.bidding-enter-active
  transition: all .1s linear;
.bidding-enter
.bidding-leave-to
  opacity: 0;
  transform: translate3d(100%, 0, 0);
.bidding-modal
  width: 100%;
  height: 100%;
  .header
    padding: 20px;
    font-size: 40px;
    text-align: center;
  .content
    textarea.mint-field-core
      border: 1px solid #ccc;
  .footer
    padding: 20px;
    button
      margin-left: 10px;
</style>
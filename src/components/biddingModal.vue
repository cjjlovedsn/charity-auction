<template>
  <transition name="bidding">
    <div class="bidding-modal clearfix" v-show="value">
      <div class="header">竞拍出价</div>
      <div class="content">
        <mt-field label="出价(￥)：" type="number" :attr="{name: 'price', min: 0}" v-model.trim="price" @blur.native.capture="limitNumber" @focus.native.capture="selectAll"></mt-field>
        <mt-field label="留言：" type="textarea" placeholder="" v-model="message" @focus.native.capture="selectAll" :attr="{name: 'message', style: 'resize: none'}"></mt-field>
      </div>
      <div class="footer pull-right">
        <mt-button size="small" type="primary" @click.native.capture="confirmEvent" :style="{backgroundColor: '#138a5c'}">确定</mt-button>
        <mt-button size="small" type="default"@click.native.capture="cancelEvent">取消</mt-button>
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
        type: Number,
        default: 0
      },
      lowest: {
        type: Number,
        default: 0
      },
      confirm: {
        type: Function
      },
      cancel: {
        type: Function
      }
    },
    data () {
      return {
        price: 0,
        message: ''
      }
    },
    watch: {
      'base': {
        handler (val) {
          if (val) {
            this.price = this.base + this.lowest
          }
        }
      }
    },
    methods: {
      selectAll ({ target }) {
        setTimeout(() => {
          target.select()
        }, 0)
      },
      limitNumber ({ target }) {
        let lowestValue = this.base + this.lowest
        console.log(lowestValue)
        if (!(target.value > lowestValue)) {
          setTimeout(() => {
            target.value = lowestValue
          }, 0)
        }
      },
      confirmEvent (e) {
        if (this.confirm) {
          this.confirm(this.$data, e)
        } else {
          this.$emit('input', false)
        }
      },
      cancelEvent (e) {
        this.$emit('input', false)
        this.cancel && this.cancel(e)
      }
    },
    mounted () {
      this.price = this.base + this.lowest
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
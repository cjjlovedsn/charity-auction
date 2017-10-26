<template>
  <div class="container">
    <img :src="src"/><p>一些描述一些描述一些描述一些描述一些描述一些描述一些描述一些描述一些描述</p>
  </div>
</template>

<script>
  export default {
    name: 'details',
    data () {
      return {
        src: ''
      }
    },
    mounted () {
      let src = this.$route.query.src
      if (src) {
        this.src = src
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/config/global.styl'
  .container
    padding: 10px;
    img
      width: 100%;
</style>
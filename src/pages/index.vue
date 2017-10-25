<template>
  <div class="container">
    <ul class="showpiece">
      <li :style="{height: emptyHeight}"></li>
      <router-link tag="li" :to="{name: 'details', params: {src: item.src}}" v-for="(item, index) in imgs" :style="{width: imgWidth + 'px'}" :key="item.id">
    	  <img src="" v-lazy="item.src" @load="lazyLoadEvent" />
    	  <div class="showpiece-info">{{item.info}}</div>
      </router-link>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        imgs: null,
        clientWidth: document.documentElement.clientWidth || 0,
        loadedImgs: [],
        minHeightArr: [],
        loadingImgHeight: 0,
        loadingNum: 0
      }
    },
    computed: {
      colNum () {
        let n = Math.floor(this.clientWidth / 200) || 1
        return n > 5 ? 5 : n
      },
      emptyHeight () {
        let arr = this.minHeightArr
        return Math.max.apply(null, arr.length ? arr : [0]) + 'px'
      },
      imgWidth () {
        return this.clientWidth / this.colNum
      }
    },
    methods: {
      lazyLoadEvent ({path}) {
        let el = path[0] || {}
        let src = path[0].src
        let mha = this.minHeightArr
        let li = el.parentElement
        let rec = li.getBoundingClientRect()
        let h = rec.height
        if (this.loadedImgs.includes(src)) return
        this.loadedImgs.push(src)
        li.style.position = 'absolute'
        if (/\.gif$/.test(src)) {
          let n = this.loadingNum
          li.style.top = this.loadingImgHeight + 'px'
          li.style.left = n % this.colNum * this.imgWidth + 'px'
          this.loadingImgHeight += h
          this.loadingNum++
          return
        }
        if (mha.length < this.colNum) {
          li.style.top = '0px'
          li.style.left = (mha.length % this.colNum) * this.imgWidth + 'px'
          mha.push(h)
        } else {
          let min = Math.min.apply(null, mha)
          let index = mha.findIndex(function (value, index) {
            return value === min
          })
          mha[index] += h
          console.log(min)
          li.style.top = min + 'px'
          li.style.left = this.imgWidth * index + 'px'
        }
      }
    },
    mounted () {
      this.$http.get('/imgs').then(res => {
        this.imgs = res.data
      })
//    this.$Lazyload.$on('loaded', this.lazyLoadEvent)
    },
    beforeRouteLeave (to, from, next) {
      console.log(1)
      this.$Lazyload.$off('loaded')
      next()
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/config/common.styl'
  .container
    .showpiece
      li
        position: relative;
        top: 0;
        padding: 10px;
        img
          width: 100%;
        .showpiece-info
          position: absolute;
          left: 0;
          bottom: 10px;
          padding: 10px;
          widows: 100%;
          font-size: 12px;
</style>
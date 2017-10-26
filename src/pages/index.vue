<template>
  <div class="container">
    <ul class="showpiece">
      <li :style="{height: emptyHeight}"></li>
      <router-link tag="li" :to="{name: 'details', params: {src: item.src}}" v-for="(item, index) in imgs" :style="{width: imgWidth + 'px'}" :key="item.id">
    	  <img :src="item.src" @load="lazyLoadEvent" ref="imgs" />
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
        minHeightArr: [],
        loadingImgHeight: 0,
        loadingNum: 0,
        timers: []
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
        let h = li.offsetHeight
        mha.length < 1 && console.log(h)
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
          li.style.top = min + 'px'
          li.style.left = this.imgWidth * index + 'px'
        }
        mha.length < 2 && console.log(li.offsetHeight)
      }
    },
    mounted () {
      this.$http.get('/imgs').then(res => {
        this.imgs = res.data
      })
      window.addEventListener('resize', () => {
        this.clientWidth = document.documentElement.clientWidth || 0
        this.minHeightArr.splice(0)
        this.timers.forEach(function (t) {
          clearTimeout(t)
        })
        this.timers.splice(0)
        this.$refs.imgs.forEach((img) => {
          this.timers.push(setTimeout(() => {
            this.lazyLoadEvent({path: [img]})
          }, 500))
        })
      })
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/config/common.styl'
  .container
    .showpiece
      li
        position: absolute;
        top: 150%;
        padding: 10px;
        transition: all .5s cubic-bezier(.55,0,.1,1);
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
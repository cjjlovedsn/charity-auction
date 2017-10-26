<template>
  <div class="container">
      <transition-group name="pieces" class="showpiece" tag="ul">
        <router-link tag="li" :to="{name: 'details', query: {src: item.src}}" v-for="(item, index) in imgs" class="item" :key="item.id">
          <div class="item-detail">
            <div class="img-box">
          	  <img src="" v-lazy="item.src" />
            </div>
            <div class="title">{{item.title}}</div>
        	  <div class="item-sub-title">{{item.info}}</div>
        	  <div class="price">{{item.price}}</div>
          </div>
        </router-link>
      </transition-group>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        imgs: []
      }
    },
    computed: {
    },
    methods: {
    },
    mounted () {
//    this.$http.get('/imgs').then(res => {
//      this.imgs = res.data
//    })
      for (let i = 1; i <= 23; i++) {
        this.imgs.push({
          id: i,
          src: require(`@/assets/${(i > 9 ? i : `0${i}`)}.jpg`),
          title: '这是标题',
          info: '一些描述'.repeat(10),
          price: `$${(Math.random() * 100 + 10).toFixed(2)}`
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/config/global.styl'
  .container
    .pieces-enter-active
    .pieces-leave-active
      transition: all 1s cubic-bezier(.55,0,.1,1);
    .pieces-enter  
    .pieces-leave-to
      opacity: 0;
      transform: translateY(30px);
    .showpiece
      .item
        float: left;
        padding: 6px;
        width 50%;
        height: 580px;
        .item-detail
          padding: 10px;
          height: 100%;
          background-color: #fff;
          .img-box
            width: 100%;
            height: 400px;
            overflow: hidden;
            overflow-x: auto;
            img
              height: 100%;
              &[lazy=loading]
                width: 100%;
                height: auto;
          .title
            margin: 10px 0;
          .item-sub-title
            margin: 10px 0;
            width: 100%;
            font-size: 12px;
            text-align: left;
            text-indent: 12px;
            overflow: hidden;
            text-overflow(2);
          .price
            text-align: left;
            color: #f00;
</style>
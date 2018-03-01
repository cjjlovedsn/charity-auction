<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.isKeepAlive"></router-view>
    </keep-alive>
      <router-view v-if="!$route.meta.isKeepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      width: document.documentElement.clientWidth
    }
  },
  computed: {
    fontSize () {
      let fontSize = this.width / 30
      fontSize = fontSize > 25 ? 25 : fontSize
      return fontSize
    }
  },
  created () {
    let rootEl = document.documentElement
    rootEl.style.fontSize = this.fontSize + 'px'
    window.addEventListener('resize', () => {
      this.width = rootEl.clientWidth
      rootEl.style.fontSize = this.fontSize + 'px'
    })
  }
}
</script>

<style>
#app {
  margin: 0 auto;
  max-width: 768px;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

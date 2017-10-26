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
  created () {
    let rootEl = document.documentElement
    rootEl.style.fontSize = this.fontSize + 'px'
    window.addEventListener('resize', () => {
      this.fontSize = rootEl.clientWidth / 30
      rootEl.style.fontSize = this.fontSize + 'px'
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

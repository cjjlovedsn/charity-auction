// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from './config/axios-config'
// import MintUI from 'mint-ui'
import { Lazyload, Swipe, SwipeItem, InfiniteScroll } from 'mint-ui'
import 'mint-ui/lib/style.css'
import '../static/normalize.css'
import './config/common.styl'

Vue.config.productionTip = false

Vue.use(Axios)
Vue.use(Lazyload, {
  preload: 1.3,
  error: require(`@/assets/error.png`),
  loading: require(`@/assets/loading.gif`),
  attempt: 1
})
Vue.use(InfiniteScroll)

Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)

Vue.prototype.fontSize = document.documentElement.clientWidth / 30

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

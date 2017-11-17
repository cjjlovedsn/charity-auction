// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router, titles} from './router'
import Axios from './config/axios-config'
import moment from 'moment'
import Mint, { Lazyload, InfiniteScroll } from 'mint-ui'
import 'mint-ui/lib/style.css'
import { NoticeBar, Icon } from 'vant'
import 'vant/lib/vant-css/index.css'
import '../static/normalize.css'
import './config/common.styl'
import Touch from './config/touch'
import CircleMenu from 'vue-circle-menu'
import VueCropper from 'vue-cropper'

Vue.config.productionTip = false

Vue.use(Axios)

Vue.use(Mint)
Vue.use(Lazyload, {
  preload: 1.3,
  error: require(`@/assets/error.png`),
  loading: require(`@/assets/loading.gif`),
  attempt: 1
})
Vue.use(InfiniteScroll)

Vue.use(Touch)

Vue.component('vueCropper', VueCropper)

Vue.component(NoticeBar.name, NoticeBar)
Vue.component(Icon.name, Icon)

Vue.component('circle-menu', CircleMenu)

router.beforeEach((to, from, next) => {
  document.title = to.params.title || to.query.title || titles[to.name] || to.name || ''
  next()
})

moment.locale('zh-cn')
Vue.filter('mmt', (value, fmtStr) => {
  let fmt = fmtStr || 'YYYY-MM-DD HH:mm:ss'
  if (typeof value === 'string') {
    value = /^\d+$/.test(value) ? parseInt(value) : value
  }
  return moment(value).format(fmt)
})

Object.assign(Vue.prototype, {
  fontSize: document.documentElement.clientWidth / 30,
  $moment: moment
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

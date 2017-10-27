// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from './config/axios-config'
import moment from 'moment'
import { Lazyload, Swipe, SwipeItem, InfiniteScroll, Spinner, Field, DatetimePicker, Header } from 'mint-ui'
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
Vue.component(Spinner.name, Spinner)
Vue.component(Field.name, Field)
Vue.component(DatetimePicker.name, DatetimePicker)
Vue.component(Header.name, Header)

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

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router, titles} from './router'
import Axios from './config/axios-config'
import moment from 'moment'
import { Lazyload, Swipe, SwipeItem, InfiniteScroll, Spinner, Field, DatetimePicker, Header, Loadmore, Popup, Button } from 'mint-ui'
import 'mint-ui/lib/style.css'
import 'vant/lib/vant-css/index.css'
import '../static/normalize.css'
import './config/common.styl'
import AlloyTouch from 'alloytouch'

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
Vue.component(Loadmore.name, Loadmore)
Vue.component(Popup.name, Popup)
Vue.component(Button.name, Button)

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

Vue.directive('tap', {
  inserted (el, binding) {
    let alloyTouch = new AlloyTouch({
      touch: el,
      tap: binding.value
    })
    el.alloyTouch = alloyTouch
  },
  unbind (el) {
    el.alloyTouch = null
  }
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

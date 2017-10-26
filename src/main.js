// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from './config/axios-config'
import '../static/normalize.css'
import './config/common.styl'

Vue.config.productionTip = false

Vue.use(Axios)

Vue.prototype.fontSize = document.documentElement.clientWidth / 30

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import Details from '@/pages/details'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {isKeepAlive: true}
    }, {
      path: '/details',
      name: 'details',
      component: Details,
      meta: {isKeepAlive: true}
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition || typeof savedPosition === 'undefined') { // 从第二页返回首页时savePosition为undefined
      // 只处理设置了路由元信息的组件
      from.meta.isKeepAlive = typeof from.meta.isKeepAlive === 'undefined' ? undefined : false
      to.meta.isKeepAlive = typeof to.meta.isKeepAlive === 'undefined' ? undefined : true
      if (savedPosition) {
        return savedPosition
      }
    } else {
      from.meta.isKeepAlive = typeof from.meta.isKeepAlive === 'undefined' ? undefined : true
      to.meta.isKeepAlive = typeof to.meta.isKeepAlive === 'undefined' ? undefined : false
    }
  }
})

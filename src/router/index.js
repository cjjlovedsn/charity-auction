import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import Details from '@/pages/details'
import Edit from '@/pages/edit'
import List from '@/pages/list'
import Notice from '@/pages/notice'

Vue.use(Router)

const router = new Router({
// mode: 'history',
  routes: [
    {
      path: '*',
      name: 'index',
      component: Index
    }, {
      path: '/details',
      name: 'details',
      component: Details
    }, {
      path: '/edit',
      name: 'edit',
      component: Edit
    }, {
      path: '/list',
      name: 'list',
      component: List
    }, {
      path: '/notice',
      name: 'notice',
      component: Notice
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || {x: 0, y: 0}
//  if (savedPosition || typeof savedPosition === 'undefined') { // 从第二页返回首页时savePosition为undefined
//    // 只处理设置了路由元信息的组件
//    from.meta.isKeepAlive = typeof from.meta.isKeepAlive === 'undefined' ? undefined : false
//    to.meta.isKeepAlive = typeof to.meta.isKeepAlive === 'undefined' ? undefined : true
//    if (savedPosition) {
//      return savedPosition
//    }
//  } else {
//    from.meta.isKeepAlive = typeof from.meta.isKeepAlive === 'undefined' ? undefined : true
//    to.meta.isKeepAlive = typeof to.meta.isKeepAlive === 'undefined' ? undefined : false
//  }
  }
})

const titles = {
  index: '拍卖 - MaxInsight',
  details: '拍品详情',
  edit: '拍品编辑',
  list: '拍品列表',
  notice: '公告'
}

export { router, titles }

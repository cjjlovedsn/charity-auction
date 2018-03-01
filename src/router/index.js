import Vue from 'vue'
import Router from 'vue-router'

import { getToken } from '@/utils/auth'

import Index from '@/pages/index'
import Details from '@/pages/details'
import Edit from '@/pages/edit'
import List from '@/pages/list'
import Notice from '@/pages/notice'
import Login from '@/pages/login'
import Register from '@/pages/register'

Vue.use(Router)

const router = new Router({
// mode: 'history',
  routes: [{
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
    component: Edit,
    meta: {
      auth: true
    }
  }, {
    path: '/list',
    name: 'list',
    component: List,
    meta: {
      auth: true
    }
  }, {
    path: '/notice',
    name: 'notice',
    component: Notice,
    meta: {
      auth: true
    }
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/register',
    name: 'register',
    component: Register
  }],
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

let whiteList = ['/login', '/register']

router.beforeEach((to, from, next) => {
  if (to.meta.auth && !getToken()) {
    next('/login')
  } else {
    if (getToken() && whiteList.indexOf(to.path) > -1) {
      next('/')
    } else {
      next()
    }
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

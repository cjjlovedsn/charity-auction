import Vue from 'vue'
import Router from 'vue-router'
const Index = () => import('@/pages/index')
const Details = () => import('@/pages/details')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }, {
      path: '/details',
      name: 'details',
      component: Details
    }
  ]
})

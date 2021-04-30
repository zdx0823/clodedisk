import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Index from '../components/Index'
import Forbidden from '../components/Forbidden'
import Confirm from '../components/Confirm'
import IndexIndex from '../components/IndexIndex'
import IndexProgress from '../components/IndexProgress'
import auth from '../js/Auth'

const router = new VueRouter({
  routes: [{
    name: 'index',
    path: '/',
    component: Index,
    redirect: '/folder',
    children: [{
      name: 'indexIndex',
      path: '/folder',
      component: IndexIndex,
      meta: {
        title: '全部文件'
      },
    }, {
      name: 'progress',
      path: '/progress',
      component: IndexProgress,
      meta: {
        title: '上传列表'
      }
    }]
  }, {
    name: 'forbidden',
    path: '/forbidden',
    component: Forbidden
  }, {
    name: 'confirm',
    path: '/confirm',
    component: Confirm,
    beforeEnter: (to, from, next) => {

      auth.isNeedConfirm(next)
    }
  }]
})


/**
 * 判断是否登录，
 * 1. 已登录，下一步
 * 2. 未登录，st是否可用
 * 2-1. 可用，重定向
 * 2-2. 不可用，重定向回sso
 */
router.beforeEach((to, from, next) => {

  auth.check(next)
})


export default router
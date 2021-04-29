import Vue from 'vue'
import VueRouter from 'vue-router'
import $ from 'jquery'
window.$ = $
require('jquery.cookie')
const URIJS = require('urijs')

Vue.use(VueRouter)

import Index from '../components/Index'
import Forbidden from '../components/Forbidden'
import Confirm from '../components/Confirm'
import IndexIndex from '../components/IndexIndex'
import IndexProgress from '../components/IndexProgress'
import { deJson } from '../components/util'
import apiUrl from '../components/apiUrl'
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
    component: Confirm
  }]
})



/**
 * 验证用户是否登录
 * 1. 每次刷新都会重新发送请求验证
 * 2. 已登录，下一步
 * 3. 未登录，验证ST
 * 3-1. ST可用，重定向回本页面，ST不可用重定向到SSO
 */
class Auth {

  /**
   * 出口方法
   */
  check (next) {

    this.checkLogin().then(res => {

      if (res) return next()

      // 未登录，ST是否可用，没有跳转到sso
      this.checkSt().then(res => {

        window.location.replace(res)
      })
    })
  }


  checkLogin () {

    return $.post(apiUrl.CHECK_LOGIN).then(res => {

      const {status} = deJson(res)
      return !!(status === 1)
    })
  }


  checkSt () {

    const urijs = URIJS(window.location.href)
    const query = urijs.search(true)
    const st = query.st

    if (!st) {

      let uri = `${apiUrl.LOGIN_SSO}?serve=${apiUrl.BASE}`
      return Promise.resolve(uri)
    }


    return $.post(apiUrl.CHECK_ST, { st }).then(res => {
      console.log(1111);
      const {status} = deJson(res)
      if (status === 1) {

        delete query.st
        let uri = urijs.search(query).toString()
        return uri
      }

      let uri = `${apiUrl.LOGIN_SSO}?serve=${apiUrl.BASE}`
      return uri
    })
  }

}


/**
 * 判断是否登录，
 * 1. 已登录，下一步
 * 2. 未登录，st是否可用
 * 2-1. 可用，重定向
 * 2-2. 不可用，重定向回sso
 */
router.beforeEach((to, from, next) => {

  const auth = new Auth()
  auth.check(next)
})


export default router
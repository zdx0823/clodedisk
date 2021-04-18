import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Index from '../components/Index'
import IndexIndex from '../components/IndexIndex'
import IndexProgress from '../components/IndexProgress'
export default new VueRouter({
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
  }]
})
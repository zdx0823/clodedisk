import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

import './assets/css/reset.css'
import './assets/css/iconfont.css'
import './assets/css/common.css'
import $ from 'jquery'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

// 右键菜单
import Contextmenu from "vue-contextmenujs"
Vue.use(Contextmenu);

Vue.config.keyCodes.f1 = 112
Vue.config.keyCodes.f1 = 113


$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});


import router from './router'
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

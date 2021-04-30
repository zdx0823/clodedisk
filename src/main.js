import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

// 全局设置
Vue.config.productionTip = false
Vue.config.keyCodes.f1 = 112
Vue.config.keyCodes.f1 = 113


// element ui
import './assets/css/reset.css'
import './assets/css/iconfont.css'
import './assets/css/common.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)


// vue cookie
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)


// 右键菜单
import Contextmenu from "vue-contextmenujs"
Vue.use(Contextmenu);


// 更改element ui 的 notify
import './assets/css/app.css'
import { notify } from './components/util'


// ajax过滤
import ajaxFilter from './js/ajaxFilter'


// 入口
new Vue({
  render: h => h(App),
  router,
  store,
  mounted () {
    this.notify = notify(this)
    ajaxFilter(this)
  }
}).$mount('#app')



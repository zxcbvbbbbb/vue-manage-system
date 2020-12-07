import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/scss/reset.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import http from '@/api/config'
import './mock'

Vue.use(ElementUI)
Vue.prototype.$http = http
Vue.prototype.$elMessage = function(msg, t) {
  this.$message({
    message: msg,
    type: t
  })
}
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  //进入的路由对象，离开的路由对象,路由跳转完后要调用next钩子加载完成
  store.commit('getToken')
  let token = store.state.user.token
  if (!token && to.name !== 'login') {
    //进去的路由不是登录页
    next({ name: 'login' })
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    store.commit('addMenu', router)
  }
}).$mount('#app')

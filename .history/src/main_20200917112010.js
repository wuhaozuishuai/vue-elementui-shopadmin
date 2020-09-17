import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式表 
import './assets/css/global.css'
import axios from 'axios'

Vue.config.productionTip = false

axios.defaults.baseURL  = 'http://127.0.0.1:8888/api/private/v1'
axios.in
Vue.prototype.$http = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

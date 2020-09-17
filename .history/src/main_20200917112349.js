import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式表 
import './assets/css/global.css'
import axios from 'axios'

Vue.config.productionTip = false

axios.defaults.baseURL  = 'http://127.0.0.1:8888/api/private/v1';
//设置请求拦截器
axios.interceptors.request.use((config)=>{
  console.log(config);
  config.headers.Authorization
  //最后必须return config
  return config
})
Vue.prototype.$http = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

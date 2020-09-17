import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式表 
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'

Vue.config.productionTip = false

axios.defaults.baseURL  = 'http://49.234.103.109:8888/api/private/v1';
//设置请求拦截器,挂载Authorization的token令牌
axios.interceptors.request.use((config)=>{
  console.log(config);
  config.headers.Authorization  =window.sessionStorage.getItem('token')
  //最后必须return config
  return config
})
Vue.prototype.$http = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

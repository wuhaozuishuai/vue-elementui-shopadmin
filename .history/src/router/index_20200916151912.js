import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
Vue.use(VueRouter)

const routes = [
  
]

const router = new VueRouter({
  routes:[
    {
      path:'/login',
      component:Login
    }
  ]
})

export default router

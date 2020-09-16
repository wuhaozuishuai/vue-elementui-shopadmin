import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    component:Login
  },
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/home',
    component:Home
  }
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫，防止用户通过路由直接访问权限页面
router.beforeEach

export default router

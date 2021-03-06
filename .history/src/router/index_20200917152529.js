import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
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
    component:Home,
    redirect:'/welcome',
    children:{
      path:'/welcome',
      component:Welcome,
    }
  },

]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫，防止用户通过路由直接访问权限页面
router.beforeEach((to,from,next)=>{
    //to 将要访问的页面
    //from 代表从哪个路径跳转而来
    //next 是一函数（放行函数）
    //    next() 放行  ；next('/login')  强制跳转
    if(to.path==='/login') return next();
    //获取token
    const tokenStr =  window.sessionStorage.getItem('token')
    if(!tokenStr) return next('/login')
    next()
})

export default router

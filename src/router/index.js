import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // 路由重定向
    redirect: '/login'
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users
    }]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
// to 是将要访问的路径，from 从哪个路径跳转过来
// next 是函数
//  next() 是直接放行
//  next('/login') 则是跳转到 login 页面
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有 token 则强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router

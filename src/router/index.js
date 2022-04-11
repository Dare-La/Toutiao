import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login/index_login.vue'
import User from '@/views/User/index_user.vue'
import Home from '@/views/Home/index_home.vue'
import Layout from '@/views/Layout/index_layout.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home' // 重定向到首页
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/layout',
    component: Layout,
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'user',
        component: User
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

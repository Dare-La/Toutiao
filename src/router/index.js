import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token.js'
// import Login from '@/views/Login/index_login.vue'
// import User from '@/views/User/index_user.vue'
// import Home from '@/views/Home/index_home.vue'
// import Layout from '@/views/Layout/index_layout.vue'
// import Search from '@/views/Search/index_search.vue'
// import SearchResult from '@/views/Search/SearchResult'
// import ArticalDetail from '@/views/ArticalDetail/articalDetail_index.vue'
// import UserEdit from '@/views/User/UserEdit.vue'
// import Chat from '@/views/Chat/chat_index.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home' // 重定向到首页
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "index_login" */ '@/views/Login/index_login.vue'),
    boforeEnter (to, from, next) {
      if (getToken()?.length > 0 && to.path === '/login') {
        // 有token且是去login页，不放行
        // next(false)
        next('/layout/home')
      } else {
        next() // 其他情况放行
      }
    }
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "index_layout" */ '@/views/Layout/index_layout.vue'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "index_home" */ '@/views/Home/index_home.vue'),
        meta: {
          scrollT: 0 // 滚动距离
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "index_user" */ '@/views/User/index_user.vue')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "index_search" */ '@/views/Search/index_search.vue')
  },
  {
    path: '/searchresult/:keyword',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult')
  },
  { // 文章详情
    path: '/detail',
    component: () => import(/* webpackChunkName: "articalDetail_index" */ '@/views/ArticalDetail/articalDetail_index.vue')
  },
  { // 编辑用户资料
    path: '/user_edit',
    component: () => import(/* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit.vue')
  },
  { // 小思
    path: '/chat',
    component: () => import(/* webpackChunkName: "chat_index" */ '@/views/Chat/chat_index.vue')
  }
]

const router = new VueRouter({
  routes
})

// 需求：若当前有token时，禁止到登陆页
// 思路：用路由守卫进行判断当前去login的时候是否有token
// router.beforeEach((to, from, next) => {
//   if (getToken()?.length > 0 && to.path === '/login') {
//     // 有token且是去login页，不放行
//     //next(false)
//     next('/layout/home')
//   } else {
//     next() // 其他情况放行
//   }
// })
export default router

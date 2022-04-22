import Vue from 'vue'
import App from './App.vue'
import '@/utils/console' // 生产环境屏蔽打印信息
import router from './router'
import store from './store'
import 'amfe-flexible' // 移动端字体大小适配
import { directiveObj } from '@/utils/directive'
import 'highlight.js/styles/default.css' // 代码高亮的样式
import '@/vueComponent.js'
// import axios from 'axios'

Vue.config.productionTip = false

// 使用use调用全局指令的方法
Vue.use(directiveObj)

// 定义一个全局自定义指令,用于自动聚焦,不使用use的方式
// Vue.directive('fofo', {
//   inserted (el, binding) {
//     // 原生DOM.nodeName能拿到标签的名称，名称为全大写
//     if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
//       el.focus()
//     } else {
//       // 当el本身不是输入框或者文本域，尝试往里面获取
//       const theInput = document.querySelector('input')
//       const theTextarea = document.querySelector('textarea')
//       if (theInput) theInput.focus() // 如果往里面获取得到input,则给它添加聚焦
//       if (theTextarea) theTextarea.focus() // 如果往里面获取得到textarea,则给它添加聚焦
//     }
//   },
//   // 二次聚焦，
//   update (el) { // 指令所在标签被更新时触发
//     if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
//       el.focus()
//     } else {
//       // 当el本身不是输入框或者文本域，尝试往里面获取
//       const theInput = document.querySelector('input')
//       const theTextarea = document.querySelector('textarea')
//       if (theInput) theInput.focus() // 如果往里面获取得到input,则给它添加聚焦
//       if (theTextarea) theTextarea.focus() // 如果往里面获取得到textarea,则给它添加聚焦
//     }
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// axios({
//   url: '/api/nc/article/headline/T1348647853363/0-40.html'
// }).then((res) => {
//   console.log(res)
// })

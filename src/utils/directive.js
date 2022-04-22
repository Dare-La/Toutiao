// 用于封装全局指令
// 定义一个全局自定义指令,用于自动聚焦,使用use的方式
export const directiveObj = {
  install (Vue) {
    // 定义一个全局自定义指令,用于自动聚焦
    Vue.directive('fofo', {
      inserted (el, binding) {
        // el是指当前标签div,当前div的内部才有input，focus()是作用于input标签上的，所以要找到div下的input
        const input = el.querySelector('input')
        input.focus()
      }
    })
  },
  update (el) { // 指令所在标签被更新时触发
    if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
      el.focus()
    } else {
      // 当el本身不是输入框或者文本域，尝试往里面获取
      const theInput = document.querySelector('input')
      const theTextarea = document.querySelector('textarea')
      if (theInput) theInput.focus() // 如果往里面获取得到input,则给它添加聚焦
      if (theTextarea) theTextarea.focus() // 如果往里面获取得到textarea,则给它添加聚焦
    }
  }
}

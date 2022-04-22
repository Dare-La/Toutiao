// 封装一些本地存储存储的方法
// 封装的意义：方便以后统一修改和管理

// 将数据存到本地
export const setStorage = (key, value) => {
  localStorage.setItem(key, value)
}

// 将数据从本地取出
export const getStorage = (key) => {
  return localStorage.getItem(key)
}

// 将数据从本地移除
export const removeStorage = (key) => {
  localStorage.removeItem(key)
}

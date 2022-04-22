// 这个文件专门用来管理Token,导出存储、取出、移除token的方法
const key = 'jeekitheima'
// 将token存储到本地
export const setToken = (token) => {
  localStorage.setItem(key, token)
}
// 将token从本地取出
export const getToken = () => {
  return localStorage.getItem(key) // 外部要拿token值必须要return
}
// 移除token
export const removeToken = () => {
  localStorage.removeItem(key)
}

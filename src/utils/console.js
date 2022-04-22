// 用于频闭在生产环境中的打印信息
if (process.env.NODE_ENV === 'production') {
  console.log = function () {}
  console.warning = function () {}
  console.dir = function () {}
  console.error = function () {}
}

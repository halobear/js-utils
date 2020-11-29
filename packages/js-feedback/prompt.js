module.exports = [
  {
    type: 'input',
    name: 'desc',
    message: '自定义内容',
    default: '自定义内容',
    validate: (t) => t ? true : '请输入'
  },
]
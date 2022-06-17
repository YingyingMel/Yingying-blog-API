const joi = require('joi')

//用户名的规则
const username = joi.string().alphanum().min(1).max(10).required()

//密码的规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

exports.reg_login_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password
  }
}
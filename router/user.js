const express = require('express')
//创建路由对象
const router = express.Router()
const userHandler = require('../router_handler/user')

//导入验证表单数据的中间件和验证规则
const expressJoi = require('@escook/express-joi')
const { reg_login_schema } = require('../schema/user')

// 解析只有文本域的form-data表单数据
//const multer = require('multer')
//const upload = multer()

//注册，虽然前端没有注册功能，但是登录账号需要密码加密，需要下面这个注册模块来预先往数据库里存入一个密码已加密的账号
router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser)

//登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login)

module.exports = router
//这个文件用来配置与个人中心有关的路由地址

const express = require('express')
//创建路由对象
const router = express.Router()
const userInfo_Handler = require('../router_handler/userInfo')

//获取用户信息
router.get('/userinfo', userInfo_Handler.getUserInfo)

module.exports = router
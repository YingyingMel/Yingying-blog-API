const express = require('express')
//创建路由对象
const router = express.Router()
const channels_handler = require('../router_handler/channels')

//获取文章分类列表
router.get('/channels', channels_handler.getChannels)

module.exports = router
const express = require('express')

const router = express.Router()
const uploadFile = require('../router_handler/uploadfile')

// 解析有文件的form-data表单数据

router.post('/upload', uploadFile, (req, res) => {
  console.log(req.body)
  res.status(200).send({
    status: 200,
    msg: '上传成功',
    data: req.body
  })
})

module.exports = router
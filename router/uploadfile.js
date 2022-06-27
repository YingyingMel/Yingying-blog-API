const express = require('express')
const router = express.Router()
const { uploadImg } = require('../router_handler/uploadfile')


//重写图片
const multer = require('multer')
const upload = multer({ dest: './uploads/' }).single("images")

router.post('/upload', upload, uploadImg)

module.exports = router
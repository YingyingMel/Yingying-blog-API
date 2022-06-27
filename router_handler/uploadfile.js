const db = require('../db/index')
const fs = require('fs')

//把图片写入数据库，存入地址
exports.uploadImg = (req, res) => {
  const file = req.file
  fs.renameSync('./uploads/' + file.filename, './uploads/' + file.originalname)
  //console.log(file)
  res.set({
    'content-type': 'application/JSON; charset=utf-8'
  })
  const images = 'http://localhost:3007/uploads/' + file.originalname

  const imageUrl = {
    images: images
  }

  const sql = 'insert into images set ?'
  db.query(sql, imageUrl, (err, results) => {
    if (err) return res.cc(err, 500)
    if (results.affectedRows !== 1) return res.cc('上传失败', 400)
    res.send({
      status: 200,
      msg: '上传成功',
      url: imageUrl.images,
    })

  })
}
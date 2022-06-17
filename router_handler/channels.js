const db = require('../db/index')

//获取文章分类列表
exports.getChannels = (req, res) => {
  const sql = 'select * from channels order by id asc'
  db.query(sql, (err, results) => {
    if (err) return res.cc(err, 500)

    res.send({
      status: 200,
      message: '获取channels列表成功',
      data: results,
    })
  })
}




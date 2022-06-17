//处理个人中心的函数

const db = require('../db/index')

//获取用户基本信息,因为这里已经登录，下面的取值不是req.body.id, 而是req.user.id
exports.getUserInfo = (req, res) => {
  const sql = 'select id, username from users where id=?'
  db.query(sql, req.user.id, (err, results) => {
    //sql语句执行失败
    if (err) return res.cc(err, 500)

    // SQL 语句执行成功，但查询行数不为 1
    if (results.length !== 1) return res.cc('获取用户信息失败', 400)

    // 将用户信息响应给客户端
    res.send({
      status: 400,
      message: '获取用户信息成功',
      data: results[0],
    })
  })
}
const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

// 注册用户的处理函数
exports.regUser = (req, res) => {
  const userInfo = req.body   //接收表单数据
  //检查用户名密码是否为空
  if (!userInfo.username || !userInfo.password) {
    return res.cc('用户名或密码不能为空', 400)
  }
  //检查用户名是否被占用
  const sqlStr = 'select * from users where username=?'
  db.query(sqlStr, [userInfo.username], (err, results) => {
    //sql语句执行失败
    if (err) return res.cc(err, 500)
    //用户名被占用
    if (results.length > 0) {
      return res.cc('用户名已被占用，请更换用户名', 400)
    }

    //确认用户名可用之后,对密码进行加密,下面的10为随机盐长度
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)
    //把用户信息写入数据库
    const sql = 'insert into users set ?'
    db.query(sql, [{ username: userInfo.username, password: userInfo.password }], (err, results) => {
      //sql语句执行失败
      if (err) return res.cc(err, 500)
      if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试', 400)
      //注册成功
      return res.cc('注册成功', 200)
    })
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  const sqlStr = 'select * from users where username=?'
  db.query(sqlStr, [req.body.username], (err, results) => {
    //sql语句执行失败
    if (err) return res.cc(err, 500)
    // 执行 SQL 语句成功，但是查询到数据条数不等于 1
    if (results.length !== 1) return res.status(400).send('user not found!')

    //用户输入密码和数据库密码进行比对
    const compareResult = bcrypt.compareSync(req.body.password, results[0].password)
    if (!compareResult) {
      return res.status(400).send('password is incorrect')
    }
    //密码比对成功，生成token前，提取user信息，剔除密码信息
    const user = { ...results[0], password: '' }
    //生成token, 有效期24h
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '24h' })
    res.send({
      status: 200,
      message: '登录成功',
      token: tokenStr,
    })
  })
}
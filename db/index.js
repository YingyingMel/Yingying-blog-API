const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
  host: 'us-cdbr-east-05.cleardb.net',
  user: 'b2168ab134372b',
  password: '725fc0fa',
  database: 'heroku_42c740c2de4f09b'
})

module.exports = db

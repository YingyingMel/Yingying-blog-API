const db = require('../db/index')
const path = require('path')
const moment = require('moment')


//增
exports.addArticle = (req, res) => {
  //图片非必选项
  // 手动校验上传的文件
  // if (!req.file || req.file.fieldname !== 'cover_img') {
  //   return res.cc('文章封面必选')
  // }
  const timeNow = moment().format('DD-MM-YYYY')
  const articleinfo = {
    ...req.body,
    pub_date: timeNow
  }

  const sql = 'insert into articles set ?'
  db.query(sql, articleinfo, (err, results) => {
    if (err) return res.cc(err, 500)
    if (results.affectedRows !== 1) return res.cc('发布文章失败', 400)
    res.send({
      status: 200,
      msg: '发布文章成功'
    })

  })
}


// `select a.id, a.title, a.pub_date, a.status, b.name as cate_name
// from articles as a,channels as b 
// where a.channel_id = b.id and a.channel_id = ifnull(?, a.channel_id)  and a.status = ifnull(?, a.status) limit ?,?`

//查， 获取文章列表
exports.listArticle = (req, res) => {
  if (req.query.status || req.query.channel_id) {
    const searchParams = {
      status: req.query.status,
      channel_id: req.query.channel_id
    }
    const sql = 'select * from articles where status =? or channel_id=?'
    db.query(sql, [searchParams.status, searchParams.channel_id], (err, results) => {
      if (err) return res.cc(err, 500)
      if (results.length > 0) {
        res.send({
          status: 200,
          msg: '搜索成功',
          data: results,
          total_count: results.length,
          page: 1,
          per_page: 10
        })
      } else {
        return res.send({
          status: 200,
          data: '',
          total_count: 0
        })
      }
    })
  } else {
    const sql = 'select * from articles order by id asc'
    db.query(sql, (err, results) => {
      if (err) return res.cc(err, 500)
      res.send({
        status: 200,
        msg: '获取文章列表成功',
        data: results,
        total_count: results.length,
        page: 1,
        per_page: 10
      })
    })
  }

}


//删
exports.delArticle = (req, res) => {
  const sql = 'delete from articles where id = ?'
  db.query(sql, req.params.id, (err, results) => {
    if (results.affectedRows !== 1) return res.cc('删除文章失败', 500)
    res.send({
      status: 200,
      msg: '删除文章成功'
    })
  })
}

//获取单个文章的详细信息用于回填
exports.queryArticleDetail = (req, res) => {
  const sql = 'select * from articles where id = ?'

  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err, 500)
    if (results.length !== 1) return res.cc('获取文章信息失败', 500)
    res.send({
      status: 200,
      msg: '查询文章详情成功',
      data: results[0]
    })
  })
}

//改
exports.editArticle = (req, res) => {
  //封面非必选
  // 手动校验上传的文件
  // if (!req.file || req.file.fieldname !== 'cover_img') {
  //   return res.cc('文章封面必选')
  // }
  const articleinfo = {
    ...req.body,
    pub_date: moment().format('DD-MM-YYYY'),
  }

  const sql = 'update articles set ? where id = ?'

  db.query(sql, [articleinfo, req.body.id], (err, results) => {
    if (err) return res.cc(err, 500)
    if (results.affectedRows !== 1) return res.cc('更新文章失败', 400)
    res.send({
      status: 200,
      msg: '更新文章成功'
    })
  })
}



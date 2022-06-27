const db = require('../db/index')
const path = require('path')
const moment = require('moment')


//增, 返回的req.body里有图片的url
exports.addArticle = (req, res) => {

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



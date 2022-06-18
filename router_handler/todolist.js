const db = require('../db/index')
const path = require('path')
const moment = require('moment')


//增
exports.addTask = (req, res) => {

  const sql = 'insert into todolist set ?'
  db.query(sql, req.body, (err, results) => {
    if (err) return res.cc(err, 500)
    if (results.affectedRows !== 1) return res.cc('add task fail', 400)
    //要把新增的数据找到并返回
    const sql2 = 'select * from todolist where id =?'
    db.query(sql2, results.insertId, (err, result) => {
      if (err) return res.cc("cannot find result", 500)
      if (result.reminder === 0) {
        return {
          ...result,
          reminder: false
        }
      }
      if (result.reminder === 1) {
        return {
          ...result,
          reminder: true
        }
      }
      res.send({
        tasks: result,
        status: 200,
        msg: 'add task success'
      })
    })
  })
}

//查
exports.listTasks = (req, res) => {
  const sql = 'select * from todolist'
  db.query(sql, (err, results) => {
    if (err) return res.cc(err, 500)
    const formatResults = results.map(item => {
      if (item.reminder === 0) {
        return {
          ...item,
          reminder: false
        }
      } else if (item.reminder === 1) {
        return {
          ...item,
          reminder: true
        }
      }

    })
    res.send({
      tasks: formatResults,
    })
  })
}


//删
exports.delTask = (req, res) => {
  const sql = 'delete from todolist where id = ?'
  db.query(sql, req.params.id, (err, results) => {
    if (results.affectedRows !== 1) return res.cc('delete fail', 500)
    res.send({
      status: 200,
      msg: 'delete success'
    })
  })
}

//获取单个task的详细信息用于回填
exports.queryTaskDetail = (req, res) => {
  const sql = 'select * from todolist where id = ?'

  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err, 500)
    if (results.length !== 1) return res.cc('get task fail', 500)
    const formatResults = results.map(item => {
      if (item.reminder === 0) {
        return {
          ...item,
          reminder: false
        }
      }
      if (item.reminder === 1) {
        return {
          ...item,
          reminder: true
        }
      }
    })
    res.send({
      tasks: formatResults,
    })

  })
}

//改
exports.editTask = (req, res) => {
  const sql = 'update todolist set ? where id = ?'
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) return res.cc(err, 500)
    if (results.affectedRows !== 1) return res.cc('update fail', 400)
    res.send({
      status: 200,
      msg: 'update sucess'
    })
  })
}



const express = require('express')
const router = express.Router()
const { addTask, listTasks, delTask, editTask, queryTaskDetail } = require('../router_handler/todolist')

// 表单数据校验规则
const expressJOI = require('@escook/express-joi')
const { add_task_schema, del_task_schema, eidt_task_schema } = require('../schema/todolist')


router.post('/', expressJOI(add_task_schema), addTask)
router.get('/', listTasks)
router.delete('/:id', expressJOI(del_task_schema), delTask)
router.put('/:id', expressJOI(eidt_task_schema), editTask)
router.get('/:id', expressJOI(del_task_schema), queryTaskDetail)

module.exports = router
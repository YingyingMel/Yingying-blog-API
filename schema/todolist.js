const joi = require('joi')


const id = joi.number().integer().min(1).required()
const day = joi.string().required()
const text = joi.string().required().allow('')
const reminder = joi.boolean()

exports.add_task_schema = {
  body: {
    day,
    text,
    reminder
  }
}


exports.list_task_schema = {
  query: {
    day,
    text,
    reminder
  }
}

exports.del_task_schema = {
  params: {
    id
  }
}

exports.eidt_task_schema = {
  body: {
    id,
    day,
    text,
    reminder
  }
}
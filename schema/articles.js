const joi = require('joi')

const title = joi.string().required()
const channel_id = joi.number().integer().min(1).required()
const channel_id2 = joi.number().integer().min(1)
const content = joi.string().required().allow('')
const status = joi.number().integer().min(1)
const read_count = joi.number().integer()
const comment_count = joi.number().integer()
const like_count = joi.number().integer()
const pubdate = joi.date()
const images = joi.string()

// const pagenum = joi.number().integer().min(0).required()
// const pagesize = joi.number().integer().min(1).required()
// const cate_id_optional = joi.number().integer().min(1).optional()
// const state_optional = joi.string().valid('草稿', '已发布').optional()

const id = joi.number().integer().min(1).required()

exports.add_article_schema = {
  body: {
    title,
    channel_id,
    content,
    images
  }
}

exports.search_article_schema = {
  body: {
    channel_id: channel_id2,
    status,
    begin_pubdate: pubdate,
    end_pubdate: pubdate
  }
}

// exports.list_article_schema = {
//   query: {
//     cate_id: cate_id_optional,
//     state: state_optional
//   }
// }

exports.del_article_schema = {
  params: {
    id
  }
}

exports.eidt_article_schema = {
  body: {
    id,
    title,
    channel_id,
    content,
    images
  }
}
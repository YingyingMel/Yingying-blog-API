const express = require('express')
const router = express.Router()
const { addArticle, listArticle, delArticle, editArticle, queryArticleDetail, searchArticle } = require('../router_handler/articles')

// 表单数据校验规则
const expressJOI = require('@escook/express-joi')
const { add_article_schema, del_article_schema, eidt_article_schema, search_article_schema } = require('../schema/articles')

//不需要在这里上传图片，上传图片已单独抽离到uploadfile
// 解析有文件的form-data表单数据
// const multer = require('multer')
// const path = require('path')
// const upload = multer({ dest: path.join(__dirname, '../uploads') }) //服务器把上传的图片存到这个文件夹
// 路由 注意：upload.single('')里面的名字必须与addArticle模块里上传文件的属性名一致

router.post('/add', expressJOI(add_article_schema), addArticle)
router.get('/list', listArticle)
router.delete('/delete/:id', expressJOI(del_article_schema), delArticle)
router.put('/edit/:id', expressJOI(eidt_article_schema), editArticle)
router.get('/:id', expressJOI(del_article_schema), queryArticleDetail)

module.exports = router
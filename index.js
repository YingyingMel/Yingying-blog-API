const express = require('express')
const cors = require('cors')
const joi = require('joi') //定义规则
const config = require('./config') //用到jwtScreteKey来解析token
const expressJWT = require('express-jwt') //解析token的中间件
const userRouter = require('./router/user')
const userinfoRouter = require('./router/userInfo')
const channelsRouter = require('./router/channels')
const articleRouter = require('./router/articles')
const uploadfileRouter = require('./router/uploadfile')
const todolistRouter = require('./router/todolist')

//创建服务器实例
const app = express()


// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))
//是否要把前端放过来？app.use(express.static('./web'))

//解决跨域
app.use(cors())

//解析表单中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))
app.use(express.json()) //重要重要重要,解析json格式的表单数据


// 一定要在路由之前，封装 res.cc 函数,因为路由要调用res.cc
app.use((req, res, next) => {
  // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status) {
    res.send({
      status: status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 解析token，使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))


//基础路由
app.use('/api', userRouter) //登录注册
app.use('/my', userinfoRouter)//获取用户信息，注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', channelsRouter) //channels路由
app.use('/my/article', articleRouter)//文章路由
app.use('/api', uploadfileRouter)//上传文件路由
app.use('/todolist', todolistRouter)

//定义错误级别中间件
app.use((err, req, res, next) => {
  //数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err, 400)

  //捕获token验证失败错误
  if (err.name === 'UnauthorizedError') return res.cc('身份验证失败，请重新登录', 401)

  //其他错误
  res.cc(err, 400)
})

app.listen(3007, () => {
  console.log("server is running at http://127.0.0.1:3007")
})
Home and Diary

首页 '/'

前端已改//已完成http.get('/mp/articles', { params }) 查询

 前端已改//已完成http.delete(`/mp/articles/${data.id}`)删除

前端已改//完成http.put(`/mp/articles/${articleId}?draft=false`, params) 修改

前端已改//已完成http.post('/mp/articles?draft=false', params) 发布

前端已改完成http.get(`/mp/articles/${articleId}`) 根据id获取文章信息回填

action="http://geek.itheima.net/v1_0/upload"

前端改了//已完成 http.get('/channels')

前端改了//已完成登录接口 http.post('http://geek.itheima.net/v1_0/authorizations'

前端改了//已完成http.get('/user/profile')

前端改了 baseURL: 'http://geek.itheima.net/v1_0',

这是前端页面跳转，不用改history.push('./login')

todolist 还有db.json

```js
const res = await fetch('http://localhost:5000/tasks')
db.json

```

### 1.1 创建项目

1. 新建 `api_server` 文件夹作为项目根目录，并在项目根目录中运行如下的命令，初始化包管理配置文件package.json：

```bash
npm init -y
```

2.  安装所有需要的包

   npm i express@4.17.1

    npm i cors

   npm i express-jwt@5.3.3

   npm i -g nodemon 

   npm i mysql@2.18.1  

   npm i bcryptjs@2.4.3

   npm install joi

   npm i @escook/express-joi

   npm i jsonwebtoken@8.5.1

   npm i multer@1.4.2
   
   npm i moment



3. 在根目录新建index.js

4. 在package.json里加入 nodeman

```jsx
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "nodemon": "nodemon app.js"
}
```

5.把 bigEvent_api_server/app.js里的有用的代码复制粘贴到index.js

6.把res.cc修改，删掉默认status = 1, 把index.js里 的相应错误状态码修改

```jsx
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
```

7. 启动nodemon: 打开终端，在根目录下直接 nodemon 回车，即可实时刷新server



8. 根目录新建两个文件夹，router和router_handler

9. 在 `router` 文件夹中，新建 `user.js` 文件，作为用户的路由模块，并复制粘贴代码

   因为前端登录/注册的表单数据提交方式是form-data, 所以路由要添加解析formdata的中间件multer

   ```js
   // 解析只有文本域的form-data表单数据
   const multer = require('multer')
   const upload = multer()
   
   //注册，虽然前端没有注册功能，但是登录账号需要密码加密，需要下面这个注册模块来预先往数据库里存入一个密码已加密的账号
   router.post('/reguser', upload.none(), expressJoi(reg_login_schema), userHandler.regUser)
   
   //登录
   router.post('/login', upload.none(), expressJoi(reg_login_schema), userHandler.login)
   ```

   **在index.js中要加中间件express.json，才能解析json格式的表单数据**， 如果添加了这个中间件，上面的登录/注册模块可以不用multer

   ```js
   //解决跨域
   app.use(cors())
   //解析表单中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
   app.use(express.urlencoded({ extended: false }))
   app.use(express.json()) //重要重要重要,解析json格式的表单数据
   ```

   注意: 在React_blog_yy的前端项目中，虽然没有登录功能，但是登录账号需要密码加密，需要注册模块来预先往数据库里存入一个密码已加密的账号，所以后端的注册功能要保留

   

10. 在index.js中确认导入登录路由模块

11. 新建 /router_handler/user.js 文件，并复制粘贴代码,   修改res.cc的状态码， 把Bearer去掉，由前端添加

    200：OK

    400：请求地址不存在或包含不支持的参数

    500：内部错误

    12. 在根目录创建 `config.js` 文件，并向外共享 **加密** 和 **还原** Token 的 `jwtSecretKey` 字符串：

    ```js
    module.exports = {
      jwtSecretKey: 'syy',
    }
    ```

    5. 

    #### 用navicat 建数据库 blog_yy, 建登录表 users

![image-20220610230803745](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220610230803745.png)

![image-20220610231046974](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220610231046974.png)

![image-20220610231307470](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220610231307470.png)

2.2 安装并配置 mysql 模块

在项目根目录中新建 `/db/index.js` 文件，在此自定义模块中创建数据库的连接对象：

```js
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'blog_yy', 
})

// 向外共享 db 数据库连接对象
module.exports = db
```

 /router_handler/user.js中把sql请求语句中的表名改为 users

2.3 检查登录表单数据是否合法

新建 `/schema/user.js` 用户信息验证规则模块，复制粘贴username 和password的规则和exports

```js
const joi = require('joi')

//用户名的规则
const username = joi.string().alphanum().min(1).max(10).required()

//密码的规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

exports.reg_login_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password
  }
}
```

2.4 测试登录注册接口

用postman测试注册接口，通过注册往数据库里写入username 和password, 如下图

![image-20220611230612236](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220611230612236.png)

测试登录接口，如下图。此时，已成功注册用户名为0426580613、密码为246810的用户。(前端要修改登录页面的默认手机号)

![image-20220611230659736](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220611230659736.png)

3. #### 获取用户基本信息 注意:这一部分可以不要，因为前端页面中不显示用户名

   3.1 创建 `/router/userinfo.js` 路由模块 和`/router_handler/userinfo.js` 路由处理函数模块，分别复制粘贴代码，只取 ’获取用户信息‘ 部分。

   把/router_handler/userinfo.js 里面的 sql语句修改为以下：并把res.cc状态码修改

   ```js
   const sql = 'select id, username from users where id=?'
   ```

   3.2 在index.js中导入并使用个人中心的路由模块：

```js
// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter)
```

测试获取用户信息接口：只需在Headers处添加Token即可请求，请求体body为空。

![image-20220611235016149](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220611235016149.png)

#### 4.Diary 部分，获取频道列表

4.1 新建channels表

![image-20220612001127393](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220612001127393.png)

![image-20220612001140533](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220612001140533.png)

4.2 获取channels列表

4.2.1 分别创建 `/router/channels.js` 路由模块 和 /router_handler/channels.js，并复制粘贴原artcate.js里的代码，只需要获取分类列表部分，修改里面的cate等词为channels, 数据库表名改为channels, 加状态码

```js
const sql = 'select * from channels order by id asc'
```

4.2.2 在index.js 中导入channels的路由模块

```js
const channelsRouter = require('./router/channels')
app.use('/my/channels', channelsRouter) //文章分类路由
```

测试接口 ’/my/channels‘， 是否能获得channels列表，只需在Headers处添加Token即可请求，请求体body为空。

![image-20220612130221704](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220612130221704.png)

#### 5. 获取文章列表（查）

5.1 新建articles表，手动往里面添加两个数据

![image-20220612213014468](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220612213014468.png)

![image-20220612213048868](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220612213048868.png)

5.2 实现步骤

1. 初始化路由模块

2. 初始化路由处理函数模块

3. 使用 multer 解析表单数据

4. 验证表单数据

5. 实现发布文章的功能

   5.2.1 分别创建 `/router/articles.js` 路由模块 ， /router_handler/articles.js 和 /schema/articles.js

   把github_bigEvent的对应代码分别复制粘贴到这三个articles.js里，修改里面参数，路径

   

   ```js
   //获取文章列表, 根据前端，添加后面三项
   exports.listArticle = (req, res) => {
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
   ```
   
   
   
   5.2.1 添加路由到index.js
   
   ```js
   app.use('/my/article', articleRouter)//文章路由
   ```
   
   postman发起get请求，看是否能拿到文章列表，只需在Headers处添加Token即可请求，请求体body为空。
   
   ![image-20220612214020034](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220612214020034.png)

#### 6. 发布新文章（增）

修改/router_handler/articles.js 里的addArticle 模块

用postman测试，记得请求头添加token

![image-20220613000348808](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220613000348808.png)

#### 7.根据id删除文章（删)

```js
//从数据库删除，不是标记删除 
const sql = 'delete from articles where id = ?'
```

postman测试，添加token，delete请求，在地址栏填写id值，其余为空

![image-20220613000736685](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220613000736685.png)

#### 8. 根据id 获取单个文章详细信息用于回填

修改/router_handler/articles.js 里的queryArticleDetail模块

```js
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
```

postman测试，添加token，在地址栏填写id值，其余为空

![image-20220613112611061](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220613112611061.png)

#### 9. 根据id 更新文章（改）

修改/router_handler/articles.js 里的editArticle模快

```js

exports.editArticle = (req, res) => {
  const articleinfo = {
    ...req.body,
    pub_date: new Date(),
    filelist: path.join('/uploads', req.file.filename)
  }

  const sql = 'update articles set ? where id = ?'

  db.query(sql, [articleinfo, req.body.id], (err, results) => {
    if (err) return res.cc(err, 500)
    if (results.affectedRows !== 1) return res.cc('更新文章失败', 500)
    res.send({
      status: 200,
      msg: '更新文章成功'
    })
  })
}
```

修改router/articles.js里的路由为：upload.single('name')里的name要与res里发送的文件属性名一致

```js
router.put('/edit', upload.single('filelist'), expressJOI(eidt_article_schema), editArticle)
```

postman 携带token和form-data参数测试，put请求

![image-20220613115536974](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220613115536974.png)



#### 修改前端

把http.js 的baseURL改了：

```js
//请求后端的baseURL
const http = axios.create({
  baseURL: 'http://127.0.0.1:3007',
  timeout: 5000
})
```

把前端所有向后端请求的端口都改成了React_blog_yy_api_server的端口

前端登录页面的手机号placeholder改成澳手机号

把前端页面中的所有mobile改成username, 所有code改成password

**至此，可以根据0426580613 和246810来登录后端**

**待办**：但是，使用错误的用户名也可登录，即使后端返回错误信息码，因为这个状态码是自定义的，前端在http响应拦截器走的response模块，不走error模块，可以在后端express把状态码设置一下，或者直接在axios成功回调里判断，手动抛出错误



channel.store.js里，line 14-15

```js
//原
this.channelList = res.data.channels
//改成：
this.channelList = res.data.data
```

article/index.js

```js
// line 23 原, 因为后端图片上传存储功能未实现
return <img src={cover.images[0] || img404} width={200} height={150} alt="" />
//改
return <img src={img404} width={200} height={150} alt="" />
```

```js
//line 121 原
 useEffect(() => {
    const loadList = async () => {
      const res = await http.get('/my/article/list', { params })
      const { results, total_count } = res.data
      setAticleData({
        list: results,
        count: total_count
      })
    }
    loadList()
  }, [params])
  
  //改, 
  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('/my/article/list')
      console.log(res)
      setAticleData({
        list: res.data.data,
        count: res.data.total_count
      })
    }
    loadList()
  }, [params])
```

![image-20220615132437775](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220615132437775.png)

前端publish/index.js 里，image 提取url以字符串存入数据库的代码

```js
//提交表单
  const navigate = useNavigate()
  const onFinish = async (values) => { //values包含了所有提交的数据，通过各个标签的name来关联获取。要先对数据提取和格式化，再发送后端
    const { channel_id, content, title } = values
    const params = {
      channel_id: channel_id,
      content: content,
      title: title,
      images: fileList[0].url
    }
    console.log(params)

    if (articleId) {
      //编辑修改
      await http.put(`/my/article/edit/${articleId}`, { ...params, id: articleId })
    } else {
      //新增发布
      await http.post('/my/article/add', params)
    }

    //修改/发布完成后跳转并提示
    navigate('/article')
    message.success(`${articleId ? 'Update success' : 'Publish success'}`) //message是antd的全局提示组件
  }
  
  //数据回填时图片获取不到
   useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/my/article/${articleId}`)
      console.log(res)
      const { ...formValue } = res.data.data
      form.current.setFieldsValue({ ...formValue })
      //把图片url提取出来,回填到upload的位置
      //res.data.data.images是字符串，要把它变成数组格式存入fileList
      const imageList = res.data.data.images
      console.log(imageList)
      setFileList([{ url: imageList }])
    }
    if (articleId) {
      loadDetail()
    }
  }, [articleId])
```

前端article/index.js, 加载文章列表时返回的res截图

![image-20220617125459491](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220617125459491.png)

图片上传调用黑马接口，

```js
//提交表单到服务器，图片转成字符串
const onFinish = async (values) => { //values包含了所有提交的数据，通过各个标签的name来关联获取。要先对数据提取和格式化，再发送后端
    const { channel_id, content, title } = values
    const params = {
      channel_id: channel_id,
      content: content,
      title: title,
      images: JSON.stringify(fileList) //把fileList里的图片对象转成字符串发给服务器
    }
    
//信息回填时，图片转成对象格式
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/my/article/${articleId}`)
      console.log(res)
      const { images, ...formValue } = res.data.data
      form.current.setFieldsValue({ ...formValue })//数据回填
      //把服务器发回的图片字符串转回对象格式，存到fileList
      setFileList(JSON.parse(images))
      console.log(JSON.parse(images))
    }
    if (articleId) {
      loadDetail()
    }
  }, [articleId])
```

发送请求时是url带参数，则请求时是params, 端口接收是req.query, 

发送的请求体是body时，端口接收是req.body

#### 重写图片上传功能，调用本地接口

新建一张表，用于存放图片url

![image-20220627144729572](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220627144729572.png)

在/router 和/router_handler下分别新建uploadfile.js

在index.js里新建路由, 用api端口可以免除携带token上传

```js
app.use('/api', uploadfileRouter)//上传文件路由
```

在/router/uploadfile.js里新建路由

```js
const express = require('express')
const router = express.Router()
const { uploadImg } = require('../router_handler/uploadfile')

//重写图片
const multer = require('multer')
const upload = multer({ dest: './uploads/' }).single("images")

router.post('/upload', upload, uploadImg)

module.exports = router
```

/router_handler/uploadfile.js，把上传文件重命名，把url写入数据库, 并把url返回前端

```js
const db = require('../db/index')
const fs = require('fs')

//把图片写入数据库，存入地址
exports.uploadImg = (req, res) => {
  const file = req.file
  fs.renameSync('./uploads/' + file.filename, './uploads/' + file.originalname)
  //console.log(file)
  res.set({
    'content-type': 'application/JSON; charset=utf-8'
  })
  const images = 'http://localhost:3007/uploads/' + file.originalname

  const imageUrl = {
    images: images
  }

  const sql = 'insert into images set ?'
  db.query(sql, imageUrl, (err, results) => {
    if (err) return res.cc(err, 500)
    if (results.affectedRows !== 1) return res.cc('上传失败', 400)
    res.send({
      status: 200,
      msg: '上传成功',
      url: imageUrl.images,
    })

  })
}
```

前端要更改的地方：

\publish\index.js里，图片请求接口更改为blog后端

![image-20220627150511567](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220627150511567.png)

onUploadChange事件里的url提取要修改，

上传存在本地服务器的图片截图

![image-20220627134706686](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220627134706686.png)

```js
 const onUploadChange = ({ fileList }) => { //直接从res中解构fileList
    console.log(fileList)
    const formatList = fileList.map(file => {
      //上传完毕，提取数据
      if (file.response) {
        return {
          url: file.response.url //提取response里的url,其他信息不要，看上面截图
        }
      }
      //否则在上传中，不做处理
      return file
    })
    console.log(formatList)
    setFileList(formatList)
  }
```

/article/.index.js里渲染cover时

```js
{
      title: 'Cover',
      dataIndex: 'images',
      render: images => { //下面src地址要根据后端返回数据提取url，看下面res截图
        //console.log(JSON.parse(images))
        return <img src={JSON.parse(images) ? JSON.parse(images)[0].url : img404} width={80} height={60} alt="" />
      }
    },
```

console.log(JSON.parse(images)

![image-20220627140938960](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220627140938960.png)



#### deploy to heroku

1. 先注册heroku账号

2. 全局安装heroku , 在已写好的项目根目录， npm install -g heroku

3. 验证heroku安装成功： heroku --version

4. 在heroku网站新建一个repository, 命名 blog-yy-server

5. 回到项目根目录bash终端,连接heroku 账号：heroku login

   ![image-20220628162749134](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220628162749134.png)

6. 把本地项目和远程项目关联：heroku git:remote -a blog-yy-server

7. 根目录新建一个文件：Procfile， 里面输入 web: node index.js

8. 在package.json里，scripts第一行，“start": "node index.js"

9. index.js 里的server监听：

   ```js
   // Start the server
   const PORT = process.env.PORT || 8080;
   app.listen(PORT, () => {
     console.log(`App listening on port ${PORT}`);
     console.log('Press Ctrl+C to quit.');
   });
   ```

9. 把写好的server项目 添加暂存区，git add .
10. git commit -am "备注信息"
11. 每次更新推送到heroku:   git push heroku master
12. 结束后打开终端提供的链接验证，也可在网页项目右上角more -> view logs


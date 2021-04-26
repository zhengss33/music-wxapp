const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const { ENV } = require('./var.secret')

const app = new Koa()
const router = new Router()

// 跨域
app.use(cors({
  origin: 'http://localhost:9528',
  credentials: true
}))

app.use(koaBody({
  multipart: true
}))

app.use(async (ctx, next) => {
  ctx.state.ENV = ENV
  await next()
})

const playlist = require('./controller/playlist')
const banner = require('./controller/banner')
const blog = require('./controller/blog')
router.use('/playlist', playlist.routes())
router.use('/banner', banner.routes())
router.use('/blog', blog.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.use(async (ctx) => {
  ctx.body = 'hello world'
})

app.listen(3000, () => {
  console.log('服务已开启')
})
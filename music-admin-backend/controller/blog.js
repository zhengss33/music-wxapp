const Router = require('koa-router')
const router = new Router()

const OK_CODE = require('../utils/config')
const callCloudDB = require('../utils/callCloudDB')
const callCloudStorage = require('../utils/callCloudStorage')

router.get('/list', async (ctx, next) => {
  const { start, count } = ctx.request.query
  const query = `
    db.collection('blog')
    .skip(${start})
    .limit(${count})
    .orderBy('createTime', 'desc')
    .get()`
  const res = await callCloudDB(ctx, 'databasequery', query)

  ctx.body = {
    data: res.data || {},
    code: OK_CODE
  }
})

router.post('/delete', async (ctx, next) => {
  const { _id, images } = ctx.request.body
  // 删除数据库blog
  const blogQuery = `
    db.collection('blog').doc('${_id}').remove()
  `
  const blogDelRes = await callCloudDB(ctx, 'databasedelete', blogQuery)

  // 删除数据库blog-comment
  const commentQuery = `
    db.collection('blog-comment').where({
      blogId: '${_id}'
    }).remove()
  `
  const commentDelRes = await callCloudDB(ctx, 'databasedelete', commentQuery)

  // 删除云储存图片
  const imageDelRes = await callCloudStorage.delete(ctx, images)

  ctx.body = {
    data: blogDelRes || {},
    code: OK_CODE
  }
})

module.exports = router
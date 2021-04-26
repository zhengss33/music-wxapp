const Router = require('koa-router')
const router = new Router()

const OK_CODE = require('../utils/config')
const callCloudFn = require('../utils/callCloudFn')
const callCloudDB = require('../utils/callCloudDB')

router.get('/list', async(ctx, next) => {
  const { start, count } = ctx.request.query
  const res = await callCloudFn(ctx, 'music', {
    $url: 'playlist',
    start: parseInt(start),
    count: parseInt(count)
  })
  
  let data = res.resp_data ? JSON.parse(res.resp_data).data : []

  ctx.body = {
    data,
    code: OK_CODE
  }
})

router.get('/getDetail', async(ctx, next) => {
  const { id } = ctx.request.query
  const query = `db.collection('playlist').where({_id:'${id}'}).get()`
  const res = await callCloudDB(ctx, 'databasequery', query)
  const data = res.data ? JSON.parse(res.data) : {}

  ctx.body = {
    data,
    code: OK_CODE
  }
})

router.post('/updateDetail', async(ctx, next) => {
  const { _id, name, copywriter } = ctx.request.body
  const query = `db.collection('playlist')
                  .doc('${_id}')
                  .update({
                    data: {
                      name: '${name}',
                      copywriter: '${copywriter}'
                    }
                  })`
  const res = await callCloudDB(ctx, 'databaseupdate', query)
  const data = res || {}

  ctx.body = {
    data,
    code: OK_CODE
  }
})

router.get('/delete', async (ctx, next) => {
  const { _id } = ctx.request.query
  const query = `db.collection('playlist')
                .doc('${_id}')
                .remove()`
  const res = await callCloudDB(ctx, 'databasedelete', query)
  const data = res ? res : {}

  ctx.body = {
    data,
    code: OK_CODE
  }
})

module.exports = router
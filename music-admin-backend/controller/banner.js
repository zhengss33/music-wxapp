const Router = require('koa-router')
const router = new Router()

const OK_CODE = require('../utils/config')
const callCloudDB = require('../utils/callCloudDB')
const callCloudStorage = require('../utils/callCloudStorage')

router.get('/list', async (ctx, next) => {
  // 默认10条
  const query = `db.collection('banner').get()`
  const res = await callCloudDB(ctx, 'databasequery', query)
  const banners = res.data || []
  let data = []

  if (banners.length > 0) {
    const fileList = banners.map(item => ({
      fileid: JSON.parse(item).fileid,
      max_age: 7200 
    }))
    const downloadUrl = await callCloudStorage.download(ctx, fileList)
    data = downloadUrl.file_list.map((item, idx) => ({
      fileid: item.fileid,
      download_url: item.download_url,
      _id: JSON.parse(banners[idx])._id
    }))
  }

  ctx.body = {
    data: data,
    code: OK_CODE
  }
})

router.post('/upload', async (ctx, next) => {
  const fileId = await callCloudStorage.upload(ctx)
  let data = {}

  if (fileId) {
    const query = `
      db.collection('banner').add({
        data: {
          fileid: '${fileId}'
        }
      })`
  
    data = await callCloudDB(ctx, 'databaseadd', query)
  }

  ctx.body = {
    data,
    code: OK_CODE
  }
})

router.get('/delete', async (ctx, next) => {
  const {_id, fileid } = ctx.request.query
  const query = `db.collection('banner').doc('${_id}').remove()`
  let data = {
    dbResult: {},
    storageResult: {}
  }

  try {    
    // 数据库删除
    const dbResult = await callCloudDB(ctx, 'databasedelete', query)
  
    // 云储存删除
    const storageResult = await callCloudStorage.delete(ctx, [fileid])

    data = {
      dbResult,
      storageResult
    }
  } catch (error) {
    console.log(error)
  }

  ctx.body = {
    data,
    code: OK_CODE
  }
})

module.exports = router
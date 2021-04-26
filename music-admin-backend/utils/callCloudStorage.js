const getAccessToken = require('./getAccessToken')
const rp = require('request-promise')
const fs = require('fs')
const request = require('../utils/request')

const callCloudStorage = {
  async download(ctx, fileList) {
    const ACCESS_TOKEN = await getAccessToken()
    const url = `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`

    return await request.post(url, {
      env: ctx.state.ENV,
      file_list: fileList
    }).then(res => res)
    .catch(err => {
      console.log('download file error: ' + err)
    })
  },

  async upload(ctx) {
    const ACCESS_TOKEN = await getAccessToken()
    const file = ctx.request.files.file
    const url = `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`
    const path = `banner/${Date.now()}-${Math.random()}-${file.name}`

    // 获取文件上传链接
    const uploadResult = await request.post(url, {
      env: ctx.state.ENV,
      path
    }).then(res => res)
    .catch(err => {
      console.log('upload file error: ', err)
    })

    const params = {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data'
      },
      uri: uploadResult.url,
      formData: {
        'key': path,
        'Signature': uploadResult.authorization,
        'x-cos-security-token': uploadResult.token,
        'x-cos-meta-fileid': uploadResult.cos_file_id,
        'file': fs.createReadStream(file.path)
      },
      json: true
    }

    return await rp(params)
    .then(res => (uploadResult.file_id || ''))
    .catch(err => { console.log('upload form error: ', err)})
  },

  async delete(ctx, fileid_list) {
    const ACCESS_TOKEN = await getAccessToken()
    const url = `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`

    return await request.post(url, {
      env: ctx.state.ENV,
      fileid_list
    }).then(res => (res))
    .catch(err => {
      console.log('delete file error: ', err)
    })
  }
}

module.exports = callCloudStorage
const getAccessToken = require('../utils/getAccessToken')
const request = require('../utils/request')

const callCloudDB = async (ctx, fName, query) => {
  const ACCESS_TOKEN = await getAccessToken()
  const url = `https://api.weixin.qq.com/tcb/${fName}?access_token=${ACCESS_TOKEN}`

  return await request.post(url, {
    env: ctx.state.ENV,
    query
  }).then(res => res)
  .catch(err => {
    console.log('errmsg: ' + err)
  })
}

module.exports = callCloudDB
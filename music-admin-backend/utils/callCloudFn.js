const getAccessToken = require('../utils/getAccessToken')
const request = require('../utils/request')

const callCloudFn = async (ctx, fnName, params) => {
  const ACCESS_TOKEN = await getAccessToken()
  const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ctx.state.ENV}&name=${fnName}`

  return await request.post(url, params)
  .then(res => res)
  .catch(err => {
    console.log('Error' + err)
  })
}

module.exports = callCloudFn
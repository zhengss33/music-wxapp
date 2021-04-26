
const { APP_ID, APP_SECRET } = require('../var.secret')
const request = require('./request')
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`
const fs = require('fs')
const path = require('path')
const filePath = path.resolve(__dirname, './access_token.secret.json')
const EXPIRES_IN = 7200

const updateAccessToken = async () => {
  const res = await request.get(URL)
  const token = res.access_token

  if (token) {
    fs.writeFileSync(filePath, JSON.stringify({
      access_token: token,
      createTime: new Date()
    }))
  } else {
    await updateAccessToken()
  }
}

const getAccessToken = async () => {
  try {  
    const readFile = fs.readFileSync(filePath, 'utf8')
    const accessToken = JSON.parse(readFile)
    const createTime = new Date(accessToken.createTime).getTime()
    const currentTime = new Date().getTime()

    if ((currentTime - createTime) / 1000 >= EXPIRES_IN) {
      throw new Error('access_token已过期')
    }

    return accessToken.access_token
  } catch (error) {
    console.log(error)
    await updateAccessToken()
    return (await getAccessToken())
  }
}

setInterval(async () => {
  console.log('update')
  await updateAccessToken()
}, (7200 - 300) * 1000)

updateAccessToken()

module.exports = getAccessToken
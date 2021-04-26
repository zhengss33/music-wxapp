// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const result = await cloud.openapi.wxacode.getUnlimited({
    scene: wxContext.OPENID,
    // page: ''
  })

  const upload = await cloud.uploadFile({
    cloudPath: `qrcode/${Date.now()}-${Math.random()}.png`, // 上传至云端的路径
    fileContent: result.buffer, // 要上传文件的内容
  })

  return upload.fileID
}
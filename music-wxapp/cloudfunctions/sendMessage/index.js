// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { blogId, content } = event


  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: wxContext.OPENID,
        page: `/pages/blog-detail/blog-detail?blogId=${blogId}`,
        lang: 'zh_CN',
        data: {
          thing1: {
            value: content
          },
          thing4: {
            value: '评论成功'
          }
        },
        templateId: 'H9UnY68oZWjI1_Yz_aewgv9n9oEGqIAvl9UBE67afWs',
        miniprogramState: 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}
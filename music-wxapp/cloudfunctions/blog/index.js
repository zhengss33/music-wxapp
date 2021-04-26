// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()

const db = cloud.database()
const blogCollection = db.collection('blog')
const blogCommentCollection = db.collection('blog-comment')
const MAX_COMMENT_COUNT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })

  app.router('list', async (ctx, next) => {
    let keywords = event.keywords
    let w = {}
    if (keywords.trim() !== '') {
      w = {
        content: db.RegExp({
          regexp: keywords,
          options: 'i'
        })
      }
    }

    ctx.body = await blogCollection
      .where(w)
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => res.data)
  })

  app.router('detail', async (ctx, next) => {
    const blogId = event.blogId
    const commentCount = await blogCommentCollection.count()
    const commentTotal = commentCount.total
    let commentList = {
      data: []
    }
    let detail = await blogCollection
    .where({ _id: blogId })
    .get()
    .then(res => res.data)

    if (commentTotal > 0) {
      const batchTimes = Math.ceil(commentTotal / MAX_COMMENT_COUNT)
      let commentTask = []
      for (let i = 0; i < batchTimes; i++) {
        let promise = blogCommentCollection
          .skip(i * MAX_COMMENT_COUNT)
          .limit(MAX_COMMENT_COUNT)
          .where({ blogId })
          .orderBy('createTime', 'desc')
          .get()
        commentTask.push(promise)
      }
      if (commentTask.length > 0) {
        commentList = (await Promise.all(commentTask)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }

    ctx.body = {
      detail,
      commentList
    }
  })

  app.router('getListByOpenId', async(ctx, next) => {
    const openid = cloud.getWXContext().OPENID
    ctx.body = await blogCollection
      .where({'_openid': openid})
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => res.data)
  })
  return app.serve();
}
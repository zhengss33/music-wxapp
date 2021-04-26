// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router');
const rp = require('request-promise');
const BASE_URL = 'http://musicapi.leanapp.cn';


cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event});

  app.router('playlist', async(ctx, next) => {
    ctx.body = await cloud.database().collection('playlist')
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime', 'desc')
    .get()
    .then(res => res)
  })

  app.router('songlist', async(ctx, next) => {
    ctx.body = await rp(`${BASE_URL}/playlist/detail?id=${event.songListId}`)
    .then(res => JSON.parse(res))
  })

  app.router('lyric', async(ctx, next) => {
    ctx.body = await rp(`https://api.imjad.cn/cloudmusic/?type=lyric&id=${event.songId}`).then(res => res)
  })

  return app.serve();
}
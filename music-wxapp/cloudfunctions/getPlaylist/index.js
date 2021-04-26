// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const rp = require('request-promise');

const URL='http://musicapi.leanapp.cn/top/playlist/highquality';
const playlistCollection = db.collection('playlist');
const MAX_LIMIT = 100;

// 云函数入口函数
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const playlistCount = await playlistCollection.count();
  const playlistTotal = playlistCount.total;
  // 计算需分几次取
  const batchTimes = Math.ceil(playlistTotal / MAX_LIMIT);
  // 承载所有读操作的 promise 的数组
  const tasks = [];

  for(let i = 0; i < batchTimes; i++) {
    const promise = await playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
    tasks.push(promise);
  }
  const dbPlaylist = (await Promise.all(tasks)).reduce((acc, cur) => (
    acc.concat(cur.data)
  ), []);

  
  const playlist = await rp.get(URL).then(res => JSON.parse(res).playlists);
  const dbPlaylistIds = dbPlaylist.map(item => item.id );
  const newList = playlist.filter(item => !dbPlaylistIds.includes(item.id))

  for (let i = 0, len = newList.length; i < len; i++ ) {
    await playlistCollection.add({
      data: {
        ...newList[i],
        createTime: db.serverDate()
      }
    }).then(res => {
      console.log('插入成功')
    }).catch(err => {
      console.log('插入失败')
    })
  }

  return newList.length;
}
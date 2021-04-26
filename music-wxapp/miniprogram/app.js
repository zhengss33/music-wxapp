import { ENV_ID } from './config.secret.js'
//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: ENV_ID,
        traceUser: true,
      })
    }

    this.globalData = {
      playingSongId: -1,
      openid: -1
    }
    this.getOpenid()
  },
  setPlayingSongId(id) {
    this.globalData.playingSongId = id
  },
  getPlayingSongId() {
    return this.globalData.playingSongId;
  },
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const openid = res.result.openid
      this.globalData.openid = openid;

      if (wx.getStorageSync(openid) == '') {
        wx.setStorageSync(openid, [])
      }
    })
  }
})

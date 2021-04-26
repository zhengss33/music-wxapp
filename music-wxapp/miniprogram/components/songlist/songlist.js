// components/songlist/songlist.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songList: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1
  },

  pageLifetimes: {
    show() {
      this.setData({
        playingId: app.getPlayingSongId()
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event) {
      const { songid: songId, index } = event.currentTarget.dataset;
      const currentSong = this.data.songList[index]

      if (currentSong.fee === 1) {
        wx.showToast({
          title: '无播放权限',
        })
        return;
      }

      this.setData({
        playingId: songId
      })
      wx.navigateTo({
        url: `../../pages/player/player?songId=${songId}&index=${index}`
      })
    }
  }
})

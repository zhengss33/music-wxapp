// pages/songlist/songlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songList: [],
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: 'loading...',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'songlist',
        songListId: options.songListId
      }
    }).then(res => {
      console.log(res)
      const playlist = res.result.playlist
      this.setData({
        songList: playlist.tracks,
        listInfo: {
          coverImgUrl: playlist.coverImgUrl,
          name: playlist.name
        }
      })
      this._saveSonglist()
      wx.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  _saveSonglist() {
    wx.setStorageSync('songlist', this.data.songList)
  }
})
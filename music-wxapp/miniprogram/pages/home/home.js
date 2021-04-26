// import regeneratorRuntime from '../../utils/runtime.js'

const MAX_LIMIT = 15;
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    playList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getBannerList()
    this._getPlaylist()
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
    this.setData({
      playList: []
    })
    this._getPlaylist();
    this._getBannerList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  _getPlaylist() {
    wx.showLoading({
      title: 'loading...',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'playlist',
        start: this.data.playList.length,
        count: MAX_LIMIT
      }
    }).then(res => {
      this.setData({
        playList: this.data.playList.concat(res.result.data)
      })
      wx.stopPullDownRefresh();
      wx.hideLoading();
    })
  },
  _getBannerList() {
    db.collection('banner').get().then(res => {
      this.setData({
        bannerList: res.data
      })
    }).catch(err => {
      console.log(err)
    })
  }
})
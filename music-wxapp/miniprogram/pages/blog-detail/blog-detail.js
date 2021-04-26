// pages/blog-detail/blog-detail.js
import formatTime from '../../utils/formatTime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogId: '',
    detail: {},
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      blogId: options.blogid
    })
    this._getBlogDetail()
  },

  _getBlogDetail() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'detail',
        blogId: this.data.blogId
      }
    }).then(res => {
      let commentList = res.result.commentList.data;
      commentList.forEach(element => {
        element.createTime = formatTime(new Date(element.createTime))
      });

      this.setData({
        commentList,
        detail: res.result.detail[0]
      })
      wx.hideLoading()
    }).catch(res => {
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
    const { detail, blogId } = this.data
    return {
      title: detail.content,
      path: `/pages/blog-detail/blog-detail?blogid=${blogId}`
    }
  }
})
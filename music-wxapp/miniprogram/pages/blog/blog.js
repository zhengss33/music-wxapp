// pages/blog/blog.js
let keywords = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isModalShow: false,
    blogList: []
  },

  onPublish() {
    // 判断用户是否授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              this.onLoginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else {
          this.setData({
            isModalShow: true
          })
        }
      }
    })
  },

  onLoginSuccess(event) {
    const detail = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },

  onLoginFail () {
    wx.showModal({
      title: '用户授权才能发布',
      content: '',
    })
  },

  _loadBlogList(start = 0) {
    wx.showLoading({
      title: 'loading...',
    })
    wx.cloud.callFunction({
      name: 'blog', 
      data: {
        $url: 'list',
        count: 10,
        start,
        keywords
      }
    }).then(res => {
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },

  gotoDeatil(e) {
    wx.navigateTo({
      url: `../../pages/blog-detail/blog-detail?blogid=${e.target.dataset.blogid}`
    })
  },

  onSearch(e) {
    keywords = e.detail.keywords
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
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
      blogList: []
    })
    this._loadBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    const { blog, blogid } = e.target.dataset
    return {
      title: blog.content,
      path: `/pages/blog-detail/blog-detail?blogid=${blogid}`
    }
  }
})
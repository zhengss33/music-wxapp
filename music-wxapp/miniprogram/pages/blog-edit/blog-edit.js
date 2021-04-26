// pages/blog-edit/blog-edit.js
const MAX_WORDS_NUM = 140;
const MAX_IMG_NUM = 9;
const db = wx.cloud.database();
let userInfo = {};
let content = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0,
    canAddImage: true,
    images: []
  },

  send() {
    if (content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
      })
      return;
    }
    wx.showLoading({
      title: '发布中...',
    })
    let uploadImgTasks = this.data.images.map(item => {
      return new Promise((resolve, reject) => {
        let suffix = /\.\w+$/.exec(item)[0];
        let timestamp = Date.now() + '_' + parseInt(Math.random() * 10000000)
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + timestamp + suffix,
          filePath: item,
          success: (res) => {
            resolve(res.fileID)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    })

    Promise.all(uploadImgTasks).then(fileIDs => {
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          images: fileIDs,
          createTime: db.serverDate()
        }
      }).then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '发布成功',
          success: () => {
            wx.navigateBack()
            const pages = getCurrentPages()
            const prevPage = pages[pages.length - 2]
            prevPage.onPullDownRefresh()
          }
        })
      })
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '发布失败',
      })
    })
  },
  
  onChooseImage() {
    let max = MAX_IMG_NUM - this.data.images.length;
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const images = this.data.images.concat(res.tempFilePaths);
        this.setData({
          canAddImage: images.length < MAX_IMG_NUM,
          images
        })
      }
    })
  },

  onDelImage(e) {
    let images = this.data.images;
    images.splice(e.target.dataset.index, 1);
    this.setData({
      canAddImage: images.length < MAX_IMG_NUM,
      images
    })
  },

  onPreviewImage(e) {
    wx.previewImage({
      urls: this.data.images,
      current: e.target.dataset.imgsrc
    })
  },

  onInput(event) {
    let wordsNum = event.detail.value.length;
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`;
    }
    content = event.detail.value;
    this.setData({
      wordsNum
    })
  },

  onFocus(event) {
    this.setData({
      footerBottom: event.detail.height
    })
  },

  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    userInfo = options;
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

  }
})
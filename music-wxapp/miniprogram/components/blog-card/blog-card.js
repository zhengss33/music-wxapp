// components/blog-card/blog-card.js
import formatTime from '../../utils/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime: ''
  },

  observers: {
    ['blog.createTime'](time) {
      if (time) {
        this.setData({
          _createTime: formatTime(new Date(time))
        })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreviewImage(e) {
      const { imgsrc, imgs } = e.target.dataset;
      wx.previewImage({
        urls: imgs,
        current: imgsrc
      })
    }
  }
})

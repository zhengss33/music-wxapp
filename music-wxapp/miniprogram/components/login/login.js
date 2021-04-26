// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isModalShow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo(event) {
      const userInfo = event.detail.userInfo;

      if (userInfo) {
        this.setData({
          isModalShow: false
        })
        this.triggerEvent('loginsuccess', userInfo)
      } else {
        this.triggerEvent('loginfail')
      }
    }
  }
})

// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
const db = wx.cloud.database()
const tmplIds = ['H9UnY68oZWjI1_Yz_aewgv9n9oEGqIAvl9UBE67afWs']
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object
  },

  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],

  /**
   * 组件的初始数据
   */
  data: {
    isLoginShow: false,
    isModalShow: false,
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoginsuccess(e) {
      userInfo = e.detail
      this.setData({
        isLoginShow: false
      }, () => {
        this.setData({
          isModalShow: true
        })
      })
    },

    onLoginfail() {
      wx.showModal({
        title: '仅用户授权可评论',
      })
    },

    onInput(e) {
      this.setData({
        content: e.detail.value
      })
    },

    onSend() {
      const blogId = this.properties.blogId
      const content = this.data.content
      if (content.trim() === '') {
        wx.showModal({
          title: '评论内容不能为空',
        })
        return
      }

      wx.showLoading({
        title: '评论提交中...',
        mask: true
      })

      db.collection('blog-comment').add({
        data: {
          content,
          blogId,
          createTime: db.serverDate(),
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName
        }
      }).then(res => {
        wx.hideLoading()
        wx.showModal({
          title: '评论成功',
          complete: (res) => {
            wx.showModal({
              title: '是否接受评论消息推送',
              success: (res) => {
                if (res.confirm) {
                  wx.requestSubscribeMessage({
                    tmplIds,
                    success (res) {
                      if (res[tmplIds] == 'accept') {
                        wx.cloud.callFunction({
                          name: "sendMessage",
                          data: {
                            content,
                            blogId
                          }
                        }).then(res => {
                          console.log("推送消息成功", res)
                        }).catch(res => {
                          console.log("推送消息失败", res)
                        })
                      } else {
                        wx.showToast({
                          title: '拒绝授权将不会推送评论消息到微信',
                        })
                      }
                    },
                    fail: (res) => {
                      console.log('授权失败', res)
                    }
                  })
                }  else if (res.cancel) {
                  wx.showToast({
                    title: '拒绝授权将不会推送评论消息到微信',
                  })
                }
              },
            })
          }
        })
        
        this.setData({
          content: '',
          isModalShow: false
        })

      })

      this.triggerEvent('refreshCommentList')
    },

    onComment() {
      wx.getSetting({
        success: (res) => {
          if(res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                this.setData({
                  isModalShow: true
                })
              }
            })
          } else {
            this.setData({
              isLoginShow: true
            })
          }
        }
      })
    }
  }
})

// components/bottom-modal/bottom-modal.js
Component({
  options: {
    styleIsolation: 'apply-shared',
    multipleSlots: true
  },
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
    onClose() {
      this.setData({
        isModalShow: false
      })
    }
  }
})

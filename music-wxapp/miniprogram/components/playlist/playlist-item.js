// components/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playitem: Object
  },

  observers: {
    ['playitem.playCount'](count) {
      this.setData({
        _playCount: this._transNumber(count, 2)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _playCount: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToSonglist() {
      wx.navigateTo({
        url: `../../pages/songlist/songlist?songListId=${this.properties.playitem.id}`,
      })
    },
    _transNumber(num, point) {
      let numStr = num.toString().split('.')[0];
      let len = numStr.length
      if (len < 6) {
        return numStr
      } else if (len >=6 && len <= 8) {
        let digit = len - 4;
        let decimal = numStr.substring(digit, digit + point);
        return `${parseFloat(parseInt(num / 10000))}.${decimal}万`
      } else if (len > 8 ) {
        let digit = len - 8;
        let decimal = numStr.substring(digit, digit + point);

        return `${parseFloat(parseInt(num / 10000000))}.${decimal}千万`
      }
    }
  }
})

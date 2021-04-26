// components/lyric/lyric.js
let lyricHeight = 0;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false,
    },
    lyric: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    currentLyricIndex: -1,
    scrollTop: 0
  },

  observers: {
    lyric(lyric) {
      if (!lyric) { return }
      const lyricObj = JSON.parse(lyric)
      if (lyricObj.nolyric) {
        this.setData({
          lrcList: [{
            lrc: '暂无歌词',
            time: 0
          }],
          currentLyricIndex: -1
        })
    
      } else {
        this._parseLyric(lyricObj.lrc.lyric)
      }
    }
  },

  lifetimes: {
    ready() {
      wx.getSystemInfo({
        success: (result) => {
          lyricHeight = result.screenWidth / 750 * 64
        },
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _parseLyric(lyric) {
      let line = lyric.split('\n');
      let lrcList = [];
      line.forEach(el => {
        let time = el.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g);
        if (time != null) {
          let lrc = el.split(time)[1];
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/);
          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000;
          lrcList.push({
            lrc,
            time: time2Seconds
          })
        }
      })
      this.setData({
        lrcList
      })
    },
    updateTime(currentTime) {
      const lyricList = this.data.lrcList;
      const len = lyricList.length
      if (len == 0) { return }
      if (currentTime > lyricList[len - 1].time) {
        if (this.data.currentLyricIndex != -1) {
          this.setData({
            currentLyricIndex: -1,
            scrollTop: len * lyricHeight
          })
        }
      }
      for(let i = 0; i < len; i++) {
        if (currentTime <= lyricList[i].time) {
          this.setData({
            currentLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break;
        }
      }
    }
  }
})

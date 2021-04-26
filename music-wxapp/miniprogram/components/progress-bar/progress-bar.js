// components/progress-bar/progress-bar.js
const backgroundAudioManager = wx.getBackgroundAudioManager();
let movableAreaWidth = 0;
let movableViewWidth = 0;
let currentSeconds = -1;
let isMoving = false;


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    movableDis: 0,
    progress: 0
  },

  lifetimes: {
    ready() {
      this._getMovableDis();
      this._bindBGMEvent();
      if (this.data.isSame) {
        this._setTime()
      }
      console.log('ready')
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange (event) {
      const { source, x } = event.detail;
      if (source === 'touch') {
        this.data.progressX = x;
        isMoving = true;
      }
    },
    onTouchEnd () {
      const x = this.data.progressX;
      const scale = x / (movableAreaWidth - movableViewWidth);
      const duraction = backgroundAudioManager.duration;
      const currentTime = duraction * scale;
      const currentTimeFmt = this._timeFormat(currentTime);
      this.setData({
        progress: scale * 100,
        movableDis: this.data.progressX,
        ['showTime.currentTime']: `${currentTimeFmt.mm}:${currentTimeFmt.ss}`
       })

       backgroundAudioManager.seek(currentTime);
       isMoving = false;
    },
    _getMovableDis() {
      const query = this.createSelectorQuery();
      query.select('.movable-area').boundingClientRect();
      query.select('.movable-view').boundingClientRect();
      query.exec(rect => {
        movableAreaWidth = rect[0].width;
        movableViewWidth = rect[1].width;
      })
    },
    _setTime() {
      const duration = backgroundAudioManager.duration;
      const durationFmt = this._timeFormat(duration);
      this.setData({
       ['showTime.totalTime']: `${durationFmt.mm}:${durationFmt.ss}`
      })
    },
    _setProgress() {
      if (!isMoving) {
        const currentTime = backgroundAudioManager.currentTime;
        const duration = backgroundAudioManager.duration;
        const currentTimeFmt = this._timeFormat(currentTime);
        const scale = (currentTime / duration);
        const currentTimeSecond = Math.floor(currentTime);

        if (currentSeconds !== currentTimeSecond) {
          this.setData({
            movableDis: (movableAreaWidth - movableViewWidth) * scale,
            progress: scale * 100,
            ['showTime.currentTime']: `${currentTimeFmt.mm}:${currentTimeFmt.ss}`
          })
          currentSeconds = currentTimeSecond;
          this.triggerEvent('timeUpdate', {
            currentTime
          })
        }
      }
    },
    _timeFormat(seconds) {
      const mm = Math.floor(seconds / 60);
      const ss = Math.floor(seconds % 60);

      return {
        mm: this._preZero(mm),
        ss: this._preZero(ss)
      }
    },
    _preZero(num) {
      return num > 10 ? num : `0${num}`;
    },
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
        this.triggerEvent('musicPlay')
      })

      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })

      backgroundAudioManager.onPause(() => {
        console.log('onPause')
        this.triggerEvent('musicPause')
      })

      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })

      backgroundAudioManager.onCanplay(() => {
        console.log('onCanplay')
        isMoving = false;
        if (typeof backgroundAudioManager.duration !== 'undefined') {
          this._setTime();
        } else {
          setTimeout(() => {
            this._setTime();
          }, 1000)
        }
      })

      backgroundAudioManager.onTimeUpdate(() => {
        this._setProgress();
      })

      backgroundAudioManager.onEnded(() => {
        console.log('onEnded')
        this.triggerEvent('musicEnd');
      })

      backgroundAudioManager.onError(res => {
        console.error(res.errMsg)
        wx.showToast({
          title: `错误：${res.errCode}`,
        })
      })
    }
  }
})

// pages/player/player.js
let songList;
let currentPlayingIdx = 0;
const backgroundAudioManager = wx.getBackgroundAudioManager();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
    isLyricShow: false,
    lyric: '',
    isSame: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    songList = wx.getStorageSync('songlist')
    currentPlayingIdx = options.index;
    this._loadSongDetail();
  },

  _loadSongDetail() {
    const currentSong = songList[currentPlayingIdx];
    const currentSongId = currentSong.id;
    const playingSongId = app.getPlayingSongId();

    if (currentSong.fee === 1) {
      wx.showToast({
        title: '无播放权限',
      })
    }

    if (playingSongId !== currentSongId) {
      backgroundAudioManager.stop();
      backgroundAudioManager.src = `https://music.163.com/song/media/outer/url?id=${currentSongId}.mp3`;
      backgroundAudioManager.title = currentSong.name;
      backgroundAudioManager.coverImgUrl = currentSong.al.picUrl;
      backgroundAudioManager.singer = currentSong.ar.map(item => item.name).join('/');
      backgroundAudioManager.epname = currentSong.al.name;

      this.savePlayHistory()
    }

    wx.setNavigationBarTitle({
      title: currentSong.name,
    })

    this.setData({
      picUrl: currentSong.al.picUrl,
      isPlaying: true,
      isSame: playingSongId === currentSongId
    })

    app.setPlayingSongId(currentSongId)
    this.getLyric(currentSongId)
  },

  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  onPrev() {
    currentPlayingIdx--;
    if (currentPlayingIdx < 0) {
      currentPlayingIdx = songList.length - 1;
    }
    this._loadSongDetail();
  },

  onNext() {
    currentPlayingIdx++;
    if (currentPlayingIdx === songList.length) {
      currentPlayingIdx = 0;
    }
    this._loadSongDetail();
  },

  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },

  getLyric(songId) {
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'lyric',
        songId
      }
    }).then(res => {
      this.setData({
        lyric: res.result
      })
    })
  },

  timeUpdate(event) {
    this.selectComponent('.lyric').updateTime(event.detail.currentTime)
  },

  onPlay() {
    this.setData({
      isPlaying: true
    })
  },

  onPause() {
    this.setData({
      isPlaying: false
    })
  },

  savePlayHistory() {
    const song = songList[currentPlayingIdx]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    let isExist = history.some(item => item.id === song.id)

    console.log(isExist)

    if (!isExist) {
      history.unshift(song)
      console.log(history)
      wx.setStorage({
        data: history,
        key: openid,
      })
    }
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
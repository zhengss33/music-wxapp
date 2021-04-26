const scroll = {
  isEnd: false,
  start(callback) {
    let timer = null
    callback && window.addEventListener('scroll', () => {
      if (timer) {
        clearTimeout(timer)
      }

      timer = setTimeout(() => {
        // 滚动距离
        const scrollTop = document.documentElement.scrollTop
        // 滚动条总高度
        const scrollHeight = document.documentElement.scrollHeight 
        // 可视区的高度
        const winHeight = document.documentElement.clientHeight

        if (!this.isEnd && scrollTop + winHeight == scrollHeight) {
          window.scrollTo(0, scrollTop - 100)
          callback()
        }
      }, 300)
    })
  },
  end() {
    this.isEnd = true
  }
}

export default scroll
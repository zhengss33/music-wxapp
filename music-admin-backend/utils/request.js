const { default: axios } = require('axios')

// create an axios instance
const service = axios.create({
  timeout: 5000 // request timeout
})

service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.errcode !== undefined && res.errcode !== 0) {
      return Promise.reject(new Error(res.message || res.errmsg || res || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

module.exports = service
import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

export function fetchBannerList() {
  return request({
    url: `${baseURL}/banner/list`,
    method: 'get'
  })
}

export function deleteBanner(params) {
  return request({
    url: `${baseURL}/banner/delete`,
    params,
    method: 'get'
  })
}
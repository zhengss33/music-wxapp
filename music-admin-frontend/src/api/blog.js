import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

export function getBlogList(params) {
  return request({
    url: `${baseURL}/blog/list`,
    method: 'get',
    params
  })
}

export function deleteBlog(data) {
  return request({
    url: `${baseURL}/blog/delete`,
    method: 'post',
    data
  })
}
import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

export function fetchList(params) {
  return request({
    params,
    url: `${baseURL}/playlist/list`,
    method: 'get'
  })
}

export function getDetail(params) {
  return request({
    params,
    url: `${baseURL}/playlist/getDetail`,
    method: 'get'
  })
}

export function updateDetail(data) {
  return request({
    data,
    url: `${baseURL}/playlist/updateDetail`,
    method: 'post'
  })
}

export function deleteList(params) {
  return request({
    params,
    url: `${baseURL}/playlist/delete`,
    method: 'get'
  })
}
import request from '@/utils/request'

const BASE_URL = '/admin/system/sysUser'

export default {
  getUserPageInfo(page, limit, searchObj) {
    return request({
      url: `${BASE_URL}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  saveUser(user) {
    return request({
      url: `${BASE_URL}/addUser`,
      method: 'post',
      data: user
    })
  },

  getUserById(id) {
    return request({
      url: `${BASE_URL}/findUserById/${id}`,
      method: 'get'
    })
  },

  updateUser(user) {
    return request({
      url: `${BASE_URL}/updateUser`,
      method: 'post',
      data: user
    })
  },

  removeUserById(id) {
    return request({
      url: `${BASE_URL}/removeUserById/${id}`,
      method: 'delete'
    })
  },

  updateStatus(id, status) {
    return request({
      url: `${BASE_URL}/updateStatus/${id}/${status}`,
      method: 'get'
    })
  }
}


import request from '@/utils/request'

const BASE_URL = '/admin/system/sysRole'

export default {
  getPageList(page, limit, searchObj) {
    return request({
      url: `${BASE_URL}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  removeId(id) {
    return request({
      url: `${BASE_URL}/remove/${id}`,
      method: 'delete'
    })
  },

  addByRole(role) {
    return request({
      url: `${BASE_URL}/addRole`,
      method: 'post',
      data: role
    })
  },

  getRoleById(id) {
    return request({
      url: `${BASE_URL}/findRoleById/${id}`,
      method: 'get'
    })
  },

  updateRole(role) {
    return request({
      url: `${BASE_URL}/updateRole`,
      method: 'post',
      data: role
    })
  },

  bactchremoveId(ids) {
    return request({
      url: `${BASE_URL}/batchRemove`,
      method: 'delete',
      data: ids
    })
  },

  getRolesByUserId(userId) {
    return request({
      url: `${BASE_URL}/toAssign/${userId}`,
      method: 'get'
    })
  },

  assignRoles(assginRoleVo) {
    return request({
      url: `${BASE_URL}/doAssign`,
      method: 'post',
      data: assginRoleVo
    })
  }
}

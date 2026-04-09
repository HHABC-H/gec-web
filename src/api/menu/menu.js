import request from '@/utils/request'

const BASE_URL = '/admin/system/sysMenu'

export default {
  findNodes() {
    return request({
      url: `${BASE_URL}/findNodes`,
      method: 'get'
    })
  },

  removeById(id) {
    return request({
      url: `${BASE_URL}/removeMenu/${id}`,
      method: 'delete'
    })
  },

  save(sysMenu) {
    return request({
      url: `${BASE_URL}/addMenu`,
      method: 'post',
      data: sysMenu
    })
  },

  updateById(sysMenu) {
    return request({
      url: `${BASE_URL}/updateMenu`,
      method: 'post',
      data: sysMenu
    })
  },

  toAssign(roleId) {
    return request({
      url: `${BASE_URL}/toAssign/${roleId}`,
      method: 'get'
    })
  },

  doAssign(assginMenuVo) {
    return request({
      url: `${BASE_URL}/doAssign`,
      method: 'post',
      data: assginMenuVo
    })
  }
}

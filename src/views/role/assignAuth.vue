<template>
  <div class="app-container">
    <div style="padding: 20px 20px 0 20px;">
      授权角色：{{ $route.query.roleName }}
    </div>
    <el-tree
      ref="tree"
      :data="sysMenuList"
      node-key="id"
      show-checkbox
      default-expand-all
      style="margin: 20px 0"
      :props="defaultProps"
    />
    <div style="padding: 20px;">
      <el-button :loading="loading" type="primary" icon="el-icon-check" size="mini" @click="save">保存</el-button>
      <el-button size="mini" icon="el-icon-refresh-right" @click="$router.push('/example/sysrole')">返回</el-button>
    </div>
  </div>
</template>

<script>
import menuApi from '@/api/menu/menu'

export default {
  name: 'AssignAuth',
  data() {
    return {
      loading: false,
      sysMenuList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const roleId = this.$route.query.id
      menuApi.toAssign(roleId).then(response => {
        this.sysMenuList = response.data || []
        this.$nextTick(() => {
          const checkedIds = this.getCheckedIds(this.sysMenuList)
          this.$refs.tree.setCheckedKeys(checkedIds)
        })
      })
    },
    getCheckedIds(treeList, result = []) {
      treeList.forEach(item => {
        const children = item.children || []
        if (item.select && children.length === 0) {
          result.push(item.id)
        }
        if (children.length > 0) {
          this.getCheckedIds(children, result)
        }
      })
      return result
    },
    save() {
      const checkedNodes = this.$refs.tree.getCheckedNodes(false, true)
      const menuIdList = checkedNodes.map(node => node.id)
      const assginMenuVo = {
        roleId: this.$route.query.id,
        menuIdList
      }
      this.loading = true
      menuApi.doAssign(assginMenuVo).then(response => {
        this.loading = false
        this.$message.success(response.message || '分配权限成功')
        this.$router.push('/example/sysrole')
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

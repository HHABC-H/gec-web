<template>
  <div class="app-container">
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add()">添加</el-button>
    </div>

    <el-table
      :data="sysMenuList"
      row-key="id"
      border
      style="width: 100%; margin-top: 10px;"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="name" label="菜单名称" width="180" />
      <el-table-column label="图标" width="100">
        <template slot-scope="scope">
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="perms" label="权限标识" width="180" />
      <el-table-column prop="path" label="路由地址" width="140" />
      <el-table-column prop="component" label="组件路径" width="180" />
      <el-table-column prop="sortValue" label="排序" width="70" />
      <el-table-column label="状态" width="90">
        <template slot-scope="scope">
          <el-switch :value="scope.row.status === 1" disabled />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="170" />
      <el-table-column label="操作" width="210" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.type !== 2"
            type="success"
            icon="el-icon-plus"
            size="mini"
            title="添加下级"
            @click="add(scope.row)"
          />
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="edit(scope.row)" />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            title="删除"
            :disabled="scope.row.children && scope.row.children.length > 0"
            @click="removeDataById(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysMenu" label-width="120px" size="small" style="padding-right: 40px;">
        <el-form-item v-if="sysMenu.id === ''" label="上级菜单">
          <el-input v-model="sysMenu.parentName" disabled />
        </el-form-item>

        <el-form-item label="菜单类型">
          <el-radio-group v-model="sysMenu.type" :disabled="typeDisabled">
            <el-radio :label="0" :disabled="type0Disabled">目录</el-radio>
            <el-radio :label="1" :disabled="type1Disabled">菜单</el-radio>
            <el-radio :label="2" :disabled="type2Disabled">按钮</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="菜单名称">
          <el-input v-model="sysMenu.name" />
        </el-form-item>

        <el-form-item v-if="sysMenu.type !== 2" label="图标">
          <el-select v-model="sysMenu.icon" clearable>
            <el-option v-for="item in iconList" :key="item.class" :label="item.class" :value="item.class">
              <span style="float: left;"><i :class="item.class" /></span>
              <span style="padding-left: 8px;">{{ item.class }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="排序">
          <el-input-number v-model="sysMenu.sortValue" controls-position="right" :min="0" />
        </el-form-item>

        <el-form-item label="路由地址">
          <el-input v-model="sysMenu.path" placeholder="例如：sysUser" />
        </el-form-item>

        <el-form-item v-if="sysMenu.type !== 0" label="组件路径">
          <el-input v-model="sysMenu.component" placeholder="例如：system/sysUser/list" />
        </el-form-item>

        <el-form-item v-if="sysMenu.type === 2" label="权限标识">
          <el-input v-model="sysMenu.perms" maxlength="100" />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="sysMenu.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="saveOrUpdate">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/menu/menu'

const defaultForm = {
  id: '',
  parentId: 0,
  parentName: '',
  name: '',
  type: 0,
  path: '',
  component: '',
  perms: '',
  icon: '',
  sortValue: 1,
  status: 1
}

export default {
  data() {
    return {
      sysMenuList: [],
      dialogVisible: false,
      dialogTitle: '',
      sysMenu: { ...defaultForm },
      typeDisabled: false,
      type0Disabled: false,
      type1Disabled: false,
      type2Disabled: false,
      iconList: [
        { class: 'el-icon-s-tools' },
        { class: 'el-icon-s-custom' },
        { class: 'el-icon-setting' },
        { class: 'el-icon-user-solid' },
        { class: 'el-icon-s-help' },
        { class: 'el-icon-phone' },
        { class: 'el-icon-s-unfold' },
        { class: 'el-icon-s-operation' },
        { class: 'el-icon-more-outline' },
        { class: 'el-icon-s-check' },
        { class: 'el-icon-tickets' },
        { class: 'el-icon-s-goods' },
        { class: 'el-icon-document-remove' },
        { class: 'el-icon-warning' },
        { class: 'el-icon-warning-outline' },
        { class: 'el-icon-question' },
        { class: 'el-icon-info' }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      api.findNodes().then(response => {
        this.sysMenuList = response.data || []
      })
    },
    removeDataById(id) {
      this.$confirm('此操作将永久删除该记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => api.removeById(id)).then(response => {
        this.$message.success(response.message || '删除成功')
        this.fetchData()
      })
    },
    add(row) {
      this.dialogVisible = true
      this.dialogTitle = row ? '添加下级节点' : '添加目录节点'
      this.sysMenu = { ...defaultForm }
      this.typeDisabled = false
      this.type0Disabled = false
      this.type1Disabled = false
      this.type2Disabled = false

      if (row) {
        this.sysMenu.parentId = row.id
        this.sysMenu.parentName = row.name
        if (row.type === 0) {
          this.sysMenu.type = 1
          this.type2Disabled = true
        } else if (row.type === 1) {
          this.sysMenu.type = 2
          this.typeDisabled = true
        }
      } else {
        this.sysMenu.parentId = 0
        this.sysMenu.type = 0
        this.sysMenu.component = 'Layout'
        this.typeDisabled = true
      }
    },
    edit(row) {
      this.dialogTitle = '修改菜单'
      this.dialogVisible = true
      this.typeDisabled = true
      this.type0Disabled = false
      this.type1Disabled = false
      this.type2Disabled = false
      this.sysMenu = { ...row }
    },
    saveOrUpdate() {
      if (this.sysMenu.type === 0 && this.sysMenu.parentId !== 0) {
        this.sysMenu.component = 'ParentView'
      }
      if (this.sysMenu.id) {
        this.update()
      } else {
        this.save()
      }
    },
    save() {
      api.save(this.sysMenu).then(response => {
        this.$message.success(response.message || '添加成功')
        this.dialogVisible = false
        this.fetchData()
      })
    },
    update() {
      api.updateById(this.sysMenu).then(response => {
        this.$message.success(response.message || '修改成功')
        this.dialogVisible = false
        this.fetchData()
      })
    }
  }
}
</script>

<style scoped>
.tools-div {
  margin-top: 10px;
}
</style>

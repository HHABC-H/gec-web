<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input v-model="searchObj.roleName" style="width: 100%" placeholder="角色名称" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
        <div class="tools-div">
          <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添加</el-button>
          <el-button class="btn-add" size="mini" @click="batchRemove">批量删除</el-button>
        </div>
      </el-form>
    </div>

    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysRole" label-width="120px" size="small" style="padding-right: 40px;">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.roleCode" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="saveOrUpdate">确定</el-button>
      </span>
    </el-dialog>

    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column label="操作" width="240" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="edit(scope.row.id)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="removeDataById(scope.row.id)" />
          <el-button type="warning" icon="el-icon-baseball" size="mini" title="分配权限" @click="showAssignAuth(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
import api from '@/api/role/role'

export default {
  data() {
    return {
      listLoading: false,
      list: [],
      total: 0,
      page: 1,
      limit: 5,
      dialogVisible: false,
      sysRole: {},
      searchObj: {},
      selectValueData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(pageNum = 1) {
      this.listLoading = true
      this.page = pageNum
      api.getPageList(this.page, this.limit, this.searchObj).then(response => {
        this.list = response.data.records || []
        this.total = response.data.total || 0
      }).finally(() => {
        this.listLoading = false
      })
    },
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },
    add() {
      this.dialogVisible = true
      this.sysRole = {}
    },
    edit(id) {
      this.dialogVisible = true
      api.getRoleById(id).then(response => {
        this.sysRole = response.data || {}
      })
    },
    saveOrUpdate() {
      if (this.sysRole.id) {
        this.updateRole()
      } else {
        this.addRole()
      }
    },
    addRole() {
      api.addByRole(this.sysRole).then(() => {
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.fetchData()
      })
    },
    updateRole() {
      api.updateRole(this.sysRole).then(() => {
        this.$message.success('修改成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },
    removeDataById(id) {
      this.$confirm('此操作将永久删除该记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => api.removeId(id)).then(() => {
        this.$message.success('删除成功')
        this.fetchData(this.page)
      })
    },
    handleSelectionChange(selectValue) {
      this.selectValueData = selectValue
    },
    batchRemove() {
      if (this.selectValueData.length === 0) {
        this.$message.warning('请选择要删除的记录')
        return
      }
      this.$confirm('此操作将永久删除所选记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selectValueData.map(item => item.id)
        return api.bactchremoveId(ids)
      }).then(() => {
        this.$message.success('批量删除成功')
        this.fetchData(this.page)
      })
    },
    showAssignAuth(row) {
      this.$router.push(`/example/assignAuth?id=${row.id}&roleName=${encodeURIComponent(row.roleName)}`)
    }
  }
}
</script>

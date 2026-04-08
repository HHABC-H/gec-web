<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="关键字">
              <el-input
                v-model="searchObj.keyword"
                style="width: 95%"
                placeholder="用户名/姓名/手机号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="createTimes"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>

    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添加</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="name" label="姓名" width="110" />
      <el-table-column prop="phone" label="手机" />
      <el-table-column label="状态" width="90">
        <template slot-scope="scope">
          <el-switch
            :value="scope.row.status === 1"
            @change="switchStatus(scope.row, $event)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />

      <el-table-column label="操作" align="center" width="230">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="edit(scope.row.id)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="removeDataById(scope.row.id)" />
          <el-button type="warning" icon="el-icon-user-solid" size="mini" title="分配角色" @click="showAssignRole(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 50]"
      style="padding: 30px 0; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="fetchData"
    />

    <el-dialog title="添加/修改用户" :visible.sync="dialogVisible" width="40%">
      <el-form :model="sysUser" label-width="100px" size="small" style="padding-right: 40px;">
        <el-form-item label="用户名">
          <el-input v-model="sysUser.username" />
        </el-form-item>
        <el-form-item v-if="!sysUser.id" label="密码">
          <el-input v-model="sysUser.password" type="password" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="sysUser.name" />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="sysUser.phone" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="saveOrUpdate">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="dialogRoleVisible" width="40%">
      <el-form label-width="90px" size="small" style="padding-right: 20px;">
        <el-form-item label="用户名">
          <el-input :value="sysUser.username" disabled />
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 12px 0;" />
          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogRoleVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="assignRole">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/user/user'
import roleApi from '@/api/role/role'

const defaultForm = {
  id: null,
  username: '',
  password: '',
  name: '',
  phone: '',
  status: 1
}

export default {
  data() {
    return {
      listLoading: true,
      list: [],
      total: 0,
      page: 1,
      limit: 5,
      searchObj: {},
      createTimes: [],
      dialogVisible: false,
      sysUser: { ...defaultForm },
      dialogRoleVisible: false,
      allRoles: [],
      userRoleIds: [],
      isIndeterminate: false,
      checkAll: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(page = 1) {
      this.listLoading = true
      this.page = page

      const params = { ...this.searchObj }
      if (this.createTimes && this.createTimes.length === 2) {
        params.createTimeBegin = this.createTimes[0]
        params.createTimeEnd = this.createTimes[1]
      }

      api.getUserPageInfo(this.page, this.limit, params).then(response => {
        this.list = response.data.records
        this.total = response.data.total
      }).finally(() => {
        this.listLoading = false
      })
    },

    handleSizeChange(size) {
      this.limit = size
      this.fetchData(1)
    },

    resetData() {
      this.searchObj = {}
      this.createTimes = []
      this.fetchData(1)
    },

    add() {
      this.sysUser = { ...defaultForm }
      this.dialogVisible = true
    },

    edit(id) {
      api.getUserById(id).then(response => {
        this.sysUser = response.data || { ...defaultForm }
        this.dialogVisible = true
      })
    },

    saveOrUpdate() {
      if (this.sysUser.id) {
        this.updateUser()
      } else {
        this.addUser()
      }
    },

    addUser() {
      api.saveUser(this.sysUser).then(() => {
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.fetchData(1)
      })
    },

    updateUser() {
      api.updateUser(this.sysUser).then(() => {
        this.$message.success('修改用户成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },

    removeDataById(id) {
      this.$confirm('此操作将永久删除该记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return api.removeUserById(id)
      }).then(() => {
        this.$message.success('删除成功')
        this.fetchData(this.page)
      })
    },

    switchStatus(row, enabled) {
      const status = enabled ? 1 : 0
      api.updateStatus(row.id, status).then(() => {
        row.status = status
        this.$message.success('状态修改成功')
      }).catch(() => {
        this.fetchData(this.page)
      })
    },

    showAssignRole(row) {
      this.sysUser = { ...row }
      this.dialogRoleVisible = true
      roleApi.getRolesByUserId(row.id).then(response => {
        this.allRoles = response.data.allRoles || []
        this.userRoleIds = response.data.userRoleIds || []
        this.checkAll = this.userRoleIds.length === this.allRoles.length && this.allRoles.length > 0
        this.isIndeterminate = this.userRoleIds.length > 0 && this.userRoleIds.length < this.allRoles.length
      })
    },

    handleCheckAllChange(value) {
      this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
      this.isIndeterminate = false
    },

    handleCheckedChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.allRoles.length && this.allRoles.length > 0
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allRoles.length
    },

    assignRole() {
      const assginRoleVo = {
        userId: this.sysUser.id,
        roleIdList: this.userRoleIds
      }
      roleApi.assignRoles(assginRoleVo).then(() => {
        this.$message.success('分配角色成功')
        this.dialogRoleVisible = false
        this.fetchData(this.page)
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

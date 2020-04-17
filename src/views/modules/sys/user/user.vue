<template>
  <div class="mod-user">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="账户名称">
            <el-input v-model="dataForm.userName" placeholder="账户名称" maxlength="16"  clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="真实姓名">
            <el-input v-model="dataForm.realName" placeholder="真实姓名" maxlength="10"  clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;padding-right: 5px">
          <el-form-item>
            <el-button icon="el-icon-search" type="warning" @click="getSearchDataList()">查询</el-button>
            <el-button icon="el-icon-refresh" style="background-color: #30b6aa; color: white" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
     <el-row>
       <el-col :span="24" style="text-align: right;padding-right: 5px">
         <el-form-item style="margin-bottom: 5px">
           <el-button icon="el-icon-circle-plus-outline" v-if="isAuth('sys:user:save')" size="mini" @click="addOrUpdateHandle()" style="background: #3698ce;color: #ffffff">新增</el-button>
           <el-button v-if="isAuth('sys:user:delete')" type="danger" size="mini" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">
             <icon-svg name="批量删除" style="vertical-align: middle"></icon-svg>
             批量删除
           </el-button>
         </el-form-item>
       </el-col>
     </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      @sort-change="changeSort"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="60">
      </el-table-column>
      <el-table-column
        type="index"
        width="80"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="账户名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="realName"
        header-align="center"
        align="center"
        label="真实姓名"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        label="邮箱"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="手机号"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="是否启用">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">启用</el-tag>
          <el-tag v-else size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sysCrtByName"
        header-align="center"
        align="center"
        label="创建者"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="sysCrtDtm"
        header-align="center"
        align="center"
        label="创建时间"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          {{$formatDate(row.sysCrtDtm, 'Second')}}
        </template>
      </el-table-column>
      <el-table-column
        v-if="isAuth('sys:user:update') || isAuth('sys:user:delete')"
        header-align="center"
        align="center"
        fixed="right"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:user:update')" type="primary" size="small"
                     :disabled="scope.row.userName === 'admin'"
                     @click="addOrUpdateHandle(scope.row.userId)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑
          </el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.userId)"
                     :disabled="scope.row.userName === 'admin'"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 编辑 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './user-add-or-update'
  import { toUnderScore, abbreviate } from '@/utils'

  export default {
    data () {
      return {
        dataForm: {
          userName: '',
          realName: '',
          fullName: '',
          organization: '',
          sort: {}
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.resetForm()
    },
    methods: {
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'post',
          data: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'userName': this.dataForm.userName,
            'realName': this.dataForm.realName,
            'userType': this.dataForm.userType,
            'fullName': this.dataForm.fullName,
            'organizationCode': this.dataForm.organization,
            'sort': this.dataForm.sort
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
            this.values = data.page.values
          } else {
            this.dataList = []
            this.totalPage = 0
            this.values = ''
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, this.values)
        })
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定删除${!this.dataListSelections.length ? '这条' : '选中'}数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  if (this.dataList.length === 1) {
                    this.pageIndex = this.pageIndex === 1 ? 1 : this.pageIndex - 1
                  }
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
        })
      },
      resetForm () {
        this.dataForm = {}
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      },
      changeSort (sortRule) {
        const column = toUnderScore(sortRule.prop)
        const order = abbreviate(sortRule.order)

        this.dataForm.sort = {
          column: column,
          order: order
        }
        this.getDataList()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mod-user .el-table{
    .el-button--primary.is-disabled, .el-button--primary.is-disabled:active, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:hover{
      color: #3E8EF7;
      background-color: #fff;
    }
    .el-button--danger.is-disabled, .el-button--danger.is-disabled:active, .el-button--danger.is-disabled:focus, .el-button--danger.is-disabled:hover{
      color: #3E8EF7;
      background-color: #fff;
    }
  }
</style>

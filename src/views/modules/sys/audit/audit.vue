<template>
  <div class="mod-audit">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="流程名称">
            <el-input v-model="dataForm.name" placeholder="流程名称" maxlength="16"  clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="模块">
            <xkl-select style="width: 100%" v-model="dataForm.module"  select-type="AUDIT_MODULE" placeholder="模块"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否启用">
            <el-select style="width: 100%" v-model="dataForm.validFlag" clearable placeholder="状态">
              <el-option value="1" label="启用"></el-option>
              <el-option value="0" label="禁用"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item>
            <el-button icon="el-icon-search" type="warning" @click="getSearchDataList()">查询</el-button>
            <el-button icon="el-icon-refresh" style="background-color: #30b6aa; color: white" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
     <el-row>
       <el-col :span="24" style="text-align: right;padding-right: 5px">
         <el-form-item style="margin-bottom: 5px">
           <el-button icon="el-icon-circle-plus-outline" v-if="isAuth('sys:audit:save')" size="mini" @click="addOrUpdateHandle()" style="background: #3698ce;color: #ffffff">新增</el-button>
           <el-button v-if="isAuth('sys:audit:delete')" type="danger" size="mini" @click="deleteHandle()"
                      :disabled="dataListSelections.length <= 0">
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
      @row-dblclick="dbAddDetailHandle"
      style="width: 100%;">
      <el-table-column
        prop="id"
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
        prop="name"
        header-align="center"
        align="center"
        label="流程名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="moduleName"
        header-align="center"
        align="center"
        label="模块"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="validFlag"
        header-align="center"
        align="center"
        width="120"
        label="是否启用">
        <template slot-scope="scope">
          <el-switch
            @change="(val) => handleStatus(val, scope.row.id)"
            v-model="scope.row.validFlag"
            active-color="#13ce66">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="sysCrtDtm"
        header-align="center"
        align="center"
        label="创建时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="isAuth('sys:audit:update') || isAuth('sys:audit:delete')"
        header-align="center"
        align="center"
        fixed="right"
        width="220"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small"
                     @click="addOrUpdateHandle(scope.row.id)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑
          </el-button>
          <el-button type="warning" size="mini" @click="addDetailHandle(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">
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
    <audit-details v-if="detailDialog" ref="auditDetails"></audit-details>
    <!-- 弹窗, 新增 / 编辑 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './audit-add-or-update'
  import AuditDetails from './audit-details'
  import { toUnderScore, abbreviate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          name: '',
          module: '',
          validFlag: 1,
          description: '',
          auditDetailEntityList: []
        },
        detailDialog: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        tableData: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      AuditDetails
    },
    activated () {
      this.resetForm()
    },
    methods: {
      addDetailHandle (id) {
        this.detailDialog = true
        this.$nextTick(() => {
          this.$refs.auditDetails.init(id)
        })
      },
      // 双击table行显示详情
      dbAddDetailHandle (row) {
        this.detailDialog = true
        this.$nextTick(() => {
          this.$refs.auditDetails.init(row.id)
        })
      },
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/audit/list'),
          method: 'post',
          data: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'name': this.dataForm.name,
            'module': this.dataForm.module,
            'validFlag': this.dataForm.validFlag
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.dataList.forEach(item => {
              if (item.validFlag === 1) {
                item.validFlag = true
              } else {
                item.validFlag = false
              }
            })
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
      // 编辑状态
      handleStatus (val, id) {
        const status = val === true ? 1 : 0
        this.$http({
          url: this.$http.adornUrl('/sys/audit/changeValidFlag'),
          method: 'get',
          params: this.$http.adornParams({
            'id': id,
            'status': status
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.getDataList()
          } else {
            this.$message(data.msg)
          }
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
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除${!this.dataListSelections.length ? '这条' : '选中'}数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/audit/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
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

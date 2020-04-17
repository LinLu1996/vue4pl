<template>
  <div>
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="承运商">
            <!--            <el-input v-model="dataForm.carrierName" placeholder="承运商名称" clearable></el-input>-->
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" keyType="carrierId" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList" placeholder="承运商"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="KPI月度">
            <xkl-date-picker v-model="kpiTime" type="monthrange"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="委托方">
            <xkl-select style="width: 100%" v-model="dataForm.ownerId" keyType="id" labelType="ownerName" linkage="/transresources/ttrconsignor/noPowerList" placeholder="委托方"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item>
            <el-button v-if="isAuth('transmanagement:tmtrain:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button v-if="isAuth('transmanagement:tmtrain:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('transmanagement:tmtrain:save')" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
            <el-button v-if="isAuth('transmanagement:tmtrain:trueExport')" type="success" size="mini" icon="el-icon-upload" @click="uploadPageHandle(dataForm.id)">导入</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      @sort-change="changeSort"
      ref="tableList"
      @row-dblclick="dbShowDetails"
      style="width: 100%;">
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="kpiMonth"
        header-align="center"
        align="center"
        label="KPI月度"
        width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierName"
        header-align="center"
        align="center"
        label="承运商"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="ownerName"
        header-align="center"
        align="center"
        label="委托方"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="trainNum"
        header-align="center"
        align="center"
        label="培训次数"
        width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="trainCompletionNum"
        header-align="center"
        align="center"
        label="达标次数"
        width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="isAuth('transmanagement:tmtrain:update') || isAuth('transmanagement:tmtrain:info')"
        header-align="center"
        align="center"
        fixed="right"
        width="220"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('transmanagement:tmtrain:update')" type="primary" size="small"
                     @click="addOrUpdateHandle(scope.row.id)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑
          </el-button>
          <el-button v-if="isAuth('transmanagement:tmtrain:info')" type="warning" size="small" @click="showDetails(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情
          </el-button>
          <el-button v-if="isAuth('transmanagement:tmtrain:delete')" type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">
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
    <upload-page
      v-if="importVisible"
      ref="uploadPage"
      title="培训记录导入"
      fileName="培训记录导入模板.xlsx"
      uploadUrl="/transmanagement/tmtrain/export"
      submitUrl="/transmanagement/tmtrain/trueExport"
      :acceptType="['xls', 'xlsx']"
      @refreshDataList="getDataList"></upload-page>
    <train-detail  v-if="detailVisible" ref="trainDetail"></train-detail>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import trainDetail from './train-detail'
  import AddOrUpdate from './train-add-or-update'
  import uploadPage from '@/components/upload/upload-page'
  import { toUnderScore, abbreviate, formatDate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          carrierId: '',
          carrierName: '',
          ownerId: '',
          ownerName: ''
        },
        importVisible: false,
        complaintDate: [],
        occurrenceDate: [],
        kpiTime: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        detailVisible: false,
        backTimelyUploadVisible: false,
        selectionDataList: [],
        dataListSelections: [],
        sort: {}
      }
    },
    components: {
      uploadPage,
      trainDetail,
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
        let afterKpiTime = null
        let beforeKpiTime = null
        if (this.kpiTime && this.kpiTime.length > 0) {
          beforeKpiTime = formatDate(this.kpiTime[0], 'Month').split('-').join('')
          afterKpiTime = formatDate(this.kpiTime[1], 'Month').split('-').join('')
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transmanagement/tmtrain/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'carrierId': this.dataForm.carrierId,
            'carrierName': this.dataForm.carrierName,
            'ownerId': this.dataForm.ownerId,
            'ownerName': this.dataForm.ownerName,
            'beforeKpiMonth': beforeKpiTime,
            'afterKpiMonth': afterKpiTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list && data.page.list.length ? data.page.list.map(item => {
              item.kpiMonth = this.$formatDate(item.kpiMonth, 'Month')
              return item
            }) : []
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      uploadPageHandle (id) {
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPage.init(id)
        })
      },
      showDetails (id) {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.trainDetail.init(id)
        })
      },
      // 双击查看详情
      dbShowDetails (row) {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.trainDetail.init(row.id)
        })
      },
      // 删除
      deleteHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定删除这条数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/transmanagement/tmtrain/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '删除成功',
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
      resetForm () {
        this.dataForm = {}
        this.complaintDate = []
        this.occurrenceDate = []
        this.kpiTime = []
        this.pageIndex = 1
        this.pageSize = 10
        this.$refs['tableList'].clearSort()
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
<style lang="scss">
  .el-month-table td .cell {
    width: 60px;
    height: 36px;
    display: block;
    line-height: 36px;
    color: #606266;
    margin: 0 auto;
    border-radius: 18px;
  }
  .el-month-table td.end-date .cell, .el-month-table td.start-date .cell {
    color: #fff;
    background-color: #409eff;
  }
</style>

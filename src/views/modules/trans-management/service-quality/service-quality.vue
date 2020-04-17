<template>
  <div>
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="承运商">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" labelType="carrierName" placeholder="承运商名称" linkage="/transresources/trcarrier/noPowerList"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="KPI月度">
            <xkl-date-picker v-model="kpiTime" type="monthrange"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;padding-right: 5px">
          <el-button v-if="isAuth('transmanagement:tmqualitystatistics:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          <el-button v-if="isAuth('transmanagement:tmqualitystatistics:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('transmanagement:tmqualitystatistics:trueExport')" type="success" size="mini" icon="el-icon-upload" @click="uploadPageHandle(dataForm.id)">导入</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      ref="tableList"
      @row-dblclick="dbGetVehicleInfo"
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
        width="120"
        label="KPI月度"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierName"
        header-align="center"
        align="center"
        label="承运商"
        min-width="150"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="returnExtractNum"
        header-align="center"
        align="center"
        width="150"
        label="销退提货单数"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="returnPunctualNum"
        header-align="center"
        align="center"
        width="160"
        label="销退准时返回数"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="returnPunctualRate"
        width="120"
        header-align="center"
        align="center"
        label="退回准时率"
      >
        <template slot-scope="{row}">{{row.returnPunctualRate + '%'}}</template>
      </el-table-column>
      <el-table-column
        prop="extractPunctualNum"
        width="140"
        header-align="center"
        align="center"
        label="准时提货次数"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="extractPunctualRate"
        width="120"
        header-align="center"
        align="center"
        label="准时提货率"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">{{row.extractPunctualRate + '%'}}</template>
      </el-table-column>
      <el-table-column
        prop="ownerName"
        header-align="center"
        align="center"
        min-width="150"
        show-overflow-tooltip
        label="委托方">
      </el-table-column>
      <el-table-column
        prop="transportTypeName"
        width="140"
        header-align="center"
        align="center"
        show-overflow-tooltip
        label="运输方式">
      </el-table-column>
      <el-table-column
        v-if="isAuth('transmanagement:tmqualitystatistics:info')"
        header-align="center"
        align="center"
        width="180"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('transmanagement:tmqualitystatistics:info')" type="warning" size="small" @click="getVehicleInfo(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情</el-button>
          <el-button v-if="isAuth('transmanagement:tmqualitystatistics:delete')" type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">
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
    <upload-page
      v-if="importVisible"
      ref="uploadPage"
      title="服务质量统计导入"
      fileName="服务质量统计导入模板.xlsx"
      uploadUrl="/transmanagement/tmqualitystatistics/importTmqualitystatistics"
      submitUrl="/transmanagement/tmqualitystatistics/trueExport"
      :acceptType="['xls', 'xlsx']"
      @refreshDataList="getDataList"></upload-page>
    <service-quality-info  v-if="serviceQualityVisible" ref="sserviceQualityInfo"></service-quality-info>
  </div>
</template>

<script>
  import ServiceQualityInfo from './service-quality-info'
  import uploadPage from '@/components/upload/upload-page'
  import { formatDate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          carrierId: '',
          kpiMonth: ''
        },
        dataList: [],
        kpiTime: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        serviceQualityVisible: false,
        importVisible: false
      }
    },
    components: {
      ServiceQualityInfo,
      uploadPage
    },
    activated () {
      this.urls = this.$http.adornUrl(`/transmanagement/tmqualitystatistics/importTmqualitystatistics?token=${this.$cookie.get('token')}`)
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
          url: this.$http.adornUrl('/transmanagement/tmqualitystatistics/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'carrierId': this.dataForm.carrierId,
            'beforeKpiMonth': beforeKpiTime,
            'afterKpiMonth': afterKpiTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list && data.page.list.length ? data.page.list.map(item => {
              const kpiYear = item.kpiMonth ? item.kpiMonth.substring(0, 4) : null
              const kpiMon = item.kpiMonth ? item.kpiMonth.substring(4) : null
              item.kpiMonth = `${kpiYear}年${kpiMon}月`
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
        this.dateValue = []
        this.kpiTime = []
        this.pageIndex = 1
        this.pageSize = 10
        this.$refs['tableList'].clearSort()
        this.getDataList()
      },
      checkUpload (file) {
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          this.$message.warning('文件不能大于50M')
          return false
        }
      },
      handleChange (file) {
        this.dataListLoading = true
        if (file.status === 'success') {
          this.dataListLoading = true
        }
      },
      handleAvatarSuccess (response) {
        this.getSearchDataList()
      },
      uploadPageHandle (id) {
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPage.init(id)
        })
      },
      // 详情
      getVehicleInfo (id) {
        this.serviceQualityVisible = true
        this.$nextTick(() => {
          this.$refs.sserviceQualityInfo.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm('确定删除这条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/transmanagement/tmqualitystatistics/delete'),
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
      // 双击查看详情
      dbGetVehicleInfo (row) {
        this.serviceQualityVisible = true
        this.$nextTick(() => {
          this.$refs.sserviceQualityInfo.init(row.id)
        })
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

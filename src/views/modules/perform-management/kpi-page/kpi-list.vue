<template>
  <div class="mod-log" v-loading="loading">
    <el-form ref="dataForm" :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="KPI月度" prop="kpiMonth">
            <xkl-date-picker v-model="dataForm.kpiMonth" type="month" placeholder="选择月份"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运输项目" prop="projectKpiId">
            <xkl-select style="width: 100%"  v-model="dataForm.projectKpiId" labelType="projectKpiName" placeholder="请选择运输项目" linkage="/performancemanagement/project/containsPowerList"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运输方式" prop="transportMethod">
            <xkl-select style="width: 100%" v-model="dataForm.transportMethod" keyType="transportType" select-type="TRANSPORT_TYPE" placeholder="选择运输方式"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item>
            <el-button v-if="isAuth('performancemanagement:projectrecord:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button v-if="isAuth('performancemanagement:projectrecord:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('performancemanagement:project:exportAssessment')" type="success" size="mini"  icon="el-icon-download" :disabled="dataListSelections.length !==1" @click="outPutExcel">导出</el-button>
            <el-button v-if="isAuth('performancemanagement:projectrecord:generateAndSave')" type="success" @click="generateHandle()" size="mini">生成</el-button>
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
      @row-dblclick="dbAddDetailHandle"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="60">
      </el-table-column>
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
        min-width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="projectKpiName"
        header-align="center"
        align="center"
        label="运输项目"
        min-width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="templateName"
        header-align="center"
        align="center"
        label="模板名称"
        min-width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="transportMethod"
        header-align="center"
        align="center"
        min-width="180"
        label="运输方式"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="score"
        header-align="center"
        align="center"
        min-width="120"
        label="分数"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="standardScore"
        header-align="center"
        align="center"
        min-width="120"
        label="标准分"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="isAuth('transresources:trcarrier:update') || isAuth('transresources:trcarrier:details')"
        header-align="center"
        align="center"
        width="180"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('performancemanagement:projectrecord:info')" type="warning" size="mini" @click="showDetailHandle(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情</el-button>
          <el-button v-if="isAuth('performancemanagement:projectrecord:delete')" type="danger" size="mini" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <generate-page v-if="generateShow" ref="generatePage" @refreshDataList="getSearchDataList"></generate-page>
  </div>
</template>

<script>
  import {formatDate, resetData} from '../../../../utils';
  import ProjectDetails from './kpi-details'
  import GeneratePage from './project-generate'
  export default {
    data () {
      return {
        dataForm: {
          kpiMonth: '',
          projectKpiId: '',
          transportMethod: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        loading: false,
        dateValue: [],
        dataListSelections: [],
        generateShow: false
      }
    },
    activated () {
      this.resetForm()
    },
    components: {
      ProjectDetails,
      GeneratePage
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
          url: this.$http.adornUrl('/performancemanagement/projectrecord/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm,
            'kpiMonth': this.dataForm.kpiMonth ? formatDate(this.dataForm.kpiMonth, 'Month').replace('-', '') : undefined
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.dataList = this.dataList.map(res => {
              if (res.kpiMonth) {
                res.kpiMonth = this.$formatDate(res.kpiMonth, 'Month')
                return res
              }
            })
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      selectionChangeHandle (val) {
        this.dataListSelections = val
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
        resetData(this.dataForm)
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      },
      generateHandle () {
        this.generateShow = true
        this.$nextTick(() => {
          this.$refs.generatePage.init()
        })
      },
      showDetailHandle (id) {
        this.$router.push({
          path: '/perform-management/kpi-page/kpi-details',
          query: {
            id: id
          }
        })
      },
      // 双击table行显示详情
      dbAddDetailHandle (row) {
        this.$router.push({
          path: '/perform-management/kpi-page/kpi-details',
          query: {
            id: row.id
          }
        })
      },
      // 导出报表
      outPutExcel () {
        this.loading = true
        let kpiMonth = this.dataListSelections[0].kpiMonth
        let projectKpiName = this.dataListSelections[0].projectKpiName
        let id = this.dataListSelections[0].id
        this.$http({
          url: this.$http.adornUrl('/performancemanagement/tkpiassessmenttemplate/exportAssessment'),
          method: 'post',
          data: this.$http.adornData({
            'id': id,
            'type': 'project'
          }),
          responseType: 'blob'
        }).then(({data}) => {
          this.loading = false
          const link = document.createElement('a')
          let blob = new Blob([data], {type: 'application/vnd.ms-excel'});
          if (blob.size === 0) {
            this.$message.error('准备导出的数据为0条')
            return
          }
          let fileName = `${kpiMonth}_${projectKpiName}`
          // for IE
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, `${fileName}.xls`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `${fileName}.xls`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      },
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除这条数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/performancemanagement/projectrecord/delete`),
            method: 'post',
            data: this.$http.adornData(ids, false)
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
        }).catch(() => {})
      }
    }
  }
</script>

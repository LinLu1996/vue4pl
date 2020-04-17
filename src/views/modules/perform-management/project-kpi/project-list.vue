<template>
  <div class="mod-log" v-loading="loading">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目名称">
            <el-input v-model="dataForm.projectKpiName" placeholder="项目名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否适用于绩效" label-width="140px">
            <el-select v-model="dataForm.isAssessment" style="width: 100%;" :clearable="true">
              <el-option key="0" label="否" :value="0">
              </el-option>
              <el-option key="1" label="是" :value="1">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否适用于费用结算" label-width="150px">
            <el-select v-model="dataForm.isCostSettlement" style="width: 100%;" :clearable="true">
              <el-option key="0" label="否" :value="0">
              </el-option>
              <el-option key="1" label="是" :value="1">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item>
            <el-button v-if="isAuth('performancemanagement:project:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button v-if="isAuth('performancemanagement:project:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('performancemanagement:project:save')" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
            <el-button v-if="isAuth('performancemanagement:project:updateStatusByIdsOne')"
               size="mini" icon="el-icon-check"
               :disabled="this.selectionDataList.length === 0 || currentStatus === 0"
               @click="handleStatus(0)"
               type="danger">启用</el-button>
            <el-button icon="el-icon-close" v-if="isAuth('performancemanagement:project:updateStatusByIdsTwo')"
               :disabled="this.selectionDataList.length === 0 || currentStatus === 1"
               @click="handleStatus(1)" size="mini"
               type="danger">禁用</el-button>
            <el-button v-if="isAuth('performancemanagement:project:outPutExcel')" type="success" size="mini"  icon="el-icon-download" @click="outPutExcel">导出</el-button>
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
      @selection-change="selectionChangeHandle"
      @row-dblclick="dbAddDetailHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="60"
        :selectable="selectable"
      >
      </el-table-column>
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="projectKpiName"
        header-align="center"
        align="center"
        label="项目全称"
        min-width="160"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="shortName"
        header-align="center"
        align="center"
        label="项目简称"
        width="160"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="logisticsName"
        width="180"
        header-align="center"
        align="center"
        label="所属运营中心"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="isEnabled"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status== 0" size="small">有效</el-tag>
          <el-tag v-if="scope.row.status== 1" size="small" type="danger">无效</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isAssessment"
        header-align="center"
        align="center"
        width="180"
        label="是否适用于绩效"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isAssessment== 0" size="small" type="warning">否</el-tag>
          <el-tag v-if="scope.row.isAssessment== 1" size="small" type="success">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isCostSettlement"
        header-align="center"
        align="center"
        width="240"
        label="是否适用于费用结算"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isCostSettlement== 0" size="small" type="warning">否</el-tag>
          <el-tag v-if="scope.row.isCostSettlement== 1" size="small" type="success">是</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="isCostSettlement"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        width="240"-->
<!--        label="是否适用于班车"-->
<!--        show-overflow-tooltip>-->
<!--        <template slot-scope="scope">-->
<!--          <el-tag v-if="scope.row.isShuttleBus== 0" size="small" type="warning">否</el-tag>-->
<!--          <el-tag v-if="scope.row.isShuttleBus== 1" size="small" type="success">是</el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        v-if="isAuth('transresources:trcarrier:update') || isAuth('transresources:trcarrier:details')"
        header-align="center"
        align="center"
        width="150"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('performancemanagement:project:update')" type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑
          </el-button>
          <el-button v-if="isAuth('performancemanagement:project:info')" type="warning" size="mini" @click="showDetailHandle(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情</el-button>
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
    <project-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></project-add-or-update>
    <project-details v-if="isShowDetails" ref="showDetails"></project-details>
    <generate-page v-if="generateShow" ref="generatePage"></generate-page>
  </div>
</template>

<script>
  import ProjectAddOrUpdate from './project-add-or-update'
  import ProjectDetails from './project-kpi-details'
  import GeneratePage from './project-generate'
  export default {
    data () {
      return {
        dataForm: {
          projectKpiName: '',
          isAssessment: null,
          isCostSettlement: null
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        loading: false,
        selectionDataList: [],
        currentStatus: '',
        organization: [],
        sort: {},
        dateValue: [],
        addOrUpdateVisible: false,
        isShowDetails: false,
        generateShow: false
      }
    },
    activated () {
      this.resetForm()
    },
    components: {
      ProjectAddOrUpdate,
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
          url: this.$http.adornUrl('/performancemanagement/project/list'),
          method: 'post',
          data: this.$http.adornData({
            ...this.dataForm,
            'page': this.pageIndex,
            'limit': this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
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
        this.pageIndex = 1
        this.pageSize = 10
        this.$refs['tableList'].clearSort()
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        if (val.length) {
          this.currentStatus = val[0].status
        } else {
          this.currentStatus = ''
        }
        this.selectionDataList = val
      },
      selectAll () {
        this.selectionDataList = this.selectionDataList.filter(res => res.status === this.currentStatus)
      },
      selectable (row) {
        if (this.selectionDataList.length && row.status !== this.currentStatus) {
          return false
        }
        return true
      },
      // 编辑状态
      handleStatus (status) {
        let ids = this.selectionDataList.map(item => {
          return item.id
        })
        this.$http({
          url: this.$http.adornUrl('/performancemanagement/project/updateStatusByIds'),
          method: 'post',
          data: this.$http.adornData({
            'ids': ids,
            'status': status
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
          } else {
            this.$message.error(data.msg)
          }
          this.getDataList()
        })
      },
      // 导出报表
      outPutExcel () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/performancemanagement/project/outPutExcel'),
          method: 'post',
          data: this.$http.adornData({
            ...this.dataForm
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
          let fileName = new Date().getTime()
          // for IE
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, `运输项目导出${fileName}.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `运输项目导出${fileName}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      },
      generateHandle () {
        this.generateShow = true
        this.$nextTick(() => {
          this.$refs.generatePage.init()
        })
      },
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        this.$router.push({
          path: '/project-kpi/project-add-or-update',
          query: {
            id: id
          }
        })
      },
      showDetailHandle (id) {
        this.isShowDetails = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(id)
        })
      },
      // 双击table行显示详情
      dbAddDetailHandle (row) {
        this.isShowDetails = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(row.id)
        })
      }
    }
  }
</script>

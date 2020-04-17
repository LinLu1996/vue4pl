<template>
  <div class="mod-config">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="模板名称">
            <el-input v-model="dataForm.templateName" placeholder="模板名称" maxlength="20" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="text-align: right;padding-right: 5px">
          <el-button v-if="isAuth('performancemanagement:tkpiassessmenttemplate:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          <el-button v-if="isAuth('performancemanagement:tkpiassessmenttemplate:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('performancemanagement:tkpiassessmenttemplate:saveKpiAssessmentTemplate')" icon="el-icon-circle-plus-outline" @click="goAddOrUpdatePage()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
            <el-button v-if="isAuth('performancemanagement:tkpiassessmenttemplate:updateStatuso')"
              @click="handleStatus(0)"
              size="mini" icon="el-icon-check"
              :disabled="this.dataListSelections.length < 1 || templateStatus === true"
              type="danger">启用</el-button>
            <el-button v-if="isAuth('performancemanagement:tkpiassessmenttemplate:updateStatusc')"
              @click="handleStatus(1)"
              size="mini" icon="el-icon-close"
              :disabled="this.dataListSelections.length < 1 || templateStatus === false"
              type="danger">禁用</el-button>
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
      @row-dblclick="dbShowDetails"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        :selectable="selectable"
        width="60">
      </el-table-column>
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="templateName"
        header-align="center"
        align="center"
        label="模板名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="templateCode"
        header-align="center"
        align="center"
        label="模板编号"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="templateAproveDate"
        header-align="center"
        align="center"
        label="批准日期"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="templateImplementedDate"
        header-align="center"
        align="center"
        label="实施日期"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="templateStatus"
        header-align="center"
        align="center"
        label="状态"
        width="150"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-tag v-if="row.templateStatus== true" size="small">有效</el-tag>
          <el-tag v-if="row.templateStatus== false" size="small" type="danger">无效</el-tag>
         <!-- <el-switch
            @change="(val) => handleStatus(val, row.id)"
            v-model="row.templateStatus"
            active-color="#13ce66">
          </el-switch>-->
        </template>
      </el-table-column>
      <el-table-column
        v-if="isAuth('performancemanagement:tkpiassessmenttemplate:editKpiAssessmentTemplate') || isAuth('performancemanagement:tkpiassessmenttemplate:info')"
        header-align="center"
        align="center"
        fixed="right"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('performancemanagement:tkpiassessmenttemplate:editKpiAssessmentTemplate')" type="primary" size="small" @click="goAddOrUpdatePage(scope.row.id)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑</el-button>
          <el-button v-if="isAuth('performancemanagement:tkpiassessmenttemplate:info')" type="primary" size="small" @click="showDetails(scope.row.id)">
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
    <el-row v-if="$route.query.type === 'product'" style="margin-top: 20px;text-align: right">
      <el-col>
        <el-form>
          <el-form-item>
            <el-button @click="$router.go(-1)">关闭</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 弹窗, 新增 / 编辑 -->
    <template-details v-if="isShowDetails" ref="showDetails" @refreshDataList="getDataList"></template-details>
  </div>
</template>

<script>
  import templateDetails from './template-details'
  // import ContractDetails from './contract-details'
  export default {
    data () {
      return {
        dataForm: {
          templateName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dateValue: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        isShowDetails: false
      }
    },
    components: {
      templateDetails
      // ContractDetails
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
          url: this.$http.adornUrl('/performancemanagement/tkpiassessmenttemplate/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'templateName': this.dataForm.templateName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.dataList = this.dataList.map(res => {
              res.templateStatus === 0 ? res.templateStatus = true : res.templateStatus = false
              if (res.templateImplementedDate) {
                res.templateImplementedDate = this.$formatDate(res.templateImplementedDate)
              }
              if (res.templateAproveDate) {
                res.templateAproveDate = this.$formatDate(res.templateAproveDate)
              }
              return res
            })
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
      // 多选
      selectionChangeHandle (val) {
        if (val.length) {
          this.templateStatus = val[0].templateStatus
        } else {
          this.templateStatus = ''
        }
        this.dataListSelections = val
      },
      selectAll () {
        this.dataListSelections = this.dataListSelections.filter(res => res.templateStatus === this.templateStatus)
      },
      selectable (row) {
        if (this.dataListSelections.length && row.templateStatus !== this.templateStatus) {
          return false
        }
        return true
      },
      showDetails (id) {
        this.isShowDetails = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(id)
        })
      },
      // 双击显示详情
      dbShowDetails (row) {
        this.isShowDetails = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(row.id)
        })
      },
      goAddOrUpdatePage (id) {
        this.$router.push({
          path: '/perform-management-perform-appraisal/exam-template/template-add',
          query: {
            id: id
          }
        })
      },
      // 新增 / 编辑
      addOrUpdateHandle (id, type) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, type)
        })
      },
      handleStatus (templateStatus) {
        /* const templateStatus = val === true ? 0 : 1 */
        let ids = this.dataListSelections.map(res => {
          return res.id
        })
        this.$http({
          url: this.$http.adornUrl('/performancemanagement/tkpiassessmenttemplate/updateStatus'),
          method: 'post',
          data: this.$http.adornData({
            'ids': ids,
            'templateStatus': templateStatus
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      dataFormSubmit () {
        if (this.dataListSelections.length > 1) {
          this.$message({
            type: 'warning',
            message: '最多选择一项'
          })
          return false
        }
        let ids = this.dataListSelections.map(res => {
          return res.id
        })
        this.$http({
          url: this.$http.adornUrl(`/transresources/trproduct/chioceModel`),
          method: 'post',
          data: this.$http.adornData({
            'serviceStandard': ids[0]
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            let serviceStandard = data.tTrProduct.serviceStandard
            this.modelList = data.tTrProduct.kpiTemplateRelationEntityList
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$router.push({
                  name: 'products-add-or-update',
                  params: this.modelList,
                  query: {
                    id: this.$route.query.initId,
                    serviceStandard: serviceStandard
                  }
                })
              }
            })
          } else {
            this.clickFlag = true
            this.$message.error(data.msg)
          }
        })
      },
      resetForm () {
        this.dataForm = {}
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      }
    }
  }
</script>

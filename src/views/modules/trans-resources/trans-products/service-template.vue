<template>
  <el-dialog
    title="标准选择"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <div class="mod-config">
      <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="模板名称">
              <el-input v-model="dataForm.templateName" placeholder="模板名称" maxlength="20" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" style="text-align: right;padding-right: 5px">
            <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataList"
        border
        v-loading="dataListLoading"
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
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
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
        isShowDetails: false,
        clickFlag: true
      }
    },
    components: {
    },
    activated () {
    },
    methods: {
      init () {
        this.visible = true
        this.resetForm()
      },
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
        this.dataListSelections = val
      },
      dataFormSubmit () {
        this.$emit('hideTable')
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
        if (!this.clickFlag) {
          return;
        }
        this.clickFlag = false
        setTimeout(() => {
          this.clickFlag = true
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
            let modelList = data.tTrProduct.kpiTemplateRelationEntityList
            let standardLength = data.tTrProduct.count
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 500,
              onClose: () => {
                this.$emit('getList', serviceStandard, modelList, standardLength)
                this.visible = false
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

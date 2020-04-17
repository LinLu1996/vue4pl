<template>
    <div class="mod-config" v-loading="dataListLoading">
      <div style="font-size: 20px;font-weight: bold;margin-bottom: 30px">
        <span>{{`${dataForm.carrierName}${dataForm.year}年${dataForm.month}月运费`}}</span>
        <span style="margin-left: 20px;color: #f93071e8">{{(dataForm.totalCarriageAmount / 10000).toFixed(5)}}万（不含税）</span>
        <span style="margin-left: 20px;color: #6ecc6e">{{(dataForm.totalCarriageAmtFax / 10000).toFixed(5)}}万（含税）</span>
      </div>
      <el-form ref="dataForm" :inline="true" :model="dataForm" label-width="120px" @keyup.enter.native="getSearchDataList()">
        <el-form-item label-width="0">
          <el-tag>对账单信息</el-tag>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="对账单号:">
              <span>
                {{dataForm.statementNo}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对账账期:">
              <span style="width: 200px; display: block">
                {{dataForm.statementMonth}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="承运商:">
              <span style="width: 200px; display: block">
                {{dataForm.carrierName}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="总件数:">
              <span style="width: 200px; display: block">
                {{dataForm.totalSum}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运费（不含税）:">
              <span style="width: 200px; display: block">
                {{dataForm.totalCarriageAmount}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运费（含税）:">
              <span style="width: 200px; display: block">
                {{dataForm.totalCarriageAmtFax}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="0">
          <el-tag>对账单明细</el-tag>
        </el-form-item>
      </el-form>
      <el-table
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataList"
        border
        ref="tableList"
        style="width: 100%;">
        <el-table-column
          type="index"
          width="80"
          align="center"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="warehoseName"
          header-align="center"
          align="center"
          label="仓库"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="transportMethodName"
          header-align="center"
          align="center"
          label="运输方式"
        >
        </el-table-column>
        <el-table-column
          prop="count"
          header-align="center"
          align="center"
          label="件数"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="carriageAmount"
          header-align="center"
          width="160"
          align="center"
          label="运费（不含税）"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="carriageAmtFax"
          header-align="center"
          align="center"
          width="140"
          label="运费（含税）"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="projectName"
          header-align="center"
          align="center"
          label="所属项目"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="shipmentName"
          header-align="center"
          align="center"
          label="配载方式"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          label="备注"
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
      <el-row style="margin-top: 20px;text-align: right">
        <el-col>
            <el-button @click="$router.go(-1)">关闭</el-button>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataForm: {
          id: '',
          statementNo: '',
          statementMonth: '',
          carrierName: '',
          year: '',
          month: '',
          totalSum: '',
          totalCarriageAmount: '',
          totalCarriageAmtFax: ''
        },
        dataList: []
      }
    },
    activated () {
      this.dataForm.id = this.$route.query.id || null
      this.resetForm()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/shippingplatform/trefficiencyplatform/efficiencyDetailList`),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'id': this.dataForm.id,
            'type': 1
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list || []
            this.totalPage = data.page.totalCount
            this.dataForm.statementNo = data.page.values && JSON.stringify(data.page.values) !== '{}' ? data.page.values.statementNo : ''
            this.dataForm.statementMonth = data.page.values && JSON.stringify(data.page.values) !== '{}' ? data.page.values.statementMonth + '月份' : ''
            this.dataForm.carrierName = data.page.values && JSON.stringify(data.page.values) !== '{}' ? data.page.values.carrierName : ''
            this.dataForm.totalSum = data.page.values && JSON.stringify(data.page.values) !== '{}' ? data.page.values.totalSum : ''
            this.dataForm.totalCarriageAmount = data.page.values && JSON.stringify(data.page.values) !== '{}' ? data.page.values.totalCarriageAmount : ''
            this.dataForm.totalCarriageAmtFax = data.page.values && JSON.stringify(data.page.values) !== '{}' ? data.page.values.totalCarriageAmtFax : ''
            this.dataForm.year = data.page.values && JSON.stringify(data.page.values) !== '{}' ? data.page.values.statementMonth.split('-')[0] : ''
            this.dataForm.month = data.page.values && JSON.stringify(data.page.values) !== '{}' ? data.page.values.statementMonth.split('-')[1] : ''
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
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.pageIndex = 1
          this.pageSize = 10
          this.getDataList()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>

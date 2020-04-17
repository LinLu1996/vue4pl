<template>
    <div class="mod-config">
      <el-form ref="dataForm" :inline="true" :model="dataForm" label-width="120px" @keyup.enter.native="getDataList()">
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
        v-loading="dataListLoading"
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
          prop="consignorName"
          header-align="center"
          align="center"
          label="委托方"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="productName"
          header-align="center"
          align="center"
          label="产品"
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
          align="center"
          label="运费（不含税）"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="carriageAmtFax"
          header-align="center"
          align="center"
          label="运费（含税）"
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
      <el-row style="display: flex;justify-content: flex-end;margin-top: 20px">
        <el-button type="primary" @click="approve(3)">通过</el-button>
        <el-button type="primary" @click="handleReverseAudit">不通过</el-button>
        <el-button type="warning" @click="handleBack()">返回</el-button>
      </el-row>
      <sea-son v-if="seaSonVisible" ref="seaSon"></sea-son>
    </div>
</template>

<script>
  import SeaSon from './seaSon'
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
          totalSum: '',
          totalCarriageAmount: '',
          totalCarriageAmtFax: ''
        },
        dataList: [],
        recordId: '',
        seaSonVisible: false
      }
    },
    components: {
      SeaSon
    },
    activated () {
      this.recordId = this.$route.query.id || null
      this.dataForm.id = this.$route.query.srcPk || null
      this.resetForm()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/feesettlement/fscarriagestmdetails/listByStmId`),
          method: 'post',
          data: this.$http.adornData({
            'stmId': this.dataForm.id,
            'page': this.pageIndex,
            'limit': this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list || []
            this.totalPage = data.page.totalCount
            this.dataForm.statementNo = data.page.values && JSON.stringify(data.page.values) !== '{}' ? data.page.values.statementNo : ''
            this.dataForm.statementMonth = data.page.values && JSON.stringify(data.page.values) !== '{}' ? data.page.values.statementMonth : ''
            this.dataForm.carrierName = data.page.values && JSON.stringify(data.page.values) !== '{}' ? data.page.values.carrierName : ''
            this.dataForm.totalSum = data.page.values && JSON.stringify(data.page.values) !== '{}' ? data.page.values.totalSum : ''
            this.dataForm.totalCarriageAmount = data.page.values && JSON.stringify(data.page.values) !== '{}' ? data.page.values.totalCarriageAmount : ''
            this.dataForm.totalCarriageAmtFax = data.page.values && JSON.stringify(data.page.values) !== '{}' ? data.page.values.totalCarriageAmtFax : ''
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
      },
      // 表单提交
      approve (approveStatus) {
        if (!this.clickFlag) {
          return;
        }
        this.clickFlag = false
        this.$http({
          url: this.$http.adornUrl(`/sys/auditrecord/approve`),
          method: 'post',
          data: this.$http.adornData({
            id: this.recordId,
            approveStatus: approveStatus
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.handleBack()
              }
            })
          } else {
            this.clickFlag = true
            this.$message.error(data.msg)
          }
        })
      },
      handleReverseAudit () {
        if (!this.dataForm.season) {
          this.seaSonVisible = true
          this.$nextTick(() => {
            this.$refs.seaSon.init(this.recordId)
          })
          return false
        }
      },
      handleBack () {
        this.$router.push({
          path: '/todoList'
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>

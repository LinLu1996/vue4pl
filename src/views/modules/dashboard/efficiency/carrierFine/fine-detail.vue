<template>
  <div class="mod-config" v-loading="dataListLoading">
    <div style="font-size: 20px;font-weight: bold;margin-bottom: 30px">
      <span>{{`${dataForm.carrierName}${dataForm.year}年${dataForm.month}月扣罚`}}</span>
      <span style="margin-left: 20px;color: red">{{dataForm.totalFineAmount}}万</span>
    </div>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      style="width: 100%;"
    >
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="fineId"
        header-align="center"
        align="center"
        label="扣罚单号"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fineMonth"
        header-align="center"
        align="center"
        label="扣罚账期"
        width="160"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierName"
        header-align="center"
        align="center"
        label="承运商"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态"
        width="120"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-tag v-if="row.status === 0" size="mini">待审核</el-tag>
          <el-tag v-if="row.status === 1" size="mini" type="danger">审核中</el-tag>
          <el-tag v-if="row.status === 2" size="mini" type="success">已审核</el-tag>
          <el-tag v-if="row.status === 3" size="mini" type="info">已驳回</el-tag>
          <el-tag v-if="row.status === 4" size="mini" type="info">已作废</el-tag>
          <el-tag v-if="row.status === 5" size="mini" type="info">已开票</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalFineAmount"
        header-align="center"
        align="center"
        label="总扣罚金额"
        width="160"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="rejectionReport"
        header-align="center"
        align="center"
        label="拒收上报"
        width="160"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="!row.editing">
            {{row.rejectionReport}}
          </span>
          <el-input-number v-else v-model="row.rejectionReport" :min="0" :max="9999999" :precision="2" :step="0.1" size="mini"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="thermometerBack"
        header-align="center"
        align="center"
        label="温度计返回"
        width="160"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="!row.editing">
            {{row.thermometerBack}}
          </span>
          <el-input-number v-else v-model="row.thermometerBack" :min="0" :max="9999999" :precision="2" :step="0.1" size="mini"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="rejectReturnsBack"
        header-align="center"
        align="center"
        label="拒收退货返回"
        width="160"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="!row.editing">
            {{row.rejectReturnsBack}}
          </span>
          <el-input-number v-else v-model="row.rejectReturnsBack" :min="0" :max="9999999" :precision="2" :step="0.1" size="mini"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="saleWithdrawalBack"
        header-align="center"
        align="center"
        label="销退提货返回"
        width="160"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="!row.editing">
            {{row.saleWithdrawalBack}}
          </span>
          <el-input-number v-else v-model="row.saleWithdrawalBack" :min="0" :max="9999999" :precision="2" :step="0.1" size="mini"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="complaintFine"
        header-align="center"
        align="center"
        label="投诉扣罚"
        width="160"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="!row.editing">
            {{row.complaintFine}}
          </span>
          <el-input-number v-else v-model="row.complaintFine" :min="0" :max="9999999" :precision="2" :step="0.1" size="mini"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="documentsAccuracy"
        header-align="center"
        align="center"
        label="单证准确率"
        width="160"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="!row.editing">
            {{row.documentsAccuracy}}
          </span>
          <el-input-number v-else v-model="row.documentsAccuracy" :min="0" :max="9999999" :precision="2" :step="0.1" size="mini"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="thermometerLoss"
        header-align="center"
        align="center"
        label="温度计遗失"
        width="160"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="!row.editing">
            {{row.thermometerLoss}}
          </span>
          <el-input-number v-else v-model="row.thermometerLoss" :min="0" :max="9999999" :precision="2" :step="0.1" size="mini"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="carEnsureRate"
        header-align="center"
        align="center"
        label="整车业务保障率"
        width="160"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="!row.editing">
            {{row.carEnsureRate}}
          </span>
          <el-input-number v-else v-model="row.carEnsureRate" :min="0" :max="9999999" :precision="2" :step="0.1" size="mini"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="reward"
        header-align="center"
        align="center"
        label="奖励项目"
        width="160"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="!row.editing">
            {{row.reward}}
          </span>
          <el-input-number v-else v-model="row.reward" :min="0" :max="9999999" :precision="2" :step="0.1" size="mini"></el-input-number>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-button @click="$router.go(-1)">关闭</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import { formatDate } from '@/utils'
  export default {
    data () {
      return {
        dataList: [],
        dataForm: {
          id: '',
          carrierName: '',
          year: '',
          month: '',
          totalFineAmount: ''
        },
        dataListLoading: false
      }
    },
    activated () {
      this.dataForm.id = this.$route.query.id || null
      this.resetForm()
    },
    computed: {
      totalFineAmount () {
        return function (row) {
          let sum = parseFloat(row.rejectionReport || 0) +
            parseFloat(row.thermometerBack || 0) +
            parseFloat(row.rejectReturnsBack || 0) +
            parseFloat(row.saleWithdrawalBack || 0) +
            parseFloat(row.complaintFine || 0) +
            parseFloat(row.documentsAccuracy || 0) +
            parseFloat(row.thermometerLoss || 0) +
            parseFloat(row.carEnsureRate || 0) -
            parseFloat(row.reward || 0)
          return sum.toFixed(2)
        }
      }
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.dataList = []
        this.$http({
          url: this.$http.adornUrl('/shippingplatform/trefficiencyplatform/efficiencyDetailList'),
          method: 'post',
          data: this.$http.adornData({
            'id': this.dataForm.id,
            'type': 2
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.year = data.fine.fineMonth.split('-')[0]
            this.dataForm.month = data.fine.fineMonth.split('-')[1]
            this.dataForm.totalFineAmount = (data.fine.totalFineAmount / 10000).toFixed(5)
            data.fine.fineMonth = data.fine.fineMonth + '月份'
            this.dataList.push(data.fine)
            this.dataForm.carrierName = data.fine.carrierName
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },
      resetForm () {
        this.getDataList()
      }
    }
  }
</script>
<style lang="scss">
  .el-table__body-wrapper{
    button{
      width: auto;
      height: 25px;
      line-height: 25px;
      padding: 0;
      text-align: center;
      background: none;
      color: #3E8EF7;
      border: none;
    }
  }
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

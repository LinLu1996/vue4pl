<template>
  <div class="mod-config">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="扣罚单号">
            <el-input v-model="dataForm.fineId" placeholder="扣罚单号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="扣罚账期">
            <xkl-date-picker v-model="dataForm.date" type="monthrange" placeholder="扣罚账期"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运商">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" keyType="carrierId" labelType="carrierName" linkage="/transresources/trcarrier/findList " placeholder="承运商名称"></xkl-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select style="width: 100%" v-model="dataForm.status" placeholder="状态" clearable>
              <el-option value="0" label="待审核"></el-option>
<!--              <el-option value="1" label="审核中"></el-option>-->
              <el-option value="2" label="已审核"></el-option>
              <!--<el-option value="3" label="已驳回"></el-option>-->
              <el-option value="4" label="已作废"></el-option>
              <el-option value="5" label="已开票"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="text-align: right;padding-right: 5px">
          <el-form-item>
            <el-button v-if="isAuth('feesettlement:fsfine:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button v-if="isAuth('feesettlement:fsfine:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('feesettlement:fsfine:trueExport')" type="success" size="mini" icon="el-icon-upload" @click="uploadPageHandle(dataForm.id)">导入</el-button>
            <el-button v-if="isAuth('feesettlement:fsfine:updateStatusA')" type="success" size="mini" :disabled="currentStatus !== 0 && currentStatus !== 3" @click="toORBackExamine(2)">
              <icon-svg name="审核" style="vertical-align: middle"></icon-svg>
              审核</el-button>
            <el-button v-if="isAuth('feesettlement:fsfine:updateStatusT')" type="success" size="mini" :disabled="currentStatus !== 2" @click="toORBackExamine(0)">
              <icon-svg name="反审核" style="vertical-align: middle"></icon-svg>
              反审核</el-button>
            <el-button v-if="isAuth('feesettlement:fsfine:updateStatusI')" type="danger" size="mini" @click="toORBackExamine(4)">
              <icon-svg name="作废" style="vertical-align: middle"></icon-svg>
              作废</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;"
      @selection-change="selectionChangeHandle"
      @select-all="selectAll">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="60"
        :selectable="selectable">
      </el-table-column>
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
          <el-input-number v-else v-model="row.rejectionReport" :min="0" :max="99999999" :precision="5" :step="0.1" size="mini"></el-input-number>
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
          <el-input-number v-else v-model="row.thermometerBack" :min="0" :max="99999999" :precision="5" :step="0.1" size="mini"></el-input-number>
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
          <el-input-number v-else v-model="row.rejectReturnsBack" :min="0" :max="99999999" :precision="5" :step="0.1" size="mini"></el-input-number>
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
          <el-input-number v-else v-model="row.saleWithdrawalBack" :min="0" :max="99999999" :precision="5" :step="0.1" size="mini"></el-input-number>
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
          <el-input-number v-else v-model="row.complaintFine" :min="0" :max="99999999" :precision="5" :step="0.1" size="mini"></el-input-number>
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
          <el-input-number v-else v-model="row.documentsAccuracy" :min="0" :max="99999999" :precision="5" :step="0.1" size="mini"></el-input-number>
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
          <el-input-number v-else v-model="row.thermometerLoss" :min="0" :max="99999999" :precision="5" :step="0.1" size="mini"></el-input-number>
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
          <el-input-number v-else v-model="row.carEnsureRate" :min="0" :max="99999999" :precision="5" :step="0.1" size="mini"></el-input-number>
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
          <el-input-number v-else v-model="row.reward" :min="0" :max="99999999" :precision="5" :step="0.1" size="mini"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="other"
        header-align="center"
        align="center"
        label="其他"
        width="160"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="!row.editing">
            {{row.other}}
          </span>
          <el-input-number v-else v-model="row.other" :min="0" :max="99999999" :precision="5" :step="0.1" size="mini"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
        width="160"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="!row.editing">
            {{row.remark}}
          </span>
          <el-input v-else v-model="row.remark" maxLength="166" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isAuth('feesettlement:fsfine:update')"
        header-align="center"
        align="center"
        width="120"
        fixed="right"
        label="操作">
        <template slot-scope="{ row }">
          <el-button v-if="isAuth('feesettlement:fsfine:update')" v-show="!row.editing" type="warning" size="small" @click="updateHandle(row)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑</el-button>
          <div v-show="row.editing">
            <el-button size="mini" @click="row.editing = false, getDataList()">关闭</el-button>
            <el-button type="primary" size="mini" @click="editSubmit(row)">确定</el-button>
          </div>
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
      title="扣罚单导入"
      fileName="扣罚单导入模板.xlsx"
      uploadUrl="/feesettlement/fsfine/export"
      submitUrl="/feesettlement/fsfine/trueExport"
      :acceptType="['xls', 'xlsx']"
      @refreshDataList="getDataList"></upload-page>
    <!-- 导入弹窗 -->
    <ticket-upload v-if="importVisible" ref="ticketImport" @refreshDataList="getDataList"></ticket-upload>
    <submit-approval ref="submitApproval" v-if="submitApprovalVisible" @refreshDataList="getDataList"></submit-approval>
    <!-- 详情弹窗 -->
    <!--<delegate-info  v-if="delegateInfoVisible" ref="delegateInfo"></delegate-info>-->
  </div>
</template>

<script>
  import { formatDate } from '@/utils'
  import TicketUpload  from './ticket-upload'
  import uploadPage from '@/components/upload/upload-page'
  import SubmitApproval from '../../sys/audit/submit_approval'
  export default {
    data () {
      return {
        dataForm: {
          carrierId: '',
          date: [],
          fineId: '',
          status: ''
        },
        dataList: [],
        selectionDataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        importVisible: false,
        delegateInfoVisible: false,
        currentStatus: '',
        submitApprovalVisible: false
      }
    },
    components: {
      TicketUpload,
      SubmitApproval,
      uploadPage
    },
    activated () {
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
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/feesettlement/fsfine/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm,
            'beforeTime': this.dataForm.date && this.dataForm.date.length > 0 ? formatDate(this.dataForm.date[0], 'Month') : undefined,
            'afterTime': this.dataForm.date && this.dataForm.date.length > 0 ? formatDate(this.dataForm.date[1], 'Month') : undefined
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.dataList = this.dataList.map(res => {
              if (res.fineMonth) {
                res.fineMonth = this.$formatDate(res.fineMonth, 'Month')
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
        if (row.status === 1 || row.status === 4 || row.status === 5) {
          return false
        }
        if (this.selectionDataList.length && row.status !== this.currentStatus) {
          return false
        }
        return true
      },
      uploadPageHandle (id) {
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPage.init(id)
        })
      },
      updateHandle (row) {
        if (row.status !== 0) {
          this.$message({
            type: 'warning',
            message: '该数据不能编辑'
          })
          return
        }
        this.$set(row, 'editing', true);
      },
      editSubmit (row) {
        row.editing = false
        this.dataFormSubmit(row)
      },
      toEdit (row) {
        this.$set(row, 'editing', true);
      },
      dataFormSubmit (row) {
        this.$http({
          url: this.$http.adornUrl(`/feesettlement/fsfine/update`),
          method: 'post',
          data: this.$http.adornData({
            ...row
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.getDataList()
          } else {
            this.clickFlag = true
            this.$message.error(data.msg)
          }
        })
      },
      // 新增 / 编辑
      ticketImportHandle (id) {
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.ticketImport.init(id)
        })
      },
      // 审核
      submitApproval (id) {
        if (!this.selectionDataList.length) {
          this.$message({
            type: 'warning',
            message: '请至少选择一条货损单'
          })
          return false
        }
        let ids = this.selectionDataList.map(item => {
          return item.id
        })
        this.submitApprovalVisible = true
        this.$nextTick(() => {
          this.$refs.submitApproval.init(ids, 'fine')
        })
      },
      toORBackExamine (status) {
        if (!this.selectionDataList.length) {
          this.$message({
            type: 'warning',
            message: '请至少选择一条扣罚单'
          })
          return false
        }
        let ids = this.selectionDataList.map(item => {
          return item.id
        })
        let carrierNames = this.selectionDataList.map(item => {
          return item.carrierName
        })
        let fineMonth = this.selectionDataList.map(item => {
          return item.fineMonth
        })
        this.$confirm(`承运商：${carrierNames} <br/> 扣罚账期：${fineMonth}`, `确定${status === 2 ? '审核' : status === 0 ? '反审核' : status === 4 ? '作废' : ''}该扣罚单？`, {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/feesettlement/fsfine/updateStatus'),
            method: 'post',
            data: this.$http.adornData({
              ids,
              fsFines: this.selectionDataList,
              status: status
            }, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: `操作成功`,
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
        }).catch(() => {})
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

<template>
  <el-dialog
    :title="currentType === 'cost' ? '选择对账单' : currentType === 'fine' ? '选择扣罚单' : currentType === 'damage' ? '选择货损单' : ''"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%">
  <div class="mod-config">
    <el-form v-if="currentType === 'cost'" ref="dataForm" :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="对账单号">
            <el-input v-model="dataForm.statementNo" maxlength="100" placeholder="对账单号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select style="width: 100%" v-model="dataForm.status" placeholder="状态" clearable>
              <el-option value="0" label="待审核"></el-option>
              <!--<el-option value="1" label="审核中"></el-option>-->
              <el-option value="2" label="已审核"></el-option>
              <!--<el-option value="3" label="已驳回"></el-option>-->
              <el-option value="4" label="已作废"></el-option>
              <el-option value="5" label="已开票"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;">
          <el-form-item>
            <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form v-if="currentType === 'fine'" ref="dataForm" :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="扣罚单号">
            <el-input v-model="dataForm.fineId" placeholder="扣罚单号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select style="width: 100%" v-model="dataForm.status" placeholder="状态" clearable>
              <el-option value="0" label="待审核"></el-option>
              <!--<el-option value="1" label="审核中"></el-option>-->
              <el-option value="2" label="已审核"></el-option>
              <!--<el-option value="3" label="已驳回"></el-option>-->
              <el-option value="4" label="已作废"></el-option>
              <el-option value="5" label="已开票"></el-option>
            </el-select>          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;padding-right: 5px">
          <el-form-item>
            <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form v-if="currentType === 'damage'" ref="dataForm" :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="货损单号">
            <el-input v-model="dataForm.cargoDamageNo" placeholder="货损单号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select style="width: 100%" v-model="dataForm.status" placeholder="状态" clearable>
              <el-option value="0" label="待审核"></el-option>
              <!--<el-option value="1" label="审核中"></el-option>-->
              <el-option value="2" label="已审核"></el-option>
              <!--<el-option value="3" label="已驳回"></el-option>-->
              <el-option value="4" label="已作废"></el-option>
              <el-option value="5" label="已开票"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;padding-right: 5px">
          <el-form-item>
            <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-if="currentType === 'cost'">
      <el-table
        ref="elTable"
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column
          type="selection"
          width="60"
          align="center"
          label="No."
        >
        </el-table-column>
        <el-table-column
          type="index"
          width="60"
          align="center"
          label="No.">
        </el-table-column>
        <el-table-column
          prop="statementNo"
          header-align="center"
          align="center"
          label="对账单号"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="statementMonth"
          align="center"
          label="对账账期"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="carrierName"
          align="center"
          label="承运商"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalSum"
          align="center"
          label="总件数"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalMoney"
          align="center"
          label="总金额"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalCarriageAmount"
          align="center"
          label="运费（不含税）"
          width="160"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalCarriageAmtFax"
          align="center"
          label="运费（含税）"
          width="160"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="orderOutlay"
          align="center"
          label="订单服务费"
          width="120"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="specialOutlay"
          align="center"
          label="特殊费用"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="状态"
          width="100"
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
          width="240"
          header-align="center"
          fixed="right"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" style="width: 100%" type="primary" @click="handleToCostDetail(scope.row.id)">
              <icon-svg name="明细" style="vertical-align: middle"></icon-svg>
              查看对账明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-if="currentType === 'fine'">
      <el-table
        ref="elTable"
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column
          type="selection"
          width="60"
          align="center"
          label="No.">
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
          width="120"
          label="扣罚单号"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="fineMonth"
          width="120"
          header-align="center"
          align="center"
          label="扣罚账期">
        </el-table-column>
        <el-table-column
          prop="carrierName"
          width="100"
          header-align="center"
          align="center"
          label="承运商"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="状态"
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
          width="140"
          header-align="center"
          align="center"
          label="总扣罚金额"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="rejectionReport"
          header-align="center"
          align="center"
          width="120"
          label="拒收上报"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="thermometerBack"
          header-align="center"
          align="center"
          width="150"
          label="温度计返回"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="rejectReturnsBack"
          header-align="center"
          align="center"
          width="150"
          label="拒收退货返回"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="saleWithdrawalBack"
          header-align="center"
          align="center"
          width="160"
          label="销退提货返回"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="complaintFine"
          header-align="center"
          align="center"
          width="160"
          label="投诉扣罚"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="documentsAccuracy"
          header-align="center"
          align="center"
          width="150"
          label="单证准确率"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="thermometerLoss"
          header-align="center"
          align="center"
          width="150"
          label="温度计遗失"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="carEnsureRate"
          header-align="center"
          align="center"
          width="160"
          label="整车业务保障率"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="reward"
          header-align="center"
          align="center"
          width="160"
          label="项目奖金"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </template>
    <template v-if="currentType === 'damage'">
      <el-table
        ref="elTable"
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column
          type="selection"
          width="60"
          align="center"
          label="No.">
        </el-table-column>
        <el-table-column
          type="index"
          width="60"
          align="center"
          label="No.">
        </el-table-column>
        <el-table-column
          prop="cargoDamageNo"
          header-align="center"
          align="center"
          label="货损单号"
          min-width="140"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="cargoDamageMonth"
          header-align="center"
          align="center"
          min-width="140"
          label="货损账期">
        </el-table-column>
        <el-table-column
          prop="carrierName"
          width="120"
          header-align="center"
          align="center"
          label="承运商"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalDamageAmount"
          header-align="center"
          align="center"
          width="180"
          label="破损总金额（元）"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          label="备注信息"
          min-width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="状态"
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
          header-align="center"
          align="center"
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" style="width: 100%" type="primary"
                       @click="handleToDamageDetail(scope.row.id, scope.row.status)">
              <icon-svg name="明细" style="vertical-align: middle"></icon-svg>
              查看货损明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 弹窗, 新增 / 编辑 -->
    <!--<cost-upload v-if="importVisible" ref="importUpdate" @refreshDataList="getDataList"></cost-upload>-->
  </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { formatDate } from '@/utils';
  export default {
    data () {
      return {
        visible: false,
        currentType: '',
        dataForm: {
          statementNo: '',
          status: '',
          fineId: '',
          cargoDamageNo: ''
        },
        dataList: [],
        dataListLoading: false,
        selectionDataList: [],
        detailVisible: false,
        importVisible: false,
        carrierId: '',
        invoiceMonth: ''
      }
    },
    components: {
    },
    methods: {
      init (type, carrierId, invoiceMonth) {
        this.visible = true
        this.currentType = type
        this.carrierId = carrierId
        this.invoiceMonth = invoiceMonth
        this.$nextTick(() => {
          this.dataForm = {}
          this.getSearchDataList()
        })
      },
      getSearchDataList () {
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        if (this.currentType === 'fine') {
          this.$http({
            url: this.$http.adornUrl('/feesettlement/fsfine/infoMonth'),
            method: 'post',
            data: this.$http.adornData({
              'fineId': this.dataForm.fineId,
              'carrierId': this.carrierId,
              'status': this.dataForm.status
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.FsFineEntityList
            } else {
              this.dataList = []
            }
            this.dataListLoading = false
          })
        } else if (this.currentType === 'damage') {
          this.$http({
            url: this.$http.adornUrl('/feesettlement/fscargodamage/infoMonth'),
            method: 'post',
            data: this.$http.adornData({
              'carrierId': this.carrierId,
              'cargoDamageNo': this.dataForm.cargoDamageNo,
              'status': this.dataForm.status
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.fsCargoDamageEntityList
            } else {
              this.dataList = []
            }
            this.dataListLoading = false
          })
        } else if (this.currentType === 'cost') {
          this.$http({
            url: this.$http.adornUrl('/feesettlement/fscarriagestatement/infoByMonth'),
            method: 'post',
            data: this.$http.adornData({
              'statementNo': this.dataForm.statementNo,
              'status': this.dataForm.status,
              'carrierId': this.dataForm.carrierId ? this.dataForm.carrierId : this.carrierId,
              'invoiceMonth': this.invoiceMonth ? formatDate(this.invoiceMonth, 'Month') : null
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.FsCarriageStatementEntityList
            } else {
              this.dataList = []
            }
            this.dataListLoading = false
          })
        }
      },
      // 多选
      selectionChangeHandle (val) {
        this.selectionDataList = val
      },
      resetForm () {
        this.dataForm = {}
        this.getDataList()
      },
      // 查看货损明细
      handleToDamageDetail (id, status) {
        this.visible = false
        this.$router.push({
          path: '/cost-settlement/cargo-damage/shipper-details',
          query: {
            id: id,
            status,
            isEdit: 1
          }
        })
      },
      // 查看对账明细
      handleToCostDetail (id) {
        this.visible = false
        this.$router.push({
          path: '/cost-settlement-cost/cost/cost-detail',
          query: {
            id: id,
            isChoice: true
          }
        })
      },
      // 确定
      dataFormSubmit () {
        if (!this.selectionDataList.length) {
          this.$message({
            type: 'warning',
            message: '请至少选择一条数据'
          })
          return false
        }
        if (this.selectionDataList.length > 1) {
          this.$message({
            type: 'warning',
            message: '只能选择一条数据'
          })
          return false
        }
        this.visible = false
        if (this.currentType === 'cost') {
          this.$emit('refreshDataList', this.selectionDataList, 'cost')
        } else if (this.currentType === 'fine') {
          this.$emit('refreshDataList', this.selectionDataList, 'fine')
        } else if (this.currentType === 'damage') {
          this.$emit('refreshDataList', this.selectionDataList, 'damage')
        }
      },
      // 关闭
      handleClose () {
        if (this.currentType === 'cost') {
          this.$router.push({
            path: '/cost-settlement-cost/invoice/invoice-add-or-update',
            query: {
              costIsClick: false
            }
          })
        } else if (this.currentType === 'fine') {
          this.$router.push({
            path: '/cost-settlement-cost/invoice/invoice-add-or-update',
            query: {
              fineIsClick: false
            }
          })
        } else if (this.currentType === 'damage') {
          this.$router.push({
            path: '/cost-settlement-cost/invoice/invoice-add-or-update',
            query: {
              damageIsClick: false
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .el-table__body-wrapper{
    button{
      width: auto!important;
      height: 25px;
      line-height: 25px;
      padding: 0;
      text-align: center;
      background: none;
      color: #3E8EF7;
      border: none;
    }
  }
  .el-table__row{
    .cell{
      width: auto!important;
    }
  }
</style>

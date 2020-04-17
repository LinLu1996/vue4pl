<template>
  <div class="invoice-detail">
    <div style="margin-bottom: 15px">
      <el-radio-group v-model="radio1">
        <el-radio-button :label="1">基本信息</el-radio-button>
        <el-radio-button :label="2">跟踪信息</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="radio1 === 1">
      <el-form label-width="120px" :model="dataForm" @keyup.enter.native="getSearchDataList()">
        <el-form-item label-width="0">
          <el-tag>开票信息</el-tag>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="开票编号：">
              <span>
                {{dataForm.invoiceNo}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票金额：">
              <span>
                {{dataForm.askInvoiceAmount}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票税点：">
              <span>
                {{dataForm.taxRateNumber}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="无税金额：">
              <span>
                {{dataForm.taxlessAmount}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="承运商：">
              <span>
                {{dataForm.carrierName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对账账期：">
              <span>
                {{dataForm.invoiceMonth}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="运输方式：">
              <span>
                {{dataForm.transportMethodName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务方式：">
              <span>
                {{dataForm.serviceMethodName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票申请时间：">
              <span>
                {{dataForm.askInvoiceApplyDtm ? $formatDate(dataForm.askInvoiceApplyDtm, 'Second') : ''}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="开票时间：">
              <span>
                {{dataForm.askInvoiceDtm}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最晚付款时间：">
              <span>
                {{dataForm.latestPaymenttime ? $formatDate(dataForm.latestPaymenttime, 'Second') : ''}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注信息：" prop="remark">
              <span>
                {{dataForm.remark}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <product-drawer v-if="drawerVisible" ref="productDrawer"></product-drawer>
      </el-form>
      <el-tag style="margin-bottom: 15px;">对账单信息</el-tag>
      <el-table
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataForm.costList"
        border
        ref="tableList"
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column
          type="index"
          width="60"
          align="center"
          label="No.">
        </el-table-column>
        <el-table-column
          prop="statementNo"
          width="120"
          header-align="center"
          align="center"
          label="对账单号"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="statementMonth"
          width="150"
          header-align="center"
          align="center"
          label="对账账期">
          <template slot-scope="{row}">
            {{row.statementMonth ? $formatDate(row.statementMonth, 'Month') : ''}}
          </template>
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
          prop="totalSum"
          header-align="center"
          align="center"
          width="100"
          label="总件数"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalMoney"
          width="100"
          header-align="center"
          align="center"
          label="总金额"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalCarriageAmount"
          header-align="center"
          align="center"
          width="160"
          label="运费（不含税）"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalCarriageAmtFax"
          header-align="center"
          align="center"
          width="160"
          label="运费（含税）"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="orderOutlay"
          header-align="center"
          align="center"
          width="120"
          label="订单服务费"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="specialOutlay"
          header-align="center"
          align="center"
          width="100"
          label="特殊费用"
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
          width="120"
          header-align="center"
          fixed="right"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" style="width: 100%" type="primary" @click="handleDetail(scope.row.id)">
              <icon-svg name="明细" style="vertical-align: middle"></icon-svg>
              查看对账明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-tag style="margin-bottom: 15px;margin-top: 15px">扣罚单信息</el-tag>
      <el-table
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataForm.fineList"
        border
        ref="tableList"
        v-loading="dataListLoading"
        style="width: 100%;">
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
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="fineMonth"
          header-align="center"
          align="center"
          label="扣罚账期"
          width="160"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            {{row.fineMonth ? $formatDate(row.fineMonth, 'Month') : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="carrierName"
          header-align="center"
          align="center"
          label="承运商"
          width="160"
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
          label="销退提货返回"
          width="160"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="complaintFine"
          header-align="center"
          align="center"
          label="投诉扣罚"
          width="160"
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
      </el-table>
      <el-tag style="margin-bottom: 15px;margin-top: 15px">货损单信息</el-tag>
      <el-table
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataForm.damageList"
        border
        ref="tableList"
        v-loading="dataListLoading"
        style="width: 100%;">
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
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="cargoDamageMonth"
          header-align="center"
          align="center"
          label="货损账期"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            {{row.cargoDamageMonth ? $formatDate(row.cargoDamageMonth, 'Month') : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="carrierName"
          header-align="center"
          align="center"
          label="承运商"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalDamageAmount"
          header-align="center"
          align="center"
          width="200"
          label="破损总金额（元）"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          label="备注信息"
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
            <el-button size="mini" style="width: 100%" type="primary" @click="handleHuoDetail(scope.row.id)">
              <icon-svg name="明细" style="vertical-align: middle"></icon-svg>
              查看委托方明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-tag style="margin-bottom: 15px;margin-top: 15px">纸质发票信息</el-tag>
      <el-form label-width="100px">
        <el-row v-for="(item, index) in dataForm.ffsInvoiceAttachmentEntityList" :key="index">
          <el-col :span="5">
            <el-form-item label="发票号：">
              <span>
                {{item.invoiceNumber}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="开票日期：">
              <span>
                {{item.invoiceDate}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="附件：">
              <xkl-upload v-model="item.attachmentInvoiceNumberList" :config="uploadConfig"></xkl-upload>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备注：">
              <span style="white-space:normal; word-break:break-all;">
              {{item.remark}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-tag style="margin-bottom: 15px;margin-top: 15px">付款核销信息</el-tag>
      <el-form label-width="100px">
        <el-row v-for="(item, index) in dataForm.fsPaymentEntityList" :key="index">
          <el-col :span="5">
            <el-form-item label="付款金额：">
              <span>
                {{item.paymentAmount}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="付款时间：">
              <span>
                {{item.paymentDtm}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付凭证：">
              <xkl-upload v-model="item.attachmentInvoiceNumberList" :config="uploadConfig"></xkl-upload>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备注：">
              <span style="white-space:normal; word-break:break-all;">
              {{item.remark}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-else>
      <el-steps :active="active">
        <el-step title="创建"></el-step>
        <el-step title="开票"></el-step>
        <el-step title="付款"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <div class="blockList">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            placement="top"
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.sysCrtDtm ? $formatDate(activity.sysCrtDtm, 'Second') : ''">
            <el-card>
              <p>{{activity.operatingrType}}</p>
              <p> 操作人：{{activity.sysCrtByName}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-button @click="$router.go(-1)">关闭</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Upload from '@/components/upload/upload'
  import ProductDrawer from '../../trans-resources/product/product-drawer'
  export default {
    data () {
      return {
        radio1: 1,
        active: 1,
        reverse: false,
        dataForm: {
          id: '',
          invoiceNo: '',
          taxlessAmount: '',
          askInvoiceAmount: '',
          carrierId: '',
          invoiceMonth: '',
          taxRateNumber: '',
          transportMethodName: '',
          serviceMethodName: '',
          remark: '',
          costList: [],
          fineList: [],
          damageList: [],
          ffsInvoiceAttachmentEntityList: [],
          fsPaymentEntityList: [],
          askInvoiceApplyDtm: '',
          latestPaymenttime: '',
          askInvoiceDtm: ''
        },
        dataListLoading: false,
        submitFlag: true,
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          disabled: true
        },
        activities: [],
        productLists: [],
        drawerVisible: false
      }
    },
    components: {
      Upload,
      ProductDrawer
    },
    activated () {
      const id = this.$route.query.id || null
      this.init(id)
    },
    methods: {
      init (id) {
        this.dataForm.id = id
        this.getDataList()
      },
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/feesettlement/tfsinvoice/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            const dataList = data.tFsInvoice
            // const trProductEntity = []
            // if (data.tFsInvoice.trProductEntity) {
            //   trProductEntity.push(data.tFsInvoice.trProductEntity)
            // }
            this.dataForm.invoiceNo = dataList.invoiceNo
            this.dataForm.carrierId = dataList.carrierId
            this.dataForm.invoiceMonth = this.$formatDate(dataList.invoiceMonth, 'Month')
            this.dataForm.askInvoiceAmount = dataList.askInvoiceAmount
            this.dataForm.taxRateNumber = dataList.taxRateNumber
            this.dataForm.taxlessAmount = dataList.taxlessAmount
            this.dataForm.transportMethodName = dataList.transportMethodName
            this.dataForm.serviceMethodName = dataList.serviceMethodName
            this.dataForm.remark = dataList.remark
            this.dataForm.costList = dataList.fsCarriageStatementEntityList
            this.dataForm.fineList = dataList.fsFineEntityList
            this.dataForm.damageList = dataList.fsCargoDamageEntityList
            this.dataForm.carrierName = dataList.carrierName
            this.dataForm.ffsInvoiceAttachmentEntityList = dataList.fsInvoiceAttachmentEntityList && dataList.fsInvoiceAttachmentEntityList.length && dataList.fsInvoiceAttachmentEntityList.map(item => {
              item.invoiceDate = this.$formatDate(item.invoiceDate.split(' ')[0])
              return item
            })
            this.dataForm.fsPaymentEntityList = dataList.fsPaymentEntityList && dataList.fsPaymentEntityList.length && dataList.fsPaymentEntityList.map(item => {
              item.paymentDtm = this.$formatDate(item.paymentDtm.split(' ')[0])
              return item
            })
            this.dataForm.askInvoiceApplyDtm = dataList.askInvoiceApplyDtm
            this.dataForm.askInvoiceDtm = dataList.askInvoiceDtm && this.$formatDate(dataList.askInvoiceDtm.split(' ')[0])
            this.dataForm.latestPaymenttime = dataList.latestPaymenttime
            this.activities = dataList.tfsInvoiceLogEntityList
            this.active = dataList.status === 0 ? 1 : dataList.status === 1 ? 2 : dataList.status === 5 ? 3 : dataList.status === 6 ? 4 : 1
            // this.productLists = trProductEntity
          } else {
            this.dataForm = {}
          }
          this.dataListLoading = false
        })
      },
      // 查看明细
      handleDetail (id) {
        this.$router.push({
          path: '/cost-settlement-cost/cost/cost-detail',
          query: {
            id: id
          }
        })
      },
      // 查看委托方明细
      handleHuoDetail (id) {
        this.$router.push({
          path: '/cost-settlement/cargo-damage/shipper-details',
          query: {
            id: id,
            isEdit: 1
          }
        })
      },
      getDrawerInfo (id) {
        this.drawerVisible = true
        this.$nextTick(() => {
          this.$refs.productDrawer.init(id)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .blockList{
    width: 70%;
    margin: 0 auto;
  }
  /deep/.el-checkbox-button {
    .el-checkbox-button__inner{
      min-width: 280px!important;
      border-color: #ffffff!important;
      padding: 1px;
    }
  }
  /deep/.invoice-detail .el-form-item__content .el-upload--picture-card{
    display: none;
  }
  /deep/.invoice-detail .el-form-item__content .el-upload__tip{
    display: none;
  }
  /deep/.invoice-detail .el-upload__tip{
    display: none;
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 10px;
    display: block;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card{
    /deep/.el-card__header {
      background-color: #3e8ef76b;
    }
  }
</style>

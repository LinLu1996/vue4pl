<template>
  <div>
    <el-form label-width="100px" ref="dataForm" :model="dataForm" :rules="dataRule" @keyup.enter.native="getSearchDataList()">
      <el-form-item label-width="0">
        <el-tag>基本信息</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="开票编号" prop="invoiceNo" v-if="dataForm.id">
            <el-input v-model="dataForm.invoiceNo" disabled maxlength="50" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运商" prop="carrierId">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" keyType="carrierId" labelType="carrierName" linkage="/transresources/trcarrier/findList " placeholder="承运商"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="对账账期" prop="invoiceMonth">
            <el-date-picker
              v-model="dataForm.invoiceMonth"
              type="month"
              style="width: 100%"
              placeholder="请选择">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开票金额" prop="askInvoiceAmount" :show-message	="false">
            <el-input v-model="dataForm.askInvoiceAmount" disabled maxlength="50" clearable>{{dataForm.costList.length > 0 && taxlessAmount()}}</el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开票税点" prop="taxRate">
            <xkl-select style="width: 100%" v-model="dataForm.taxRate" select-type="TAX_RATE" placeholder="请选择" @getLabel="getSelectLabel"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="无税金额" prop="taxlessAmount">
            <el-input v-model="dataForm.taxlessAmount" disabled maxlength="50" clearable>{{dataForm.askInvoiceAmount && dataForm.taxRate && askInvoiceAmount()}}</el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运输方式" prop="transportMethod">
            <xkl-select style="width: 100%" v-model="dataForm.transportMethod" select-type="TRANSPORT_TYPE" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="服务方式" prop="serviceMethod">
            <xkl-select style="width: 100%" v-model="dataForm.serviceMethod" select-type="SERVICE_METHOD" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注信息" prop="remark">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="dataForm.remark" placeholder="备注" clearable maxlength="100"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="margin-bottom: 15px;margin-top: 15px">
      <el-col :span="4">
        <el-tag>对账单信息</el-tag>
      </el-col>
      <el-col :span="20" style="text-align: right">
        <el-button type="primary" @click="handleChoice('cost')">选择</el-button>
      </el-col>
    </el-row>
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
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="statementMonth"
        width="150"
        header-align="center"
        align="center"
        label="对账账期">
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
        width="180"
        header-align="center"
        align="center"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleToCostDetail(scope.row.id)">
            <icon-svg name="明细" style="vertical-align: middle"></icon-svg>查看对账明细
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-bottom: 15px;margin-top: 15px">
      <el-col :span="4">
        <el-tag>扣罚单信息</el-tag>
      </el-col>
      <el-col :span="20" style="text-align: right">
        <el-button type="primary" @click="handleChoice('fine')" :disabled="dataForm.costList.length === 0">选择</el-button>
      </el-col>
    </el-row>
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
      <el-table-column
        width="120"
        header-align="center"
        align="center"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDeleteList(scope, 'fine')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-bottom: 15px;margin-top: 15px">
      <el-col :span="4">
        <el-tag>货损单信息</el-tag>
      </el-col>
      <el-col :span="20" style="text-align: right">
        <el-button type="primary" @click="handleChoice('damage')" :disabled="dataForm.costList.length === 0">选择</el-button>
      </el-col>
    </el-row>
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
        width="150"
        label="货损单号"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cargoDamageMonth"
        header-align="center"
        align="center"
        width="150"
        label="货损账期">
      </el-table-column>
      <el-table-column
        prop="carrierName"
        min-width="150"
        header-align="center"
        align="center"
        label="承运商"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="totalDamageAmount"
        header-align="center"
        min-width="190"
        align="center"
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
        min-width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleToDamageDetail(scope.row.id, scope.row.status)">
            <icon-svg name="明细" style="vertical-align: middle"></icon-svg>查看委托方明细
          </el-button>
          <el-button size="mini" type="danger" @click="handleDeleteList(scope, 'damage')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-button @click="$router.push('/cost-settlement-invoice/invoice-management')">关闭</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-col>
    </el-row>
    <invoice-choice v-if="choiceVisible" ref="choice" @refreshDataList="setDataList"></invoice-choice>
    <product-drawer v-if="drawerVisible" ref="productDrawer"></product-drawer>
  </div>
</template>

<script>
  import { formatDate } from '@/utils';
  import InvoiceChoice from './invoice-choice'
  import ProductDrawer from '../../trans-resources/product/product-drawer'
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: '',
          carrierId: '',
          invoiceNo: '',
          invoiceMonth: '',
          taxRate: '',
          productId: '',
          askInvoiceAmount: null,
          taxlessAmount: null,
          transportMethod: '',
          serviceMethod: '',
          remark: '',
          costList: [],
          fineList: [],
          damageList: [],
          carrierIdItem: ''
        },
        dataRule: {
          code: [{required: false, message: '请输入开票编号', trigger: 'blur'}],
          carrierId: [{required: true, message: '请选择承运商', trigger: 'blur'}],
          invoiceMonth: [{required: true, message: '请选择对账账期', trigger: 'blur'}],
          // askInvoiceAmount: [{required: true}],
          taxRate: [{required: true, message: '请选择开票税点', trigger: 'change'}],
          transportMethod: [{required: true, message: '请选择运输方式', trigger: 'change'}],
          serviceMethod: [{required: true, message: '请选择服务方式', trigger: 'change'}]
          // taxlessAmount: [{required: true}],
          // product: [{required: true, message: '请选择产品', trigger: 'blur'}]
        },
        dataListLoading: false,
        submitFlag: true,
        choiceVisible: false,
        totalFineMoney: 0,
        productLists: [],
        drawerVisible: false,
        taxRateValue: 0
      }
    },
    activated () {
      this.dataForm.id = JSON.stringify(this.$route.query) !== '{}' ? this.$route.query.id : null
      if (this.dataForm.id && !this.$route.query.type) {
        this.init(this.dataForm.id)
      }
      // this.productLists = this.$route.query.productList
      // this.dataForm.productId = this.productLists.map(res => {
      //   return res.id
      // })[0]
    },
    watch: {
      '$route.params' (newVal) {
        if (this.$route.params.length) {
          this.productLists = this.$route.params
          this.dataForm.productId = this.productLists.map(res => {
            return res.id
          })[0]
        }
      },
      'dataForm.invoiceMonth' (newVal) {
        if (newVal !== formatDate(this.dataForm.invoiceMonth, 'Month')) {
          this.dataForm.costList = []
          this.dataForm.fineList = []
          this.dataForm.damageList = []
          this.dataForm.askInvoiceAmount = ''
          this.dataForm.taxlessAmount = ''
        }
      },
      'dataForm.carrierId' (newVal) {
        if (newVal !== this.dataForm.carrierIdItem) {
          this.dataForm.costList = []
          this.dataForm.fineList = []
          this.dataForm.damageList = []
          this.dataForm.askInvoiceAmount = ''
          this.dataForm.taxlessAmount = ''
        }
      }
    },
    components: {
      InvoiceChoice,
      ProductDrawer
    },
    computed: {
      totalFineAmount () {
        return function (row) {
          let sum = parseInt(row.rejectionReport || 0) +
            parseInt(row.thermometerBack || 0) +
            parseInt(row.rejectReturnsBack || 0) +
            parseInt(row.saleWithdrawalBack || 0) +
            parseInt(row.complaintFine || 0) +
            parseInt(row.documentsAccuracy || 0) +
            parseInt(row.thermometerLoss || 0) +
            parseInt(row.carEnsureRate || 0) +
            parseInt(row.reward || 0)
          this.totalFineMoney = sum
          return sum
        }
      },
      taxlessAmount () {
        return function () {
          if (this.dataForm.costList.length) {
            const costMoney = this.dataForm.costList[0].totalMoney
            const fineListMoney = this.dataForm.fineList.length > 0 ? this.dataForm.fineList.reduce((prev, cur) => { return prev + cur.totalFineAmount }, 0) : 0
            const damageMoney = this.dataForm.damageList.length > 0 ? this.dataForm.damageList.reduce((prev, next) => { return prev + next.totalDamageAmount }, 0) : 0
            let sum = (parseFloat(costMoney || 0) - parseFloat(fineListMoney || 0) - parseFloat(damageMoney || 0)).toFixed(5)
            this.dataForm.askInvoiceAmount = sum
            return sum
          }
        }
      },
      askInvoiceAmount () {
        return function () {
          // let sum = parseFloat(this.dataForm.askInvoiceAmount || 0) - (parseFloat(this.dataForm.askInvoiceAmount || 0) * (parseFloat(this.taxRateValue) * 1 / 100).toFixed(2)).toFixed(2)
          let sum = ((1 - parseFloat(this.taxRateValue) * 1 / 100) * this.dataForm.askInvoiceAmount).toFixed(5)
          this.dataForm.taxlessAmount = sum
          return sum
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || null
        if (id) {
          this.getDataList()
        }
      },
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/feesettlement/tfsinvoice/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            const trProductEntity = []
            if (data.tFsInvoice.trProductEntity) {
              trProductEntity.push(data.tFsInvoice.trProductEntity)
            }
            const dataList = data.tFsInvoice
            this.dataForm.invoiceNo = dataList.invoiceNo
            this.dataForm.carrierId = dataList.carrierId.toString()
            this.dataForm.carrierIdItem = dataList.carrierId.toString()
            this.dataForm.invoiceMonth = dataList.invoiceMonth
            this.dataForm.askInvoiceAmount = dataList.askInvoiceAmount
            this.dataForm.taxRate = dataList.taxRate.toString()
            this.taxRateValue = dataList.taxRateNumber
            this.dataForm.taxlessAmount = dataList.taxlessAmount
            this.dataForm.transportMethod = dataList.transportMethod
            this.dataForm.serviceMethod = dataList.serviceMethod
            this.dataForm.remark = dataList.remark
            this.productLists = trProductEntity
            // this.dataForm.productId = dataList.productId
            this.dataForm.costList = dataList.fsCarriageStatementEntityList
            this.dataForm.fineList = dataList.fsFineEntityList && dataList.fsFineEntityList
            this.dataForm.damageList = dataList.fsCargoDamageEntityList
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 选择产品
      getProductList (type) {
        this.$router.push({
          name: 'product-list',
          params: {
            type: type,
            id: this.dataForm.id,
            isSelected: this.productLists
          }
        })
      },
      // 提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            if (this.dataForm.costList.length < 1) {
              this.$message({
                type: 'warning',
                message: '请选择对账单'
              })
              return
            }
            let detailList = {}
            if (this.dataForm.costList.length) {
              detailList[1] = [this.dataForm.costList[0].id]
            }
            if (this.dataForm.fineList.length) {
              detailList[2] = this.dataForm.fineList.map(item => item.id)
            }
            if (this.dataForm.damageList.length) {
              detailList[3] = this.dataForm.damageList.map(item => item.id)
            }
            this.$http({
              url: this.$http.adornUrl(`/feesettlement/tfsinvoice/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'invoiceNo': this.dataForm.invoiceNo || null,
                'carrierId': this.dataForm.carrierId,
                'invoiceMonth': this.dataForm.invoiceMonth && formatDate(this.dataForm.invoiceMonth, 'Month'),
                // 'productId': this.dataForm.productId,
                'askInvoiceAmount': this.dataForm.askInvoiceAmount,
                'taxlessAmount': this.dataForm.taxlessAmount,
                'transportMethod': this.dataForm.transportMethod,
                'serviceMethod': this.dataForm.serviceMethod,
                'remark': this.dataForm.remark,
                'taxRate': this.dataForm.taxRate,
                detailList
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$router.push({
                      path: '/cost-settlement-invoice/invoice-management'
                    })
                  }
                })
                this.clickFlag = true
              } else {
                this.clickFlag = true
                this.$message.error(data.msg)
              }
            })
            // }
          }
        })
      },
      // 查看对账明细
      handleToCostDetail (id) {
        this.$router.push({
          path: '/cost-settlement-cost/cost/cost-detail',
          query: {
            id: id
          }
        })
      },
      // 查看货损明细
      handleToDamageDetail (id, status) {
        this.$router.push({
          path: '/cost-settlement/cargo-damage/shipper-details',
          query: {
            id: id,
            status: status,
            isEdit: 1
          }
        })
      },
      handleChoice (type) {
        if (type === 'cost') {
          if (!this.dataForm.carrierId || !this.dataForm.invoiceMonth) {
            this.$message({
              type: 'warning',
              message: '请先选择承运商和对账账期'
            })
            return false
          }
        } else {
          if (!this.dataForm.carrierId) {
            this.$message({
              type: 'warning',
              message: '请先选择承运商和对账账期'
            })
            return false
          }
        }
        this.choiceVisible = true
        this.$nextTick(() => {
          this.$refs.choice.init(type, this.dataForm.carrierId, this.dataForm.invoiceMonth)
        })
      },
      setDataList (params, type) {
        if (type === 'cost') {
          this.dataForm.costList = params
        } else if (type === 'fine') {
          this.dataForm.fineList = params
        } else {
          this.dataForm.damageList = params
        }
      },
       // 获取下拉框的label值
      getSelectLabel (params) {
        this.taxRateValue = params
      },
      deleteProduct (index) {
        this.productLists.splice(index, 1)
      },
      getDrawerInfo (id) {
        this.drawerVisible = true
        this.$nextTick(() => {
          this.$refs.productDrawer.init(id)
        })
      },
      // 删除
      handleDeleteList (scope, type) {
        const ins = scope.$index
        this.$confirm('确定删除这条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          if (type === 'cost') {
            this.dataForm.costList.splice(ins, 1)
          } else if (type === 'fine') {
            this.dataForm.fineList.splice(ins, 1)
          } else {
            this.dataForm.damageList.splice(ins, 1)
          }
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/.el-checkbox-button {
    .el-checkbox-button__inner{
      min-width: 280px!important;
      border-color: #ffffff!important;
      padding: 0;
    }
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
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

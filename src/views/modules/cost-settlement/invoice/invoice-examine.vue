<template>
  <div>
    <el-form :model="dataForm" label-width="110px" ref="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()">
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
            <el-form-item label="无税金额：">
              <span>
                {{dataForm.taxlessAmount}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
                {{dataForm.askInvoiceApplyDtm}}
              </span>
            </el-form-item>
          </el-col>
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
                {{dataForm.latestPaymenttime}}
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
      <el-row style="margin-bottom: 10px">
        <el-col :span="4">
          <el-form-item label-width="0">
            <el-tag>纸质发票信息</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="20" style="text-align: right">
          <el-button type="primary" size="mini" @click="addInvoiceList()">添加发票</el-button>
        </el-col>
      </el-row>
      <template>
          <el-row v-for="(item, index) in dataForm.fsInvoiceAttachmentEntityList" :key="index">
            <el-col :span="5">
              <el-form-item label="发票号：" :prop="'fsInvoiceAttachmentEntityList.' + index + '.invoiceNumber'" :rules="dataRule.invoiceNumber">
                <el-input v-model="item.invoiceNumber" maxlength="15" placeholder="请填写纸质发票号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="开票日期：" :prop="'fsInvoiceAttachmentEntityList.' + index + '.invoiceDate'" :rules="dataRule.invoiceDate">
                <el-date-picker
                  style="width: 100%;"
                  v-model="item.invoiceDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="附件：" :prop="'fsInvoiceAttachmentEntityList.' + index + '.attachmentInvoiceNumberList'">
                <xkl-upload v-model="item.attachmentInvoiceNumberList" :config="uploadConfig"></xkl-upload>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="备注：" :prop="'fsInvoiceAttachmentEntityList.' + index + '.remark'">
                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="item.remark" placeholder="备注" clearable maxlength="160"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align: center">
              <el-button type="danger" size="mini" @click="deleteHandle(index)">删除</el-button>
            </el-col>
          </el-row>
      </template>
      <el-row style="margin-top: 20px;text-align: right">
        <el-col>
          <el-button @click="$router.push({ path: '/cost-settlement-invoice/invoice-management' })">关闭</el-button>
          <el-button type="primary" @click="dataFormSubmit">确定</el-button>
        </el-col>
      </el-row>
    </el-form>
    <submit-approval ref="submitApproval" v-if="submitApprovalVisible" @refreshDataList="init"></submit-approval>
  </div>
</template>

<script>
  import {formatDate} from '@/utils';
  import Upload from '@/components/upload/upload'
  import SubmitApproval from '../../sys/audit/submit_approval'
  import ProductDrawer from '../../trans-resources/product/product-drawer'
  export default {
    data () {
      let verifyNumber = (rule, value, callback) => {
        let patrn = /^[0-9][0-9]{0,14}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入不超过15位的数字'))
        }
        callback()
      }
      return {
        clickFlag: true,
        dataForm: {
          id: 0,
          askInvoiceAmount: '',
          taxlessAmount: '',
          carrierName: '',
          invoiceMonth: '',
          transportMethodName: '',
          serviceMethodName: '',
          askInvoiceApplyDtm: '',
          latestPaymenttime: '',
          askInvoiceDtm: '',
          remark: '',
          status: '',
          fsInvoiceAttachmentEntityList: [
          ]
        },
        dataRule: {
          invoiceNumber: [
            {required: true, message: '请输入发票号', trigger: 'change'},
            { validator: verifyNumber, trigger: 'change' }
          ],
          invoiceDate: [
            {required: true, message: '请填写开票日期', trigger: 'change'}
          ],
          attachmentInvoiceNumberList: [{required: true, message: '请上传附件', trigger: 'change'}]
        },
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
        },
        productLists: [],
        drawerVisible: false,
        submitApprovalVisible: false
      }
    },
    activated () {
      this.dataForm.id = this.$route.query.id || null
      this.init()
    },
    components: {
      Upload,
      ProductDrawer,
      SubmitApproval
    },
    methods: {
      init () {
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
            this.dataForm.carrierName = dataList.carrierName
            this.dataForm.invoiceMonth = dataList.invoiceMonth
            this.dataForm.askInvoiceAmount = dataList.askInvoiceAmount
            this.dataForm.taxlessAmount = dataList.taxlessAmount
            this.dataForm.status = dataList.status
            this.dataForm.transportMethodName = dataList.transportMethodName
            this.dataForm.serviceMethodName = dataList.serviceMethodName
            this.dataForm.askInvoiceApplyDtm = dataList.askInvoiceApplyDtm
            this.dataForm.askInvoiceDtm = dataList.askInvoiceDtm && dataList.askInvoiceDtm.split(' ')[0]
            this.dataForm.latestPaymenttime = dataList.latestPaymenttime
            this.dataForm.remark = dataList.remark
            // this.productLists = trProductEntity
            this.dataForm.fsInvoiceAttachmentEntityList = dataList.fsInvoiceAttachmentEntityList && dataList.fsInvoiceAttachmentEntityList.length > 0 ? dataList.fsInvoiceAttachmentEntityList : [
              {
                invoiceNumber: '',
                attachmentInvoiceNumberList: [],
                remark: ''
              }
            ]
          } else {
            this.dataForm = {}
          }
          this.dataListLoading = false
        })
      },
      handleCancel () {
        window.history.go(-1)
      },
      addInvoiceList () {
        let lastItem
        if (this.dataForm.fsInvoiceAttachmentEntityList.length) {
          lastItem = this.dataForm.fsInvoiceAttachmentEntityList[this.dataForm.fsInvoiceAttachmentEntityList.length - 1]
        }
        this.dataForm.fsInvoiceAttachmentEntityList.push({
          invoiceNumber: lastItem.invoiceNumber && lastItem.invoiceNumber.indexOf('.') === -1 && !isNaN(lastItem.invoiceNumber) ? parseFloat(lastItem.invoiceNumber) + 1 + '' : '',
          invoiceDate: lastItem.invoiceDate ? lastItem.invoiceDate : '',
          attachmentInvoiceNumberList: [],
          remark: ''
        })
      },
      deleteHandle (index) {
        if (this.dataForm.fsInvoiceAttachmentEntityList.length === 1) {
          this.$message.warning('至少保留一条数据')
          return
        }
        this.dataForm.fsInvoiceAttachmentEntityList.splice(index, 1)
      },
      submitApproval () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.dataForm.status !== 0) {
              this.$message.error('该开票单已审核')
              return
            }
            const ids = []
            ids.push(this.dataForm.id)
            this.submitApprovalVisible = true
            this.$nextTick(() => {
              this.$refs.submitApproval.init(ids, 'invoice', this.dataForm.fsInvoiceAttachmentEntityList)
            })
          }
        })
      },
      dataFormSubmit () {
        if (this.$store.state.upload.status) {
          this.$message({
            type: 'warning',
            message: '文件尚未上传完成'
          })
          return false
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            const ids = []
            ids.push(this.dataForm.id)
            this.$http({
              url: this.$http.adornUrl('/feesettlement/tfsinvoice/audit'),
              method: 'post',
              data: this.$http.adornData({
                'ids': ids,
                'fsInvoiceAttachmentList': this.dataForm.fsInvoiceAttachmentEntityList.map(item => {
                  item.invoiceDate = formatDate(item.invoiceDate)
                  return item
                }),
                status: 2
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '审核成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    window.history.go(-1)
                  }
                })
              } else {
                this.clickFlag = true
                this.$message.error(data.msg)
              }
            })
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
  .tem-content{
    padding: 0 100px;
  }
  /deep/.el-checkbox-button {
    .el-checkbox-button__inner{
      min-width: 280px!important;
      border-color: #ffffff!important;
      padding: 1px;
    }
  }
  /deep/.el-dialog__wrapper .el-form-item__content .el-upload__tip{
    display: none;
  }
  /deep/.el-dialog__wrapper .el-upload__tip{
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

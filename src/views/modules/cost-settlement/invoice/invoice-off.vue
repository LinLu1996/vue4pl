<template>
  <div class="invoice-off">
    <el-form label-width="100px" ref="dataForm" :model="dataForm" :rules="dataRule">
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
          <el-form-item label="对账账期：" prop="invoiceMonth">
            <span>
              {{dataForm.invoiceMonth}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="已付金额：">
            <span>
              {{dataForm.amountPay}}
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
      <el-form-item label-width="0">
        <el-tag>纸质发票信息</el-tag>
      </el-form-item>
      <template>
        <el-form label-width="100px">
          <el-row v-for="(item, index) in dataForm.fsInvoiceAttachmentEntityList" :key="index">
            <el-col :span="8">
              <el-form-item label="发票号：">
                <span>
                  {{item.invoiceNumber}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="附件：">
                <xkl-upload v-model="item.attachmentInvoiceNumberList" :config="uploadConfig"></xkl-upload>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注：">
                <span style="white-space:normal; word-break:break-all;">
                  {{item.remark}}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-form-item label-width="0">
        <el-tag>付款信息</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="付款金额" prop="paymentAmount">
            <el-input v-model="dataForm.paymentAmount" placeholder="付款金额"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="付款时间" prop="paymentDtm">
            <el-date-picker
              style="width: 100%;"
              v-model="dataForm.paymentDtm"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注" prop="paymentRemark">
            <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="dataForm.paymentRemark" clearable maxlength="160"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="支付凭证">
            <xkl-upload v-model="dataForm.attachments" :config="uploadConfig2"></xkl-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-button @click="$router.go(-1)">关闭</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-col>
    </el-row>
    </el-form>
  </div>
</template>

<script>
  import Upload from '@/components/upload/upload'
  import { formatDate } from '@/utils';
  export default {
    data () {
      let verifyPrice = (rule, value, callback) => {
        if (value) {
          let patrn = /^(([1-9][0-9]{1,7})|([0-9]{1}))(\.[0-9]{1,5})?$/;
          if (!patrn.exec(value)) {
            callback(new Error('整数位最多8位，小数位最多5位'))
          }
        }
        callback()
      }
      return {
        clickFlag: true,
        dataForm: {
          id: 0,
          invoiceNo: '',
          askInvoiceAmount: '',
          taxlessAmount: '',
          carrierName: '',
          invoiceMonth: '',
          amountPay: '',
          paymentAmountCount: '',
          transportMethodName: '',
          serviceMethodName: '',
          remark: '',
          fsInvoiceAttachmentEntityList: [
          ],
          paymentAmount: '',
          paymentDtm: '',
          paymentRemark: '',
          attachments: []
        },
        dataRule: {
          paymentAmount: [
            {required: true, message: '请输入付款金额', trigger: 'blur'},
            { validator: verifyPrice, trigger: 'change' }
          ],
          paymentDtm: [{required: true, message: '请选择付款时间', trigger: 'change'}]
        },
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          disabled: true
        },
        uploadConfig2: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
        }
      }
    },
    activated () {
      this.dataForm.id = this.$route.query.id || null
      this.init()
    },
    components: {
      Upload
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
            this.dataForm.invoiceNo = dataList.invoiceNo
            this.dataForm.invoiceMonth = dataList.invoiceMonth
            this.dataForm.askInvoiceAmount = dataList.askInvoiceAmount
            this.dataForm.taxlessAmount = dataList.taxlessAmount
            this.dataForm.carrierName = dataList.carrierName
            this.dataForm.amountPay = dataList.amountPay
            this.dataForm.paymentAmount = dataList.paymentAmountCount || 0
            this.dataForm.paymentAmountCount = dataList.paymentAmountCount
            this.dataForm.taxRate = dataList.taxRate
            this.dataForm.transportMethodName = dataList.transportMethodName
            this.dataForm.serviceMethodName = dataList.serviceMethodName
            this.dataForm.remark = dataList.remark
            this.dataForm.attachments = dataList.attachments
            this.dataForm.fsInvoiceAttachmentEntityList = dataList.fsInvoiceAttachmentEntityList
          } else {
            this.dataForm = {}
          }
          this.dataListLoading = false
        })
      },
      handleCancel () {
        window.history.go(-1)
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
            if (this.dataForm.paymentAmountCount && this.dataForm.paymentAmount > this.dataForm.paymentAmountCount) {
              this.$message({
                type: 'warning',
                message: `付款金额不能大于${this.dataForm.paymentAmountCount}`
              })
              return
            }
            const ids = []
            ids.push(this.dataForm.id)
            this.$http({
              url: this.$http.adornUrl('/feesettlement/tfsinvoice/paymentAmount'),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'paymentAmount': this.dataForm.paymentAmount,
                'paymentDtm': this.dataForm.paymentDtm && formatDate(this.dataForm.paymentDtm),
                'paymentRemark': this.dataForm.paymentRemark,
                'attachments': this.dataForm.attachments
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '付款核销成功',
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tem-content{
    padding: 0 100px;
  }
  /deep/.invoice-off .el-form-item__content .el-upload--picture-card{
    display: none;
  }
  /deep/.invoice-off .el-form-item__content .el-upload__tip{
    display: none;
  }
  /deep/.invoice-off .el-upload__tip{
    display: none;
  }
</style>

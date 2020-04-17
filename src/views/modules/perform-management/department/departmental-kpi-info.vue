<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="考核月度：">
          <span style="width: 200px; display: block">
              {{dataForm.kpiMonth}}
          </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="到货准时率：">
          <span style="width: 200px; display: block">
              {{dataForm.reachPunctualRate}}%
          </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="破损率(细盒)：">
          <span style="width: 200px; display: block">
              {{dataForm.damageRateDetail}}%
          </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="破损率(订单行)：">
          <span style="width: 200px; display: block">
              {{dataForm.damageRateBook}}%
          </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="提退货返回及时率：">
          <span style="width: 200px; display: block">
              {{dataForm.withdrawalReturnRate}}%
          </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="回单返回及时率：">
          <span style="width: 200px; display: block">
              {{dataForm.receiptReturnRate}}%
          </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="回单上传及时率：">
          <span style="width: 200px; display: block">
              {{dataForm.receiptUploadRate}}%
          </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="签收信息及时率：">
          <span style="width: 200px; display: block">
              {{dataForm.signRate}}%
          </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拒收上报及时率：">
          <span style="width: 200px; display: block">
              {{dataForm.rejectionReportRate}}%
          </span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: '',
          kpiMonth: '',
          reachPunctualRate: '',
          damageRateDetail: '',
          damageRateBook: '',
          withdrawalReturnRate: '',
          receiptReturnRate: '',
          receiptUploadRate: '',
          signRate: '',
          rejectionReportRate: ''
        },
        dataRule: {
          kpiMonth: [
            { required: true, message: '考核月度不能为空', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.visible = true
        this.dataForm = {
          id: '',
          kpiMonth: '',
          reachPunctualRate: '',
          damageRateDetail: '',
          damageRateBook: '',
          withdrawalReturnRate: '',
          receiptReturnRate: '',
          receiptUploadRate: '',
          signRate: ''
        }
        this.dataForm.id = id || ''
        this.dataForm.kpiMonth = ''
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/kpidepart/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.kpiMonth = this.$formatDate(data.kpiDepart.kpiMonth, 'Month')
                this.dataForm.reachPunctualRate = data.kpiDepart.reachPunctualRate
                this.dataForm.damageRateDetail = data.kpiDepart.damageRateDetail
                this.dataForm.damageRateBook = data.kpiDepart.damageRateBook
                this.dataForm.withdrawalReturnRate = data.kpiDepart.withdrawalReturnRate
                this.dataForm.receiptReturnRate = data.kpiDepart.receiptReturnRate
                this.dataForm.receiptUploadRate = data.kpiDepart.receiptUploadRate
                this.dataForm.signRate = data.kpiDepart.signRate
                this.dataForm.rejectionReportRate = data.kpiDepart.rejectionReportRate
              }
            })
          }
        })
      }
    }
  }
</script>


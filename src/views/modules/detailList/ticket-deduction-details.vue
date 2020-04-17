<template>
  <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="130px">
    <el-form-item label-width="0">
      <el-tag>扣罚单信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="扣罚单号：">
           <span style="width: 200px; display: block">
                {{dataForm.fineId}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="扣罚账期：">
           <span style="width: 200px; display: block">
                {{dataForm.fineMonth}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运商：">
           <span style="width: 200px; display: block">
                {{dataForm.carrierName}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="总扣罚金额：">
           <span style="width: 200px; display: block">
                {{dataForm.totalFineAmount}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="拒收上报：">
           <span style="width: 200px; display: block">
                {{dataForm.rejectionReport}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="温度计返回：">
           <span style="width: 200px; display: block">
                {{dataForm.thermometerBack}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="拒收退货返回：">
           <span style="width: 200px; display: block">
                {{dataForm.rejectReturnsBack}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="销退提货返回：">
           <span style="width: 200px; display: block">
                {{dataForm.saleWithdrawalBack}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="投诉扣罚：">
           <span style="width: 200px; display: block">
                {{dataForm.complaintFine}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="单证准确率：">
           <span style="width: 200px; display: block">
                {{dataForm.documentsAccuracy}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="温度计遗失：">
           <span style="width: 200px; display: block">
                {{dataForm.thermometerLoss}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="整车业务保障率：">
           <span style="width: 200px; display: block">
                {{dataForm.carEnsureRate}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="奖励项目：">
           <span style="width: 200px; display: block">
                {{dataForm.reward}}
            </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="display: flex;justify-content: flex-end;margin-top: 20px">
      <el-button type="primary" @click="approve(3)">通过</el-button>
      <el-button type="primary" @click="handleReverseAudit">不通过</el-button>
      <el-button type="warning" @click="handleBack()">返回</el-button>
    </el-row>
    <sea-son v-if="seaSonVisible" ref="seaSon"></sea-son>
  </el-form>
</template>

<script>
  import SeaSon from './seaSon'
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        linkage: '1',
        dataListLoading: false,
        isShow: true,
        dataForm: {
          id: 0,
          fineId: '',
          fineMonth: '',
          totalFineAmount: '',
          rejectionReport: '',
          thermometerBack: '',
          rejectReturnsBack: '',
          saleWithdrawalBack: '',
          complaintFine: '',
          documentsAccuracy: '',
          thermometerLoss: '',
          carEnsureRate: '',
          reward: ''
        },
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
      this.init()
    },
    methods: {
      init () {
        this.clickFlag = true
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/feesettlement/fscargodamage/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.fineId = data.fsCargoDamage ? data.fsCargoDamage.cargoDamageNo : ''
                this.dataForm.fineMonth = data.fsCargoDamage ? data.fsCargoDamage.cargoDamageMonth : ''
                this.dataForm.totalFineAmount = data.fsCargoDamage ? data.fsCargoDamage.totalFineAmount : ''
                this.dataForm.rejectionReport = data.fsCargoDamage ? data.fsCargoDamage.rejectionReport : ''
                this.dataForm.thermometerBack = data.fsCargoDamage ? data.fsCargoDamage.thermometerBack : ''
                this.dataForm.rejectReturnsBack = data.fsCargoDamage ? data.fsCargoDamage.rejectReturnsBack : ''
                this.dataForm.saleWithdrawalBack = data.fsCargoDamage ? data.fsCargoDamage.saleWithdrawalBack : ''
                this.dataForm.complaintFine = data.fsCargoDamage ? data.fsCargoDamage.complaintFine : ''
                this.dataForm.documentsAccuracy = data.fsCargoDamage ? data.fsCargoDamage.documentsAccuracy : ''
                this.dataForm.thermometerLoss = data.fsCargoDamage ? data.fsCargoDamage.thermometerLoss : ''
                this.dataForm.carEnsureRate = data.fsCargoDamage ? data.fsCargoDamage.carEnsureRate : ''
                this.dataForm.reward = data.fsCargoDamage ? data.fsCargoDamage.reward : ''
              }
            })
          } else {
          }
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
  /deep/.el-checkbox-button {
    .el-checkbox-button__inner{
      min-width: 280px!important;
      border-color: #ffffff!important;
      padding: 0;
    }
  }
</style>

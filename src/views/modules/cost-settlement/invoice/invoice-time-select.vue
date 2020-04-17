<template>
  <el-dialog
    title="批量付款核销"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="付款时间" prop="paymentDtm">
            <el-date-picker
              style="width: 100%;"
              v-model="dataForm.paymentDtm"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-button @click="closeForm()">关闭</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          paymentDtm: ''
        },
        dataRule: {
          paymentDtm: [{required: true, message: '请选择付款时间', trigger: 'change'}]
        }
      }
    },
    methods: {
      init () {
        this.clickFlag = true
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            this.visible = false
            this.$emit('getTime', this.dataForm.paymentDtm)
          }
        })
      },
      closeForm () {
        this.visible = false
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>

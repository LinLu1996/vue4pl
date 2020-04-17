<template>
  <el-dialog
    title="货损单新增"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-row>
        <el-col :span="16">
          <el-form-item label="承运商" prop="carrierCode">
            <xkl-select style="width: 100%" v-model="dataForm.carrierCode" keyType="carrierCode" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList" select-type="OPERATION_TYPE" placeholder="承运商"></xkl-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="货损账期" prop="cargoDamageMonth">
            <el-date-picker
              v-model="dataForm.cargoDamageMonth"
              type="month"
              style="width: 100%"
              placeholder="请选择">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">关闭</el-button>
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
          carrierCode: '',
          cargoDamageMonth: ''
        },
        dataRule: {
          cargoDamageMonth: [{required: true, message: '请选择货损账期', trigger: 'change'}],
          carrierCode: [{required: true, message: '请选择承运商', trigger: 'change'}]
        }
      }
    },
    methods: {
      init (id, values) {
        this.visible = true
        this.clickFlag = true
        // this.dataForm.id = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
        })
      },
      // 获取承运商label
      getLabel (label) {
        this.dataForm.carrierName = label
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/feesettlement/fscargodamage/export`),
              method: 'post',
              data: this.$http.adornData({
                ...this.dataForm
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
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
      closeForm () {
        this.visible = false
      }
    }
  }
</script>
<style lang="scss">
  .el-message-box__content{
    max-height: 500px!important;
    overflow: auto;
  }
</style>

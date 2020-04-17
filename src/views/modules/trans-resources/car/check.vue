<template>
  <el-dialog
    title="车辆验证"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-form-item label="承运商名称" prop="carrierName">
        <span>
          {{dataForm.carrierName}}
        </span>
      </el-form-item>
      <el-form-item label="车牌号" prop="carNumber">
        <span>
          {{dataForm.carNumber}}
        </span>
      </el-form-item>
      <el-form-item label="车型" prop="carValue">
        <span>
          {{dataForm.carValue}}
        </span>
      </el-form-item>
      <el-form-item label="验证日期" prop="checkDate">
        <el-date-picker
          v-model="dataForm.checkDate"
          style="width: 100%"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="有效日期" prop="validDate">
        <el-date-picker
          v-model="validDate"
          style="width: 100%"
          type="date"
          disabled
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label=是否通过 prop="checkResult">
        <el-radio-group v-model="dataForm.checkResult">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" :autosize="{ minRows: 2, maxRows: 4}" placeholder="备注" maxlength="160"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import upload from './upload'
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataList: [],
        dataForm: {
          id: null,
          carrierName: '',
          carNumber: '',
          carValue: '',
          checkDate: '',
          checkResult: 0,
          remark: ''
        },
        dataRule: {
          checkDate: [{required: true, message: '请选择验证期'}]
        }
      }
    },
    computed: {
      validDate: {
        get () {
          const checkDate = new Date(this.dataForm.checkDate)
          return checkDate.setMonth(checkDate.getMonth() + 6)
        }
      }
    },
    components: {
      upload
    },
    methods: {
      init (id, scope) {
        this.visible = true
        this.dataForm.id = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.dataForm.carrierName = scope.row.carrierName
            this.dataForm.carValue = scope.row.carValue
            this.dataForm.carNumber = scope.row.carNumber
          }
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
            this.$http({
              url: this.$http.adornUrl('/transresources/trcarcheck/save'),
              method: 'post',
              data: this.$http.adornData({
                'carId': this.dataForm.id,
                'checkTime': this.dataForm.checkDate,
                'validTime': new Date(this.validDate),
                'checkResult': this.dataForm.checkResult,
                'remark': this.dataForm.remark
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.clickFlag = true
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
      }
    }
  }
</script>

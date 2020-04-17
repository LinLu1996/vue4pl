<template>
  <el-dialog
    title="审核"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-row>
        <el-col>
          <el-form-item label="备案结果" prop="checkLabel">
            <el-radio-group v-model="dataForm.checkLabel">
              <el-radio :label="3">通过</el-radio>
              <el-radio :label="2">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备案说明" prop="approveRemark">
            <el-input v-model="dataForm.approveRemark" type="textarea" rows="4" maxLength="100"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible =  false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    components: {
    },
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          checkLabel: 3,
          approveRemark: ''
        },
        dataRule: {
          checkLabel: [
            {required: true, message: '请选择是否通过', trigger: 'change'}
          ]
        },
        radio: false,
        clickFlag: true
      }
    },
    methods: {
      init (id, status) {
        this.visible = true
        this.dataForm.id = id
        this.dataForm.checkLabel = status === 3 || status === 2 ? status : ''
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/transresources/auditrecord/approve`),
              method: 'post',
              data: this.$http.adornData({
                srcPk: this.dataForm.id,
                approveStatus: this.dataForm.checkLabel,
                remark: this.dataForm.approveRemark
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
                    this.clickFlag = true
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
<style>
</style>


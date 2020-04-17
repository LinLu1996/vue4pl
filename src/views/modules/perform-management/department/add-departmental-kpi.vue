<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-row>
        <el-col :span="16">
          <el-form-item label="考核月度">
            <xkl-date-picker v-model="dataForm.kpiMonth" type="month" placeholder="选择月份"></xkl-date-picker>
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
  import { formatDate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          kpiMonth: ''
        },
        dataRule: {
          kpiMonth: [
            { required: true, message: '考核月度不能为空', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      init () {
        this.clickFlag = true
        this.visible = true
        this.dataForm.kpiMonth = ''
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
            this.$http({
              url: this.$http.adornUrl('/performancemanagement/kpidepart/save'),
              method: 'post',
              data: this.$http.adornData({
                'kpiMonth': this.dataForm.kpiMonth ? formatDate(this.dataForm.kpiMonth, 'Month').split('-').join('') : ''
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: this.dataForm.id ? '编辑成功' : '新增成功',
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
      }
    }
  }
</script>

<template>
  <el-dialog
    title="创建"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="90px">
      <el-form-item label="考核月度" prop="month">
        <el-date-picker
          style="width: 100%"
          v-model="dataForm.month"
          type="month"
          placeholder="选择考核月度">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="承运商" prop="carrierId">
        <xkl-select style="width: 100%" v-model="dataForm.carrierId" select-type="OPERATION_TYPE" placeholder="选择承运商"></xkl-select>
      </el-form-item>
      <el-form-item label="考核模板" prop="name">
        <xkl-select style="width: 100%" v-model="dataForm.name" select-type="OPERATION_TYPE" placeholder="选择考核模板"></xkl-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        options: [],
        dataForm: {
          id: 0,
          month: '',
          carrierId: '',
          name: ''
        },
        dataRule: {
          month: [
            { required: true, message: '请选择考核月度', trigger: 'change' }
          ],
          carrierId: [
            { required: true, message: '请选择承运商', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请选择考核模板', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/config/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              // if (data && data.code === 0) {
              //   this.dataForm.paramKey = data.config.paramKey
              //   this.dataForm.paramValue = data.config.paramValue
              //   this.dataForm.remark = data.config.remark
              // }
            })
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
              url: this.$http.adornUrl(`/sys/config/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined
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
      }
    }
  }
</script>
<style lang="scss">

</style>

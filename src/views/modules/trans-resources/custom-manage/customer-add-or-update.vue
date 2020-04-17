<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="委托方简称" prop="shortOwnerName">
        <el-input v-model="dataForm.shortOwnerName" maxlength="16" placeholder="委托方简称"></el-input>
      </el-form-item>
      <el-form-item label="委托方全称" prop="ownerName">
        <el-input v-model="dataForm.ownerName" maxlength="18" placeholder="委托方全称"></el-input>
      </el-form-item>
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
          shortOwnerName: '',
          ownerName: ''
        },
        dataRule: {
          shortOwnerName: [
            { required: true, message: '委托方简称不能为空', trigger: 'blur' }
          ],
          ownerName: [
            { required: true, message: '委托方全称不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/transresources/ttrconsignor/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.shortOwnerName = data.tTrConsignor.shortOwnerName
                this.dataForm.ownerName = data.tTrConsignor.ownerName
              }
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
              url: this.$http.adornUrl(`/transresources/ttrconsignor/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'shortOwnerName': this.dataForm.shortOwnerName,
                'ownerName': this.dataForm.ownerName
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: this.dataForm.id ? '修改成功' : '新增成功',
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

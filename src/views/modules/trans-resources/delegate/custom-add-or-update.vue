<template>
  <el-dialog
    title="合并SAVE货主"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="简称" prop="shortOwnerName">
            <el-input v-model="dataForm.shortOwnerName" maxlength="16" placeholder="简称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="全称" prop="ownerName">
            <el-input v-model="dataForm.ownerName" placeholder="全称" maxlength="18" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible=false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        url: this.$http.adornUrl(`/transresources/trcontract/upload?token=${this.$cookie.get('token')}`),
        visible: false,
        clickFlag: true,
        dataForm: {
          ownerName: '',
          shortOwnerName: '',
          saveOwners: []
        },
        dataRule: {
          shortOwnerName: [{required: true, message: '请输入简称', trigger: 'blur'}],
          ownerName: [{required: true, message: '请输入全称', trigger: 'blur'}]
        }
      }
    },
    components: {
    },
    methods: {
      init (list) {
        this.clickFlag = true
        this.visible = true
        this.dataForm.saveOwners = list
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
              url: this.$http.adornUrl(`/transresources/ttrconsignor/mergingCustomers`),
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
      }
    }
  }
</script>

<template>
  <el-dialog
    :title="this.editType === 'GENERATE' ? '生成正式客户' : '合并客户'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="简称" prop="shortName">
        <el-input v-model="dataForm.shortName" maxlength="16" placeholder="简称"></el-input>
      </el-form-item>
      <el-form-item label="全称" prop="fullName">
        <el-input v-model="dataForm.fullName" maxlength="33" placeholder="全称"></el-input>
      </el-form-item>
<!--      <el-form-item v-if="editType === 'GENERATE'" label="所属组织" prop="organization">-->
<!--        <el-input v-model="dataForm.organization" placeholder="所属组织"></el-input>-->
<!--      </el-form-item>-->
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
        editType: '',
        visible: false,
        clickFlag: true,
        dataForm: {
          shortName: '',
          fullName: '',
          organization: '',
          list: [],
          basicSaveCustomerEntity: {}
        },
        dataRule: {
          shortName: [
            { required: true, message: '简称不能为空', trigger: 'blur' }
          ],
          fullName: [
            { required: true, message: '全称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (type, params) {
        this.clickFlag = true
        this.visible = true
        this.editType = type
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.editType === 'GENERATE') {
            this.dataForm.basicSaveCustomerEntity = params
            this.dataForm.shortName = params.shortName
            this.dataForm.fullName = params.fullName
          } else {
            this.dataForm.list = params
            this.dataForm.shortName = params[0].shortName
            this.dataForm.fullName = params[0].fullName
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
              url: this.$http.adornUrl(this.editType === 'TOMERGE' ? '/basic/customer/mergingCustomers' : '/basic/customer/addCustomer'),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: this.editType === 'TOMERGE' ? '已合并客户' : '已生成正式客户',
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

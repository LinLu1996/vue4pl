<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="100px">
    <el-form-item label-width="0">
      <el-tag>基本信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="简称" prop="shortName">
          <el-input v-model="dataForm.shortName" maxlength="16" clearable placeholder="简称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
          <el-form-item label="编码" prop="wareCode">
          <el-input v-model="dataForm.wareCode" maxlength="50" clearable placeholder="编码"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="全称" prop="fullName">
          <el-input v-model="dataForm.fullName" maxlength="33" clearable placeholder="全称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
          <el-form-item label="地址" prop="address">
            <el-input v-model="dataForm.address" maxlength="166" clearable placeholder="地址"></el-input>
          </el-form-item>
      </el-col>
    </el-row>
  </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible=false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      let verifyNumberChar = (rule, value, callback) => {
        let patrn = /^(\w){0,50}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入字母、数字、下划线'))
        }
        callback()
      }
      return {
        visible: false,
        drawerVisible: false,
        clickFlag: true,
        linkage: '1',
        id: '',
        dataForm: {
          id: 0,
          wareCode: '',
          shortName: '',
          fullName: '',
          address: ''
        },
        dataRule: {
          shortName: [
            {required: true, message: '请填写简称', trigger: 'blur'}
          ],
          fullName: [
            {required: true, message: '请填写全称', trigger: 'blur'}
          ],
          wareCode: [
            {required: true, message: '请填写编码', trigger: 'change'},
            {validator: verifyNumberChar}
          ],
          address: [
            {required: true, message: '请填写地址', trigger: 'blur'}
          ]
        },
        isDisabled: false
      }
    },
    watch: {
    },
    components: {
    },
    created () {
      this.init()
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/transresources/trwarehouse/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.shortName = data.trWarehouse.shortName
                this.dataForm.address = data.trWarehouse.address
                this.dataForm.wareCode = data.trWarehouse.wareCode
                this.dataForm.fullName = data.trWarehouse.fullName
              }
            })
          } else {
            this.isDisabled = false
            this.dataForm.attachmentUrl = ''
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
            this.handleSubmit()
          }
        })
      },
      closeForm () {
        this.visible = false
        this.$refs['attachment'].init()
      },
      handleSubmit () {
        this.clickFlag = false
        this.$http({
          url: this.$http.adornUrl(`/transresources/trwarehouse/${!this.dataForm.id ? 'save' : 'update'}`),
          method: 'post',
          data: this.$http.adornData({
            'id': this.dataForm.id,
            'shortName': this.dataForm.shortName,
            'fullName': this.dataForm.fullName,
            'wareCode': this.dataForm.wareCode,
            'address': this.dataForm.address
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
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
    display: block;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card{
    /deep/.el-card__header {
      background-color: #3e8ef76b;
    }
  }
</style>

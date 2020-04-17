<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="save货主编码" prop="saveOwnerCode">
            <el-input v-model="dataForm.saveOwnerCode" maxLength="16" placeholder="save货主编码" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物流货主编码" prop="logisticsOwnerCode">
            <el-input v-model="dataForm.logisticsOwnerCode" maxLength="16" placeholder="物流货主编码" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="简称" prop="shortOwnerName">
            <el-input v-model="dataForm.shortOwnerName" placeholder="简称" maxlength="16" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="全称" prop="ownerName">
            <el-input v-model="dataForm.ownerName" placeholder="全称" maxlength="16" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label=是否内部货主 prop="isInsideOwner">
            <el-radio-group v-model="dataForm.isInsideOwner">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    components: {},
    data () {
      let verifyNumberChar = (rule, value, callback) => {
        let patrn = /^(\w){0,16}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入字母、数字、下划线'))
        }
        callback()
      }
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: '',
          saveOwnerCode: '',
          logisticsOwnerCode: '',
          shortOwnerName: '',
          ownerName: '',
          isInsideOwner: 0
        },
        dataRule: {
          saveOwnerCode: [
            {required: true, message: '请输入save货主编码', trigger: 'blur'},
            {validator: verifyNumberChar}
          ],
          logisticsOwnerCode: [
            {required: true, message: '请输入物流货主编码', trigger: 'blur'},
            {validator: verifyNumberChar}
          ],
          shortOwnerName: [
            {required: true, message: '请输入简称', trigger: 'blur'}
          ],
          ownerName: [
            {required: true, message: '请输入全称', trigger: 'blur'}
          ],
          isInsideOwner: [{required: true, message: '请选择是否内部货主', trigger: 'change'}]
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
        })
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/transresources/trsaveowner/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.saveOwnerCode = data.trWarehouse.saveOwnerCode
              this.dataForm.logisticsOwnerCode = data.trWarehouse.logisticsOwnerCode
              this.dataForm.shortOwnerName = data.trWarehouse.shortOwnerName
              this.dataForm.ownerName = data.trWarehouse.ownerName
              this.dataForm.isInsideOwner = data.trWarehouse.isInsideOwner
            }
          })
        }
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
              url: this.$http.adornUrl(`/transresources/trsaveowner/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                id: this.dataForm.id || undefined,
                saveOwnerCode: this.dataForm.saveOwnerCode,
                logisticsOwnerCode: this.dataForm.logisticsOwnerCode,
                shortOwnerName: this.dataForm.shortOwnerName,
                ownerName: this.dataForm.ownerName,
                isInsideOwner: this.dataForm.isInsideOwner
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
      },
      getPercen () {
        if (this.dataForm.planedCarNum) {
          let realityCarNum = this.dataForm.realityCarNum
          let planedCarNum = this.dataForm.planedCarNum
          realityCarNum = realityCarNum && !isNaN(realityCarNum) ? realityCarNum : 0
          planedCarNum = planedCarNum && !isNaN(planedCarNum) ? planedCarNum : 0
          this.dataForm.fillRate = parseInt(realityCarNum) / parseInt(planedCarNum) * 100
          this.dataForm.fillRate = this.dataForm.fillRate.toFixed(2)
          this.dataForm.unprotectedNumber = parseInt(planedCarNum) - parseInt(realityCarNum)
          if (this.dataForm.unprotectedNumber < 0) {
            this.dataForm.unprotectedNumber = 0
          } else {
            this.dataForm.unprotectedNumber = this.dataForm.unprotectedNumber
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 85px;
  }
</style>

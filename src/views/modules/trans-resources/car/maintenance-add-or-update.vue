<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-tag style="font-size: 18px;margin-bottom: 15px;">基本信息</el-tag>
    <el-form :model="dataForm" ref="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="维保日期" prop="maintenanceTime">
            <xkl-date-picker style="width: 100%" v-model="dataForm.maintenanceTime"  type="date" placeholder="维保日期"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="维保项目" prop="maintenanceItem">
            <el-input v-model="dataForm.maintenanceItem" placeholder="维保项目" maxlength="165"  clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="更换部件" prop="changeComponent">
            <el-input type="textarea" v-model="dataForm.changeComponent" maxlength="165" placeholder="更换部件"  clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="dataForm.remark" maxlength ="165" placeholder="备注"  rows="5" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
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
          id: '',
          carId: '',
          maintenanceTime: '',
          maintenanceItem: '',
          changeComponent: '',
          remark: ''
        },
        dataRule: {
          maintenanceTime: [
            { required: true, message: '维保时间不能为空', trigger: 'change' }
          ],
          maintenanceItem: [
            { required: true, message: '维保项目不能为空', trigger: 'change' }
          ],
          changeComponent: [
            { required: true, message: '维保部件不能为空', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      init (id, carId) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.dataForm.carId = carId
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcarmaintenance/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.id = data.maintenance.id
                this.dataForm.carId = data.maintenance.carId
                this.dataForm.maintenanceTime = new Date(data.maintenance.maintenanceDtm)
                this.dataForm.maintenanceItem = data.maintenance.maintenanceItem
                this.dataForm.changeComponent = data.maintenance.changeComponent
                this.dataForm.remark = data.maintenance.remark
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (!this.clickFlag) {
            return
          }
          if (valid) {
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcarmaintenance/${!this.dataForm.id ? 'save' : 'update'}`),
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

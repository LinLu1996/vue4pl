<template>
  <el-dialog
    title="原因"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
  <div class="mod-config">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-row>
        <el-col :span="16">
          <el-form-item label="原因" prop="remark">
            <el-input  type="textarea"  v-model="dataForm.remark" maxlength="166" placeholder="原因"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">关闭</el-button>
    <el-button type="primary" @click="approve">确定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        currentType: '',
        dataForm: {
          remark: '',
          id: ''
        },
        dataRule: {
          remark: [{required: true, message: '请输入不通过原因', trigger: 'blur'}]}
      }
    },
    components: {
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.visible = true
        this.dataForm.id = id
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 表单提交
      approve () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/sys/auditrecord/approve`),
              method: 'post',
              data: this.$http.adornData({
                ...this.dataForm,
                approveStatus: 2
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.handleBack()
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
      // 关闭
      handleBack () {
        this.visible = false
        this.$router.push({
          path: '/todoList'
        })
      }
    }
  }
</script>
<style lang="scss">
  .el-table__body-wrapper{
    button{
      width: auto!important;
      height: 25px;
      line-height: 25px;
      padding: 0;
      text-align: center;
      background: none;
      color: #3E8EF7;
      border: none;
    }
  }
</style>

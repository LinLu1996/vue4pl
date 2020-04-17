<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label-width="0">
        <el-tag>基本信息</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item label="简称：">
          <span style="width: 100%; display: block">
              {{dataForm.shortName}}
          </span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="编码：">
          <span style="width: 100%; display: block; word-break: break-all">
              {{dataForm.wareCode}}
          </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="全称：">
          <span style="width: 200px; display: block">
              {{dataForm.fullName}}
          </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址：">
          <span style="width: 90%; display: block">
             {{dataForm.address}}
          </span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        drawerVisible: false,
        clickFlag: true,
        linkage: '1',
        dataRule: {},
        dataForm: {
          id: 0,
          wareCode: '',
          shortName: '',
          fullName: '',
          address: ''
        },
        productLists: []
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
      closeForm () {
        this.visible = false
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
  /deep/.el-dialog__wrapper .el-form-item__content .el-upload--picture-card{
    display: none;
  }
  /deep/.el-dialog__wrapper .el-upload__tip{
    display: none;
  }
</style>

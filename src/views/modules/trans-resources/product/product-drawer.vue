<template>
  <el-drawer
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    size="45%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label-width="0">
        <el-tag>基本信息</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="产品编号：" prop="prdNo">
            <span style="width: 200px; display: inline-block">
                {{dataForm.prdNo}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品名称：" prop="prdName">
            <span style="width: 200px; display: inline-block">
                {{dataForm.prdName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运输方式：" prop="tpMode">
            <span style="width: 200px; display: inline-block">
                {{dataForm.tpModeName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配载方式：" prop="loadingMode">
            <span style="width: 200px; display: inline-block">
                {{dataForm.loadingModeName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="温控类型：" prop="tempMode">
            <span style="width: 200px; display: inline-block">
                {{dataForm.tempModeName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用：" prop="isEnabled">
            <span style="width: 200px; display: inline-block">
                {{dataForm.isEnabled ? '禁用' : '启用'}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：">
            <span style="width: 80%; display: inline-block;white-space:normal; word-break:break-all;">
                {{dataForm.remark}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <el-tag>质量标准</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item label="标准内容：" prop="qualityStandard">
            <span style="width: 80%; display: inline-block">
                {{dataForm.qualityStandard}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="标准附件：" prop="attachmentUrl">
            <xkl-upload v-model="dataForm.contractAttachment" :config="uploadConfig"></xkl-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <service-standard :templateData="templateData" :standardId="standardId" :isDetail="true"></service-standard>
    </el-form>
  </el-drawer>
</template>

<script>
  import serviceStandard from '../trans-products/service-standard'
  export default {
    data () {
      return {
        visible: false,
        drawerVisible: false,
        dataListLoading: false,
        dataList: [],
        standardId: '',
        linkage: '1',
        dataForm: {
          id: 0,
          prdNo: '',
          prdName: '',
          tpMode: '',
          tpModeName: '',
          loadingMode: '',
          loadingModeName: '',
          tempMode: '',
          tempModeName: '',
          isEnabled: 1,
          remark: '',
          qualityStandard: '',
          contractAttachment: []
        },
        templateData: [],
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          disabled: true // 禁止上传
        },
        signDepData: [],
        dataRule: {},
        fileList: [],
        levelDate: '',
        pickerOptions: {
          disabledDate (value) {
            if (Date.now() >= value) {
              return true
            }
            return false
          }
        },
        isDisabled: false
      }
    },
    watch: {
    },
    components: {
      serviceStandard
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
              url: this.$http.adornUrl(`/transresources/trproduct/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.prdNo = data.tTrProduct.prdNo
                this.dataForm.prdName = data.tTrProduct.prdName
                this.dataForm.tpMode = data.tTrProduct.tpMode
                this.dataForm.tpModeName = data.tTrProduct.tpModeName
                this.dataForm.loadingMode = data.tTrProduct.loadingMode
                this.dataForm.loadingModeName = data.tTrProduct.loadingModeName
                this.dataForm.tempMode = data.tTrProduct.tempMode
                this.dataForm.tempModeName = data.tTrProduct.tempModeName
                this.dataForm.isEnabled = data.tTrProduct.isEnabled
                this.dataForm.remark = data.tTrProduct.remark
                this.dataForm.qualityStandard = data.tTrProduct.qualityStandard
                this.dataForm.contractAttachment = data.tTrProduct.attachmentList
                this.standardId = data.tTrProduct.serviceStandard
                this.templateData = data.tTrProduct.kpiTemplateRelationEntityList.length ? data.tTrProduct.kpiTemplateRelationEntityList : []
              }
            })
          } else {
            this.isDisabled = false
            this.dataForm.attachmentUrl = ''
          }
        })
      },
      getSelectDate (val) {
        if (val) {
          let levelDate = (new Date(val) - Date.now()) / 86400000
          levelDate = Math.ceil(levelDate)
          this.levelDate = levelDate
          this.$message({
            type: 'warning',
            // message: '证书还有' + levelDate + '天过期',
            message: levelDate > 0 ? `合同还有${levelDate}天过期` : `合同已过期${-levelDate}天`
          })
        } else {
          this.levelDate = ''
        }
      },
      closeForm () {
        this.visible = false
        this.$refs['attachment'].init()
      },
      getDrawerInfo () {
        this.drawerVisible = true
        this.$nextTick(() => {
          this.$refs.productDrawer.init()
        })
      },
      getProductList () {
        this.$router.push({
          name: 'product-list'
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
      padding: 1px;
    }
  }
  /deep/.el-dialog__wrapper .el-form-item__content .el-upload--picture-card{
    display: none;
  }
  /deep/.el-dialog__wrapper .el-upload__tip{
    display: none;
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
  /deep/.el-dialog__wrapper .el-drawer{
    padding-left: 20px!important;
    overflow-y: scroll!important;
  }
</style>

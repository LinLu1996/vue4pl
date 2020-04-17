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
      <el-col :span="8">
        <el-form-item label="许可证号：">
          <span style="width: 200px; display: block">
              {{dataForm.licenceNo}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运商：">
          <span style="width: 200px; display: block">
              {{dataForm.carrierName}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="业户名称：">
          <span style="width: 200px; display: block">
              {{dataForm.propertyName}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="地址：">
          <span style="width: 90%; display: block">
            {{dataForm.provinceName ? dataForm.provinceName + '、' : ''}}
            {{dataForm.cityName ? dataForm.cityName + '、' : ''}}
            {{dataForm.areaName ? dataForm.areaName + '、' : ''}}
            {{dataForm.detailAddress ? dataForm.detailAddress : ''}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="经营范围：">
          <span style="width: 90%; display: block">
              {{dataForm.manageScope}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="证件有效期：">
          <span style="width: 200px; display: block">
            {{ `${dataForm.startValidDate ? $formatDate(dataForm.startValidDate) : ''}
           ~ ${dataForm.endValidDate ? $formatDate(dataForm.endValidDate) : ''}`}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="核发机关：">
          <span style="width: 200px; display: block">
              {{dataForm.verifyOffice}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="核发日期：">
          <span style="width: 200px; display: block">
            {{ dataForm.verifyDate ? $formatDate(dataForm.verifyDate) : '' }}
          </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="附件：">
          <xkl-download style="margin-left: 10px" :disabled="!dataForm.attachments.length" :outputConfig="outputConfig"></xkl-download>
          <xkl-upload v-model="dataForm.attachments" :config="uploadConfig"></xkl-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-form-item>
          <el-button @click="visible = false">关闭</el-button>
          <!--<el-button type="primary" @click="dataFormSubmit()">确定</el-button>-->
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  </el-dialog>
</template>

<script>
  import { formatDate } from '@/utils'
  import Upload from '@/components/upload/upload'
  import ProductDrawer from '../product/product-drawer'
  export default {
    data () {
      return {
        visible: false,
        drawerVisible: false,
        clickFlag: true,
        linkage: '1',
        dataForm: {
          id: 0,
          licenceNo: '',
          carrierId: '',
          propertyName: '',
          manageScope: '',
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          areaId: '',
          areaName: '',
          detailAddress: '',
          startValidDate: '',
          endValidDate: '',
          verifyOffice: '',
          verifyDate: '',
          attachmentUrl: '',
          valueDate: [],
          isEnabled: '',
          attachments: []
        },
        signDepData: [],
        productLists: [],
        loadUrl: '/transresources/trcontract/upload',
        downloadUrl: '/transresources/trcontract/download',
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
        isDisabled: false,
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false,
          disabled: true
        },
        outputConfig: {
          id: '',
          outputUrl: '/transresources/trroadmanagementlicence/outPutExcelAnnex',
          fileName: '经营许可证附件'
        }
      }
    },
    watch: {
      '$route.params' (newVal) {
        if (this.$route.params.length) {
          this.productLists = this.$route.params
          this.dataForm.contractProductIds = this.productLists.map(res => {
            return res.id
          })
        }
      }
    },
    components: {
      Upload,
      ProductDrawer
    },
    created () {
      this.init()
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.outputConfig.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/transresources/trroadmanagementlicence/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.licenceNo = data.tTrRoadManagementLicence.licenceNo
                this.dataForm.carrierId = data.tTrRoadManagementLicence.carrierId
                this.dataForm.carrierName = data.tTrRoadManagementLicence.carrierName
                this.dataForm.propertyName = data.tTrRoadManagementLicence.propertyName
                this.dataForm.manageScope = data.tTrRoadManagementLicence.manageScope
                this.dataForm.provinceId = parseInt(data.tTrRoadManagementLicence.provinceId)
                this.dataForm.provinceName = data.tTrRoadManagementLicence.provinceName
                this.dataForm.cityId = parseInt(data.tTrRoadManagementLicence.cityId)
                this.dataForm.cityName = data.tTrRoadManagementLicence.cityName
                this.dataForm.areaId = parseInt(data.tTrRoadManagementLicence.areaId)
                this.dataForm.areaName = data.tTrRoadManagementLicence.areaName
                this.dataForm.detailAddress = data.tTrRoadManagementLicence.detailAddress
                this.dataForm.startValidDate = formatDate(data.tTrRoadManagementLicence.startValidDate)
                this.dataForm.endValidDate = formatDate(data.tTrRoadManagementLicence.endValidDate)
                this.dataForm.verifyOffice = data.tTrRoadManagementLicence.verifyOffice
                this.dataForm.verifyDate = data.tTrRoadManagementLicence.verifyDate ? data.tTrRoadManagementLicence.verifyDate.slice(0, 10) : ''
                this.dataForm.attachments = data.tTrRoadManagementLicence.attachmentList || []
                this.dataForm.isEnabled = data.tTrRoadManagementLicence.isEnabled
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
        this.$refs['attachment'].init()
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

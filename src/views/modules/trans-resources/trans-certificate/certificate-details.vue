<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
    <el-form-item label-width="0">
      <el-tag>基本信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="运输证号：">
           <span style="width: 200px; display: block">
                {{dataForm.transportNo}}
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
      <el-col :span="8">
        <el-form-item label="车牌号：">
           <span style="width: 200px; display: block">
                {{dataForm.carNumber}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="经营许可证号：" label-width="110px">
           <span style="width: 200px; display: block">
                {{dataForm.licenceNo}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车牌类型：">
           <span style="width: 200px; display: block">
                {{dataForm.carType}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车尺寸(毫米)：" label-width="110px">
           <span style="width: 200px; display: block">
            长：{{dataForm.carLong}}
           </span>
          <span style="width: 200px; display: block">
            宽：{{dataForm.carWide}}
           </span>
          <span style="width: 200px; display: block">
            高：{{dataForm.carHigh}}
           </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="载重(吨)：">
           <span style="width: 200px; display: block">
                {{dataForm.carLoad}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="经营范围：">
           <span style="width: 200px; display: block">
                {{dataForm.manageScope}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="证件有效期：">
           <span style="width: 200px; display: block">
             {{ `${dataForm.startValidDate ? $formatDate(dataForm.startValidDate) : ''}
            ~  ${dataForm.endValidDate ? $formatDate(dataForm.endValidDate) : ''}`}}
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
                {{dataForm.verifyDate ? $formatDate(dataForm.verifyDate) : ''}}
            </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0">
      <el-tag>附件</el-tag>
      <xkl-download style="margin-left: 10px" :disabled="!dataForm.attachments.length" :outputConfig="outputConfig"></xkl-download>
    </el-form-item>
    <el-row>
      <el-col :span="24">
        <el-form-item prop="attachmentUrl">
          <xkl-upload v-model="dataForm.attachments" :config="uploadConfig"></xkl-upload>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
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
          transportNo: '',
          carrierId: '',
          propertyName: '',
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          areaId: '',
          areaName: '',
          detailAddress: '',
          carNumber: '',
          licenceNo: '',
          carType: '',
          carLong: '',
          carWide: '',
          carHigh: '',
          manageScope: '',
          startValidDate: '',
          endValidDate: '',
          verifyOffice: '',
          verifyDate: '',
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
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          disabled: true
        },
        outputConfig: {
          id: '',
          outputUrl: '/transresources/trroadtransportlicence/outPutExcelAnnex',
          fileName: '车辆道路运输证附件'
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
              url: this.$http.adornUrl(`/transresources/trroadtransportlicence/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.transportNo = data.tTrRoadTransportLicence.transportNo
                this.dataForm.carrierId = data.tTrRoadTransportLicence.carrierId
                this.dataForm.carrierName = data.tTrRoadTransportLicence.carrierName
                this.dataForm.propertyName = data.tTrRoadTransportLicence.propertyName
                this.dataForm.manageScope = data.tTrRoadTransportLicence.manageScope
                this.dataForm.provinceId = parseInt(data.tTrRoadTransportLicence.provinceId)
                this.dataForm.provinceName = data.tTrRoadTransportLicence.provinceName
                this.dataForm.cityId = parseInt(data.tTrRoadTransportLicence.cityId)
                this.dataForm.cityName = data.tTrRoadTransportLicence.cityName
                this.dataForm.areaId = parseInt(data.tTrRoadTransportLicence.areaId)
                this.dataForm.areaName = data.tTrRoadTransportLicence.areaName
                this.dataForm.detailAddress = data.tTrRoadTransportLicence.detailAddress
                this.dataForm.carNumber = data.tTrRoadTransportLicence.carNumber
                this.dataForm.licenceNo = data.tTrRoadTransportLicence.licenceNo
                this.dataForm.carType = data.tTrRoadTransportLicence.carType
                this.dataForm.carLong = data.tTrRoadTransportLicence.carLong
                this.dataForm.carWide = data.tTrRoadTransportLicence.carWide
                this.dataForm.carHigh = data.tTrRoadTransportLicence.carHigh
                this.dataForm.carLoad = data.tTrRoadTransportLicence.carLoad
                this.dataForm.startValidDate = formatDate(data.tTrRoadTransportLicence.startValidDate)
                this.dataForm.endValidDate = formatDate(data.tTrRoadTransportLicence.endValidDate)
                this.dataForm.verifyOffice = data.tTrRoadTransportLicence.verifyOffice
                this.dataForm.verifyDate = formatDate(data.tTrRoadTransportLicence.verifyDate)
                this.dataForm.attachments = data.tTrRoadTransportLicence.attachmentList || []
                this.dataForm.isEnabled = data.tTrRoadTransportLicence.isEnabled
              }
            })
          } else {
            this.isDisabled = false
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
  /deep/.el-form-item .el-form-item__content .el-input-group__prepend{
    padding: 5px!important;
  }
  /deep/.el-dialog__wrapper .el-form-item__content .el-upload--picture-card{
    display: none;
  }
  /deep/.el-dialog__wrapper .el-upload__tip{
    display: none;
  }
</style>

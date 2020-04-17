<template>
  <div class="carrier-detail">
    <el-radio-group v-model="radio1" @change="handleRadioChange" style="margin-bottom: 10px">
      <el-radio-button :label="1">基本信息</el-radio-button>
      <el-radio-button :label="2">道路运输经营许可证</el-radio-button>
      <el-radio-button :label="3">承运范围</el-radio-button>
      <el-radio-button :label="4">承运合同</el-radio-button>
      <el-radio-button :label="5">绩效信息</el-radio-button>
    </el-radio-group>
    <div v-if="radio1 === 1">
      <el-form :model="dataForm1" :rules="dataRule" ref="dataForm1"
               label-width="140px">
        <el-form-item label-width="0">
          <el-tag>基本信息</el-tag>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="运营中心：" prop="carrierCode">
            <span style="width: 200px; display: block">
              {{dataForm1.operationCenterName}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="代码：" prop="carrierCode">
            <span style="width: 200px; display: block">
              {{dataForm1.carrierCode}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称：" prop="carrierName">
          <span style="width: 200px; display: block">
            {{dataForm1.carrierName}}
          </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="简称：" prop="shortName">
            <span style="width: 200px; display: block">
              {{dataForm1.shortName}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="曾用名：" prop="oldCarrierName">
            <span style="width: 200px; display: block">
              {{dataForm1.oldCarrierName}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型：" prop="type">
            <span style="width: 200px; display: block">
              {{dataForm1.type}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="引入方式：" prop="introductionWay">
            <span style="width: 200px; display: block">
              {{dataForm1.introductionWay}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="质量审计结果：" prop="qualityAuditResult">
            <span style="width: 220px; display: block">
              {{dataForm1.qualityAuditResult === 0 ? '通过' : '不通过'}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="付款账期：" prop="billAccountPeriod">
            <span style="width: 200px; display: block">
              {{dataForm1.billAccountPeriod !== null ? `${dataForm1.billAccountPeriod}天` : ''}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="运输温度：" prop="temperatures">
            <span style="width: 90%; display: block">
              {{dataForm1.temperatures}}
            </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="0">
          <el-tag>营业执照信息</el-tag>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="统一社会信用代码：" prop="licence.creditCode">
            <span style="width: 200px; display: block">
              {{dataForm1.licence.creditCode}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="币种：" prop="licence.currency">
            <span style="width: 200px; display: block">
              {{dataForm1.licence.currencyValue}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册资金：" prop="licence.regCapital">
            <span style="width: 200px; display: block">
              {{dataForm1.licence.regCapital !== null ? `${dataForm1.licence.regCapital + ' w'}` : ''}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="法人代表：" prop="licence.corporation">
            <span style="width: 200px; display: block">
              {{dataForm1.licence.corporation}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册日期：" prop="licence.registerTime">
          <span style="width: 200px; display: block">
            {{$formatDate(dataForm1.licence.registerTime)}}
          </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否长期有效：">
              <span style="width: 220px; display: block">
              {{dataForm1.licence.isLong === 0 ? '长期' : '短期'}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证照有效期："v-if="this.dataForm1.licence.isLong === 1">
            <span style="width: 200px; display: block">
              {{$formatDate(dataForm1.licence.validTime)}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件：" prop="licence.attachments">
              <xkl-download style="margin-left: 10px" :disabled="!dataForm1.licence.attachments.length" :outputConfig="outputConfig"></xkl-download>
              <xkl-upload v-model="dataForm1.licence.attachments" :config="uploadConfig1"></xkl-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="0">
          <el-tag>联系人信息</el-tag>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="联系人姓名：" prop="link">
            <span style="width: 200px; display: block">
              {{dataForm1.link}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话：" prop="linkPhone">
          <span style="width: 200px; display: block">
            {{dataForm1.linkPhone}}
          </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱：" prop="linkMail">
            <span style="width: 200px; display: block; word-break: break-all;">
              {{dataForm1.linkMail}}
            </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-if="radio1 === 2">
      <el-row v-if="!radio2Show">
        <el-col>
          <div style="height: 400px;line-height: 400px;text-align: center;font-size: 20px;color: #CCCCCC">暂无有效经营许可证！</div>
        </el-col>
      </el-row>
      <el-form :model="dataForm2" :rules="dataRule" ref="dataForm2" label-width="100px" v-else>
        <el-form-item label-width="0">
          <el-tag>基本信息</el-tag>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="许可证号：">
          <span style="width: 200px; display: block">
              {{dataForm2.licenceNo}}
          </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="承运商：">
          <span style="width: 200px; display: block">
              {{dataForm2.carrierName}}
          </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业户名称：">
          <span style="width: 200px; display: block">
              {{dataForm2.propertyName}}
          </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址：">
          <span style="width: 90%; display: block">
            {{dataForm2.provinceName ? dataForm2.provinceName + '、' : ''}}
            {{dataForm2.cityName ? dataForm2.cityName + '、' : ''}}
            {{dataForm2.areaName ? dataForm2.areaName + '、' : ''}}
            {{dataForm2.detailAddress ? dataForm2.detailAddress : ''}}
          </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="经营范围：">
          <span style="width: 90%; display: block">
              {{dataForm2.manageScope}}
          </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件有效期：">
          <span style="display: inline-block">
              {{$formatDate(dataForm2.startValidDate) + ' ~ ' + $formatDate(dataForm2.endValidDate)}}
          </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核发机关：">
          <span style="width: 200px; display: block">
              {{dataForm2.verifyOffice}}
          </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核发日期：">
          <span style="width: 200px; display: block">
              {{$formatDate(dataForm2.verifyDate)}}
          </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件：">
              <xkl-download style="margin-left: 10px" :disabled="!dataForm2.attachments.length" :outputConfig="outputConfig1"></xkl-download>
              <xkl-upload v-model="dataForm2.attachments" :config="uploadConfig2"></xkl-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-if="radio1 === 3">
      <range-echarts></range-echarts>
    </div>
    <div v-if="radio1 === 4">
      <contract-detail v-if="contractVisible" ref="contractUpdate"></contract-detail>
    </div>
    <div v-if="radio1 === 5">
      <performance-information></performance-information>
    </div>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
          <el-button @click="$router.go(-1)">关闭</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {formatDate} from '@/utils'
  import ContractDetail from './contract-detail'
  import PerformanceInformation from './performance-information'
  import rangeEcharts from './carrier-range-echarts'
  export default {
    data () {
      return {
        radio1: 1,
        clickFlag: true,
        options: [],
        dataForm: {
          id: ''
        },
        dataForm1: {
          operationCenterName: '',
          carrierCode: '',
          carrierName: '',
          shortName: '',
          oldCarrierName: '',
          type: '',
          introductionWay: '',
          qualityAuditResult: '',
          billAccountPeriod: '',
          link: '',
          linkPhone: '',
          linkMail: '',
          remark: '',
          licence: {
            creditCode: '',
            registerTime: '',
            validTime: '',
            currencyValue: '',
            regCapital: '',
            corporation: '',
            attachments: [],
            isLong: ''
          },
          temperatures: []
        },
        uploadConfig1: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          disabled: true
        },
        outputConfig: {
          id: '',
          outputUrl: '/transresources/trcarrier/outPutExcelAnnex',
          fileName: '承运商营业执照附件'
        },
        outputConfig1: {
          id: '',
          outputUrl: '/transresources/trroadmanagementlicence/outPutExcelAnnex',
          fileName: '道路运输经营许可证附件'
        },
        dataForm2: {
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
        uploadConfig2: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false,
          disabled: true
        },
        dataRule: {},
        contractVisible: false,
        performanceVisible: false,
        selectElement: '',
        radio2Show: false
      }
    },
    components: {
      ContractDetail,
      rangeEcharts,
      PerformanceInformation
    },
    activated () {
      this.dataForm.id = this.$route.query.id || null
      this.outputConfig.id = this.$route.query.id || null
      this.init()
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.$nextTick(() => {
          this.$refs['dataForm1'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcarrier/details/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm1.carrierCode = data.trCarrier.carrierCode
                this.dataForm1.carrierName = data.trCarrier.carrierName
                this.dataForm1.operationCenterName = data.trCarrier.operationCenterName
                this.dataForm1.shortName = data.trCarrier.shortName
                this.dataForm1.oldCarrierName = data.trCarrier.oldCarrierName
                this.dataForm1.type = data.trCarrier.type
                this.dataForm1.introductionWay = data.trCarrier.introductionWay
                this.dataForm1.qualityAuditResult = data.trCarrier.qualityAuditResult
                this.dataForm1.billAccountPeriod = data.trCarrier.billAccountPeriod
                this.dataForm1.link = data.trCarrier.link
                this.dataForm1.linkPhone = data.trCarrier.linkPhone
                this.dataForm1.linkMail = data.trCarrier.linkMail
                this.dataForm1.licence = data.trCarrier.licence ? data.trCarrier.licence : this.dataForm1.licence;
                this.dataForm1.licence.registerTime = data.trCarrier && data.trCarrier.licence && data.trCarrier.licence.registerTime ? formatDate(data.trCarrier.licence.registerTime) : null;
                this.dataForm1.licence.validTime = data.trCarrier && data.trCarrier.licence && data.trCarrier.licence.validTime ? formatDate(data.trCarrier.licence.validTime) : null;
                this.dataForm1.licence.attachments = data.trCarrier.attachments
                this.dataForm1.temperatures = data.trCarrier.temperaturesValue ? data.trCarrier.temperaturesValue.join('、') : null;
              }
            })
          }
        })
      },
      handleRadioChange (label) {
        if (label === 2) {
          this.$http({
            url: this.$http.adornUrl(`/transresources/trroadmanagementlicence/infoByCarrierId/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (!data.tTrRoadManagementLicence) {
                this.radio2Show = false
              } else {
                this.radio2Show = true
              }
              this.dataForm2.id = data.tTrRoadManagementLicence ? data.tTrRoadManagementLicence.id : ''
              this.outputConfig1.id = data.tTrRoadManagementLicence ? data.tTrRoadManagementLicence.id : ''
              this.dataForm2.licenceNo = data.tTrRoadManagementLicence ? data.tTrRoadManagementLicence.licenceNo : ''
              this.dataForm2.carrierId = data.tTrRoadManagementLicence ? data.tTrRoadManagementLicence.carrierId : ''
              this.dataForm2.carrierName = data.tTrRoadManagementLicence ? data.tTrRoadManagementLicence.carrierName : ''
              this.dataForm2.propertyName = data.tTrRoadManagementLicence ? data.tTrRoadManagementLicence.propertyName : ''
              this.dataForm2.manageScope = data.tTrRoadManagementLicence ? data.tTrRoadManagementLicence.manageScope : ''
              this.dataForm2.provinceId = data.tTrRoadManagementLicence ? parseInt(data.tTrRoadManagementLicence.provinceId) : ''
              this.dataForm2.provinceName = data.tTrRoadManagementLicence ? data.tTrRoadManagementLicence.provinceName : ''
              this.dataForm2.cityId = data.tTrRoadManagementLicence ? parseInt(data.tTrRoadManagementLicence.cityId) : ''
              this.dataForm2.cityName = data.tTrRoadManagementLicence ? data.tTrRoadManagementLicence.cityName : ''
              this.dataForm2.areaId = data.tTrRoadManagementLicence ? parseInt(data.tTrRoadManagementLicence.areaId) : ''
              this.dataForm2.areaName = data.tTrRoadManagementLicence ? data.tTrRoadManagementLicence.areaName : ''
              this.dataForm2.detailAddress = data.tTrRoadManagementLicence ? data.tTrRoadManagementLicence.detailAddress : ''
              this.dataForm2.startValidDate = data.tTrRoadManagementLicence ? formatDate(data.tTrRoadManagementLicence.startValidDate) : ''
              this.dataForm2.endValidDate = data.tTrRoadManagementLicence ? formatDate(data.tTrRoadManagementLicence.endValidDate) : ''
              this.dataForm2.verifyOffice = data.tTrRoadManagementLicence ? data.tTrRoadManagementLicence.verifyOffice : ''
              this.dataForm2.verifyDate = data.tTrRoadManagementLicence && data.tTrRoadManagementLicence.verifyDate ? data.tTrRoadManagementLicence.verifyDate.slice(0, 10) : null
              this.dataForm2.attachments = data.tTrRoadManagementLicence ? data.tTrRoadManagementLicence.attachmentList || [] : []
              this.dataForm2.isEnabled = data.tTrRoadManagementLicence ? data.tTrRoadManagementLicence.isEnabled : ''
              this.dataForm2.startValidDate = data.tTrRoadManagementLicence ? formatDate(data.tTrRoadManagementLicence.startValidDate) : ''
              this.dataForm2.endValidDate = data.tTrRoadManagementLicence ? formatDate(data.tTrRoadManagementLicence.endValidDate) : ''
            }
          })
        } else if (label === 4) {
          this.contractVisible = true
          this.$nextTick(() => {
            this.$refs.contractUpdate.init(this.dataForm.id)
          })
        } else if (label === 3) {
        }
      },
      handleCancel () {
        window.history.go(-1)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tem-content{
    padding: 0 100px;
  }
  /deep/.el-dialog__wrapper .el-form-item__content .el-upload--picture-card{
    display: none;
  }
  /deep/.el-dialog__wrapper .el-form-item__content .el-upload__tip{
    display: none;
  }
  /deep/.carrier-detail .el-upload__tip{
    display: none;
  }
</style>

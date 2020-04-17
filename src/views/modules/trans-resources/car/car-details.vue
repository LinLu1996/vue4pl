<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
           label-width="100px">
    <el-form-item label-width="0">
      <el-tag>基本信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="承运商："  prop="carrierId">
          <span style="width: 200px; display: block">
              {{dataForm.carrierName}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车牌号：" prop="carNumber">
          <span style="width: 200px; display: block">
              {{dataForm.carNumber}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车型：" prop="carType">
          <span style="width: 200px; display: block">
              {{dataForm.carValue}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车号："  prop="carrierId">
          <span style="width: 200px; display: block">
              {{dataForm.vehicleNumber}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车辆类型："  prop="carrierId">
          <span style="width: 200px; display: block">
              {{dataForm.vehicleType}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="计酬车型："  prop="carrierId">
          <span style="width: 200px; display: block">
              {{dataForm.paidCar}}
          </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <el-form-item label="车辆尺寸：" prop="carLong">
          <el-col :span="8">
            <el-form-item prop="carLong">
              <span style="width: 200px; display: block">
                长：{{dataForm.carLong}} mm
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px">
            <el-form-item prop="carWide">
              <span style="width: 200px; display: block">
                宽：{{dataForm.carWide}} mm
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px">
            <el-form-item prop="carHigh">
              <span style="width: 200px; display: block">
               高： {{dataForm.carHigh}} mm
              </span>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="载重：" prop="carLoad">
          <span style="width: 200px; display: block">
              {{dataForm.carLoad}} 吨
          </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <el-form-item label="车箱尺寸：" prop="carLong">
          <el-col :span="8">
            <el-form-item prop="carLong">
              <span style="width: 200px; display: block">
                长：{{dataForm.carboxLong}} mm
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px">
            <el-form-item prop="carWide">
              <span style="width: 200px; display: block">
                宽：{{dataForm.carboxWide}} mm
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px">
            <el-form-item prop="carHigh">
              <span style="width: 200px; display: block">
               高： {{dataForm.carboxHigh}} mm
              </span>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="容积：" prop="volume">
          <span style="width: 200px; display: block">
              {{dataForm.volume + ' m³'}}
          </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="上牌日期：" prop="cardTime">
          <span style="width: 200px; display: block">
              {{dataForm.cardTime ? $formatDate(dataForm.cardTime) : ''}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发动机号：" prop="engineNumber">
          <span style="width: 200px; display: block">
              {{dataForm.engineNumber}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车架号：" prop="frameNumber">
          <span style="width: 200px; display: block">
              {{dataForm.frameNumber}}
          </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <el-form-item label="温区："  prop="warmArea">
          <span style="width: 90%; display: block">
                {{dataForm.warmArea}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否冷藏车："  prop="warmArea">
          <span style="width: 200px; display: block">
                {{dataForm.isCold === 0 ? '是' : '否'}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注信息：" prop="remark">
          <span style="width: 200px; display: block">
                {{dataForm.remark}}
            </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px">
      <el-col :span="8">
        <el-form-item label-width="0">
          <el-tag>GPS信息</el-tag>
        </el-form-item>
      </el-col>
    </el-row >
    <template>
      <el-row v-for="(item, index) in dataForm.carGpses" :key="index" style="margin-bottom: 0px">
        <el-col :span="6">
          <el-form-item label="GPS品牌：" :prop="'carGpses.'+ index +'.gpsName'" :rules="dataRule.gpsName">
            <span style="display: block">
                {{item.gpsName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="GPS设备号：" :prop="'carGpses.'+ index +'.gpsDeviceCode'" :rules="dataRule.gpsDeviceCode">
            <span style="display: block;word-break: break-all">
                {{item.gpsDeviceCode}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="放置位置：" :prop="'carGpses.'+ index +'.placePosition'" :rules="dataRule.placePosition">
            <span style="display: block">
                {{item.placePosition}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="GPS对接平台：" label-width="120px" :prop="'carGpses.'+ index +'.gpsPlatform'" :rules="dataRule.gpsPlatform">
            <span style="display: block">
                {{item.gpsPlatform}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <el-row style="margin-bottom: 20px">
      <el-col :span="8">
        <el-form-item label-width="0">
          <el-tag>冷机信息</el-tag>
        </el-form-item>
      </el-col>
    </el-row >
    <template>
      <el-row v-for="(item, index) in dataForm.carCoolers" :key="index" style="margin-bottom: 0px">
        <el-col :span="8">
          <el-form-item label="冷机品牌：" :prop="'carCoolers.'+ index +'.coolerName'" :rules="dataRule.coolerName">
            <span style="width: 200px; display: block">
                {{item.coolerName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="冷机型号：" :prop="'carCoolers.'+ index +'.coolerDeviceCode'" :rules="dataRule.coolerDeviceCode">
            <span style="width: 200px; display: block">
                {{item.coolerModel}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="放置位置：" :prop="'carCoolers.'+ index +'.placePosition'" :rules="dataRule.placePosition">
            <span style="width: 200px; display: block">
                {{item.placePosition}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <el-form-item label-width="0">
      <el-tag>行驶证信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="所有人：" prop="carLicence.person" :rules="dataRule.person">
          <span style="width: 200px; display: block">
              {{dataForm.carLicence.person}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="使用性质：" prop="carLicence.applyNature" :rules="dataRule.applyNature">
          <span style="width: 200px; display: block">
              {{dataForm.carLicence.applyNature}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="品牌型号：" prop="carLicence.brandModel">
          <span style="width: 200px; display: block;word-break: break-all">
              {{dataForm.carLicence.brandModel}}
          </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="注册日期：" prop="carLicence.registerTime">
          <span style="width: 200px; display: block">
              {{dataForm.carLicence.registerTime}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发证日期：" prop="carLicence.certificationTime">
          <span style="width: 200px; display: block">
              {{dataForm.carLicence.certificationTime}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="有限期至：" prop="carLicence.validTime" :rules="dataRule.validTime">
          <span style="width: 200px; display: block">
              {{dataForm.carLicence.validTime ? $formatDate(dataForm.carLicence.validTime) : ''}}
          </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="强制报废期至：" prop="forceScrapTime" label-width="120px">
          <span style="width: 200px; display: block">
              {{dataForm.carLicence.forceScrapTime}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="附件：" prop="carLicence.attachmentUrl">
          <xkl-download style="margin-left: 10px" :disabled="!dataForm.carLicence.attachments.length" :outputConfig="outputConfig"></xkl-download>
          <xkl-upload v-model="dataForm.carLicence.attachments" :config="uploadConfig"></xkl-upload>
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
  export default {
    data () {
      return {
        url: this.$http.adornUrl(`/transresources/trcontract/upload?token=${this.$cookie.get('token')}`),
        visible: false,
        dataListLoading: false,
        brandListVisible: false,
        clickFlag: true,
        dataForm: {
          id: null,
          carrierId: '',
          carCoolers: [{
            coolerName: '',
            coolerDeviceCode: '',
            placePosition: ''
          }],
          coolerName: '',
          coolerDeviceCode: '',
          carNumber: '',
          cardTime: '',
          carType: '',
          carValue: '',
          engineNumber: '',
          vehicleNumber: '',
          vehicleType: '',
          paidCar: '',
          isCold: '',
          volume: '',
          carLong: '',
          carHigh: '',
          carboxLong: '',
          carboxWide: '',
          carboxHigh: '',
          frameNumber: '',
          carWide: '',
          carGpses: [{
            gpsName: '',
            gpsDeviceCode: '',
            placePosition: ''
          }],
          gpsName: '',
          gpsDeviceCode: '',
          carLoad: '',
          warmArea: '',
          remark: '',
          carLicence: {
            person: '',
            applyNature: '',
            brandModel: '',
            registerTime: '',
            certificationTime: '',
            validTime: '',
            forceScrapTime: '',
            attachments: []
          }
        },
        dataList: [{name: 1}],
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
          outputUrl: '/transresources/trcar/outPutExcelAnnex',
          fileName: '车辆附件'
        },
        dataRule: {
        },
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now();
          }
        }
      }
    },
    watch: {
    },
    activated () {
    },
    components: {
    },
    methods: {
      init (id, values) {
        this.visible = true
        this.dataForm.id = id || 0
        this.outputConfig.id = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcar/detail/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.carrierName = data.trCar.carrierName
                this.dataForm.carrierId = data.trCar.carrierId
                this.dataForm.carCoolers = data.trCar.carCoolers
                this.dataForm.cardTime = data.trCar.cardDtm ? formatDate(data.trCar.cardDtm) : []
                this.dataForm.carType = data.trCar.carType
                this.dataForm.carValue = data.trCar.carValue
                this.dataForm.carNumber = data.trCar.carNumber
                this.dataForm.carHigh = data.trCar.carHigh
                this.dataForm.engineNumber = data.trCar.engineNumber
                this.dataForm.carLong = data.trCar.carLong
                this.dataForm.frameNumber = data.trCar.frameNumber
                this.dataForm.carWide = data.trCar.carWide
                this.dataForm.carboxLong = data.trCar.carboxLong
                this.dataForm.carboxWide = data.trCar.carboxWide
                this.dataForm.carboxHigh = data.trCar.carboxHigh
                this.dataForm.carGpses = data.trCar.carGpses
                this.dataForm.remark = data.trCar.remark
                this.dataForm.carLoad = data.trCar.carLoad
                this.dataForm.warmArea = data.trCar.warmArea
                this.dataForm.volume = data.trCar.volume
                this.dataForm.vehicleNumber = data.trCar.vehicleNumber
                this.dataForm.vehicleType = data.trCar.vehicleType
                this.dataForm.paidCar = data.trCar.paidCar
                this.dataForm.isCold = data.trCar.isCold
                this.dataForm.carboxLong = data.trCar.carboxLong
                this.dataForm.carboxWide = data.trCar.carboxWide
                this.dataForm.carboxHigh = data.trCar.carboxHigh
                this.dataForm.carLicence = data.trCar.carLicence ? data.trCar.carLicence : this.dataForm.carLicence;
                this.dataForm.carLicence.registerTime = data.trCar.carLicence.registerTime ? formatDate(data.trCar.carLicence.registerTime) : '';
                this.dataForm.carLicence.certificationTime = data.trCar.carLicence.certificationTime ? formatDate(data.trCar.carLicence.certificationTime) : '';
                this.dataForm.carLicence.validTime = data.trCar.carLicence.validTime ? formatDate(data.trCar.carLicence.validTime) : null;
                this.dataForm.carLicence.forceScrapTime = data.trCar.carLicence.forceScrapTime ? formatDate(data.trCar.carLicence.forceScrapTime) : '';
                this.dataForm.carLicence.attachments = data.trCar.attachments ? data.trCar.attachments : this.dataForm.carLicence.attachments
              }
            })
          }
        })
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

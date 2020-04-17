<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
           label-width="100px">
    <el-form-item label-width="0">
      <el-tag>基本信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="承运商"  prop="carrierId">
          <xkl-select style="width: 100%"  v-model="dataForm.carrierId" linkage="/transresources/trcarrier/findList" labelType="carrierName" placeholder="承运商"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车牌号" class="carNumber" prop="appendNumber">
          <xkl-car-number ref="carNumber" v-model="dataForm.appendNumber" @areaPre="getAreaPre"></xkl-car-number>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车型" prop="carType">
          <xkl-select style="width: 100%"  v-model="dataForm.carType" select-type="CAR_TYPE" placeholder="车型"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车号" prop="vehicleNumber">
          <el-input style="width: 100%" v-model="dataForm.vehicleNumber" placeholder="车号" clearable maxlength="20"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车辆类型" prop="vehicleType">
          <xkl-select style="width: 100%"  v-model="dataForm.vehicleType" select-type="VEHICLE_TYPE" placeholder="车辆类型"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="计酬车型" prop="paidCar">
          <xkl-select style="width: 100%"  v-model="dataForm.paidCar" select-type="PAID_CAR" placeholder="计酬车型"></xkl-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form-item label="车辆尺寸" prop="carLong">
          <el-col :span="8">
            <el-form-item prop="carLong">
              <el-input v-model="dataForm.carLong" maxlength="7" @input="oninput('carLong')" clearable>
                <template slot="prepend">长</template>
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px">
            <el-form-item prop="carWide">
              <el-input v-model="dataForm.carWide" maxlength="7" @input="oninput('carWide')" clearable>
                <template slot="prepend">宽</template>
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px">
            <el-form-item prop="carHigh">
              <el-input v-model="dataForm.carHigh" maxlength="7" @input="oninput('carHigh')" clearable>
                <template slot="prepend">高</template>
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="载重" prop="carLoad">
          <el-input style="width: 100%" v-model="dataForm.carLoad" placeholder="载重" maxlength="7" @input="oninput('carLoad')" clearable><template slot="append">吨</template></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form-item label="车箱尺寸" prop="carboxLong">
          <el-col :span="8">
            <el-form-item prop="carboxLong">
              <el-input v-model="dataForm.carboxLong" maxlength="7" clearable>
                <template slot="prepend">长</template>
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px">
            <el-form-item prop="carboxWide">
              <el-input v-model="dataForm.carboxWide" maxlength="7" clearable>
                <template slot="prepend">宽</template>
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px">
            <el-form-item prop="carboxHigh">
              <el-input v-model="dataForm.carboxHigh" maxlength="7" clearable>
                <template slot="prepend">高</template>
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="容积" prop="volume">
          <el-input style="width: 100%" v-model="volume" placeholder="容积" maxlength="7" readonly clearable>
            <template slot="append">m³</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="上牌日期" prop="cardTime">
          <el-date-picker
            style="width: 100%"
            v-model="dataForm.cardTime"
            type="date"
            placeholder="上牌日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发动机号" prop="engineNumber">
          <el-input style="width: 100%" v-model="dataForm.engineNumber" placeholder="发动机号" maxlength="20" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车架号" prop="frameNumber">
          <el-input style="width: 100%" v-model="dataForm.frameNumber" placeholder="车架号" clearable maxlength="20"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="温区"  prop="warmArea">
          <xkl-select style="width: 100%" v-model="dataForm.warmArea" select-type="TEMPERATURE" :multiple="true" placeholder="请选择"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否冷藏车" prop="isCold">
          <el-select style="width: 100%;" v-model="dataForm.isCold" clearable>
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注信息" prop="remark">
          <el-input style="width: 100%" type="textarea" v-model="dataForm.remark" placeholder="备注" rows="4" maxlength="100" clearable></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px">
      <el-col :span="8">
        <el-form-item label-width="0">
          <el-tag>GPS信息</el-tag>
        </el-form-item>
      </el-col>
      <el-col :span="16" style="text-align: right;">
        <el-button type="success" size="mini" icon="el-icon-upload" @click="uploadPageHandle(dataForm.id, 'gps')">导入</el-button>
        <!--<div style="display: inline-block">-->
          <!--<el-upload-->
            <!--:action="urls"-->
            <!--:show-file-list="false"-->
            <!--:before-upload="checkUpload"-->
            <!--:on-change="handleChange"-->
            <!--:on-success="handleAvatarSuccess">-->
            <!--<el-button size="mini" type="primary" @click="urls = $http.adornUrl(`/transresources/trcar/gpsExport?token=${$cookie.get('token')}`)">导入</el-button>-->
          <!--</el-upload>-->
        <!--</div>-->
        <el-button icon="el-icon-circle-plus-outline" type="primary" size="mini" @click="addGpsList()" style="background: #3698ce;color: #ffffff">新增</el-button>
      </el-col>
    </el-row >
    <template>
      <el-row v-for="(item, index) in dataForm.carGpses" :key="index" style="margin-bottom: 0px">
        <el-col :span="5">
          <el-form-item label="GPS品牌" :prop="'carGpses.'+ index +'.gpsName'" :rules="dataRule.gpsName">
            <xkl-select style="width: 100%" v-model="item.gpsName" @getLabel="getLabel(arguments[0],item,'gps')" select-type="GPS_BRAND" placeholder="GPS品牌" clearable></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align: center">
          <el-form-item label="GPS设备号" :prop="'carGpses.'+ index +'.gpsDeviceCode'" :rules="dataRule.gpsDeviceCode">
            <el-input style="width: 100%" v-model="item.gpsDeviceCode" placeholder="GPS设备号" maxlength="50" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="放置位置" :prop="'carGpses.'+ index +'.placePosition'">
          <xkl-select style="width: 100%" v-model="item.placePosition" select-type="PLACE_POSITION" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="GPS对接平台" label-width="120px" :prop="'carGpses.'+ index +'.gpsPlatform'" :rules="dataRule.gpsPlatform">
            <el-input style="width: 100%" v-model="item.gpsPlatform" placeholder="GPS对接平台" maxlength="16" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" style="text-align: right">
          <el-button  icon="el-icon-delete" type="danger" size="mini" @click="deleteGpsList(index)"></el-button>
        </el-col>
      </el-row>
    </template>
    <el-row style="margin-bottom: 20px">
      <el-col :span="8">
        <el-form-item label-width="0">
          <el-tag>冷机信息</el-tag>
        </el-form-item>
      </el-col>
      <el-col :span="16" style="text-align: right;">
        <el-button type="success" size="mini" icon="el-icon-upload" @click="uploadPageHandle(dataForm.id, 'carCoolers')">导入</el-button>
        <!--<div style="display: inline-block">-->
          <!--<el-upload-->
            <!--:action="urls"-->
            <!--:show-file-list="false"-->
            <!--:before-upload="checkUpload"-->
            <!--:on-change="handleChange"-->
            <!--:on-success="handleAvatarSuccess">-->
            <!--<el-button size="mini" type="primary" @click="urls = $http.adornUrl(`/transresources/trcar/coolerExport?token=${$cookie.get('token')}`)">导入</el-button>-->
          <!--</el-upload>-->
        <!--</div>-->
        <el-button icon="el-icon-circle-plus-outline" type="primary" size="mini" @click="addCoolerList" style="background: #3698ce;color: #ffffff">新增</el-button>
      </el-col>
    </el-row >
    <template>
      <el-row v-for="(item, index) in dataForm.carCoolers" :key="index" style="margin-bottom: 0px">
        <el-col :span="8">
          <el-form-item label="冷机品牌" :prop="'carCoolers.'+ index +'.coolerName'" :rules="dataRule.coolerName">
            <xkl-select style="width: 100%" v-model="item.coolerName" @getLabel="getLabel(arguments[0],item,'cooler')" select-type="COOLER_BRAND" placeholder="冷机品牌" clearable></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" style="text-align: center">
          <el-form-item label="冷机型号" :prop="'carCoolers.'+ index +'.coolerModel'" :rules="dataRule.coolerModel">
            <el-input style="width: 100%" v-model="item.coolerModel" placeholder="冷机型号" maxlength="50" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="放置位置" :prop="'carCoolers.'+ index +'.placePosition'">
            <xkl-select style="width: 100%" v-model="item.placePosition" select-type="PLACE_POSITION" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="2" style="text-align: right">
          <el-button  icon="el-icon-delete" type="danger" size="mini" @click="deleteCoolerList(index)"></el-button>
        </el-col>
      </el-row>
    </template>
    <el-form-item label-width="0">
      <el-tag>行驶证信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="所有人" prop="carLicence.person" :rules="dataRule.person">
          <el-input style="width: 100%" v-model="dataForm.carLicence.person" placeholder="所有人" clearable maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="使用性质" prop="carLicence.applyNature" :rules="dataRule.applyNature">
          <xkl-select style="width: 100%" v-model="dataForm.carLicence.applyNature" select-type="USAGE_RESTRICTION" placeholder="请选择"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="品牌型号">
          <el-input style="width: 100%" v-model="dataForm.carLicence.brandModel" placeholder="品牌型号" clearable maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="注册日期" prop="carLicence.registerTime">
          <el-date-picker
            style="width: 100%;"
            type="date"
            placeholder="注册日期"
            v-model="dataForm.carLicence.registerTime">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发证日期" prop="carLicence.certificationTime">
          <el-date-picker
            style="width: 100%;"
            type="date"
            placeholder="发证日期"
            v-model="dataForm.carLicence.certificationTime">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="有限期至" prop="carLicence.validTime" :rules="dataRule.validTime">
          <el-date-picker
            style="width: 100%;"
            type="date"
            placeholder="有限期至"
            v-model="dataForm.carLicence.validTime">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="强制报废期至" prop="forceScrapTime">
          <el-date-picker
            style="width: 100%;"
            type="date"
            placeholder="强制报废期至"
            v-model="dataForm.carLicence.forceScrapTime">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="附件" prop="carLicence.attachments">
          <xkl-upload v-model="dataForm.carLicence.attachments" :config="uploadConfig"></xkl-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <upload-page
      v-if="importVisible"
      ref="uploadPage"
      :title="uploadTitle"
      :fileName="`${uploadTitle}模板.xlsx`"
      :uploadUrl="uploadUrl"
      :submitUrl="submitUrl"
      :acceptType="['xls', 'xlsx']"
      @addList="addList"></upload-page>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-form-item>
          <el-button @click="$router.go(-1)">关闭</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import attachmentUpload from '@/components/upload/attachmentUpload'
  import uploadPage from '@/components/upload/upload-page'
  export default {
    data () {
      let verifyCarNumber = (rule, value, callback) => {
        let patrn = /^[a-zA-Z]{1}[a-zA-Z0-9]{4}[a-zA-Z0-9挂学警港澳]{1}$/;
        if (!patrn.test(value)) {
          callback(new Error('请输入合法车牌号'))
        }
        callback()
      }
      let verifyNumberChar = (rule, value, callback) => {
        let patrn = /^[A-Za-z0-9-\_]+$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入字母、数字、下划线、横线'))
        }
        callback()
      }
      let verifyNumberCharOne = (rule, value, callback) => {
        if (!value) {
          callback()
        }
        let patrn = /^[A-Za-z0-9-\_]+$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入字母、数字、下划线、横线'))
        }
        callback()
      }
      let verifyPositiveNumber = (rule, value, callback) => {
        if (isNaN(value) || value <= 0) {
          callback(new Error('请输入大于0的数字'))
        }
        callback()
      }
      let verifyPositiveNumberSize = (rule, value, callback) => {
        if (isNaN(value) || value < 1000) {
          callback(new Error('请输入不少于4位的数字'))
        }
        callback()
      }
      return {
        url: this.$http.adornUrl(`/transresources/trcontract/upload?token=${this.$cookie.get('token')}`),
        urls: '',
        visible: false,
        dataListLoading: false,
        brandListVisible: false,
        importVisible: false,
        clickFlag: true,
        uploadType: '',
        uploadUrl: '',
        submitUrl: '',
        id: '',
        dataForm: {
          id: null,
          carrierId: '',
          carCoolers: [{
            coolerName: '',
            coolerModel: '',
            placePosition: ''
          }],
          coolerName: '',
          coolerModel: '',
          carNumber: '',
          carNumberPre: '沪',
          appendNumber: '',
          cardTime: '',
          carType: '',
          engineNumber: '',
          vehicleNumber: '',
          vehicleType: '',
          paidCar: '',
          isCold: '',
          volume: '',
          carLong: '',
          carHigh: '',
          frameNumber: '',
          carWide: '',
          carboxLong: '',
          carboxWide: '',
          carboxHigh: '',
          carGpses: [{
            gpsName: '',
            gpsDeviceCode: '',
            placePosition: '',
            gpsPlatform: ''
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
        uploadTitle: '',
        carNumberPres: [],
        dataList: [{name: 1}],
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          id: ''
        },
        dataRule: {
          carrierId: [
            {required: true, trigger: 'change', message: '请选择承运商名称'}],
          carType: [
            {required: true, trigger: 'change', message: '请选择车型'}],
          engineNumber: [
            {validator: verifyNumberCharOne}],
          vehicleNumber: [
            {required: true, trigger: 'blur', message: '请填写车号'}],
          vehicleType: [
            {required: true, trigger: 'change', message: '请选择车辆类型'}],
          paidCar: [
            {required: true, trigger: 'change', message: '请选择计酬车型'}],
          isCold: [
            {required: true, trigger: 'change', message: '请选择是否冷藏'}],
          coolerName: [
            {required: true, trigger: 'change', message: '请选择冷机品牌'}],
          coolerModel: [
            {required: true, trigger: 'blur', message: '请填写冷机型号'}],
          gpsName: [
            {required: true, trigger: 'change', message: '请选择GPS品牌'}],
          gpsDeviceCode: [
            {required: true, trigger: 'blur', message: '请填写GPS设备号'},
            {validator: verifyNumberChar}],
          appendNumber: [{required: true,  trigger: 'blur', message: '请填写车牌号'},
            {validator: verifyCarNumber, trigger: 'blur'}
          ],
          gpsPlatform: [
            {required: true, trigger: 'change', message: '请选择GPS对接平台'}],
          cardTime: [
            {required: true, trigger: 'blur', message: '请选择上牌日期'}],
          carLong: [
            {required: true, message: '请输入车长', trigger: 'blur'},
            {validator: verifyPositiveNumberSize, trigger: 'blur'}],
          carWide: [
            {required: true, message: '请输入车宽', trigger: 'blur'},
            { validator: verifyPositiveNumberSize, trigger: 'blur' }],
          carHigh: [
            { required: true, message: '请输入车高', trigger: 'blur' },
            {validator: verifyPositiveNumberSize, trigger: 'blur'}],
          carboxLong: [
            {required: true, message: '请输入车箱长'},
            {validator: verifyPositiveNumberSize, trigger: 'blur'}],
          carboxWide: [
            {required: true, message: '请输入车箱宽', trigger: 'blur'},
            { validator: verifyPositiveNumberSize, trigger: 'blur' }],
          carboxHigh: [
            { required: true, message: '请输入车箱高', trigger: 'blur' },
            {validator: verifyPositiveNumberSize, trigger: 'blur'}],
          carLoad: [
            {required: true, validator: verifyPositiveNumber, trigger: 'blur'}
          ],
          volume: [
            {required: true, validator: verifyPositiveNumber, trigger: 'change'}
          ],
          person: [
            {required: true, trigger: 'blur', message: '请输入所有人'}],
          applyNature: [
            {required: true, trigger: 'change', message: '请选择使用性质'}],
          brandModel: [
            {required: true, trigger: 'blur', message: '请填写品牌型号'},
            {validator: verifyNumberChar, trigger: 'blur'}],
          validTime: [
            {required: true, message: '请输入有效时间'}]
        },
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now();
          }
        }
      }
    },
    activated () {
      const id = this.$route.query.id || null
      this.init(id)
    },
    components: {
      attachmentUpload,
      uploadPage
    },
    computed: {
      volume () {
        let long, width, height, result
        long = this.dataForm.carboxLong
        width = this.dataForm.carboxWide
        height = this.dataForm.carboxHigh
        result = Number((long * width * height / 1000000000).toFixed(2))
        this.dataForm.volume = result
        return result
      }
    },
    methods: {
      init (id, values) {
        this.visible = true
        this.dataForm.id = id || null
        this.uploadConfig.id = id || null
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcar/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.carrierId = data.trCar.carrierId
                this.dataForm.carCoolers = data.trCar.carCoolers
                this.dataForm.cardTime = new Date(data.trCar.cardDtm)
                this.dataForm.carType = data.trCar.carType
                this.dataForm.carNumber = data.trCar.carNumber
                this.dataForm.carNumberPre = data.trCar.carNumber.substring(0, 1)
                if (this.dataForm.carNumberPre === '内') {
                  this.dataForm.carNumberPre = '内蒙古'
                  this.dataForm.appendNumber = data.trCar.carNumber.substring(3, 9)
                } else {
                  this.dataForm.appendNumber = data.trCar.carNumber.substring(1, 7)
                }
                this.dataForm.carHigh = data.trCar.carHigh
                this.dataForm.engineNumber = data.trCar.engineNumber
                this.dataForm.carLong = data.trCar.carLong
                this.dataForm.frameNumber = data.trCar.frameNumber
                this.dataForm.carWide = data.trCar.carWide
                this.dataForm.carGpses = data.trCar.carGpses
                this.dataForm.remark = data.trCar.remark
                this.dataForm.carLoad = data.trCar.carLoad
                this.dataForm.carboxLong = data.trCar.carboxLong
                this.dataForm.carboxWide = data.trCar.carboxWide
                this.dataForm.carboxHigh = data.trCar.carboxHigh
                this.dataForm.vehicleNumber = data.trCar.vehicleNumber
                this.dataForm.vehicleType = data.trCar.vehicleType
                this.dataForm.paidCar = data.trCar.paidCar
                this.dataForm.isCold = data.trCar.isCold !== null ? data.trCar.isCold.toString() : ''
                this.dataForm.warmArea = data.trCar.warmArea ? data.trCar.warmArea.split(',') : []
                this.dataForm.volume = data.trCar.volume
                this.dataForm.carLicence = data.trCar.carLicence ? data.trCar.carLicence : this.dataForm.carLicence;
                this.dataForm.carLicence.registerTime = data.trCar.carLicence.registerTime ? new Date(data.trCar.carLicence.registerTime) : '';
                this.dataForm.carLicence.certificationTime = data.trCar.carLicence.certificationTime ? new Date(data.trCar.carLicence.certificationTime) : '';
                this.dataForm.carLicence.validTime = new Date(data.trCar.carLicence.validTime)
                this.dataForm.carLicence.forceScrapTime = data.trCar.carLicence.forceScrapTime ? new Date(data.trCar.carLicence.forceScrapTime) : '';
                this.dataForm.carLicence.attachments = data.trCar.attachments ? data.trCar.attachments : []
                this.$nextTick(() => {
                  this.$refs.carNumber.init(this.dataForm.carNumberPre)
                })
              }
            })
          }
        })
      },
      addGpsList () {
        this.dataForm.carGpses.push(
          {
            gpsName: '',
            gpsDeviceCode: '',
            placePosition: '',
            gpsPlatform: ''
          }
        )
      },
      deleteGpsList (index) {
        this.$confirm('确定删除这条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          this.dataForm.carGpses.splice(index, 1)
        })
      },
      addCoolerList () {
        this.dataForm.carCoolers.push(
          {
            coolerName: '',
            coolerModel: '',
            placePosition: ''
          }
        )
      },
      deleteCoolerList (index) {
        this.$confirm('确定删除这条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          this.dataForm.carCoolers.splice(index, 1)
        })
      },
      uploadPageHandle (id, type) {
        if (type === 'carCoolers') {
          this.uploadTitle = '冷机品牌导入'
          this.uploadUrl = '/transresources/trcar/coolerExport'
          this.submitUrl = '/transresources/trcar/trueCoolerExport'
        } else {
          this.uploadTitle = 'GPS品牌导入'
          this.uploadUrl = '/transresources/trcar/gpsExport'
          this.submitUrl = '/transresources/trcar/trueGpsExport'
        }
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPage.init(id)
        })
      },
      addList (val, type) {
        if (type.indexOf('coolerExport') > -1) {
          let temp = val.map(res => {
            let json = {
              coolerName: res.coolerName,
              coolerModel: res.coolerModel,
              placePosition: res.placePosition
            }
            return json
          })
          this.dataForm.carCoolers = this.dataForm.carCoolers.concat(temp).filter(res => res.coolerName)
        }
        if (type.indexOf('gpsExport') > -1) {
          let temp = val.map(res => {
            let json = {
              gpsName: res.gpsName,
              gpsDeviceCode: res.gpsDeviceCode,
              placePosition: res.placePosition,
              gpsPlatform: res.gpsPlatform
            }
            return json
          })
          this.dataForm.carGpses = this.dataForm.carGpses.concat(temp).filter(res => res.gpsName)
        }
      },
      clearNext (item) {
        this.$set(item, 'coolerModel', '')
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      getAreaPre (area) {
        this.dataForm.carNumberPre = area
      },
      getBrandList (type) {
        let date = null
        if (type && type === 'cooler') {
          date = this.dataForm.carCoolers
        } else {
          date = this.dataForm.carGpses
        }
        this.brandListVisible = true
        this.$nextTick(() => {
          this.$refs.brandList.init(type, date)
        })
      },
      // 表单提交
      dataFormSubmit () {
        if (this.$store.state.upload.status) {
          this.$message({
            type: 'warning',
            message: '文件尚未上传完成'
          })
          return false
        }
        this.$refs['dataForm'].validate((valid) => {
          if (!this.clickFlag) {
            return
          }
          if (valid) {
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcar/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                ...this.dataForm,
                'id': this.uploadConfig.id,
                carNumber: this.dataForm.carNumberPre + this.dataForm.appendNumber,
                'warmArea': this.dataForm.warmArea.join(',')
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    window.history.go(-1)
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
      checkUpload (file) {
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          this.$message.warning('文件不能大于50M')
          return false
        }
        if (this.uploadType === 'gps') {
          this.urls = this.$http.adornUrl(`/transresources/trcar/gpsExport?token=${this.$cookie.get('token')}`)
        }
        if (this.uploadType === 'cooler') {
          this.urls = this.$http.adornUrl(`/transresources/trcar/coolerExport?token=${this.$cookie.get('token')}`)
        }
      },
      handleChange (file) {
        this.dataListLoading = true
        if (file.status === 'success') {
          this.dataListLoading = true
        }
      },
      handleAvatarSuccess (response) {
        if (response.gps) {
          response.gps.map(res => {
            if (this.dataForm.carGpses.length && !this.dataForm.carGpses[0].gpsName) {
              this.dataForm.carGpses = []
            }
            if (!this.dataForm.carGpses.length) {
              this.dataForm.carGpses = []
            }
            this.dataForm.carGpses.push(
              {
                gpsName: res.gpsName,
                gpsDeviceCode: res.gpsDeviceCode,
                placePosition: res.placePosition
              }
            )
          })
        }
        if (response.cooler) {
          response.cooler.map(res => {
            if (this.dataForm.carCoolers.length && !this.dataForm.carCoolers[0].coolerName) {
              this.dataForm.carCoolers = []
            }
            if (!this.dataForm.carCoolers.length) {
              this.dataForm.carCoolers = []
            }
            this.dataForm.carCoolers.push(
              {
                coolerName: res.coolerName,
                coolerModel: res.coolerModel,
                placePosition: res.placePosition
              }
            )
          })
        }
      },
      getLabel (value, item, type) {
        if (type === 'cooler') {
          this.$set(item, 'coolerName', value)
        }
        if (type === 'gps') {
          this.$set(item, 'gpsName', value)
        }
      },
      oninput (value) {
        if (value === 'carLong') {
          this.dataForm.carLong = (this.dataForm.carLong.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        }
        if (value === 'carWide') {
          this.dataForm.carWide = (this.dataForm.carWide.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        }
        if (value === 'carHigh') {
          this.dataForm.carHigh = (this.dataForm.carHigh.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        }
        if (value === 'carLoad') {
          this.dataForm.carLoad = (this.dataForm.carLoad.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        }
        if (value === 'volume') {
          this.dataForm.volume = (this.dataForm.volume.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/.el-form-item .el-form-item__content .el-input-group__prepend{
    padding: 5px!important;
  }
  /deep/.carNumber .el-input-group__prepend{
    width: 100px!important;
    text-align: center;
  }
</style>

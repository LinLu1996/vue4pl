<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
    <el-form-item label-width="0">
      <el-tag>基本信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="运输证号" prop="transportNo">
          <el-input v-model="dataForm.transportNo" maxlength="20" clearable placeholder="运输证号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运商" prop="carrierId">
          <xkl-select style="width: 100%" v-model="dataForm.carrierId" :transportId="dataForm.id" keyType="carrierId" labelType="carrierName" linkage="/transresources/trcarrier/findList" @getLabel="getSelectLabel"  placeholder="承运商名称"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="业户名称" prop="propertyName">
          <el-input v-model="dataForm.propertyName" maxlength="30" clearable placeholder="业户名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-row>
          <el-col :span="4">
            <el-form-item label="地址" prop="provinceId">
              <xkl-select style="width: 100%" v-model="dataForm.provinceId" labelType="name" levelNumber1="1"  linkage="/sys/sysregion/regionList" placeholder="请选择"></xkl-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="padding: 10px">
            省
          </el-col>
          <el-col :span="3">
            <el-form-item prop="cityId" label-width="0">
              <xkl-select style="width: 100%" v-model="dataForm.cityId" labelType="name" linkage="/sys/sysregion/regionList" levelNumber2="2" :selectId="dataForm.provinceId" placeholder="请选择"></xkl-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="padding: 10px">
            市
          </el-col>
          <el-col :span="3">
            <el-form-item prop="areaId" label-width="0">
              <xkl-select style="width: 100%" v-model="dataForm.areaId" labelType="name" linkage="/sys/sysregion/regionList" levelNumber3="3" :selectId="dataForm.cityId" placeholder="请选择"></xkl-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="padding: 10px 0 10px 10px;">
            区/县
          </el-col>
          <el-col :span="11">
            <el-form-item prop="detailAddress" label-width="0">
              <el-input v-model="dataForm.detailAddress" maxlength="30" clearable placeholder="请补充完整地址信息（到门牌号）"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车牌号" prop="appendNumber">
          <xkl-car-number ref="carNumber" v-model="dataForm.appendNumber" @areaPre="getAreaPre"></xkl-car-number>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="许可证号" prop="licenceNo">
          <el-input v-model="dataForm.licenceNo" maxlength="20" clearable placeholder="许可证号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车牌类型" prop="carType">
          <el-input v-model="dataForm.carType" maxlength="10" clearable placeholder="车牌类型"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="carLong" label="车辆尺寸">
              <el-input v-model="dataForm.carLong" maxlength="7" clearable>
                <template slot="prepend">长</template>
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px">
            <el-form-item prop="carWide">
              <el-input v-model="dataForm.carWide" maxlength="7" clearable>
                <template slot="prepend">宽</template>
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px">
            <el-form-item prop="carHigh">
              <el-input v-model="dataForm.carHigh" maxlength="7" clearable>
                <template slot="prepend">高</template>
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-form-item label="载重" prop="carLoad">
          <el-input style="width: 100%" v-model="dataForm.carLoad" placeholder="载重" maxlength="7" clearable><template slot="append">吨</template></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="经营范围">
          <el-input v-model="dataForm.manageScope" type="textarea" maxlength="120" placeholder="多行输入" rows="4"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="证件有效期" prop="valueDate">
          <xkl-date-picker type="daterange" v-model="dataForm.valueDate" placeholder="证件有效期"></xkl-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="核发机关" prop="verifyOffice">
          <el-input v-model="dataForm.verifyOffice" maxlength="20" clearable placeholder="核发机关"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="核发日期" prop="verifyDate">
          <xkl-date-picker type="date" v-model="dataForm.verifyDate" placeholder="核发日期"></xkl-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0">
      <el-tag>附件</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="24">
        <el-form-item label="上传文件" prop="attachmentUrl">
          <xkl-upload v-model="dataForm.attachments" :config="uploadConfig"></xkl-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-form-item>
          <el-button @click="$router.push({name: 'trans-resources-trans-certificate/certificate'})">关闭</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import { formatDate } from '@/utils'
  import Upload from '@/components/upload/upload'
  import ProductDrawer from '../product/product-drawer'
  export default {
    data () {
      let verifyCarNumber = (rule, value, callback) => {
        let patrn = /^[a-zA-Z]{1}[a-zA-Z0-9]{4}[a-zA-Z0-9挂学警港澳]{1}$/;
        if (!patrn.test(value)) {
          callback(new Error('请输入合法车牌号'))
        }
        callback()
      }
      let verifyChar = (rule, value, callback) => {
        let patrn = /^(\w){0,30}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入字母、数字、下划线'))
        }
        callback()
      }
      let verifyNumberChar = (rule, value, callback) => {
        let patrn = /^(\w){0,30}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入字母、数字、下划线'))
        }
        callback()
      }
      let verifyPositiveNumber = (rule, value, callback) => {
        if (isNaN(value) || value <= 0) {
          callback(new Error('请输入大于0的数字'))
        }
        callback()
      }
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
          cityId: '',
          areaId: '',
          detailAddress: '',
          carNumber: '',
          carNumberPre: '沪',
          appendNumber: '',
          licenceNo: '',
          carType: '',
          carLong: '',
          carWide: '',
          carHigh: '',
          carLoad: '',
          manageScope: '',
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
        dataRule: {
          transportNo: [
            {required: true, message: '请填写运输证号', trigger: 'blur'},
            {validator: verifyNumberChar}
          ],
          carrierId: [
            { required: true, message: '请填写承运商名称', trigger: 'change' },
            { validator: verifyChar, trigger: 'blur' }
          ],
          propertyName: [
            { required: false, message: '请填写业户名称', trigger: 'blur' }
          ],
          appendNumber: [
            { required: true, message: '请填写车牌号', trigger: 'change' },
            { validator: verifyCarNumber, trigger: 'blur' }
          ],
          licenceNo: [
            { required: false, validator: verifyNumberChar, trigger: 'blur' }
          ],
          carType: [
            { required: true, message: '请填写车牌类型', trigger: 'blur' }
          ],
          carLong: [
            {required: true, message: '请输入车长'},
            {validator: verifyPositiveNumber, trigger: 'blur'}
          ],
          carWide: [
            {required: true, message: '请输入车宽', trigger: 'blur'},
            { validator: verifyPositiveNumber, trigger: 'blur' }
          ],
          carHigh: [
            { required: true, message: '请输入车高', trigger: 'blur' },
            {validator: verifyPositiveNumber, trigger: 'blur'}
          ],
          carLoad: [
            {required: true, validator: verifyPositiveNumber, trigger: 'blur'}
          ],
          valueDate: [
            { required: true, message: '请选择证件有效期', trigger: 'change' }
          ]
        },
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
          id: ''
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
      },
      'dataForm.provinceId' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.cityId = ''
          this.dataForm.areaId = ''
        }
      },
      'dataForm.cityId' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.areaId = ''
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
      init () {
        this.clickFlag = true
        this.dataForm.id = this.$route.query.id || null
        this.uploadConfig.id = this.dataForm.id
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
                this.dataForm.provinceId = parseInt(data.tTrRoadTransportLicence.provinceId) || ''
                this.dataForm.cityId = parseInt(data.tTrRoadTransportLicence.cityId) || ''
                this.dataForm.areaId = parseInt(data.tTrRoadTransportLicence.areaId) || ''
                this.dataForm.detailAddress = data.tTrRoadTransportLicence.detailAddress
                this.dataForm.carNumber = data.tTrRoadTransportLicence.carNumber
                this.dataForm.carNumberPre = data.tTrRoadTransportLicence.carNumber.substring(0, 1)
                if (this.dataForm.carNumberPre === '内') {
                  this.dataForm.carNumberPre = '内蒙古'
                  this.dataForm.appendNumber = data.tTrRoadTransportLicence.carNumber.substring(3, 9)
                } else {
                  this.dataForm.appendNumber = data.tTrRoadTransportLicence.carNumber.substring(1, 7)
                }
                this.dataForm.licenceNo = data.tTrRoadTransportLicence.licenceNo
                this.dataForm.carType = data.tTrRoadTransportLicence.carType
                this.dataForm.carLong = data.tTrRoadTransportLicence.carLong
                this.dataForm.carWide = data.tTrRoadTransportLicence.carWide
                this.dataForm.carHigh = data.tTrRoadTransportLicence.carHigh
                this.dataForm.carLoad = data.tTrRoadTransportLicence.carLoad
                this.dataForm.startValidDate = data.tTrRoadTransportLicence.startValidDate
                this.dataForm.endValidDate = data.tTrRoadTransportLicence.endValidDate
                this.dataForm.verifyOffice = data.tTrRoadTransportLicence.verifyOffice
                this.dataForm.verifyDate = data.tTrRoadTransportLicence.verifyDate
                this.dataForm.attachments = data.tTrRoadTransportLicence.attachmentList
                this.dataForm.isEnabled = data.tTrRoadTransportLicence.isEnabled
                this.dataForm.valueDate = [
                  data.tTrRoadTransportLicence.startValidDate,
                  data.tTrRoadTransportLicence.endValidDate
                ]
                this.$nextTick(() => {
                  this.$refs.carNumber.init(this.dataForm.carNumberPre)
                })
              }
            })
          } else {
            this.isDisabled = false
            this.dataForm.attachmentUrl = ''
          }
        })
      },
      // 获取下拉框的label值
      getSelectLabel (params) {
        this.dataForm.propertyName = params
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
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.handleSubmit()
          }
        })
      },
      getAreaPre (area) {
        this.dataForm.carNumberPre = area
      },
      closeForm () {
        this.visible = false
        this.$refs['attachment'].init()
      },
      handleSubmit () {
        this.clickFlag = false
        this.$http({
          url: this.$http.adornUrl(`/transresources/trroadtransportlicence/${!this.dataForm.id ? 'save' : 'update'}`),
          method: 'post',
          data: this.$http.adornData({
            ...this.dataForm,
            'id': this.uploadConfig.id,
            'verifyDate': this.dataForm.verifyDate ? formatDate(this.dataForm.verifyDate) : '',
            'startValidDate': formatDate(this.dataForm.valueDate[0]),
            'endValidDate': formatDate(this.dataForm.valueDate[1]),
            'carNumber': this.dataForm.carNumberPre + this.dataForm.appendNumber
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$router.push({name: 'trans-resources-trans-certificate/certificate'})
              }
            })
          } else {
            this.clickFlag = true
            this.$message.error(data.msg)
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
</style>

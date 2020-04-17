<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="100px">
    <el-form-item label-width="0">
      <el-tag>基本信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="许可证号" prop="licenceNo">
          <el-input v-model="dataForm.licenceNo" maxlength="20" clearable placeholder="许可证号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运商" prop="carrierId">
          <xkl-select style="width: 100%" v-model="dataForm.carrierId" :managementId="dataForm.id" @getLabel="getSelectLabel" labelType="carrierName" linkage="/transresources/trcarrier/getManagementCarriers" placeholder="承运商名称"></xkl-select>
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
              <xkl-select style="width: 100%" v-model="dataForm.provinceId" labelType="name" levelNumber1="1" linkage="/sys/sysregion/regionList" placeholder="请选择"></xkl-select>
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
      <el-col :span="24">
        <el-form-item label="经营范围">
          <el-input v-model="dataForm.manageScope" type="textarea" maxlength="120" rows="4" placeholder="允许多行输入"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="证件有效期" prop="valueDate">
          <xkl-date-picker type="daterange" v-model="dataForm.valueDate" placeholder="证件有效期"></xkl-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="核发机关" prop="verifyOffice">
          <el-input v-model="dataForm.verifyOffice" maxlength="30" clearable placeholder="核发机关"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="核发日期" prop="verifyDate">
          <xkl-date-picker type="date" v-model="dataForm.verifyDate" placeholder="核发日期"></xkl-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="附件" prop="attachmentUrl">
          <xkl-upload v-model="dataForm.attachments" :config="uploadConfig"></xkl-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-form-item>
          <el-button @click="$router.push({name: 'trans-resources-business-license/business-license'})">关闭</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import { formatDate } from '@/utils'
  import ProductDrawer from '../product/product-drawer'
  export default {
    data () {
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
      return {
        visible: false,
        drawerVisible: false,
        clickFlag: true,
        linkage: '1',
        id: '',
        dataForm: {
          id: 0,
          licenceNo: '',
          carrierId: '',
          propertyName: '',
          manageScope: '',
          provinceId: '',
          cityId: '',
          areaId: '',
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
        dataRule: {
          licenceNo: [
            {required: true, message: '请填写许可证号', trigger: 'blur'},
            {validator: verifyNumberChar}
          ],
          carrierId: [
            { required: true, message: '请填写承运商名称', trigger: 'change' },
            { validator: verifyChar, trigger: 'blur' }
          ],
          propertyName: [
            { required: false, message: '请填写业务名称', trigger: 'blur' }
          ],
          valueDate: [
            { required: true, message: '请填写证件有效期', trigger: 'change' }
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
      ProductDrawer
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.clickFlag = true
        this.dataForm.id = this.$route.query.id || 0
        this.uploadConfig.id = this.$route.query.id || null
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
                this.dataForm.propertyName = data.tTrRoadManagementLicence.propertyName
                this.dataForm.manageScope = data.tTrRoadManagementLicence.manageScope
                this.dataForm.provinceId = parseInt(data.tTrRoadManagementLicence.provinceId) || ''
                this.dataForm.cityId = parseInt(data.tTrRoadManagementLicence.cityId) || ''
                this.dataForm.areaId = parseInt(data.tTrRoadManagementLicence.areaId) || ''
                this.dataForm.detailAddress = data.tTrRoadManagementLicence.detailAddress
                this.dataForm.startValidDate = data.tTrRoadManagementLicence.startValidDate
                this.dataForm.endValidDate = data.tTrRoadManagementLicence.endValidDate
                this.dataForm.verifyOffice = data.tTrRoadManagementLicence.verifyOffice
                this.dataForm.verifyDate = data.tTrRoadManagementLicence.verifyDate
                this.dataForm.attachments = data.tTrRoadManagementLicence.attachmentList || []
                this.dataForm.isEnabled = data.tTrRoadManagementLicence.isEnabled
                this.dataForm.valueDate = [
                  data.tTrRoadManagementLicence.startValidDate,
                  data.tTrRoadManagementLicence.endValidDate
                ]
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
            this.clickFlag = false
            this.handleSubmit()
          }
        })
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
      getProductList (type) {
        this.$router.push({
          name: 'product-list',
          params: {
            type: type
          }
        })
      },
      deleteProduct (index) {
        this.productLists.splice(index, 1)
      },
      handleSubmit () {
        this.$http({
          url: this.$http.adornUrl(`/transresources/trroadmanagementlicence/${!this.dataForm.id ? 'save' : 'update'}`),
          method: 'post',
          data: this.$http.adornData({
            'id': this.uploadConfig.id,
            'licenceNo': this.dataForm.licenceNo,
            'carrierId': this.dataForm.carrierId,
            'propertyName': this.dataForm.propertyName,
            'manageScope': this.dataForm.manageScope,
            'provinceId': this.dataForm.provinceId,
            'cityId': this.dataForm.cityId,
            'areaId': this.dataForm.areaId,
            'detailAddress': this.dataForm.detailAddress,
            'startValidDate': formatDate(this.dataForm.valueDate[0]),
            'endValidDate': formatDate(this.dataForm.valueDate[1]),
            'verifyOffice': this.dataForm.verifyOffice,
            'verifyDate': this.dataForm.verifyDate ? formatDate(this.dataForm.verifyDate) : null,
            'attachments': this.dataForm.attachments,
            'isEnabled': this.dataForm.isEnabled
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$router.push({name: 'trans-resources-business-license/business-license'})
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
</style>

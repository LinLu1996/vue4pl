<template>
  <div class="tem-content">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-form-item label-width="0">
        <el-tag>基本信息</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="运营中心" prop="operationCenterId">
            <xkl-select style="width: 100%" v-model="dataForm.operationCenterId" labelType="fullName" linkage="/sys/toperationcenter/list" placeholder="运营中心"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="代码" prop="carrierCode">
            <el-input v-model="dataForm.carrierCode" maxlength="16" :disabled="!!dataForm.id" placeholder="承运商代码，保存后不可修改" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="名称" prop="carrierName">
            <el-input v-model="dataForm.carrierName" maxlength="33" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="简称" prop="shortName">
            <el-input v-model="dataForm.shortName" maxlength="16" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="曾用名" prop="oldCarrierName">
            <el-input v-model="dataForm.oldCarrierName" maxlength="33" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
        <el-form-item label="类型" prop="type">
          <xkl-select style="width: 100%" v-model="dataForm.type" select-type="CARRIER_TYPE" placeholder="请选择"></xkl-select>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="引入方式" prop="introductionWay">
            <xkl-select style="width: 100%" v-model="dataForm.introductionWay" select-type="INTRODUCTION_MODE" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="质量审计结果" prop="qualityAuditResult">
            <el-select v-model="dataForm.qualityAuditResult" style="width: 100%;" :clearable="true">
              <el-option key="0" label="通过" :value="0">
              </el-option>
              <el-option key="1" label="不通过" :value="1">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="付款账期" prop="billAccountPeriod">
            <el-input type="number" v-model="dataForm.billAccountPeriod" @input="changeBillAccountPeriod" placeholder="请填写付款账期，以天为单位" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运输温度" prop="temperatures">
            <xkl-select style="width: 100%" v-model="dataForm.temperatures" :multiple="true" select-type="TEMPERATURE" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <el-tag>营业执照信息</el-tag>
      </el-form-item>
      <el-row>
        <el-col>
          <el-col :span="8">
            <el-form-item label="统一社会信用代码" prop="licence.creditCode" :rules="dataRule.creditCode">
              <el-input v-model="dataForm.licence.creditCode" maxlength="30" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="币种" prop="licence.currency">
              <xkl-select style="width: 100%" v-model="dataForm.licence.currency" select-type="CURRENCY" placeholder="请选择"></xkl-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册资金" prop="licence.regCapital" :rules="dataRule.regCapital">
              <el-input v-model="dataForm.licence.regCapital" clearable :disabled="!dataForm.licence.currency" placeholder="注册资金" maxLength="9">
                <template slot="append">w</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col>
          <el-col :span="8">
            <el-form-item label="法人代表" prop="licence.corporation">
              <el-input v-model="dataForm.licence.corporation" maxlength="16" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册日期" prop="licence.registerTime">
              <el-date-picker
                style="width: 100%"
                v-model="dataForm.licence.registerTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否长期有效" prop="licence.isLong" :rules="dataRule.isLong">
              <el-select v-model="dataForm.licence.isLong" style="width: 100%;" clearable>
                <el-option key="0" label="长期" :value="0">
                </el-option>
                <el-option key="1" label="短期" :value="1">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证照有效期" prop="licence.validTime" :rules="dataRule.validTime" v-if="this.dataForm.licence.isLong === 1">
            <el-date-picker
              style="width: 100%"
              v-model="dataForm.licence.validTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件" prop="licence.attachments">
            <xkl-upload v-model="dataForm.licence.attachments" :config="uploadConfig"></xkl-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <el-tag>联系人信息</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="联系人姓名" prop="link">
            <el-input v-model="dataForm.link" maxlength="16" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话" prop="linkPhone">
            <el-input v-model="dataForm.linkPhone" maxlength="11" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱" prop="linkMail">
            <el-input v-model="dataForm.linkMail" maxlength="50" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;text-align: right">
        <el-col>
          <el-form-item>
            <el-button @click="$router.go(-1)">关闭</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { isEmail } from '@/utils/validate'
  export default {
    data () {
      let verifyTel = (rule, value, callback) => {
        let verifyPhone = (mobile) => {
          let tel = /^8\d{7,8}$/;
          let phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
          if (mobile.length === 11) { // 手机号码
            if (phone.test(mobile)) {
              return true;
            }
          } else if (mobile.length === 8) { // 电话号码
            if (tel.test(mobile)) {
              return true;
            }
          }
        }
        if (!verifyPhone(value)) {
          callback(new Error('请输入正确的手机或电话号码'))
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
      let validateEmail = (rule, value, callback) => {
        if (value === '' || value == null) {
          callback()
        }
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      let verifyNumber = (rule, value, callback) => {
        if (value === '' || value == null) {
          callback()
        }
        let r = /^\+?[1-9][0-9]*$/;
        if (!r.test(value)) {
          callback(new Error('请输入正整数'))
        } else {
          callback()
        }
      }
      let verifyPrice = (rule, value, callback) => {
        if (value) {
          let patrn = /^(([1-9][0-9]{1,8})|([0-9]{1}))(\.[0-9]{0,3})?$/;
          if (!patrn.exec(value)) {
            callback(new Error('最多保留3位小数'))
          }
        }
        callback()
      }
      return {
        url: this.$http.adornUrl(`/transresources/trcontract/upload?token=${this.$cookie.get('token')}`),
        clickFlag: true,
        options: [],
        labelType: '',
        id: '',
        dataForm: {
          id: '',
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
          operationCenterId: '',
          licence: {
            currency: '',
            creditCode: '',
            registerTime: '',
            validTime: '',
            regCapital: '',
            corporation: '',
            isLong: '',
            attachments: []
          },
          temperatures: []
        },
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          id: ''
        },
        dataRule: {
          operationCenterId: [
            {required: true, message: '请选择运营中心', trigger: 'change'}
          ],
          carrierCode: [
            {required: true, message: '请输入承运商编号', trigger: 'blur'},
            {validator: verifyNumberChar}
          ],
          carrierName: [
            {required: true, message: '请输入承运商名称', trigger: 'blur'}
          ],
          oldCarrierName: [
            {required: false, message: '请输入曾用名', trigger: 'blur'}
          ],
          qualityAuditResult: [
            {required: true, message: '请选择质量审计结果', trigger: 'change'}
          ],
          isLong: [
            {required: true, message: '请选择是否长期有效', trigger: 'change'}
          ],
          validTime: [
            {required: true, message: '请选择证照有效期', trigger: 'change'}
          ],
          billAccountPeriod: [
            {validator: verifyNumber}
          ],
          creditCode: [
            {required: true, message: '请输入统一社会信用代码', trigger: 'blur'},
            {validator: verifyNumberChar}
          ],
          regCapital: [{validator: verifyPrice}],
          type: [
            {required: true, message: '请选择类型', trigger: 'change'}],
          link: [
            {required: true, message: '请输入联系人', trigger: 'blur'}],
          linkPhone: [
            {required: true, message: '请输入联系电话', trigger: 'blur'},
            {validator: verifyTel, trigger: 'blur'}
          ],
          linkMail: [
            { validator: validateEmail, trigger: 'blur' }
          ]
        },
        pickerOptions: {
          disabledDate (value) {
            if (Date.now() >= value) {
              return true
            }
            return false
          }
        },
        dialogImageUrl: '',
        dialogVisible: false,
        areaShowVisible: false
      }
    },
    activated () {
      const id = this.$route.query.id || null
      this.init(id)
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || null
        this.uploadConfig.id = id || null
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcarrier/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.carrierCode = data.trCarrier.carrierCode
                this.dataForm.carrierName = data.trCarrier.carrierName
                this.dataForm.shortName = data.trCarrier.shortName
                this.dataForm.oldCarrierName = data.trCarrier.oldCarrierName
                this.dataForm.type = data.trCarrier.type
                this.dataForm.introductionWay = data.trCarrier.introductionWay
                this.dataForm.qualityAuditResult = data.trCarrier.qualityAuditResult
                this.dataForm.billAccountPeriod = data.trCarrier.billAccountPeriod
                this.dataForm.link = data.trCarrier.link
                this.dataForm.linkPhone = data.trCarrier.linkPhone
                this.dataForm.linkMail = data.trCarrier.linkMail
                this.dataForm.operationCenterId = data.trCarrier.operationCenterId
                this.dataForm.licence = data.trCarrier.licence ? data.trCarrier.licence : this.dataForm.licence;
                this.dataForm.licence.attachments = data.trCarrier.attachments
                this.dataForm.licence.registerTime = data.trCarrier.licence && data.trCarrier.licence.registerTime ? new Date(data.trCarrier.licence.registerTime) : '';
                this.dataForm.licence.validTime = data.trCarrier.licence && data.trCarrier.licence.validTime ? new Date(data.trCarrier.licence.validTime) : '';
                this.dataForm.temperatures = data.trCarrier.temperatures ? data.trCarrier.temperatures : this.dataForm.temperatures;
              }
            })
          }
        })
      },
      handleCancel () {
        window.history.go(-1)
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
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcarrier/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                ...this.dataForm,
                'id': this.uploadConfig.id
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
      changeBillAccountPeriod () {
        if (this.dataForm.billAccountPeriod.length > 3) {
          this.dataForm.billAccountPeriod = this.dataForm.billAccountPeriod.slice(0, 3)
        }
      },
      changeRegCapital () {
        if (this.dataForm.licence.regCapital.length > 9) {
          this.dataForm.licence.regCapital = this.dataForm.licence.regCapital.slice(0, 9)
        }
        this.dataForm.licence.regCapital = (this.dataForm.licence.regCapital.match(/^\d*(\.?\d{0,3})/g)[0]) || null
      }
    }
  }
</script>
<style lang="scss">
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
    margin: 0;
  }
  input[type="number"]{-moz-appearance:textfield;}
</style>

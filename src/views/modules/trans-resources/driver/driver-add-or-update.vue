<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label-width="0">
        <el-tag>基本信息</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="承运商" prop="carrierId">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" labelType="carrierName" linkage="/transresources/trcarrier/findList" select-type="OPERATION_TYPE" placeholder="承运商" clearable></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="司机姓名" prop="driverName">
            <el-input v-model="dataForm.driverName" maxlength="16" placeholder="司机姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证号" prop="driverIdcard">
            <el-input v-model="dataForm.driverIdcard" placeholder="身份证号" maxlength="18" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker
              style="width: 100%"
              v-model="dataForm.birthday"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="driverSex">
            <el-radio-group v-model="dataForm.driverSex">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号" prop="driverPhone">
            <el-input v-model="dataForm.driverPhone" placeholder="手机号" maxlength="11" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input style="width: 100%" v-model="dataForm.remark" type="textarea" rows="4" placeholder="备注" maxlength="100" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证正面" prop="idCardFrontAttachment">
            <xkl-upload ref="upload1" v-model="dataForm.idCardFrontAttachment" :config="uploadConfig"></xkl-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证反面" prop="idCardBackAttachment">
            <xkl-upload ref="upload2" v-model="dataForm.idCardBackAttachment" :config="uploadConfig"></xkl-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <el-tag>驾驶证信息</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="准驾车型" prop="driverLicence.driveAllowType" :rules="dataRule.driveAllowType">
            <xkl-select style="width: 100%" v-model="dataForm.driverLicence.driveAllowType" select-type="PERMIT_DRIVEING_TYPE" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="120px" label="初次领证日期" prop="driverLicence.certificationTime" :rules="dataRule.certificationTime">
            <el-date-picker
              v-model="dataForm.driverLicence.certificationTime"
              type="date"
              style="width: 100%"
              placeholder="领证日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="120px" label="证件有效期至" prop="driverLicence.validTime" :rules="dataRule.validTime">
            <el-date-picker
              style="width: 100%"
              v-model="dataForm.driverLicence.validTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="驾驶证附件" prop="driverLicence.attachments">
            <xkl-upload v-model="dataForm.driverLicence.attachments" :config="uploadConfig1"></xkl-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      let verifyTel = (rule, value, callback) => {
        let patrn = /^1(3|4|5|7|8)\d{9}$/;
        if (!patrn.exec(value)) {
          callback(new Error('格式错误'))
        }
        callback()
      }
      let verifyId = (rule, value, callback) => {
        let patrn = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
        if (!patrn.exec(value)) {
          callback(new Error('请输入正确的身份证号'))
        }
        callback()
      }
      return {
        url: this.$http.adornUrl(`/transresources/trcontract/upload?token=${this.$cookie.get('token')}`),
        visible: false,
        clickFlag: true,
        dataForm: {
          id: '',
          driverName: '',
          carrierId: '',
          driverSex: 0,
          birthday: '',
          driverIdcard: '',
          idCardFront: '',
          idCardBack: '',
          driverPhone: '',
          idCardFrontAttachment: [],
          idCardBackAttachment: [],
          remark: '',
          fileName: '',
          filePath: '',
          driverLicence: {
            driveAllowType: '',
            certificationTime: '',
            validTime: '',
            attachments: []
          }
        },
        id: '',
        uploadConfig: {
          fileListType: 'avatar', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: true, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          id: ''
        },
        uploadConfig1: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          id: ''
        },
        dialogVisible: false,
        dialogImageUrl: '',
        dataRule: {
          driverName: [{required: true, message: '请输入司机姓名', trigger: 'blur'}],
          carrierId: [{required: true, message: '请输入承运商名称', trigger: 'blur'}],
          driverSex: [{required: true, message: '请选择性别', trigger: 'change'}],
          birthday: [{required: true, message: '请选择出生日期', trigger: 'change'}],
          certificationTime: [{required: true, message: '请选择领证时间', trigger: 'change'}],
          validTime: [{required: true, message: '请选择领证时间', trigger: 'change'}],
          driveAllowType: [{required: true, message: '请选择准驾车型', trigger: 'change'}],
          driverPhone: [
            { required: true, message: '请填写手机号', trigger: 'blur' },
            { validator: verifyTel, trigger: 'blur' }
          ],
          driverIdcard: [
            { required: true, message: '请填写身份证', trigger: 'blur' },
            { validator: verifyId, trigger: 'blur' }
          ]
        },
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now();
          }
        }
      }
    },
    watch: {
      'dataForm.idCardFrontAttachment' (newVal, oldVal) {
        if (oldVal) {
          this.uploadConfig1.id = this.uploadConfig.id
        }
      },
      'dataForm.idCardBackAttachment' (newVal, oldVal) {
        if (oldVal) {
          this.uploadConfig1.id = this.uploadConfig.id
        }
      },
      'dataForm.driverLicence.attachments' (newVal, oldVal) {
        if (oldVal) {
          this.uploadConfig.id = this.uploadConfig1.id
        }
      }
    },
    components: {
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || undefined
        this.id = this.dataForm.id
        this.uploadConfig1.id = this.dataForm.id
        this.uploadConfig.id = this.dataForm.id
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/transresources/trdriver/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.driverName = data.tTrDriver.driverName
                this.dataForm.carrierId = data.tTrDriver.carrierId
                this.dataForm.driverSex = data.tTrDriver.driverSex
                this.dataForm.birthday = new Date(data.tTrDriver.birthday)
                this.dataForm.driverIdcard = data.tTrDriver.driverIdcard
                this.dataForm.idCardFront = data.tTrDriver.idCardFront
                this.dataForm.idCardBack = data.tTrDriver.idCardBack
                this.dataForm.remark = data.tTrDriver.remark
                this.dataForm.idCardFrontAttachment = data.tTrDriver.idCardFrontAttachment ? data.tTrDriver.idCardFrontAttachment : [];
                this.dataForm.idCardBackAttachment = data.tTrDriver.idCardBackAttachment ? data.tTrDriver.idCardBackAttachment : [];
                this.dataForm.certificationTime = new Date(data.tTrDriver.certificationTime)
                this.dataForm.driverPhone = data.tTrDriver.driverPhone
                this.dataForm.driverLicence = data.tTrDriver.driverLicence ? data.tTrDriver.driverLicence : this.dataForm.driverLicence;
                this.dataForm.driverLicence.certificationTime = data.tTrDriver.driverLicence.certificationTime ? new Date(data.tTrDriver.driverLicence.certificationTime) : null;
                this.dataForm.driverLicence.validTime = data.tTrDriver.driverLicence.validTime ? new Date(data.tTrDriver.driverLicence.validTime) : null;
                this.dataForm.driverLicence.attachments = data.tTrDriver.attachments ? data.tTrDriver.attachments : [];
              }
            })
          }
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
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/transresources/trdriver/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                ...this.dataForm,
                id: this.uploadConfig.id
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                    this.$emit('close')
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
      closeForm () {
        this.$refs.upload1.init('driver')
        this.$refs.upload2.init('driver')
        this.$emit('close')
        this.visible = false
      }
    }
  }
</script>

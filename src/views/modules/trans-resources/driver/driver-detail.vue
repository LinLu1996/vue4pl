<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70% ">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label-width="0">
        <el-tag>基本信息</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="司机姓名：" prop="driverName">
            <span style="width: 200px; display: block">
              {{dataForm.driverName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运商名称：" prop="carrierName">
            <span style="width: 200px; display: block">
              {{dataForm.carrierName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别：" prop="driverSex">
            <span style="width: 200px; display: block">
              {{dataForm.driverSex === 0 ? '男' : '女'}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出生日期：" prop="birthday">
             <span style="width: 200px; display: block">
              {{$formatDate(dataForm.birthday)}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证号：" prop="driverIdcard">
            <span style="width: 200px; display: block">
              {{dataForm.driverIdcard}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号：" prop="driverPhone">
            <span style="width: 200px; display: block">
              {{dataForm.driverPhone}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态：" prop="isEnabled">
            <span style="width: 200px; display: block">
              {{dataForm.isEnabled ===1 ? '无效' : '有效'}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注：" prop="remark">
            <span style="width: 200px; display: block;white-space:normal; word-break:break-all;">
              {{dataForm.remark}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证正面：" prop="idCardFrontAttachment">
            <xkl-upload ref="upload1" v-if="dataForm.idCardFrontAttachment.length" v-model="dataForm.idCardFrontAttachment" :config="uploadConfig"></xkl-upload>
            <img v-else style="width: 240px;
                        height: 178px;
                        display: block;"
                 src="~@/assets/img/defaultIdCardFront.png">
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证反面：" prop="idCardBackAttachment">
            <xkl-upload ref="upload2" v-if="dataForm.idCardBackAttachment.length" v-model="dataForm.idCardBackAttachment" :config="uploadConfig"></xkl-upload>
            <img v-else style="width: 240px;
                        height: 178px;
                        display: block;"
            src="~@/assets/img/defaultIdCardBack.png">
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <el-tag>资质证照</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="准驾车型：" prop="driveAllowType">
            <span style="width: 200px; display: block">
              {{dataForm.driverLicence.driveAllowType}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="120px" label="初次领证日期：" prop="certificationTime">
            <span style="width: 200px; display: block">
              {{$formatDate(dataForm.driverLicence.certificationTime)}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="120px" label="证件有效期至：" prop="validTime">
            <span style="width: 200px; display: block">
              {{$formatDate(dataForm.driverLicence.validTime)}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="驾驶证附件：" prop="driverLicence.attachments">
            <xkl-download style="margin-left: 10px" :disabled="!dataForm.driverLicence.attachments.length" :outputConfig="outputConfig"></xkl-download>
            <xkl-upload v-model="dataForm.driverLicence.attachments" :config="uploadConfig1"></xkl-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {formatDate} from '@/utils'
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
          driverName: '',
          carrierId: '',
          carrierName: '',
          driverSex: 1,
          birthday: '',
          driverIdcard: '',
          driverPhone: '',
          remark: '',
          idCardFrontAttachment: [],
          idCardBackAttachment: [],
          idCardAttachment: '',
          fileName: '',
          filePath: '',
          isEnabled: '',
          driverLicence: {
            driveAllowType: '',
            certificationTime: '',
            validTime: '',
            name: '',
            path: '',
            attachments: []
          }
        },
        uploadConfig: {
          fileListType: 'avatar', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: true, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          disabled: true
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
          outputUrl: '/transresources/trdriver/outPutExcelAnnex',
          fileName: '司机驾驶证附件'
        },
        dialogVisible: false,
        dialogImageUrl: '',
        dataRule: {
          driverPhone: [
            { required: false, message: '请填写电话', trigger: 'blur' },
            { validator: verifyTel, trigger: 'blur' }
          ],
          driverIdcard: [
            { required: false, message: '请填写身份证', trigger: 'blur' },
            { validator: verifyId, trigger: 'blur' }
          ]
        }
      }
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
            this.$http({
              url: this.$http.adornUrl(`/transresources/trdriver/detail/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.driverName = data.tTrDriver.driverName
                this.dataForm.carrierId = data.tTrDriver.carrierId
                this.dataForm.carrierName = data.tTrDriver.carrierName
                this.dataForm.driverSex = data.tTrDriver.driverSex
                this.dataForm.birthday = formatDate(data.tTrDriver.birthday)
                this.dataForm.driverIdcard = data.tTrDriver.driverIdcard
                this.dataForm.remark = data.tTrDriver.remark
                this.dataForm.isEnabled = data.tTrDriver.isEnabled
                // this.dataForm.certificationTime = formatDate(data.tTrDriver.certificationTime)
                this.dataForm.driverPhone = data.tTrDriver.driverPhone
                this.dataForm.driverLicence = data.tTrDriver.driverLicence ? data.tTrDriver.driverLicence : this.dataForm.driverLicence;
                this.dataForm.driverLicence.certificationTime = data.tTrDriver.driverLicence.certificationTime ? formatDate(data.tTrDriver.driverLicence.certificationTime) : null;
                this.dataForm.driverLicence.validTime = data.tTrDriver.driverLicence.validTime ? formatDate(data.tTrDriver.driverLicence.validTime) : null;
                this.dataForm.idCardFront = data.tTrDriver.idCardFront
                this.dataForm.idCardBack = data.tTrDriver.idCardBack
                this.dataForm.idCardFrontAttachment = data.tTrDriver.idCardFrontAttachment ? data.tTrDriver.idCardFrontAttachment : [];
                this.dataForm.idCardBackAttachment = data.tTrDriver.idCardBackAttachment ? data.tTrDriver.idCardBackAttachment : [];
                this.dataForm.driverLicence = data.tTrDriver.driverLicence ? data.tTrDriver.driverLicence : this.dataForm.driverLicence;
                this.dataForm.driverLicence.attachments = data.tTrDriver.attachments ? data.tTrDriver.attachments : [];
              }
            })
          }
        })
      },
      closeForm () {
        this.visible = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/.el-dialog__wrapper .el-form-item__content .el-upload--picture-card{
    display: none;
  }
  /deep/.el-dialog__wrapper .el-upload__tip{
    display: none;
  }
</style>

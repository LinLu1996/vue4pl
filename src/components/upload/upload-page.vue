<template>
  <el-dialog
    :title="title"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()"
             label-width="110px">
      <div style="color: skyblue;padding-left: 20px;height: 40px;line-height: 20px"><icon-svg name="详情" style="vertical-align: middle"></icon-svg>请按照导入模板文件进行数据导入</div>
      <el-row>
        <div v-if="divFlag">
<!--          <el-row>-->
<!--            <el-col :span="16">-->
<!--              <el-form-item label="承运商"  prop="carrierId">-->
<!--                <xkl-select style="width: 100%"  v-model="dataForm.carrierId" linkage="/transresources/trcarrier/findList" labelType="carrierName" placeholder="承运商"></xkl-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
          <el-row>
            <el-col :span="16">
              <el-form-item label="扣罚账期" prop="fineMonth">
                <xkl-date-picker v-model="dataForm.fineMonth" type="month" placeholder="扣罚账期"></xkl-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-col>
          <el-form-item label="下载模板">
            <span style="margin-right: 20px">{{fileName}}</span>
            <el-button type="primary" @click="handleDownLoad()">下载</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="hasImportType">
        <el-col :span="12">
          <el-form-item label="导入形式" prop="importType">
            <el-select v-model="dataForm.importType" style="width: 100%;" :clearable="true">
              <el-option key="0" label="增量" :value="0">
              </el-option>
              <el-option key="1" label="全量" :value="1">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="上传文件" prop="attachments">
            <el-input v-model="dataForm.attachments.length" type="hidden" style="position: absolute"></el-input>
            <xkl-upload ref="upload" v-model="dataForm.attachments" :config="uploadConfig" @getDataList="getDataList" @changeVisible="visible = false"></xkl-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">关闭</el-button>
      <el-button v-if="!subText && clickFlag" type="primary" @click="dataFormSubmit()">确定</el-button>
      <el-button v-else type="primary" :loading="btnLoading">导入中</el-button>
    </span>
    <upload-road-feedback v-if="uploadRoadFeedbackVisible" ref="uploadRoadFeedback" @refreshDataList="handleRefresh"></upload-road-feedback>
  </el-dialog>
</template>

<script>
  import { formatDate } from '@/utils'
  import Upload from '@/components/upload/upload'
  import UploadRoadFeedback from '@/views/modules/trans-resources/carrier/upload-road-feedback'
  export default {
    props: {
      title: {
        required: true,
        type: String
      },
      fileName: {
        required: true,
        type: String
      },
      uploadUrl: {
        required: true,
        type: String
      },
      submitUrl: {
        required: true,
        type: String
      },
      subText: {
        type: String
      },
      acceptType: {
        type: Array
      },
      hasImportType: {
        type: Boolean
      }
    },
    components: {
      Upload,
      UploadRoadFeedback
    },
    data () {
      return {
        visible: false,
        clickFlag: true,
        divFlag: false,
        dataForm: {
          id: '',
          fineMonth: '',
          carrierId: '',
          attachments: [],
          importType: ''
        },
        dataRule: {
          fineMonth: [{required: true, message: '请选择扣罚账期', trigger: 'change'}],
          carrierId: [{required: true, message: '请选择承运商', trigger: 'change'}],
          attachments: [{required: true, message: '请上传文件', trigger: 'change'}],
          importType: [{required: true, message: '请选择导入形式', trigger: 'change'}]
        },
        uploadConfig: {
          fileListType: 'text', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          limit: 1,
          text: this.subText || '',
          acceptType: this.acceptType
        },
        list: [],
        importFileName: '',
        uploadRoadFeedbackVisible: false,
        btnLoading: true
      }
    },
    watch: {
      uploadUrl: {
        handler () {
          this.uploadConfig.uploadUrl = this.uploadUrl
        },
        immediate: true
      }
    },
    methods: {
      init (id, values) {
        this.divFlag = false
        this.clickFlag = true
        if (this.title === '扣罚单导入') {
          this.divFlag = true
        }
        this.visible = true
        this.uploadRoadFeedbackVisible = false
        this.dataForm.id = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          this.dataForm.attachments = []
          this.$refs.upload.init('add')
        })
      },
      // 表单提交
      dataFormSubmit (val) {
        if (this.$store.state.upload.status) {
          this.$message({
            type: 'warning',
            message: '文件尚未上传完成'
          })
          return false
        }
        if (!this.clickFlag) {
          return;
        }
        this.clickFlag = false
        setTimeout(() => {
          this.clickFlag = true
        }, 3000)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(this.submitUrl),
              method: 'post',
              data: !this.divFlag ? (this.hasImportType ? this.$http.adornData({
                'carChecks': this.list,
                'importFileName': this.importFileName,
                'importType': this.dataForm.importType
              }) : this.$http.adornData(this.list, false)) : this.$http.adornData({
                'fines': this.list,
                'fineMonth': formatDate(this.dataForm.fineMonth, 'Month'),
                'carrierId': this.dataForm.carrierId
              })
            }).then(({data}) => {
              if (data.type && data.type === '2') {
                this.$confirm(`${data.errorMsg}`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.dataFormSubmit(2)
                }).catch(() => {})
              } else {
                if (data.code === 0) {
                  this.uploadRoadFeedbackVisible = true
                  this.$nextTick(() => {
                    this.$refs.uploadRoadFeedback.init(data, this.uploadConfig.uploadUrl)
                  })
                } else {
                  this.$message({
                    type: 'warning',
                    message: data.msg
                  })
                }
              }
              this.clickFlag = true
            })
          } else {
            this.clickFlag = true
          }
        })
      },
      // 下载
      handleDownLoad () {
        let fileName = this.fileName
        this.$http({
          url: this.$http.adornUrl('/transresources/trcontract/downloadOne'),
          method: 'get',
          params: this.$http.adornParams({
            'fileName': fileName
          }),
          responseType: 'blob'
        }).then(({data}) => {
          this.loading = false
          const link = document.createElement('a')
          let blob = new Blob([data], {type: 'application/octet-stream'})
          if (blob.size === 0) {
            this.$message.error('文件不存在')
            return
          }
          // let fileName = new Date().getTime()
          // for IE
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, this.fileName)
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            link.setAttribute('download', this.fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      },
      getDataList (data, importFileName) {
        this.list = data
        this.importFileName = importFileName
      },
      handleRefresh (val, type) {
        this.visible = false
        this.$emit('addList', val, type)
        this.$emit('refreshDataList')
      },
      closeForm () {
        this.visible = false
        if (!this.dataForm.id) {
          this.$refs.upload.init('add')
        }
      }
    }
  }
</script>
<style lang="scss">
  .el-message-box__content{
    max-height: 500px!important;
    overflow: auto;
  }
</style>

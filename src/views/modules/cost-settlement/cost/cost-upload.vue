<template>
  <el-dialog
    title="对账单导入"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <div style="color: skyblue;padding-left: 20px;height: 40px;line-height: 20px"><icon-svg name="详情" style="vertical-align: middle"></icon-svg>请按照导入模板文件进行数据导入</div>
      <el-row>
        <el-col :span="16">
          <el-form-item label="承运商" prop="carrierName">
            <xkl-select style="width: 100%" v-model="dataForm.carrierName" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList" select-type="OPERATION_TYPE" placeholder="承运商" @getLabel="getLabel"></xkl-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="对账账期" prop="statementMon">
            <el-date-picker
              v-model="dataForm.statementMon"
              type="month"
              style="width: 100%"
              placeholder="请选择">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="下载模板">
            <span style="margin-right: 20px">{{fileName}}</span>
            <el-button type="primary" @click="handleDownLoad()">下载</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="上传对账单" prop="attachments">
            <el-input v-model="dataForm.attachments.length" type="hidden" style="position: absolute"></el-input>
            <xkl-upload ref="upload" v-model="dataForm.attachments" :config="uploadConfig" @getDataList="getDataList"></xkl-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">关闭</el-button>
      <el-button v-if="clickFlag" type="primary" @click="dataFormSubmit()">确定</el-button>
      <el-button v-else type="primary" :loading="btnLoading">导入中</el-button>
    </span>
    <upload-road-feedback v-if="uploadRoadFeedbackVisible" ref="uploadRoadFeedback" @refreshDataList="handleRefresh"></upload-road-feedback>
  </el-dialog>
</template>

<script>
  import Upload from '@/components/upload/upload'
  import UploadRoadFeedback from '../../trans-resources/carrier/upload-road-feedback'
  import { formatDate } from '@/utils';
  export default {
    components: {
      Upload,
      UploadRoadFeedback
    },
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: '',
          statementMon: '',
          carrierName: '',
          attachments: []
        },
        dataRule: {
          attachments: [{required: true, message: '请上传对账单', trigger: 'change'}],
          statementMon: [{required: true, message: '请选择对账账期', trigger: 'change'}],
          carrierName: [{required: true, message: '请选择承运商', trigger: 'change'}]
        },
        uploadConfig: {
          fileListType: 'text', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/feesettlement/fscarriagestatement/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          limit: 1,
          acceptType: ['xls', 'xlsx']
        },
        fileName: '对账单导入模板.xlsx',
        fsCarriageStatementEntityList: [],
        uploadRoadFeedbackVisible: false,
        btnLoading: true
      }
    },
    methods: {
      init (id, values) {
        this.visible = true
        this.clickFlag = true
        this.uploadRoadFeedbackVisible = false
        this.dataForm.id = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          this.dataForm.attachments = []
          this.$refs.upload.init('add')
        })
      },
      // 获取承运商label
      getLabel (label) {
        this.dataForm.carrierName = label
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
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            setTimeout(() => {
              this.clickFlag = true
            }, 3000)
            this.$http({
              url: this.$http.adornUrl('/feesettlement/fscarriagestatement/imporFsCarriageStatement'),
              method: 'post',
              data: this.$http.adornData({
                'fsCarriageStatementEntityList': this.fsCarriageStatementEntityList,
                'statementMon': this.dataForm.statementMon && formatDate(this.dataForm.statementMon, 'Month'),
                'carrierName': this.dataForm.carrierName,
                'type': !val ? null : val
              })
            }).then(({data}) => {
              if (data.type && data.type === '2') {
                this.$confirm(`${data.errorMsg}`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '关闭',
                  type: 'warning'
                }).then(() => {
                  this.dataFormSubmit(2)
                }).catch(() => {})
              } else {
                if (data.code === 0 && data.type === 1) {
                  this.visible = true
                  // let exception = ''
                  // data.feedBack.exceptionList && data.feedBack.exceptionList.length && data.feedBack.exceptionList.forEach(item => {
                  //   exception += `第${item.index}行 ${item.column}列 ${item.exception}<br/>`
                  // })
                  // this.$confirm(`本次导入新增${data.feedBack.successNumber}对账单条，对账单明细${data.feedBack.falseNumber}条<br/>${exception}`, '导入成功！', {
                  //   confirmButtonText: '确定',
                  //   showCancelButton: false,
                  //   dangerouslyUseHTMLString: true,
                  //   showClose: false,
                  //   type: 'warning'
                  // }).then(() => {
                  //   this.$emit('refreshDataList')
                  // }).catch(() => {})
                  this.uploadRoadFeedbackVisible = true
                  this.$nextTick(() => {
                    this.$refs.uploadRoadFeedback.init(data)
                  })
                } else {
                  this.$message({
                    type: 'warning',
                    message: data.errorMsg
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
      getDataList (data) {
        this.fsCarriageStatementEntityList = data
      },
      handleRefresh () {
        this.visible = false
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

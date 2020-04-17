<template>
  <el-dialog
    title="扣罚单导入"
    :visible.sync="visible">
    <el-form label-width="100px">
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
            <el-upload
              style="display: inline-block;margin: 0 10px"
              :action="urls"
              :show-file-list="false"
              :before-upload="checkUpload"
              :on-change="handleChange"
              :on-success="handleAvatarSuccess">
              <el-button size="mini" type="success" icon="el-icon-upload">文件上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">关闭</el-button>
      <el-button type="primary" @click="closeForm()">确定</el-button>
    </span>
    <upload-road-feedback v-if="uploadRoadFeedbackVisible" ref="uploadRoadFeedback" @refreshDataList=""></upload-road-feedback>
  </el-dialog>
</template>

<script>
  import UploadRoadFeedback from '../../trans-resources/carrier/upload-road-feedback'
  export default {
    components: {
      UploadRoadFeedback
    },
    data () {
      return {
        visible: false,
        clickFlag: true,
        fileName: '扣罚单导入模板.xls',
        uploadRoadFeedbackVisible: false,
        urls: this.$http.adornUrl(`/feesettlement/fsfine/export?token=${this.$cookie.get('token')}`)
      }
    },
    methods: {
      init (id, values) {
        this.visible = true
        this.uploadRoadFeedbackVisible = false
      },
      checkUpload (file) {
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          this.$message.warning('文件不能大于50M')
          return false
        }
      },
      handleChange (file) {
      },
      handleAvatarSuccess (response) {
        if (response.code !== 0) {
          this.$message.error(response.msg)
          return
        }
        this.uploadRoadFeedbackVisible = true
        this.$nextTick(() => {
          this.$refs.uploadRoadFeedback.init(response)
        })
      },
      // 下载
      handleDownLoad () {
        let filePath = 'D:/static/' + this.fileName
        this.$http({
          url: this.$http.adornUrl('/transresources/trcontract/downloadOne'),
          method: 'get',
          params: this.$http.adornParams({
            'filePath': filePath
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
      closeForm () {
        this.visible = false
        this.$emit('refreshDataList')
      }
    }
  }
</script>
<style>
</style>

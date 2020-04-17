<template>
  <div>
    <el-upload
      ref="upload1"
      v-bind="config"
      :class="{'upload-demo': true, 'isHidden': true}"
      v-if="config.fileListType === 'picture-card'"
      list-type="picture"
      :action="this.$http.adornUrl(`${config.uploadUrl}?${config.id ? `id=${config.id}&` : ''}token=${$cookie.get('token')}`)"
      :file-list="fileList"
      :before-upload="checkUpload"
      :on-remove="handleRemove"
      :on-success="getResult"
      :on-progress="handleProgress"
      :on-preview="handlePreview"
      :on-error="handleError"
      :limit="5"
      :disabled="config.disabled || uploadStatus"
      :on-exceed="handleExceed">
      <el-button v-show="loading" type="text" size="mini" :loading="true">加载中。。。</el-button>
      <el-button v-if="!config.disabled && !loading" size="mini" type="success" @click="sendStatus()">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">
        {{'最多上传5个文件，点击文件列表即可下载'}}
      </div>
    </el-upload>
    <el-upload
      v-bind="config"
      v-if="config.fileListType === 'text'"
      ref="upload2"
      :action="this.$http.adornUrl(`${config.uploadUrl}?${config.id ? `id=${config.id}&` : ''}token=${$cookie.get('token')}`)"
      :file-list="fileList"
      list-type="text"
      :before-upload="checkUpload"
      :on-remove="handleRemove"
      :on-progress="handleProgress"
      :on-success="getResult"
      :on-error="handleError"
      :limit="config.limit ? config.limit : 5"
      :disabled="config.disabled || uploadStatus"
      :on-exceed="handleExceed">
      <div slot="tip" class="el-upload__tip" style="display: inline-block;margin: 0 10px">
        {{config.text ? config.text : `支持扩展名xls、xlsx`}}
      </div>
      <el-button v-if="loading" type="success" size="mini" :loading="true">加载中</el-button>
      <el-button v-if="!loading" size="mini" type="success"
                 icon="el-icon-upload">
        {{config.text ? '点击上传' : config.fileListShow ? '文件上传' : '导入'}}
      </el-button>
    </el-upload>
    <el-upload
      v-bind="config"
      :class="{'avatar-uploader': config.single}"
      v-if="config.fileListType === 'avatar'"
      :action="this.$http.adornUrl(`${config.uploadUrl}?${config.id ? `id=${config.id}&` : ''}token=${$cookie.get('token')}`)"
      :show-file-list="false"
      :before-upload="checkUpload"
      :on-progress="handleProgress"
      :on-success="getResult"
      :disabled="config.disabled || uploadStatus"
      :on-error="handleError">
      <img v-if="urlImagShow" :src="singleUrl" class="avatar" @click="sendStatus()">
      <i v-else :class="{[className]: true, 'avatar-uploader-icon': true}" @click="sendStatus()"></i>
      <!--<i v-show="" class="el-icon-loading avatar-uploader-icon"></i>-->
      <div slot="tip" class="el-upload__tip">
        {{'请上传 jpg / jpeg 格式图片，不大于1Mb'}}
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" title="预览">
      <img width="100%" :src="dialogImageUrl" alt="">
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'xklUpload',
    props: {
      value: {
        type: Array
      },
      config: {
        type: Object
      },
      id: {
        type: String
      }
    },
    data () {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        loadList: [],
        isList: true,
        singleUrl: '',
        loading: false,
        loadingBath: false,
        urlImagShow: true,
        fileListId: '',
        clickFlag: true,
        clickFlag2: true,
        className: 'el-icon-plus'
      }
    },
    watch: {
    },
    created () {
      this.init()
    },
    computed: {
      fileList: {
        get () {
          let loadArr = this.value ? this.value.map(res => {
            let loadItem = {
              name: res.name,
              path: res.path,
              url: res.path,
              fileId: res.id || ''
              // url: require('D:/static/noimag.jpg')
            }
            return loadItem
          }) : []
          return loadArr
        },
        set (value) {
          this.$emit('input', value)
        }
      },
      uploadStatus: {
        get () { return this.$store.state.upload.status }
      }
    },
    methods: {
      init (type) {
        this.$store.commit('upload/updateStatus', false)
        this.urlImagShow = false
        setTimeout(() => {
          this.singleUrl = this.fileList.length ? this.fileList[0].url : ''
          if (this.singleUrl) {
            this.urlImagShow = true
          }
        }, 1000)
        const { fileListType, fileListShow } = this.config
        if (type === 'add') {
          if (fileListType === 'picture-card') {
            this.$refs.upload1.clearFiles()
          } else {
            this.$refs.upload2.clearFiles()
          }
        }
        fileListType === 'picture-card' && fileListShow ? this.isList = false : this.isList = true
      },
      sendStatus () {
        if (this.uploadStatus) {
          this.$message({
            type: 'warning',
            message: '请稍后上传'
          })
          return false
        }
      },
      checkUpload (file) {
        this.loading = true
        const isLt50M = file.size / 1024 / 1024 < 50
        const isLt1M = file.size / 1024 / 1024 < 1
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isLt50M) {
          this.$message.warning('文件不能大于50M')
          return false
        }
        const ending = file.name.split('.')
        const endIndex = ending.length - 1
        ending[endIndex] = ending[endIndex].toLowerCase()
        if (this.config.acceptType && this.config.acceptType.length) {
          if (this.config.acceptType.indexOf(ending[endIndex]) < 0) {
            this.$message.warning('文件格式不正确')
            this.loading = false
            return false
          }
        } else {
          if (ending[endIndex] === 'zip') {
            this.$message.warning('文件格式不正确')
            this.loading = false
            return false
          }
        }
        if (ending.indexOf('jpg') > -1 || ending.indexOf('jpeg') > -1 || ending.indexOf('png') > -1 || ending.indexOf('gif') > -1) {
          if (!isLt10M) {
            this.$message.warning('图片大小不得超过10Mb')
            this.loading = false
            return false
          }
        }
        if (this.config.single) {
          if (ending.indexOf('jpg') < 1 && ending.indexOf('jpeg') < 1) {
            this.$message.warning('证件照格式不正确')
            return false
          }
          if (!isLt1M) {
            this.$message.warning('图片大小不得超过1Mb')
            return false
          }
        }
      },
      getResult (response, ee, fileList) {
        this.urlImagShow = true
        if (response.feedBack && !response.feedBack.exceptionList.length) {
          this.$emit('changeVisible')
          this.$message.success('上传成功')
          this.loading = false
          return
        }
        if ((response.code === 0 && response.file)) {
          let loadItem = {
            name: response.file.fileName,
            path: response.file.filePath,
            fileId: response.file.id
          }
          this.config.id = response.file.id
          this.loadList = [loadItem]
          let fileItem = {
            name: response.file.fileName,
            path: response.file.filePath,
            url: response.file.filePath,
            fileId: response.file.id
          }
          const importList = response.file.importList ? response.file.importList : []
          const fileName = response.file.fileName ? response.file.fileName : ''
          this.fileList.push(fileItem)
          if (this.config.single) {
            this.$emit('input', this.loadList)
            this.singleUrl = this.loadList[0].path
          } else {
            this.$emit('input', this.fileList)
          }
          this.$emit('getDataList', importList, fileName)
        } else {
          if (response.feedBack && response.feedBack.exceptionList.length) {
            this.loadingBath = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
          }
          this.$message({
            type: 'error',
            message: `${!response.feedBack ? '上传失败' : (response.feedBack && !response.feedBack.exceptionList.length ? '上传失败' : '部分文件上传失败')}`,
            onClose: () => {
              if (response.feedBack && response.feedBack.exceptionList.length) {
                this.loadingBath.close()
                this.$emit('changeVisible')
                this.$confirm('是否下载失败详情?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  if (!this.clickFlag2) {
                    return;
                  }
                  this.clickFlag2 = false
                  this.$http({
                    url: this.$http.adornUrl('/transresources/trcar/outPutErrorCause'),
                    method: 'post',
                    data: this.$http.adornData({
                      exceptionList: response.feedBack.exceptionList
                    }),
                    responseType: 'blob'
                  }).then(({data}) => {
                    let fileName = '失败详情'
                    let attribute = `${fileName}.xlsx`
                    this.handleDownloadFile(data, fileName, attribute)
                  })
                }).finally(() => {
                  this.clickFlag2 = true
                });
              }
            }
          })
          if (this.config.fileListType === 'picture-card') {
            this.$refs.upload1.clearFiles()
          } else if (this.config.fileListType === 'text') {
            this.$refs.upload2.clearFiles()
          }
        }
        this.urlImagShow = true
        this.className = 'el-icon-plus'
        this.$store.commit('upload/updateStatus', false)
        this.loading = false
      },
      handleRemove (file) {
        this.fileList = this.fileList.filter(res => {
          return res.uid !== file.uid
        })
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleDownload (file) {
        this.$nextTick(() => {
          if (!this.clickFlag) {
            return;
          }
          this.clickFlag = false
          this.loading = true
          if (this.fileList.length) {
            let filePath = file.url.toString()
            let fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length)
            let attribute = `${fileName}`
            this.$http({
              url: this.$http.adornUrl(`${this.config.downloadUrl}`),
              method: 'post',
              data: this.$http.adornData({
                'filePath': filePath
              }),
              responseType: 'blob'
            }).then(({data}) => {
              this.loading = false
              this.handleDownloadFile(data, fileName, attribute)
            }).finally(() => {
              this.clickFlag = true
            })
          }
        })
      },
      handleDownloadFile (data, fileName, attribute) {
        const link = document.createElement('a')
        let blob = new Blob([data], {type: 'application/octet-stream'})
        if (blob.size === 0) {
          this.$message.error('连接超时')
          return
        }
        // let fileName = new Date().getTime()
        // for IE
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, attribute)
        } else {
          // for Non-IE (chrome, firefox etc.)
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.setAttribute('download', attribute)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      },
      handlePreview (file) {
        this.handleDownload(file)
      },
      handleExceed () {
        this.$message.warning(`每次只能上传${this.config.limit || 5}个文件`)
      },
      handleProgress (event, file, fileList) {
        this.urlImagShow = false
        this.className = 'el-icon-loading'
        this.$store.commit('upload/updateStatus', true)
      },
      handleError (err) {
        console.log(err)
      }
    }
  }
</script>
<style lang="scss">
  .upload-demo{
    /*display: -webkit-box;*/
    ul{
      li{
        width: 300px;
        margin-right: 50px;
        float: left;
      }
    }
  }
  .isHidden {
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 240px;
    height: 178px;
    display: block;
  }
  .v-modal{
    z-index: 2000!important;
  }
</style>

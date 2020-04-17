<!--
<template>
  <el-upload
    class="upload-demo"
    ref="upload"
    v-bind="$attrs"
    :action="this.$http.adornUrl(`${$attrs.loadUrl}?token=${$cookie.get('token')}`)"
    :before-upload="checkUpload"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-success="getResult"
    :on-progress="handleProgress"
    :on-error="handleError"
    :file-list="fileList"
    :limit="5"
    :on-exceed="handleExceed"
    list-type="picture">
    <el-button v-if="$attrs.type !== 'output'" slot="trigger" size="mini" icon="el-icon-upload" type="success" :disabled="$attrs.type === 'details'">{{$attrs.btnTxt ? $attrs.btnTxt : '选择文件'}}</el-button>
    <div v-if="$attrs.type === 'details'" style="width: 80px;height: 40px;position: absolute;top: 0"></div>
    <el-button v-if="$attrs.type !== 'import'" @click="downloadFile" :disabled="noDownload" :loading="loading" type="primary" size="mini">{{$attrs.btnDownTxt ? $attrs.btnDownTxt : '下载'}}</el-button>
    <div v-if="!($attrs.type === 'import' || $attrs.type === 'output')" slot="tip" class="el-upload__tip">{{$attrs.type !== 'details' ? '每次只能上传一个文件' : '点击下载合同附件'}}</div>
  </el-upload>
</template>
<script>
  export default {
    props: {
      value: {
        type: Array
      }
    },
    data () {
      return {
        fileList: [],
        filePath: '',
        noDownload: true,
        newName: '',
        loading: false,
        loadList: []
      }
    },
    watch: {
      value (newVal) {
        this.fileList = newVal.map(res => {
          let loadItem = {
            name: res.name,
            url: require('')
          }
          return loadItem
        })
      }
    },
    computed: {},
    activated () {
      if (this.fileList.length) {
        this.noDownload = false
      }
    },
    methods: {
      init () {
        this.fileList = []
        this.newName = ''
      },
      checkUpload (file) {
        // if (!this.$attrs.owner) {
        //   this.$message.warning('请先选择所属对象')
        //   return false
        // }
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          this.$message.warning('文件不能大于50M')
          return false
        }
        // const ending = file.name.split('.')
        // const endIndex = ending.length - 1
        // if (this.$attrs.type.toString() === '1') {
        //   if (ending[endIndex] && ending[endIndex] !== 'key') {
        //     this.$message.warning('电子章文件类型不正确')
        //     return false
        //   }
        // } else {
        //   if (ending[endIndex] &&  ending[endIndex] !== 'pfx') {
        //     this.$message.warning('证书文件类型不正确')
        //     return false
        //   }
        // }
      },
      handleRemove (file, fileList) {
        this.loadList = fileList
        this.$emit('input', this.loadList)
      },
      handlePreview (file) {
      },
      handleExceed () {
        this.$message.warning('每次只能上传五个文件');
      },
      handleProgress (event, file, fileList) {
      },
      handleError (err) {
        console.log(err)
      },
      getResult (response) {
        if (response.code === 0 && response.file) {
          let loadItem = {
            name: response.file.fileName,
            path: response.file.filePath
          }
          this.loadList.push(loadItem)
          this.$emit('input', this.loadList)
        } else {
          this.$message.error('上传失败');
          this.$refs['upload'].clearFiles()
        }
      },
      downloadFile () {
        this.$nextTick(() => {
          if (this.fileList.length) {
            let filePath = this.fileList[0].path.toString()
            let fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length)
            this.loading = true
            this.$http({
              url: this.$http.adornUrl(`${this.$attrs.downloadUrl}`),
              method: 'get',
              params: this.$http.adornParams({
                'filePath': filePath
              }),
              responseType: 'blob'
            }).then(({data}) => {
              this.loading = false
              const link = document.createElement('a')
              let blob = new Blob([data], {type: 'application/octet-stream'});
              if (blob.size === 0) {
                this.$message.error('文件不存在')
                return
              }
              // let fileName = new Date().getTime()
              // for IE
              if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, fileName);
              } else {
                // for Non-IE (chrome, firefox etc.)
                link.style.display = 'none'
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', fileName)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .upload-demo{
    ul{
      display: flex;
      justify-content: left;
      li{
        width: 120px;
        margin-right: 20px;
      }
    }
  }
  .el-upload__tip{
    margin-top: 0;
    height: 30px;
    line-height: 30px;
    padding-left: 5px;
    color: skyblue;
  }
</style>
-->

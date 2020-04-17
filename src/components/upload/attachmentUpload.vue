<!--
<template>
  <div>
    <el-upload
      v-bind="$attrs"
      :action="this.$http.adornUrl(`${$attrs.loadUrl}?token=${$cookie.get('token')}`)"
      list-type="picture-card"
      :before-upload="checkUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="getResult"
      :on-progress="handleProgress"
      :on-error="handleError"
      :file-list="fileList"
      :limit="5"
      :on-exceed="handleExceed">
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url" alt=""
        >
        <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleDownload(file)"
        >
          <i class="el-icon-download"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
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
    props: {
      value: {
        type: Array
      }
    },
    data () {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        fileList: [],
        loadList: []
      };
    },
    watch: {
      value (newVal) {
        if (newVal) {
          this.fileList = newVal.map(res => {
            let loadItem = {
              name: res.name,
              url: require('')
            }
            return loadItem
          })
        }
      }
    },
    created () {
      console.log(this.value)
    },
    methods: {
      handleRemove (file) {
        this.fileList = this.fileList.filter(res => res.uid !== file.uid)
        this.$emit('input', this.fileList)
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleDownload (file) {
        console.log(file);
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
-->

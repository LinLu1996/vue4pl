<template>
  <el-dialog
    title="上传结果"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%"
    v-loading="loading">
    <div>
      <el-form label-width="60px">
        <el-row>
          <el-col :span="11">
            <div style="height: 100px;line-height:30px;background-color: #3E8EF7;padding-top: 20px">
              <p style="text-align: center;color: #ffffff;margin: 0">
                <i class="el-icon-view" style="font-size: 25px"></i>
                &nbsp;
                <span style="font-size: 20px">
                  {{successNumber ? successNumber : '0' }} 条
                </span>
              </p>
              <p style="text-align: center;color: #ffffff;margin: 0">成功</p>
            </div>
          </el-col>
          <el-col :span="11" :offset="2">
            <div style="height: 100px;line-height:30px;background-color: red;padding-top: 20px">
              <p style="text-align: center;color: #ffffff;margin: 0">
                <i class="el-icon-download" style="font-size: 25px"></i>
                <span style="font-size: 20px">
                  {{falseNumber ? falseNumber : '0' }} 条
                </span>
              </p>
              <p style="text-align: center;color: #ffffff;margin: 0">失败</p>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="falseNumber > 0" type="primary" @click="outPutExcel">导出失败详情</el-button>
      <el-button type="primary" @click="back">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        exceptionList: [],
        successList: [],
        falseNumber: 0,
        successNumber: 0,
        loading: false,
        type: '',
        backType: ''
      }
    },
    methods: {
      init (response, type) {
        this.backType = type
        if (response.code !== 0) {
          this.$message.error(response.msg)
          this.back()
          return
        }
        if (response.filePath && response.filePath !== '') {
          let fileName = response.filePath.substring(response.filePath.lastIndexOf('/') + 1, response.filePath.length)
          let attribute = `${fileName}`
          this.$confirm(`导入成功是否下载导入结果?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('/transresources/trcontract/download'),
              method: 'post',
              data: this.$http.adornData({
                'filePath': response.filePath
              }),
              responseType: 'blob'
            }).then(({data}) => {
              if (data) {
                this.handleDownloadFile(data, attribute)
                this.$router.push({ path: '/trans-resources-car-validation/car-validation' })
              }
            })
          }).catch(() => {
            this.$router.push({ path: '/trans-resources-car-validation/car-validation' })
          })
          this.back()
          return
        }
        if (!response.feedBack.exceptionList || response.feedBack.exceptionList.length === 0) {
          this.successList = response.feedBack.successList
          this.$message.success('导入成功')
          this.back()
          return
        }
        this.visible = true
        // this.type = !type ? '' : type
        this.$nextTick(() => {
          this.exceptionList = response.feedBack.exceptionList
          this.successNumber = response.feedBack.successNumber
          this.successList = response.feedBack.successList
          this.falseNumber = response.feedBack.exceptionList.length
        })
      },
      handleDownloadFile (data, attribute) {
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
      //  报表
      outPutExcel () {
        this.loading = true
        let carrierLines =  this.exceptionList
        let url = '/transresources/trcarrierline/outPutExcel'
        // if (this.type === 'cost') {
        //   url = '/feesettlement/fscarriagestatement/outPutExcel'
        // } else if (this.type === 'certificate') {
        //   url = '/transresources/trroadtransportlicence/outPutExcel'
        // }
        this.$http({
          url: this.$http.adornUrl(url),
          method: 'post',
          data: this.$http.adornData(carrierLines, false),
          responseType: 'blob'
        }).then(({data}) => {
          this.loading = false
          const link = document.createElement('a')
          let blob = new Blob([data], {type: 'application/vnd.ms-excel'});
          let fileName = new Date().getTime()
          // for IE
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, `导入失败详情${fileName}.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `导入失败详情${fileName}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      },
      back () {
        this.visible = false
        this.$emit('refreshDataList', this.successList, this.backType)
      }
    }
  }
</script>

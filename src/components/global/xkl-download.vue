<template>
  <el-button v-if="loading" type="success" size="mini" :loading="true">加载中</el-button>
  <el-button v-else v-bind="$attrs" icon="el-icon-download" type="success" size="mini" @click="outPutExcel()">附件导出</el-button>
</template>

<script>
  export default {
    name: 'xklDownload',
    props: {
      outputConfig: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        dataFrom: {
          id: 0
        },
        loading: false
      }
    },
    watch: {
    },
    created () {
      this.init()
    },
    computed: {
    },
    methods: {
      init () {
      },
      outPutExcel () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl(`${this.outputConfig.outputUrl}`),
          method: 'post',
          data: this.$http.adornData({
            'id': this.outputConfig.id
          }),
          responseType: 'blob'
        }).then(({data}) => {
          this.loading = false
          const link = document.createElement('a')
          let blob = new Blob([data], {type: 'application/vnd.ms-excel'});
          if (blob.size === 0) {
            this.$message.error('准备导出的数据为0条')
            return
          }
          let fileName = this.outputConfig.fileName
          // for IE
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, `${fileName}.zip`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `${fileName}.zip`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      }
    }
  }
</script>
<style lang="scss">
</style>

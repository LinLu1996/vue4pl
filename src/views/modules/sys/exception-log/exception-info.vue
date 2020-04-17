<template>
  <el-dialog
    title="异常信息"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <span>{{exceptionInfo}}</span><br>
    <el-row>
      <el-col :span="24" style="text-align: right;padding-right: 5px">
        <el-button @click="visible = false">返回</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        exceptionInfo: ''
      }
    },
    methods: {
      init (exceptionInfo) {
        this.exceptionInfo = exceptionInfo
        this.visible = true
      }
    }
  }
</script>

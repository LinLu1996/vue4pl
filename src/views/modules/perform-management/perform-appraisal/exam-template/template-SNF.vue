<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    align="center">
    <el-table-column
      prop="name"
      align="center"
      label="考核项目"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="assessmentProjectName"
      align="center"
      label="计算公式"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="assessmentProjectName"
      align="center"
      label="目标"
      show-overflow-tooltip>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    data () {
      return {
        tableData: [{name: '1'}]
      }
    }
  }
</script>

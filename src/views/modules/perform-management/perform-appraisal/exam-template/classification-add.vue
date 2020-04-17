<template>
  <el-dialog
    title="新增考核项"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div class="wrap">
      <el-badge v-for="(item,index) in dataList" :key="index" :value="item.num" :hidden="item.num === 0" class="item">
        <el-button size="small" @click="changeNum(item, 'add')">{{item.name}}</el-button>
      </el-badge>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">关闭</el-button>
      <el-button type="primary" size="small"  @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataList: [],
      addTempDataList: []
    }
  },
  methods: {
    init () {
      this.visible = true
      this.addTempDataList = []
      this.getDataList()
    },
    getDataList () {
      this.dataListLoading = true
      this.dataList = []
      this.$http({
        url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentstandard/assessmentStandard`),
        method: 'post',
        data: this.$http.adornData({
          'page': this.pageIndex,
          'limit': 999,
          'assessmentClassificationLevel': '1'
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.dataList = this.dataList.map(res => {
            res.num = 0
            return res
          })
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.loading = false
      })
    },
    changeNum (item, type) {
      if (type === 'add') {
        item.num ++
        let json = {
          assessmentClassificationName: item.name,
          assessmentClassification: item.id,
          assessmentProjectName: '',
          assessmentProject: '',
          relationEntityList: [{assessmentStandard: '', percentStandard: '', weightScore: '', relationStatus: ''}]
        }
        this.addTempDataList.push(json)
      } else {
        item.num --
      }
      this.$forceUpdate()
    },
    dataFormSubmit () {
      if (!this.addTempDataList.length) {
        this.$message.warning('请至少选择一项')
        return false
      }
      this.$emit('getTempData', this.addTempDataList)
      this.visible = false
    },
    closeForm () {
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/.wrap .item {
    width: 100px;
    margin-top: 10px;
    margin-right: 40px;
    button{
      width: 100px;
    }
  }
</style>

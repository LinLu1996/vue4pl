<template>
  <div class="mod-config">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="导入人">
            <el-input v-model="dataForm.importUserName" placeholder="导入人" maxlength="20" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="text-align: right;padding-right: 5px">
          <el-button v-if="isAuth('transresources:trcarcheckimport:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          <el-button v-if="isAuth('transresources:trcarcheckimport:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      ref="tableList"
      style="width: 100%;"
    >
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="importDate"
        header-align="center"
        align="center"
        label="导入时间"
        min-width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="importUserName"
        header-align="center"
        align="center"
        min-width="180"
        label="导入人"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="qualifiedCount"
        header-align="center"
        align="center"
        min-width="180"
        label="验证合格数"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="unqualifiedCount"
        header-align="center"
        align="center"
        min-width="180"
        label="验证不合格数"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="addCount"
        header-align="center"
        align="center"
        min-width="180"
        label="新增数"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="importType"
        header-align="center"
        align="center"
        min-width="180"
        label="导入形式"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.importType== 0" size="small" type="warning">增量</el-tag>
          <el-tag v-if="scope.row.importType== 1" size="small" type="success">全量</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button style="width: 100px" type="primary" size="small" @click="handleDown(scope.row.importFileUrl, scope.row.importFileName)">
            <icon-svg name="detail" style="vertical-align: middle"></icon-svg>
            下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-row style="display: flex;justify-content: flex-end;margin-top: 20px">
      <el-button @click="handleBack()">关闭</el-button>
    </el-row>
    <!-- 弹窗, 新增 / 编辑 -->
  </div>
</template>

<script>
  import { formatDate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          importUserName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false
      }
    },
    components: {
    },
    activated () {
      this.resetForm()
    },
    methods: {
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trcarcheckimport/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list.length > 0 ? data.page.list.map(item => {
              item.firstCheckDate = item.firstCheckDate ? formatDate(item.firstCheckDate) : null;
              return item
            }) : []
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      handleBack () {
        this.$router.push({
          path: '/trans-resources-car-validation/car-validation'
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      handleDown (filePath, fileName) {
        this.$http({
          url: this.$http.adornUrl('/transresources/trcontract/download'),
          method: 'post',
          data: this.$http.adornData({
            'filePath': filePath
          }),
          responseType: 'blob'
        }).then(({data}) => {
          if (data) {
            this.handleDownloadFile(data, fileName)
          }
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
      resetForm () {
        this.dataForm = {}
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/.el-table__body-wrapper{
    button{
      width: auto!important;
      height: 25px;
      line-height: 25px;
      padding: 0 4px;
      text-align: center;
      background: none;
      color: #3E8EF7;
      border: none;
    }
  }
</style>

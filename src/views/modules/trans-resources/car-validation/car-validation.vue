<template>
  <div class="mod-config"  v-loading="loading">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="车牌号">
            <el-input v-model="dataForm.carNumber" placeholder="车牌号" maxlength="20" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运商">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList" select-type="OPERATION_TYPE" placeholder="承运商"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="首次验证日期">
            <xkl-date-picker style="width: 100%" v-model="firstCheckDate" ></xkl-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="最近冬季验证日期" label-width="140px">
            <xkl-date-picker style="width: 100%" v-model="lastWinnerCheckDate"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最近夏季验证日期" label-width="140px">
            <xkl-date-picker style="width: 100%" v-model="lastSummerCheckDate"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;padding-right: 5px">
          <el-button v-if="isAuth('transresources:trcarcheck:checkList')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          <el-button v-if="isAuth('transresources:trcarcheck:checkList')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('transresources:trcarcheck:trueExport')" type="success" size="mini" icon="el-icon-upload" @click="uploadPageHandle(dataForm.id)">导入</el-button>
            <el-button v-if="isAuth('transresources:trcarcheck:outPutExcel')" type="success" size="mini"  icon="el-icon-download" @click="outPutExcel">导出</el-button>
            <el-button v-if="isAuth('transresources:trcarcheckimport:list')" type="success" size="mini"  icon="el-icon-edit" @click="handleImportRecord">导入记录</el-button>
            <!--<div style="display: inline-block">-->
              <!--<el-upload-->
                <!--:action="urls"-->
                <!--:show-file-list="false"-->
                <!--:before-upload="checkUpload"-->
                <!--:on-change="handleChange"-->
                <!--:on-success="handleAvatarSuccess">-->
                <!--<el-button size="mini" icon="el-icon-upload" type="success">导入</el-button>-->
              <!--</el-upload>-->
            <!--</div>-->
          </el-form-item>
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
      @selection-change="handleSelectionChange">
      <el-table-column
        v-if="selectionVisible"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="carNumber"
        header-align="center"
        align="center"
        label="车牌号"
        width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierName"
        header-align="center"
        align="center"
        label="承运商"
        min-width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="firstCheckDate"
        header-align="center"
        align="center"
        min-width="180"
        label="首次验证日期"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          {{row.firstCheckDate ? $formatDate(row.firstCheckDate) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="lastSummerCheckDate"
        header-align="center"
        align="center"
        min-width="180"
        label="最近夏季验证日期"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          {{row.lastSummerCheckDate ? $formatDate(row.lastSummerCheckDate) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="lastWinnerCheckDate"
        header-align="center"
        align="center"
        min-width="180"
        label="最近冬季验证日期"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          {{row.lastWinnerCheckDate ? $formatDate(row.lastWinnerCheckDate) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        v-if="isAuth('transresources:trcarcheck:listv')"
        header-align="center"
        align="center"
        fixed="right"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('transresources:trcarcheck:listv')" style="width: 100px" type="primary" size="small" @click="handleResult(scope.row.id)">
            <icon-svg name="detail" style="vertical-align: middle"></icon-svg>
            查看验证记录
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
    <!-- 弹窗, 新增 / 编辑 -->
    <upload-page
      v-if="importVisible"
      ref="uploadPage"
      title="车辆验证导入"
      fileName="车辆验证导入模板.xlsx"
      uploadUrl="/transresources/trcarcheck/export"
      submitUrl="/transresources/trcarcheck/trueExport"
      :hasImportType="true"
      :acceptType="['xls', 'xlsx']"
      @refreshDataList="getDataList"></upload-page>
    <validation-record v-if="resultVisible" ref="resultUpdate" @refreshDataList="getDataList"></validation-record>
    <upload-road-feedback v-if="uploadRoadFeedbackVisible" ref="uploadRoadFeedback" @refreshDataList="getSearchDataList"></upload-road-feedback>
  </div>
</template>

<script>
  import { toUnderScore, abbreviate, formatDate } from '@/utils'
  import validationRecord from './validation-record'
  import uploadPage from '@/components/upload/upload-page'
  import UploadRoadFeedback from '../carrier/upload-road-feedback'
  export default {
    data () {
      return {
        dataForm: {
          carNumber: '',
          carrierId: '',
          carrierName: '',
          beforeFirstCheck: '',
          afterFirstCheck: '',
          beforeLastSummerCheck: '',
          afterLastSummerCheck: '',
          beforeLastWinnerCheck: '',
          afterLastWinnerCheck: ''
        },
        importVisible: false,
        firstCheckDate: [],
        lastSummerCheckDate: [],
        lastWinnerCheckDate: [],
        dataList: [],
        isShowDetails: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        checkVisible: false,
        resultVisible: false,
        dataListSelections: [],
        sort: {},
        selectionVisible: false,
        urls: '',
        uploadRoadFeedbackVisible: false,
        loading: false
      }
    },
    components: {
      validationRecord,
      UploadRoadFeedback,
      uploadPage
    },
    activated () {
      this.urls = this.$http.adornUrl(`/transresources/trcarcheck/export?token=${this.$cookie.get('token')}`)
      this.selectionVisible = false
      this.dataForm.carrierId = this.$route.query.id ? this.$route.query.id : ''
      this.pageIndex = 1
      this.pageSize = 10
      this.getDataList()
    },
    methods: {
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        if (this.firstCheckDate) {
          this.dataForm.beforeFirstCheck = new Date(this.firstCheckDate[0])
          this.dataForm.afterFirstCheck = new Date(new Date(this.firstCheckDate[1]).getTime() + 24 * 3600 * 1000)
        } else {
          this.dataForm.beforeFirstCheck = ''
          this.dataForm.afterFirstCheck = ''
        }
        if (this.lastSummerCheckDate) {
          this.dataForm.beforeLastSummerCheck = new Date(this.lastSummerCheckDate[0])
          this.dataForm.afterLastSummerCheck = new Date(new Date(this.lastSummerCheckDate[1]).getTime() + 24 * 3600 * 1000)
        } else {
          this.dataForm.beforeLastSummerCheck = ''
          this.dataForm.afterLastSummerCheck = ''
        }
        if (this.lastWinnerCheckDate) {
          this.dataForm.beforeLastWinnerCheck = new Date(this.lastWinnerCheckDate[0])
          this.dataForm.afterLastWinnerCheck = new Date(new Date(this.lastWinnerCheckDate[1]).getTime() + 24 * 3600 * 1000)
        } else {
          this.dataForm.beforeLastWinnerCheck = ''
          this.dataForm.afterLastWinnerCheck = ''
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trcarcheck/checkList'),
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
              item.lastSummerCheckDate = item.lastSummerCheckDate ? formatDate(item.lastSummerCheckDate) : null;
              item.lastWinnerCheckDate = item.lastWinnerCheckDate ? formatDate(item.lastWinnerCheckDate) : null
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
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        this.$router.push({
          path: '/car/car-add-or-update',
          query: {
            id: id
          }
        })
      },
      // 新增 / 编辑
      check (id, scope) {
        this.checkVisible = true
        this.$nextTick(() => {
          this.$refs.check.init(id, scope)
        })
      },
      // 验证结果
      handleResult (id) {
        this.resultVisible = true
        this.$nextTick(() => {
          this.$refs.resultUpdate.init(id, this.values)
        })
      },
      // 查看导入列表
      handleImportRecord () {
        this.$router.push({
          path: '/trans-resources-car-validation/import-record-list'
        })
      },
      // 导出报表
      outPutExcel () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trcarcheck/outPutExcel'),
          method: 'post',
          data: this.$http.adornData({
            ...this.dataForm
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
          let fileName = new Date().getTime()
          // for IE
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, `车辆验证导出${fileName}.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `车辆验证导出${fileName}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      },
      uploadPageHandle (id) {
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPage.init(id)
        })
      },
      showDetails (id) {
        this.isShowDetails = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(id)
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
      // 维保记录
      handleCarMaintenance (id) {
        this.$router.push({
          path: '/carMaintenance',
          query: {
            id: id
          }
        })
      },
      resetForm () {
        this.dataForm = {}
        this.firstCheckDate = []
        this.lastSummerCheckDate = []
        this.lastWinnerCheckDate = []
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      },
      changeSort (sortRule) {
        const column = toUnderScore(sortRule.prop)
        const order = abbreviate(sortRule.order)
        this.dataForm.sort = {
          column: column,
          order: order
        }
        this.getDataList()
      },
      handleSelectionChange (val) {
        this.dataListSelections = val
      },
      checkUpload (file) {
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          this.$message.warning('文件不能大于50M')
          return false
        }
      },
      handleChange (file) {
        this.dataListLoading = true
        if (file.status === 'success') {
          this.dataListLoading = true
        }
      },
      handleAvatarSuccess (response) {
        this.uploadRoadFeedbackVisible = true
        this.$nextTick(() => {
          this.$refs.uploadRoadFeedback.init(response)
        })
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

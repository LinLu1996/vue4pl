<template>
  <div class="mod-config" v-loading="loading">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="考核月度">
            <xkl-date-picker v-model="dataForm.kpiMonth" type="month" placeholder="选择月份"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="text-align: right;padding-right: 5px">
          <el-form-item>
            <el-button v-if="isAuth('performancemanagement:kpidepart:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button v-if="isAuth('performancemanagement:kpidepart:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('performancemanagement:kpidepart:save')" icon="el-icon-circle-plus-outline" size="mini" style="background: #3698ce;color: #ffffff" @click="addOrUpdateHandle()">新增</el-button>
            <!--<el-button v-if="isAuth('performancemanagement:kpidepart:delete')" type="danger" size="mini" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">-->
              <!--<icon-svg name="批量删除" style="vertical-align: middle"></icon-svg>-->
              <!--批量删除-->
            <!--</el-button>-->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template>
      <el-table
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;"
        @row-dblclick="info"
        @selection-change="selectionChangeHandle">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="60">
        </el-table-column>
        <el-table-column
          type="index"
          width="60"
          align="center"
          label="No.">
        </el-table-column>
        <el-table-column
          prop="kpiMonth"
          min-width="120"
          align="center"
          label="考核月度">
        </el-table-column>
        <el-table-column
          prop="reachPunctualRate"
          align="center"
          width="180"
          show-overflow-tooltip
          label="到货准时率">
          <template slot-scope="scope">
            {{scope.row.reachPunctualRate}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="damageRateDetail"
          align="center"
          width="180"
          show-overflow-tooltip
          label="破损率(细盒)">
          <template slot-scope="scope">
            {{scope.row.damageRateDetail}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="damageRateBook"
          align="center"
          width="180"
          show-overflow-tooltip
          label="破损率(订单行)">
          <template slot-scope="scope">
            {{scope.row.damageRateBook}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawalReturnRate"
          align="center"
          width="180"
          show-overflow-tooltip
          label="提退货返回及时率">
          <template slot-scope="scope">
            {{scope.row.withdrawalReturnRate}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="receiptReturnRate"
          align="center"
          width="180"
          show-overflow-tooltip
          label="回单返回及时率">
          <template slot-scope="scope">
            {{scope.row.receiptReturnRate}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="receiptUploadRate"
          align="center"
          width="180"
          show-overflow-tooltip
          label="回单上传及时率">
          <template slot-scope="scope">
            {{scope.row.receiptUploadRate}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="signRate"
          align="center"
          width="180"
          show-overflow-tooltip
          label="签收信息及时率">
          <template slot-scope="scope">
            {{scope.row.signRate}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="rejectionReportRate"
          align="center"
          width="180"
          show-overflow-tooltip
          label="拒收上报及时率">
          <template slot-scope="scope">
            {{scope.row.rejectionReportRate}}%
          </template>
        </el-table-column>
        <el-table-column
          v-if="isAuth('performancemanagement:tkpiassessmentrecord:updateRecord') || isAuth('performancemanagement:tkpiassessmentrecord:delete') || isAuth('performancemanagement:tkpiassessmentrecord:editInfo')"
          header-align="center"
          align="center"
          fixed="right"
          width="160"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('performancemanagement:kpidepart:info')" type="primary" size="mini" @click="info(scope.row.id)">
              <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
              详情</el-button>
            <el-button v-if="isAuth('performancemanagement:kpidepart:delete')" type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
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
    <add-departmental-kpi v-if="addDepartmentalKpiVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-departmental-kpi>
    <departmental-kpi-info v-if="departmentalKpiInfoVisible" ref="info"></departmental-kpi-info>
  </div>
</template>

<script>
  import XklDatePicker from '../../../../components/global/xkl-datePicker';
  import { formatDate } from '@/utils'
  import AddDepartmentalKpi from './add-departmental-kpi'
  import DepartmentalKpiInfo from './departmental-kpi-info'
  export default {
    data () {
      return {
        loading: false,
        dataForm: {
          kpiMonth: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addDepartmentalKpiVisible: false,
        departmentalKpiInfoVisible: false
      }
    },
    components: {
      XklDatePicker,
      AddDepartmentalKpi,
      DepartmentalKpiInfo
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
          url: this.$http.adornUrl('/performancemanagement/kpidepart/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'kpiMonth': this.dataForm.kpiMonth ? formatDate(this.dataForm.kpiMonth, 'Month').split('-').join('') : '',
            'carrierId': this.dataForm.carrierId,
            'ownerId': this.dataForm.ownerId,
            'transportType': this.dataForm.transportType
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list && data.page.list.length ? data.page.list.map(item => {
              item.kpiMonth = this.$formatDate(item.kpiMonth, 'Month')
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        this.addDepartmentalKpiVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init()
        })
      },
      // 新增 / 编辑
      info (row) {
        let id = row.id ? row.id : row;
        this.departmentalKpiInfoVisible = true
        this.$nextTick(() => {
          this.$refs.info.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除这条数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/performancemanagement/kpidepart/delete`),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  if (this.dataList.length === 1) {
                    this.pageIndex = this.pageIndex === 1 ? 1 : this.pageIndex - 1
                  }
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      resetForm () {
        this.dataForm = {}
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      },
      handleClick (tab, event) {
      }
    }
  }
</script>
<style lang="scss">
  .el-table__body-wrapper{
    button{
      width: auto;
      height: 25px;
      line-height: 25px;
      padding: 0;
      text-align: center;
      background: none;
      color: #3E8EF7;
      border: none;
    }
  }
</style>

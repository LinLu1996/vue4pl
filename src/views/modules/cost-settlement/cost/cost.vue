<template>
  <div class="mod-config">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="对账单号">
            <el-input v-model="dataForm.statementNo" maxlength="100" placeholder="对账单号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="对账账期">
            <el-date-picker
              v-model="dataForm.date"
              type="monthrange"
              style="width: 100%;"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运商">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" labelType="carrierName" placeholder="承运商名称" linkage="/transresources/trcarrier/findList"></xkl-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select style="width: 100%" v-model="dataForm.status" placeholder="状态" clearable>
              <el-option value="0" label="待审核"></el-option>
<!--              <el-option value="1" label="审核中"></el-option>-->
              <el-option value="2" label="已审核"></el-option>
              <!--<el-option value="3" label="已驳回"></el-option>-->
              <el-option value="4" label="已作废"></el-option>
              <el-option value="5" label="已开票"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-form-item>
            <el-button v-if="isAuth('feesettlement:fscarriagestatement:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button v-if="isAuth('feesettlement:fscarriagestatement:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('feesettlement:fscarriagestatement:imporFsCarriageStatement')" type="success" size="mini" icon="el-icon-upload" @click="ticketImportHandle(dataForm.id)">导入</el-button>
            <el-button v-if="isAuth('feesettlement:fscarriagestatement:audit')" type="success" size="mini" :disabled="currentStatus !== 0 && currentStatus !== 3" @click="handleExamine(2)">
              <icon-svg name="审核" style="vertical-align: middle"></icon-svg>
              审核</el-button>
            <el-button v-if="isAuth('feesettlement:fscarriagestatement:theAudit')" type="success" size="mini" @click="handleExamine(0)" :disabled="currentStatus !== 2">
              <icon-svg name="反审核" style="vertical-align: middle"></icon-svg>
              反审核</el-button>
            <el-button v-if="isAuth('feesettlement:fscarriagestatement:invalid')" type="danger" size="mini" @click="handleExamine(4)">
              <icon-svg name="作废" style="vertical-align: middle"></icon-svg>
              作废</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template>
      <el-table
        ref="elTable"
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        @select-all="selectAll"
        @row-dblclick="dbHandleDetail"
        style="width: 100%;">
        <el-table-column
          type="selection"
          width="60"
          align="center"
          label="No."
          :selectable="selectable">
        </el-table-column>
        <el-table-column
          type="index"
          width="60"
          align="center"
          label="No.">
        </el-table-column>
        <el-table-column
          prop="statementNo"
          header-align="center"
          align="center"
          label="对账单号"
          width="220"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="statementMonth"
          align="center"
          label="对账账期"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="carrierName"
          align="center"
          label="承运商"
          width="200"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="statusName"
          align="center"
          label="状态"
          width="100"
          show-overflow-tooltip>
          <template slot-scope="{ row }">
            <el-tag v-if="row.status === 0" size="mini">待审核</el-tag>
            <el-tag v-if="row.status === 1" size="mini" type="danger">审核中</el-tag>
            <el-tag v-if="row.status === 2" size="mini" type="success">已审核</el-tag>
            <el-tag v-if="row.status === 3" size="mini" type="info">已驳回</el-tag>
            <el-tag v-if="row.status === 4" size="mini" type="info">已作废</el-tag>
            <el-tag v-if="row.status === 5" size="mini" type="info">已开票</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalSum"
          align="center"
          label="总件数"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalMoney"
          align="center"
          label="总金额"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalCarriageAmount"
          align="center"
          label="运费（不含税）"
          width="160"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="totalCarriageAmtFax"
          align="center"
          label="运费（含税）"
          width="160"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="orderOutlay"
          align="center"
          label="订单服务费"
          width="160"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-input-number v-if="scope.row.isEdit===true" :min="0" :max="99999999" v-model="scope.row.orderOutlay" :precision="5" :step="0.1" size="mini"></el-input-number>
            <span v-else>{{scope.row.orderOutlay}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="specialOutlay"
          align="center"
          label="特殊费用"
          width="160"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input-number v-if="scope.row.isEdit===true" :min="0" :max="99999999" v-model="scope.row.specialOutlay" :precision="5" :step="0.1" size="mini"></el-input-number>
            <span v-else>{{scope.row.specialOutlay}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="isAuth('feesettlement:fscarriagestatement:update') || isAuth('feesettlement:fscarriagestmdetails:listByStmId')"
          width="220"
          header-align="center"
          align="center"
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('feesettlement:fscarriagestatement:update')" v-show="!scope.row.isEdit" type="primary" size="mini" @click="handleEditRow(scope)">
              <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
              编辑</el-button>
            <div v-show="scope.row.isEdit" style="display: inline-block;">
              <el-button type="primary" size="mini" @click="handleStatusCancel(scope)">
                关闭</el-button>
              <el-button type="primary" size="mini" @click="editSubmit(scope.row)">
                确定</el-button>
            </div>
            <el-button v-if="isAuth('feesettlement:fscarriagestmdetails:listByStmId')" size="mini" type="primary" @click="handleDetail(scope.row.id)">
              <icon-svg name="明细" style="vertical-align: middle"></icon-svg>
              查看对账明细</el-button>
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
    <cost-add-or-update v-if="detailVisible" ref="detailUpdate" @refreshDataList="getDataList"></cost-add-or-update>
    <cost-upload v-if="importVisible" ref="importUpdate" @refreshDataList="getDataList"></cost-upload>
    <submit-approval ref="submitApproval" v-if="submitApprovalVisible" @refreshDataList="getDataList"></submit-approval>
  </div>
</template>

<script>
  import { formatDate } from '@/utils';
  import CostAddOrUpdate from './cost-add-or-update'
  import uploadPage from '@/components/upload/upload-page'
  import CostUpload from './cost-upload';
  import SubmitApproval from '../../sys/audit/submit_approval'
  export default {
    data () {
      return {
        dataForm: {
          statementNo: '',
          date: [],
          status: '',
          carrierId: ''
        },
        dataList: [
          {
          }
        ],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        selectionDataList: [],
        detailVisible: false,
        importVisible: false,
        submitApprovalVisible: false,
        currentStatus: ''
      }
    },
    components: {
      CostUpload,
      CostAddOrUpdate,
      uploadPage,
      SubmitApproval
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
          url: this.$http.adornUrl('/feesettlement/fscarriagestatement/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'statementNo': this.dataForm.statementNo,
            'status': this.dataForm.status,
            'carrierId': this.dataForm.carrierId,
            'begindate': this.dataForm.date && this.dataForm.date.length > 0 ? formatDate(this.dataForm.date[0], 'Month') : undefined,
            'enddate': this.dataForm.date && this.dataForm.date.length > 0 ? formatDate(this.dataForm.date[1], 'Month') : undefined
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.dataList = this.dataList.map(res => {
              if (res.statementMonth) {
                res.statementMonth = this.$formatDate(res.statementMonth, 'Month')
              }
              return res
            })
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
      handleStatusCancel (scope) {
        scope.row.isEdit = false
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      selectAll () {
        this.selectionDataList = this.selectionDataList.filter(res => res.status === this.currentStatus)
      },
      selectable (row) {
        if (row.status === 1 || row.status === 4) {
          return false
        }
        if (this.selectionDataList.length && row.status !== this.currentStatus) {
          return false
        }
        return true
      },
      // 多选
      selectionChangeHandle (val) {
        if (val.length) {
          this.currentStatus = val[0].status
        } else {
          this.currentStatus = ''
        }
        this.selectionDataList = val
      },
      // 导入
      ticketImportHandle (id) {
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.importUpdate.init(id)
        })
      },
      // 审核
      submitApproval (id) {
        if (!this.selectionDataList.length) {
          this.$message({
            type: 'warning',
            message: '请至少选择一条对账单'
          })
          return false
        }
        let ids = this.selectionDataList.map(item => {
          return item.id
        })
        this.submitApprovalVisible = true
        this.$nextTick(() => {
          this.$refs.submitApproval.init(ids, 'statement')
        })
      },
      // 审核
      handleExamine (val) {
        if (!this.selectionDataList.length) {
          this.$message({
            type: 'warning',
            message: '请至少选择一条对账单'
          })
          return false
        }
        let ids = this.selectionDataList.map(item => {
          return item.id
        })
        let carrierNames = this.selectionDataList.map(item => {
          return item.carrierName
        })
        let statementMonth = this.selectionDataList.map(item => {
          return item.statementMonth
        })
        this.$confirm(`承运商：${carrierNames} <br/> 对账账期：${statementMonth}`, `确定${val === 2 ? '审核' : val === 0 ? '反审核' : val === 4 ? '作废' : ''}该对账单？`, {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          const type = val === 2 ? 'audit' : val === 0 ? 'theAudit' : val === 4 ? 'invalid' : ''
          this.$http({
            url: this.$http.adornUrl(`/feesettlement/fscarriagestatement/${type}`),
            method: 'post',
            data: this.$http.adornData({
              statementIds: ids,
              status: val
            }, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message.success('操作成功')
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      // 编辑
      handleEditRow (scope) {
        const row = scope.row
        if (row.status !== 0) {
          this.$message({
            type: 'warning',
            message: '该数据不能编辑'
          })
          return
        }
        this.$set(row, 'isEdit', true)
      },
      toEdit (row) {
        this.$set(row, 'isEdit', true);
      },
      // 保存编辑
      editSubmit (row) {
        row.isEdit = false
        this.$http({
          url: this.$http.adornUrl('/feesettlement/fscarriagestatement/update'),
          method: 'post',
          data: this.$http.adornData({
            'id': row.id,
            'orderOutlay': row.orderOutlay,
            'specialOutlay': row.specialOutlay
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.detailUpdate.init(id)
        })
      },
      uploadPageHandle (id) {
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPage.init(id)
        })
      },
      // 查看明细
      handleDetail (id) {
        this.$router.push({
          path: '/cost-settlement-cost/cost/cost-detail',
          query: {
            id: id
          }
        })
      },
      // 双击查看明细
      dbHandleDetail (row) {
        this.$router.push({
          path: '/cost-settlement-cost/cost/cost-detail',
          query: {
            id: row.id
          }
        })
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
<style lang="scss">
  .el-month-table td .cell {
    width: 60px;
    height: 36px;
    display: block;
    line-height: 36px;
    color: #606266;
    margin: 0 auto;
    border-radius: 18px;
  }
  .el-month-table td.end-date .cell, .el-month-table td.start-date .cell {
    color: #fff;
    background-color: #409eff;
  }
</style>

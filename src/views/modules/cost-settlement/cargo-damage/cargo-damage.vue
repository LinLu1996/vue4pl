<template>
  <div class="mod-config">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="货损单号">
            <el-input v-model="dataForm.cargoDamageNo" placeholder="货损单号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="货损账期">
            <xkl-date-picker v-model="dataForm.date" type="monthrange" placeholder="货损账期"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运商">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" keyType="carrierId" labelType="carrierName" linkage="/transresources/trcarrier/findList " placeholder="承运商名称"></xkl-select>
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
        <el-col :span="16" style="text-align: right;padding-right: 5px">
          <el-form-item>
            <el-button v-if="isAuth('feesettlement:fscargodamage:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button v-if="isAuth('feesettlement:fscargodamage:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('feesettlement:fscargodamage:export')" icon="el-icon-circle-plus-outline" @click="uploadPageHandle(dataForm.id)" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
            <el-button v-if="isAuth('feesettlement:fscargodamage:updateStatusA')" type="success" size="mini" :disabled="currentStatus !== 0 && currentStatus !== 3" @click="toORBackExamine(2)">
              <icon-svg name="审核" style="vertical-align: middle"></icon-svg>
              审核</el-button>
            <el-button v-if="isAuth('feesettlement:fscargodamage:updateStatusT')" type="success" size="mini" :disabled="currentStatus !== 2" @click="toORBackExamine(0)">
              <icon-svg name="反审核" style="vertical-align: middle"></icon-svg>
              反审核</el-button>
            <el-button v-if="isAuth('feesettlement:fscargodamage:updateStatusI')" type="danger" size="mini" @click="toORBackExamine(4)">
              <icon-svg name="作废" style="vertical-align: middle"></icon-svg>
              作废</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;"
      @selection-change="selectionChangeHandle"
      @row-dblclick="dbShowDetails"
      @select-all="selectAll">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="60"
        :selectable="selectable">
      </el-table-column>
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="cargoDamageNo"
        header-align="center"
        align="center"
        label="货损单号"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cargoDamageMonth"
        header-align="center"
        align="center"
        label="货损账期"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierName"
        header-align="center"
        align="center"
        label="承运商"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态"
        width="120"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-tag v-if="row.status === 0" size="mini">待审核</el-tag>
          <el-tag v-if="row.status === 1" size="mini" type="danger">审核中</el-tag>
          <el-tag v-if="row.status === 2" size="mini" type="success">已审核</el-tag>
          <el-tag v-if="row.status === 3" size="mini" type="info">已驳回</el-tag>
          <el-tag v-if="row.status === 4" size="mini" type="info">已作废</el-tag>
          <el-tag v-if="row.status === 5" size="mini" type="success">已开票</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalDamageAmount"
        header-align="center"
        align="center"
        width="200"
        label="破损总金额（元）"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注信息"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="isAuth('feesettlement:fscargodamage:info')"
        header-align="center"
        align="center"
        fixed="right"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('feesettlement:fscargodamage:info')" type="warning" size="small" @click="showDetails(scope.row.id, scope.row.status)">
            <icon-svg name="明细" style="vertical-align: middle"></icon-svg>
            查看委托方明细</el-button>
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
    <upload-page
      ref="uploadPage"
      title="货损单导入"
      fileName="货损单导入模板.xlsx"
      uploadUrl="/feesettlement/fscargodamage/export"
      submitUrl="/feesettlement/fscargodamage/trueExport"
      :acceptType="['xls', 'xlsx']"
      @refreshDataList="getDataList"></upload-page>
    <!-- 导入弹窗 -->
    <!--<ticket-import v-if="importVisible" ref="ticketImport" @refreshDataList="getDataList"></ticket-import>-->
    <!-- 详情弹窗 -->
    <!--<delegate-info  v-if="delegateInfoVisible" ref="delegateInfo"></delegate-info>-->
    <cargo-upload ref="addPage" v-if="importVisible" @refreshDataList="getDataList"></cargo-upload>
    <submit-approval ref="submitApproval" v-if="submitApprovalVisible" @refreshDataList="getDataList"></submit-approval>
  </div>
</template>

<script>
  // import TicketImport  from './ticket-import'
  import { formatDate } from '@/utils';
  import CargoUpload from './cargo-upload'
  import uploadPage from '@/components/upload/upload-page'
  import SubmitApproval from '../../sys/audit/submit_approval'
  export default {
    data () {
      return {
        dataForm: {
          carrierId: '',
          cargoDamageNo: '',
          status: '',
          date: []
        },
        dataList: [],
        selectionDataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        importVisible: false,
        delegateInfoVisible: false,
        dialogVisible: false,
        currentStatus: '',
        submitApprovalVisible: false
      }
    },
    components: {
      CargoUpload,
      SubmitApproval,
      uploadPage
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
          url: this.$http.adornUrl('/feesettlement/fscargodamage/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm,
            'beforeTime': this.dataForm.date && this.dataForm.date.length > 0 ? formatDate(this.dataForm.date[0], 'Month') : undefined,
            'afterTime': this.dataForm.date && this.dataForm.date.length > 0 ? formatDate(this.dataForm.date[1], 'Month') : undefined
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.dataList = this.dataList.map(res => {
              if (res.cargoDamageMonth) {
                res.cargoDamageMonth = this.$formatDate(res.cargoDamageMonth, 'Month')
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
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      selectionChangeHandle (val) {
        if (val.length) {
          this.currentStatus = val[0].status
        } else {
          this.currentStatus = ''
        }
        this.selectionDataList = val
      },
      selectAll () {
        this.selectionDataList = this.selectionDataList.filter(res => res.status === this.currentStatus)
      },
      selectable (row) {
        if (row.status === 1 || row.status === 4 || row.status === 5) {
          return false
        }
        if (this.selectionDataList.length && row.status !== this.currentStatus) {
          return false
        }
        return true
      },
      toORBackExamine (status) {
        if (!this.selectionDataList.length) {
          this.$message({
            type: 'warning',
            message: '请至少选择一条货损单'
          })
          return false
        }
        let ids = this.selectionDataList.map(item => {
          return item.id
        })
        let carrierNames = this.selectionDataList.map(item => {
          return item.carrierName
        })
        let cargoDamageMonth = this.selectionDataList.map(item => {
          return item.cargoDamageMonth
        })
        this.$confirm(`承运商：${carrierNames} <br/> 货损账期：${cargoDamageMonth}`, `确定${status === 2 ? '审核' : status === 0 ? '反审核' : status === 4 ? '作废' : ''}该货损单？`, {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/feesettlement/fscargodamage/updateStatus'),
            method: 'post',
            data: this.$http.adornData({
              ids,
              fsCargoDamages: this.selectionDataList,
              status: status
            }, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: `操作成功`,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      addOrUpdateHandle (id) {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 审核
      submitApproval (id) {
        if (!this.selectionDataList.length) {
          this.$message({
            type: 'warning',
            message: '请至少选择一条货损单'
          })
          return false
        }
        let ids = this.selectionDataList.map(item => {
          return item.id
        })
        this.submitApprovalVisible = true
        this.$nextTick(() => {
          this.$refs.submitApproval.init(ids, 'damage')
        })
      },
      uploadPageHandle (id) {
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.addPage.init(id)
        })
      },
      showDetails (id, status) {
        this.$router.push({
          path: '/cost-settlement/cargo-damage/shipper-details',
          query: {
            id: id,
            status: status
          }
        })
      },
      // 双击查看详情
      dbShowDetails (row) {
        this.$router.push({
          path: '/cost-settlement/cargo-damage/shipper-details',
          query: {
            id: row.id,
            status: row.status
          }
        })
      },
      // 新增 / 编辑
      ticketImportHandle (id) {
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.ticketImport.init(id)
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

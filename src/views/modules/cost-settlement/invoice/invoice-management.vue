<template>
  <div class="mod-config">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="开票单号">
            <el-input v-model="dataForm.invoiceNo" maxlength="100" placeholder="开票单号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开票时间">
            <xkl-date-picker v-model="dataForm.date" placeholder="开票时间"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运商">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" labelType="carrierName" placeholder="承运商名称" linkage="/transresources/trcarrier/noPowerList"></xkl-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="对账账期">
            <el-date-picker
              v-model="dataForm.invoiceMonth"
              type="month"
              style="width: 100%"
              placeholder="请选择">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运输方式">
            <xkl-select style="width: 100%" v-model="dataForm.transportMethod" select-type="TRANSPORT_TYPE" placeholder="运输方式"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select style="width: 100%" v-model="dataForm.status" placeholder="状态" clearable>
              <el-option value="0" label="待审核"></el-option>
<!--              <el-option value="1" label="审核中"></el-option>-->
              <el-option value="2" label="已审核"></el-option>
              <!--<el-option value="3" label="已驳回"></el-option>-->
              <el-option value="4" label="已作废"></el-option>
              <el-option value="5" label="部分付款"></el-option>
              <el-option value="6" label="已完成"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: right;">
          <el-form-item>
            <el-button v-if="isAuth('feesettlement:tfsinvoice:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button v-if="isAuth('feesettlement:tfsinvoice:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('feesettlement:tfsinvoice:save')" size="mini" icon="el-icon-circle-plus-outline" style="background: #3698ce;color: #ffffff" @click="addOrUpdateHandle()">
              新增</el-button>
            <el-button v-if="isAuth('feesettlement:tfsinvoice:audit')" type="success" size="mini" :disabled="currentStatus === 1 || this.selectionDataList.length!=1"
                       @click="handleExamine()">
              <icon-svg name="审核" style="vertical-align: middle"></icon-svg>
              审核</el-button>
            <el-button v-if="isAuth('feesettlement:tfsinvoice:theAudit')" type="success" size="mini" @click="handleExamineOrVoid(1)"
                       :disabled="currentStatus !== 2 || !isSome">
              <icon-svg name="反审核" style="vertical-align: middle"></icon-svg>
              反审核</el-button>
            <el-button v-if="isAuth('feesettlement:tfsinvoice:exportFsInvoice')" type="success" size="mini"  icon="el-icon-download" @click="outPutExcel"
                       :disabled="this.selectionDataList.length!=1"
            >导出</el-button>
            <el-button v-if="isAuth('feesettlement:tfsinvoice:invalid')" type="danger" size="mini" @click="handleExamineOrVoid(2)"
                       >
              <icon-svg name="作废" style="vertical-align: middle"></icon-svg>
              作废</el-button>
            <el-button v-if="isAuth('feesettlement:tfsinvoice:paymentAmount')" type="success" :disabled="this.selectionDataList.length!=1" size="mini" @click="handleWriteOff()">
              <icon-svg name="付款核销" style="vertical-align: middle"></icon-svg>
              付款核销</el-button>
            <el-button v-if="isAuth('feesettlement:tfsinvoice:paymentAmount')" type="success" :disabled="this.selectionDataList.length===0 || currentStatus !== 2 && currentStatus !== 5" size="mini" @click="handleTimeSelect()">
              <icon-svg name="付款核销" style="vertical-align: middle"></icon-svg>
              批量付款核销</el-button>
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
        @row-dblclick="dbShowDetails"
        style="width: 100%;">
        <el-table-column
          type="selection"
          width="60"
          align="center"
          :selectable="selectable">
        </el-table-column>
        <el-table-column
          type="index"
          width="60"
          align="center"
          label="No.">
        </el-table-column>
        <el-table-column
          prop="invoiceNo"
          header-align="center"
          align="center"
          label="开票单号"
          min-width="170"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="askInvoiceApplyDtm"
          align="center"
          label="开票申请时间"
          width="140"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            {{row.askInvoiceApplyDtm ? $formatDate(row.askInvoiceApplyDtm, 'Second') : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="askInvoiceDtm"
          align="center"
          label="开票时间"
          width="120"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            {{row.askInvoiceDtm ? $formatDate(row.askInvoiceDtm, 'Second') : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="askInvoiceAmount"
          align="center"
          label="开票金额"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="taxlessAmount"
          align="center"
          label="无税金额"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="carrierName"
          align="center"
          label="承运商"
          min-width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="status"
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
            <el-tag v-if="row.status === 5" size="mini" type="info">部分付款</el-tag>
            <el-tag v-if="row.status === 6" size="mini" type="info">已完成</el-tag>
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="productName"-->
          <!--align="center"-->
          <!--label="运输产品"-->
          <!--width="160"-->
          <!--show-overflow-tooltip>-->
        <!--</el-table-column>-->
        <el-table-column
          prop="invoiceMonth"
          align="center"
          label="对账账期"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="latestPaymenttime"
          align="center"
          label="最晚付款时间"
          width="200"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            {{row.latestPaymenttime ? $formatDate(row.latestPaymenttime, 'Second') : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="transportMethodName"
          align="center"
          label="运输方式"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serviceMethodName"
          align="center"
          label="服务方式"
          width="200"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          v-if="isAuth('feesettlement:tfsinvoice:update') || isAuth('feesettlement:tfsinvoice:info')"
          width="180"
          header-align="center"
          align="center"
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('feesettlement:tfsinvoice:update')" type="primary" size="mini"
                       @click="addOrUpdateHandle(scope)"
            >
              <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
              编辑</el-button>
            <el-button v-if="isAuth('feesettlement:tfsinvoice:info')" type="warning" size="mini" @click="showDetails(scope.row.id)"
            >
              <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
              详情
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
    <invoice-time-select v-if="timeSelectVisible" ref="timeSelect" @getTime="handleBatchWriteOff"></invoice-time-select>
    <!--<cost-upload v-if="importVisible" ref="importUpdate" @refreshDataList="getDataList"></cost-upload>-->
  </div>
</template>

<script>
  import { formatDate } from '@/utils';
  import XklSelect from '../../../../components/global/xkl-select';
  import InvoiceTimeSelect from './invoice-time-select'
  export default {
    data () {
      return {
        dataForm: {
          invoiceNo: '',
          carrierId: '',
          status: '',
          invoiceMonth: '',
          transportMethod: '',
          date: []
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        selectionDataList: [],
        detailVisible: false,
        importVisible: false,
        currentStatus: null,
        isSome: true,
        timeSelectVisible: false
      }
    },
    components: {
      XklSelect,
      InvoiceTimeSelect
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
          url: this.$http.adornUrl('/feesettlement/tfsinvoice/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'invoiceNo': this.dataForm.invoiceNo,
            'carrierId': this.dataForm.carrierId,
            'status': this.dataForm.status,
            'transportMethod': this.dataForm.transportMethod,
            'invoiceMonth': this.dataForm.invoiceMonth && formatDate(this.dataForm.invoiceMonth, 'Month'),
            'begindate': this.dataForm.date && this.dataForm.date.length > 0 ? formatDate(this.dataForm.date[0]) : undefined,
            'enddate': this.dataForm.date && this.dataForm.date.length > 0 ? formatDate(this.dataForm.date[1]) : undefined
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.dataList = this.dataList.map(res => {
              if (res.invoiceMonth) {
                res.invoiceMonth = this.$formatDate(res.invoiceMonth, 'Month')
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
      // 多选
      selectionChangeHandle (val) {
        if (val.length) {
          this.currentStatus = val[0].status
        } else {
          this.currentStatus = null
        }
        this.selectionDataList = val
        this.selectionDataList.some(item => {
          if (item.status !== this.currentStatus) {
            this.isSome = false
            return true
          }
        })
      },
      selectAll () {
        this.selectionDataList = this.selectionDataList.filter(res => res.status === this.currentStatus)
      },
      selectable (row) {
        if (row.status === 1 || row.status === 4) {
          return false
        }
        if (this.selectionDataList.length) {
          if (row.status === 2 || row.status === 5) {
            if (this.currentStatus === 2 || this.currentStatus === 5) {
              return true
            } else {
              return false
            }
          } else {
            if (row.status !== this.currentStatus) {
              return false
            }
          }
        }
        return true
      },
      // 导入
      ticketImportHandle (id) {
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.importUpdate.init(id)
        })
      },
      // 反审核 作废
      handleExamineOrVoid (val) {
        if (!this.selectionDataList.length) {
          this.$message({
            type: 'warning',
            message: '请至少选择一条数据'
          })
          return false
        }
        let ids = this.selectionDataList.map(item => {
          return item.id
        })
        let idsName = this.selectionDataList.map(item => {
          return item.carrierName
        })
        let statementMonth = this.selectionDataList.map(item => {
          return item.invoiceMonth
        })
        this.$confirm(`承运商：${idsName} <br /> 对账账期：${statementMonth}`, `确定${val === 1 ? '反审核' : val === 2 ? '作废' : ''}该开票单？`, {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          const type = val === 1 ? 'theAudit' : val === 2 ? 'invalid' : ''
          this.$http({
            url: this.$http.adornUrl(`/feesettlement/tfsinvoice/${type}`),
            method: 'post',
            data: this.$http.adornData({
              ids,
              status: val === 1 ? 0 : val === 2 ? 4 : null
            }, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: `${val === 1 ? '反审核' : val === 2 ? '作废' : ''}成功`,
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
      // 审核
      handleExamine () {
        if (this.selectionDataList[0].status !== 0) {
          this.$message({
            type: 'warning',
            message: '该数据不能审核'
          })
          return
        }
        this.$router.push({
          path: '/cost-settlement-cost/invoice/invoice-examine',
          query: {
            id: this.selectionDataList[0].id,
            status: 2
          }
        })
      },
      // 付款核销
      handleWriteOff () {
        if (this.selectionDataList[0].status !== 2 && this.selectionDataList[0].status !== 5) {
          this.$message({
            type: 'warning',
            message: '该数据不能付款核销'
          })
          return
        }
        this.$router.push({
          path: '/cost-settlement-cost/invoice/invoice-off',
          query: {
            id: this.selectionDataList[0].id
          }
        })
      },
      // 批量付款核销确定
      handleBatchWriteOff (time) {
        let ids = this.selectionDataList.map(item => {
          return item.id
        })
        this.$http({
          url: this.$http.adornUrl('/feesettlement/tfsinvoice/paymentBatchAmount'),
          method: 'post',
          data: this.$http.adornData({
            'ids': ids,
            'paymentDtm': time && formatDate(time)
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '付款核销成功',
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
      },
      // 批量付款核销
      handleTimeSelect () {
        this.timeSelectVisible = true
        this.$nextTick(() => {
          this.$refs.timeSelect.init()
        })
      },
      // 新增 / 编辑
      addOrUpdateHandle (scope) {
        if (scope) {
          const row = scope.row
          const id = scope.row.id
          if (row.status !== 0) {
            this.$message({
              type: 'warning',
              message: '该数据不能编辑'
            })
            return
          }
          this.$router.push({
            path: '/cost-settlement-cost/invoice/invoice-add-or-update',
            query: {
              id: id
            }
          })
        } else {
          this.$router.push({
            path: '/cost-settlement-cost/invoice/invoice-add-or-update'
          })
        }
      },
      // 查看明细
      showDetails (id) {
        this.$router.push({
          path: '/cost-settlement-cost/invoice/invoice-detail',
          query: {
            id: id
          }
        })
      },
      // 双击查看明细
      dbShowDetails (row) {
        this.$router.push({
          path: '/cost-settlement-cost/invoice/invoice-detail',
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
      },
      outPutExcel () {
        this.$http({
          url: this.$http.adornUrl('/feesettlement/tfsinvoice/exportModleFsInvoice'),
          method: 'post',
          data: this.$http.adornData({
            id: this.selectionDataList[0].id
          }),
          responseType: 'blob'
        }).then(({data}) => {
          const link = document.createElement('a')
          let blob = new Blob([data], {type: 'application/vnd.ms-excel'});
          if (blob.size === 0) {
            this.$message.error('准备导出的数据为0条')
            return
          }
          let fileName = new Date().getTime()
          // for IE
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, `开票列表${fileName}.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `开票列表${fileName}.xlsx`)
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
  .el-table__body-wrapper{
    button{
      width: auto!important;
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

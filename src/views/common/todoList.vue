<template>
  <div class="mod-config">
    <el-form @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="备案时间">
            <xkl-date-picker style="width: 100%" v-model="dateValue" value-format="yyyy-MM-dd"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备案名称">
            <el-input v-model="dataForm.recordName" placeholder="备案名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="委托方">
            <xkl-select style="width: 100%" v-model="dataForm.consignorId" keyType="consignorId" labelType="ownerName" linkage="/transresources/ttrconsignor/noPowerList" placeholder="委托方"></xkl-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="适用范围">
            <el-input v-model="dataForm.supportRange" placeholder="适用范围" clearable></el-input>
          </el-form-item>
        </el-col>
        <!--<el-col :span="8">-->
          <!--<el-form-item label="状态">-->
            <!--<xkl-select style="width: 100%" v-model="dataForm.recordStatus" select-type="RECORD_STATUS" placeholder="请选择"></xkl-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="16" style="text-align: right;padding-right: 5px">
          <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          <el-button style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <!--<el-button icon="el-icon-circle-plus-outline" @click="recordHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>-->
            <!--<el-button type="primary" :disabled="this.selectionDataList.length === 0 || currentStatus !==1 " size="mini" @click="recordCommit">-->
              <!--<icon-svg name="提交审核" style="vertical-align: middle"></icon-svg>-->
              <!--提交</el-button>-->
            <!--<el-button type="success" size="mini" icon="el-icon-download" @click="outPutExcel">导出</el-button>-->
            <el-button v-if="fromType === 'todo'" type="success" :disabled="currentStatus!==2 || this.selectionDataList.length === 0" size="mini" @click="toORBackExamine">
              <icon-svg name="审核" style="vertical-align: middle"></icon-svg>
              审核</el-button>
            <!--<el-button type="success" size="mini" :disabled="currentStatus !== 4 && currentStatus !== 3" @click="updateStatus(1)">-->
              <!--<icon-svg name="反审核" style="vertical-align: middle"></icon-svg>-->
              <!--反审核</el-button>-->
            <!--<el-button type="danger" size="mini"  @click="updateStatus(5)">-->
              <!--<icon-svg name="作废" style="vertical-align: middle"></icon-svg>-->
              <!--作废</el-button>-->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
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
        v-if="fromType === 'done'"
        prop="approveByName"
        header-align="center"
        align="center"
        label="审核人"
        min-width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="fromType === 'done'"
        prop="approveTime"
        header-align="center"
        align="center"
        label="审核时间"
        min-width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="fromType === 'done'"
        prop="approveStatus"
        header-align="center"
        align="center"
        label="状态"
        min-width="120"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag v-if="row.approveStatus === 2"  size="mini" type="danger">不通过</el-tag>
          <el-tag v-if="row.approveStatus === 3" size="mini">通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="fromType === 'done'"
        prop="approveRemark"
        header-align="center"
        align="center"
        label="审核备注"
        min-width="160"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="recordDtm"
        header-align="center"
        align="center"
        label="备案时间"
        min-width="160"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="recordNo"
        header-align="center"
        align="center"
        label="备案编号"
        min-width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="recordName"
        header-align="center"
        align="center"
        label="备案名称"
        min-width="200"
        show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column
         prop="effectDtm"
         header-align="center"
         align="center"
         label="生效时间"
         show-overflow-tooltip>
       </el-table-column>-->
      <el-table-column
        prop="ownerName"
        header-align="center"
        align="center"
        label="委托方"
        min-width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        width="140"
        label="附件">
        <template slot-scope="{row}">
          <el-tooltip placement="top" effect="light" :disabled="!row.attachments || !row.attachments.length">
            <a href="javascript:" slot="content" style="font-size: 14px;line-height: 20px" v-for="item in row.attachments ? row.attachments : []" @click="downloadedFile(item.name, item.path)" >{{item.name}}<br /></a>
            <el-button size="mini">附件下载</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <!--<el-button type="primary" size="mini" @click="recordHandle(scope.row.id, scope.row.recordStatus)">-->
            <!--<icon-svg name="编辑" style="vertical-align: middle"></icon-svg>-->
            <!--编辑</el-button>-->
          <el-button type="primary" size="small" @click="showDetails(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情</el-button>
          <!-- <el-button v-if="scope.row.recordStatus === 2" type="primary" size="mini" @click="toORBackExamine(scope.row.id, scope.row.recordStatus)">
             <icon-svg name="审核" style="vertical-align: middle"></icon-svg>
             审核</el-button>-->
          <!--<el-button v-if="scope.row.recordStatus === 1" type="primary" size="mini" @click="recordCommit(scope.row)">
            <icon-svg name="提交审核" style="vertical-align: middle"></icon-svg>
            提交</el-button>-->
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
    <el-form style="margin-top: 20px">
      <el-form-item style="text-align: right">
        <el-button type="primary" plain @click="$router.push({name: 'home'})">关闭</el-button>
      </el-form-item>
    </el-form>
    <!-- 导入弹窗 -->
    <import-delegate v-if="importDelegateVisible" ref="importDelegate" @refreshDataList="getDataList"></import-delegate>
    <!-- 详情弹窗 -->
    <record-details  v-if="showDetailsVisible" ref="showDetails"></record-details>
    <check-details  v-if="showCheckDetailsVisible" ref="showCheckDetails" @refreshDataList="getDataList"></check-details>
    <record-commit v-if="showRecordCommitVisible" ref="recordCommit" @refreshDataList="getDataList"></record-commit>
  </div>
</template>

<script>
  import { formatDate } from '@/utils';
  // import ImportDelegate from '../delegate/import-delegate'
  // import DelegateInfo from '../delegate/delegate-info'
  import RecordDetails from './record-details'
  import CheckDetails from './check-details'
  // import RecordCommit from './record-commit'
  export default {
    data () {
      return {
        dataForm: {
          recordStatus: '',
          consignorId: '',
          resourceId: '',
          supportRange: '',
          recordName: ''
        },
        currentStatus: '',
        dateValue: [],
        showCheckDetails: false,
        showCheckDetailsVisible: false,
        showRecordCommitVisible: false,
        dataList: [
          {
            name: '',
            code: ''
          }
        ],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        recordDtm: [],
        selectionDataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false,
        importDelegateVisible: false,
        delegateInfoVisible: false,
        showDetailsVisible: false,
        clickFlag: true,
        fromType: true
      }
    },
    components: {
      // ImportDelegate,
      // DelegateInfo,
      RecordDetails,
      CheckDetails
      // RecordCommit
    },
    activated () {
      this.init()
      this.resetForm()
    },
    methods: {
      init () {
        this.fromType = this.$route.params.type
      },
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/auditrecord/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm,
            'begindate': this.dateValue ? this.dateValue[0] : undefined,
            'enddate': this.dateValue ? this.dateValue[1] : undefined,
            approveStatusList: this.fromType === 'todo' ? [1] : [2, 3]
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.dataList = this.dataList.map(res => {
              if (res.recordDtm) {
                res.recordDtm = formatDate(res.recordDtm)
              }
              if (res.effectDtm) {
                res.effectDtm = formatDate(res.effectDtm)
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
      selectAll () {
        this.selectionDataList = this.selectionDataList.filter(res => res.recordStatus === this.currentStatus)
      },
      selectable (row) {
        if (row.recordStatus === 5) {
          return false
        }
        if (this.selectionDataList.length && row.recordStatus !== this.currentStatus) {
          return false
        }
        return true
      },
      // 多选
      selectionChangeHandle (val) {
        if (val.length) {
          this.currentStatus = val[0].recordStatus
        } else {
          this.currentStatus = ''
        }
        this.selectionDataList = val
      },
      // 导出报表
      outPutExcel () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/ttrconsignor/downloadFilsListByRecord'),
          method: 'post',
          data: this.$http.adornData({
            ...this.dataForm,
            'begindate': this.dateValue ? this.dateValue[0] : undefined,
            'enddate': this.dateValue ? this.dateValue[1] : undefined
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
            window.navigator.msSaveOrOpenBlob(blob, `备案导出${fileName}.zip`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `备案导出${fileName}.zip`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 备案
      recordHandle (id, type) {
        if (!(type !== 4 && type !== 5)) {
          this.$message({
            type: 'warning',
            message: '该条数据不能编辑'
          })
          return false
        }
        this.$router.push({
          path: '/trans-resources/delegate-record/for-record',
          query: {
            id: id
          }
        })
      },
      recordCommit () {
        this.showRecordCommitVisible = true
        if (this.selectionDataList.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一条数据'
          })
          return false
        }
        this.$nextTick(() => {
          this.$refs.recordCommit.init(this.selectionDataList[0])
        })
      },
      importSave () {
        this.importDelegateVisible = true
        this.$nextTick(() => {
          this.$refs.importDelegate.init()
        })
      },
      showDetails (id, recordStatus) {
        this.showDetailsVisible = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(id, recordStatus)
        })
      },
      // 双击显示详情
      dbShowDetails (row) {
        this.showDetailsVisible = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(row.id, row.recordStatus)
        })
      },
      toORBackExamine () {
        this.showCheckDetailsVisible = true
        if (this.selectionDataList.length > 1) {
          this.$message({
            type: 'warning',
            message: '最多选中一条数据'
          })
          return false
        }
        this.$nextTick(() => {
          this.$refs.showCheckDetails.init(this.selectionDataList[0].id, this.selectionDataList[0].status)
        })
      },
      updateStatus (recordStatus) {
        if (this.selectionDataList.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一条数据'
          })
          return false
        }
        let ids = this.selectionDataList.map(res => {
          return res.id
        })
        this.$confirm(`是否${recordStatus === 5 ? '作废' : '反审核'}选中数据？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/transresources/trrecord/audit'),
            method: 'post',
            data: this.$http.adornData({
              'ids': ids,
              'recordStatus': recordStatus
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
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
      downloadedFile (name, path) {
        this.$nextTick(() => {
          if (!this.clickFlag) {
            return;
          }
          this.clickFlag = false
          this.loading = true
          const ending = path.split('.')
          const endIndex = ending.length - 1
          const fileName = name + '.' + ending[endIndex]
          this.$http({
            url: this.$http.adornUrl(`/transresources/trcontract/download`),
            method: 'get',
            params: this.$http.adornParams({
              'filePath': path
            }),
            responseType: 'blob'
          }).then(({data}) => {
            this.loading = false
            const link = document.createElement('a')
            let blob = new Blob([data], {type: 'application/octet-stream'})
            if (blob.size === 0) {
              this.$message.error('文件不存在')
              return
            }
            // let fileName = new Date().getTime()
            // for IE
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob, fileName)
            } else {
              // for Non-IE (chrome, firefox etc.)
              link.style.display = 'none'
              link.href = URL.createObjectURL(blob)
              link.setAttribute('download', fileName)
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }
          }).finally(() => {
            this.clickFlag = true
          })
        })
      },
      resetForm () {
        this.dataForm = {}
        this.dateValue = []
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

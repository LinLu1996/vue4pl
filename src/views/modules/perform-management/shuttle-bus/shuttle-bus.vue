<template>
  <div class="mod-config" v-loading="loading">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="考核月度">
            <xkl-date-picker v-model="dataForm.rensureMonth" type="month" placeholder="选择月份"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运商">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" labelType="carrierName" placeholder="选择承运商" linkage="/transresources/trcarrier/noPowerList"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;padding-right: 5px">
          <el-form-item>
            <el-button v-if="isAuth('performancemanagement:kpishuttlebusrecord:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button v-if="isAuth('performancemanagement:kpishuttlebusrecord:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('performancemanagement:shuttlebus:exportAssessment')" type="success" size="mini"  icon="el-icon-download" :disabled="dataListSelections.length !==1" @click="outPutExcel">导出</el-button>
            <el-button v-if="isAuth('performancemanagement:kpishuttlebusrecord:generate') && isAuth('performancemanagement:kpishuttlebusrecord:saveRecord')" icon="el-icon-circle-plus-outline" size="mini" style="background: #3698ce;color: #ffffff" @click="handleCreateTemplate()">新增</el-button>
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
        @row-dblclick="dbAddDetailHandle"
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
          prop="rensureMonth"
          width="120"
          align="center"
          label="考核月度">
        </el-table-column>
        <el-table-column
          prop="carrierName"
          align="center"
          min-width="200"
          show-overflow-tooltip
          label="承运商">
        </el-table-column>
        <el-table-column
          prop="templateName"
          align="center"
          width="200"
          label="考核模板">
        </el-table-column>
        <el-table-column
          prop="score"
          width="100"
          align="center"
          label="得分">
        </el-table-column>
        <el-table-column
          v-if="isAuth('performancemanagement:kpishuttlebusrecord:updateRecord') || isAuth('performancemanagement:kpishuttlebusrecord:delete') || isAuth('performancemanagement:kpishuttlebusrecord:editInfo')"
          header-align="center"
          align="center"
          fixed="right"
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('performancemanagement:kpishuttlebusrecord:updateRecord')" type="primary" size="mini" @click="handleCreateTemplate(scope.row.id)">
              <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
              编辑</el-button>
            <el-button v-if="isAuth('performancemanagement:kpishuttlebusrecord:editInfo')" type="primary" size="mini" @click="handleCreateTemplate(scope.row.id, 'detail')">
              <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
              详情</el-button>
            <el-button v-if="isAuth('performancemanagement:kpishuttlebusrecord:delete')" type="danger" size="mini" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <shuttle-bus-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></shuttle-bus-add-or-update>
  </div>
</template>

<script>
  import shuttleBusAddOrUpdate from './shuttleBus-add-or-update'
  import { formatDate } from '@/utils'
  export default {
    data () {
      return {
        loading: false,
        dataForm: {
          rensureMonth: '',
          carrierId: '',
          ownerId: '',
          transportType: ''
        },
        dataList: [
          {
            id: 1,
            no: 1,
            name: '名称1'
          },
          {
            id: 2,
            no: 2,
            name: '名称2'
          }
        ],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        addList: []
      }
    },
    components: {
      shuttleBusAddOrUpdate
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
          url: this.$http.adornUrl('/performancemanagement/kpishuttlebusrecord/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'rensureMonth': this.dataForm.rensureMonth ? formatDate(this.dataForm.rensureMonth, 'Month').split('-').join('') : undefined,
            'carrierId': this.dataForm.carrierId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list && data.page.list.length ? data.page.list.map(item => {
              item.rensureMonth = this.$formatDate(item.rensureMonth, 'Month')
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
      // 导出报表
      outPutExcel () {
        this.loading = true
        let rensureMonth = formatDate(this.dataListSelections[0].rensureMonth, 'Month').split('-').join('')
        let id = this.dataListSelections[0].id
        let carrierName = this.dataListSelections[0].carrierName
        this.$http({
          url: this.$http.adornUrl('/performancemanagement/tkpiassessmenttemplate/exportAssessment'),
          method: 'post',
          data: this.$http.adornData({
            'id': id,
            'type': 'bus'
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
          let fileName = `${rensureMonth}_${carrierName}_班车绩效`
          // for IE
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, `${fileName}.xls`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `${fileName}.xls`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
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
      handleCreateTemplate (id, type) {
        if (type === 'detail') {
          this.$router.push({
            path: '/perform-management/shuttle-bus/template-detail',
            query: {
              id: id
            }
          })
        } else {
          this.$router.push({
            path: '/perform-management/shuttle-bus/template-view',
            query: {
              id: id
            }
          })
        }
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
            url: this.$http.adornUrl(`/performancemanagement/kpishuttlebusrecord/delete/${id}`),
            method: 'get',
            data: this.$http.adornData(ids[0], false)
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
      // 双击table行显示详情
      dbAddDetailHandle (row) {
        this.$router.push({
          path: '/perform-management/shuttle-bus/template-detail',
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
  .el-table__fixed-right{
    height: 100%!important;
  }
</style>

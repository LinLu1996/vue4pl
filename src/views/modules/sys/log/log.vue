<template>
  <div class="mod-log" v-loading="loading">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="操作类型">
            <xkl-select style="width: 100%" v-model="dataForm.operation" select-type="OPERATION_TYPE" placeholder="操作类型"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户名">
            <el-input v-model="dataForm.userName" placeholder="用户名" maxlength="16" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间从">
            <xkl-date-picker v-model="dateValue"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item>
            <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('sys:log:export')" icon="el-icon-upload" @click="outPutExcel" size="mini" type="success">导出</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      @sort-change="changeSort"
      ref="tableList"
      style="width: 100%;">
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="sysCrtDtm"
        header-align="center"
        align="center"
        label="操作时间"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          {{$formatDate(row.sysCrtDtm)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        sortable="'custom'"
        label="用户名"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="operationContent"
        width="150"
        header-align="center"
        align="center"
        sortable="'custom'"
        label="操作类型">
      </el-table-column>
      <el-table-column
        prop="ip"
        header-align="center"
        align="center"
        label="设备IP"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
        show-overflow-tooltip>
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
  </div>
</template>

<script>
  import { toUnderScore, abbreviate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          beforeTime: '',
          afterTime: '',
          userName: '',
          operation: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        loading: false,
        selectionDataList: [],
        organization: [],
        sort: {},
        dateValue: []
      }
    },
    activated () {
      this.resetForm()
    },
    methods: {
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 导出报表
      outPutExcel () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/sys/log/outPutExcel'),
          method: 'post',
          data: this.$http.adornData({
            'beforeTime': this.dataForm.beforeTime,
            'afterTime': this.dataForm.afterTime,
            'userName': this.dataForm.userName,
            'operation': this.dataForm.operation,
            'sort': this.dataForm.sort
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
            window.navigator.msSaveOrOpenBlob(blob, `操作日志${fileName}.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `操作日志${fileName}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      },
      // 获取数据列表
      getDataList () {
        if (this.dateValue) {
          this.dataForm.beforeTime = new Date(this.dateValue[0])
          this.dataForm.afterTime = new Date(new Date(this.dateValue[1]).getTime() + 24 * 3600 * 1000)
        } else {
          this.dataForm.beforeTime = ''
          this.dataForm.afterTime = ''
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/log/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'beforeTime': this.dataForm.beforeTime,
            'afterTime': this.dataForm.afterTime,
            'userName': this.dataForm.userName,
            'operation': this.dataForm.operation,
            'sort': this.dataForm.sort
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
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
      resetForm () {
        this.dataForm = {}
        this.dateValue = []
        this.pageIndex = 1
        this.pageSize = 10
        this.$refs['tableList'].clearSort()
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
      }
    }
  }
</script>

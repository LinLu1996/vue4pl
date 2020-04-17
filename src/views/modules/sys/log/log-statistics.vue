<template>
  <div class="mod-log" v-loading="loading">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="操作组织">
            <el-input v-model="dataForm.organizationName" placeholder="操作组织" maxlength="16" clearable></el-input>
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
      </el-row>
      <el-row>
        <el-col style="text-align: right;padding-right: 5px">
          <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          <el-button style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <!--<el-button  @click="getDataList()">查询</el-button>-->
            <el-button v-if="isAuth('sys:log:outPutLogStatistics')" icon="el-icon-upload" @click="outPutExcel" size="mini" type="success">导出</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      @sort-change="changeSort"
      ref="tableList"
      v-loading="dataListLoading">
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="operatingTime"
        header-align="center"
        align="center"
        label="操作时间"
        sortable="'custom'"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作组织"
        show-overflow-tooltip>
        <template slot-scope="{ row }">{{ row.organizationName ? row.organizationName : '平台'}}</template>
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="用户名"
        sortable="'custom'"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="preview"
        header-align="center"
        align="center"
        label="预览量"
        sortable="'custom'">
      </el-table-column>
      <el-table-column
        prop="download"
        header-align="center"
        align="center"
        label="下载量"
        sortable="'custom'"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="print"
        header-align="center"
        align="center"
        label="打印量"
        sortable="'custom'"
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
  import XklDatePicker from '../../../../components/global/xkl-datePicker';
  export default {
    components: {XklDatePicker},
    data () {
      return {
        dataForm: {
          beforeTime: '',
          afterTime: '',
          userName: '',
          code: '',
          operation: '',
          organizationName: ''
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
          url: this.$http.adornUrl('/sys/log/outPutLogStatistics'),
          method: 'post',
          data: this.$http.adornData({
            'beforeTime': this.dataForm.beforeTime,
            'afterTime': this.dataForm.afterTime,
            'userName': this.dataForm.userName,
            'organizationName': this.dataForm.organizationName,
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
            window.navigator.msSaveOrOpenBlob(blob, `日志统计${fileName}.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `日志统计${fileName}.xlsx`)
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
          url: this.$http.adornUrl('/sys/log/logStatistics'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'beforeTime': this.dataForm.beforeTime,
            'afterTime': this.dataForm.afterTime,
            'userName': this.dataForm.userName,
            'organizationName': this.dataForm.organizationName,
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
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/basic/customer/organization'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.organization = data.list
            }
          })
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

<template>
  <div class="mod-config"  v-loading="loading">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="编码">
            <el-input v-model="dataForm.consignorNo" placeholder="编码"  maxlength="50" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="简称">
            <el-input v-model="dataForm.shortOwnerName" placeholder="简称" maxlength="16" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="全称">
            <el-input v-model="dataForm.ownerName" placeholder="全称" maxlength="33" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="创建时间从">
            <xkl-date-picker v-model="dateValue"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('transresources:ttrconsignor:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button v-if="isAuth('transresources:ttrconsignor:list')" style="background-color: #30b6aa; color: white" plain icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('transresources:ttrconsignor:outPutExcel')" type="success" size="mini"  icon="el-icon-download" @click="outPutExcel">导出</el-button>
            <el-button v-if="isAuth('transresources:trproduct:listCustomer')" type="primary" @click="getProductList('custom')" size="mini"
                       :disabled="dataListSelections.length!=1"
            >
              <icon-svg name="备案列表" style="vertical-align: middle"></icon-svg>
              委托产品</el-button>
            <el-button v-if="isAuth('transresources:ttrconsignor:updateStatusByIdso')"
              @click="handleStatus(0)" size="mini" icon="el-icon-check"
              :disabled="this.dataListSelections.length === 0 || currentStatus === 0"
              type="danger">启用</el-button>
            <el-button v-if="isAuth('transresources:ttrconsignor:updateStatusByIdsc')"
              @click="handleStatus(1)" size="mini" icon="el-icon-close"
              :disabled="this.dataListSelections.length === 0 || currentStatus === 1"
              type="danger">禁用</el-button>
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
      @sort-change="changeSort"
      ref="tableList"
      @row-dblclick="dbShowDetails"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="60"
        :selectable="selectable"
      >
      </el-table-column>
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="sysCrtDtm"
        width="200"
        header-align="center"
        align="center"
        label="创建时间"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          {{$formatDate(row.sysCrtDtm)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="consignorNo"
        width="150"
        header-align="center"
        align="center"
        label="编码"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="shortOwnerName"
        width="200"
        header-align="center"
        align="center"
        label="简称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="ownerName"
        header-align="center"
        align="center"
        label="全称"
        min-width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        header-align="center"
        width="100"
        align="center"
        label="状态">
        <template slot-scope="{ row }">
          <el-tag v-if="row.status === 0" size="small">有效</el-tag>
          <el-tag v-else size="small" type="danger">无效</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isAuth('transresources:ttrconsignor:update') || isAuth('transresources:ttrconsignor:info') || isAuth('transresources:ttrconsignor:merge')"
        header-align="center"
        align="center"
        fixed="right"
        width="280"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('transresources:ttrconsignor:update')" type="primary" size="mini" icon="el-icon-edit" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
          <el-button v-if="isAuth('transresources:ttrconsignor:info')" type="warning" size="mini" icon="el-icon-document" @click="goPage('DETAILS',scope.row.id)">详情</el-button>
          <el-button v-if="isAuth('transresources:ttrconsignor:merge')" type="success" size="mini" icon="el-icon-view" @click="goPage('TOSAVE',scope.row.id)">查看SAVE货主</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './customer-add-or-update'
  import { toUnderScore, abbreviate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          ownerName: '',
          consignorNo: '',
          shortOwnerName: ''
        },
        beforeTime: '',
        afterTime: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        sort: {},
        dateValue: [],
        currentStatus: '',
        loading: false
      }
    },
    components: {
      AddOrUpdate
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.resetForm()
      },
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        if (this.dateValue) {
          this.beforeTime = new Date(this.dateValue[0])
          this.afterTime = new Date(new Date(this.dateValue[1]).getTime() + 24 * 3600 * 1000)
        } else {
          this.beforeTime = ''
          this.afterTime = ''
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/ttrconsignor/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'consignorNo': this.dataForm.consignorNo,
            'ownerName': this.dataForm.ownerName,
            'shortOwnerName': this.dataForm.shortOwnerName,
            'beforeTime': this.beforeTime,
            'afterTime': this.afterTime
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
      getProductList (type) {
        const item = this.dataListSelections[0]
        this.$router.push({
          name: 'product-list',
          params: {
            type: type,
            id: item.id,
            isSelected: item.consignorProducts
          }
        })
      },
      // 导出报表
      outPutExcel () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/ttrconsignor/outPutExcel'),
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
            window.navigator.msSaveOrOpenBlob(blob, `委托方导出${fileName}.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `委托方导出${fileName}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      },
      // 启用禁用
      handleStatus (status) {
        let ids = this.dataListSelections.map(item => {
          return item.id
        })
        this.$http({
          url: this.$http.adornUrl('/transresources/ttrconsignor/updateStatusByIds'),
          method: 'post',
          data: this.$http.adornData({
            'ids': ids,
            'status': status
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.getDataList()
          } else {
            this.$message(data.msg)
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
        if (val.length) {
          this.currentStatus = val[0].status
        } else {
          this.currentStatus = ''
        }
        this.dataListSelections = val
      },
      // 双击查看明细
      dbShowDetails (row) {
        this.$router.push({
          path: '/customer-details',
          query: {
            id: row.id
          }
        })
      },
      selectable (row) {
        if (this.dataListSelections.length && row.status !== this.currentStatus) {
          return false
        }
        return true
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      goPage (type, id) {
        if (type === 'TOSAVE') {
          this.$router.push({
            path: '/customer-consolidation-details',
            query: {
              id: id,
              type: type
            }
          })
        } else {
          this.$router.push({
            path: '/customer-details',
            query: {
              id: id
            }
          })
        }
      },
      resetForm () {
        this.dataForm = {}
        this.dateValue = []
        this.pageIndex = 1
        this.pageSize = 10
        this.loading = false
        this.$nextTick(() => {
          this.$refs['tableList'].clearSort()
        })
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

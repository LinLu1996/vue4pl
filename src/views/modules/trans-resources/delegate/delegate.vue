<template>
  <div class="mod-config" v-loading="loading">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="全称">
            <el-input v-model="dataForm.ownerName" placeholder="全称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="简称">
            <el-input v-model="dataForm.shortOwnerName" placeholder="简称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="save货主编码">
            <el-input v-model="dataForm.saveOwnerCode" placeholder="save货主编码" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物流货主编码">
            <el-input v-model="dataForm.logisticsOwnerCode" placeholder="物流货主编码" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否内部货主">
            <el-select style="width: 100%" v-model="dataForm.isInsideOwner" placeholder="是否内部货主" clearable>
              <el-option value="0" label="是"></el-option>
              <el-option value="1" label="否"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间从">
            <xkl-date-picker v-model="dateValue"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('transresources:trsaveowner:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button v-if="isAuth('transresources:trsaveowner:list')" style="background-color: #30b6aa; color: white" plain icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('transresources:trsaveowner:save')" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
            <el-button v-if="isAuth('transresources:trsaveowner:updateActiveQ')"
               size="mini" icon="el-icon-check"
               :disabled="this.dataListSelections.length === 0 || currentStatus === 0"
               @click="handleStatus(0)"
               type="danger">启用</el-button>
            <el-button v-if="isAuth('transresources:trsaveowner:updateActiveJ')" icon="el-icon-close"
               :disabled="this.dataListSelections.length === 0 || currentStatus === 1"
               @click="handleStatus(1)" size="mini"
               type="danger">禁用</el-button>
            <el-button v-if="isAuth('transresources:trsaveowner:outPutExcel')" type="success" size="mini"  icon="el-icon-download" @click="outPutExcel">导出</el-button>
            <el-button v-if="isAuth('transresources:ttrconsignor:mergingCustomers')" type="success" size="mini" icon="el-icon-upload" :disabled="this.dataListSelections.length === 0 || currentStatus === 1" @click="handleAdd()">合并</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      row-key="id"
      @selection-change="selectionChangeHandle"
      @sort-change="changeSort"
      ref="tableList"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        :reserve-selection="true"
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
      </el-table-column>
      <el-table-column
        prop="saveOwnerCode"
        width="150"
        header-align="center"
        align="center"
        label="save货主编码"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="logisticsOwnerCode"
        width="150"
        header-align="center"
        align="center"
        label="物流货主编码"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="logisticsCode"
        width="150"
        header-align="center"
        align="center"
        label="物流编码"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="ownerName"
        header-align="center"
        align="center"
        label="全称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="shortOwnerName"
        width="150"
        header-align="center"
        align="center"
        label="简称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="isInsideOwner"
        header-align="center"
        align="center"
        width="160"
        label="是否内部货主"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-tag v-if="row.isInsideOwner === 0" size="small">是</el-tag>
          <el-tag v-else size="small" type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        width="150"
        align="center"
        label="状态">
        <template slot-scope="{ row }">
          <el-tag v-if="row.isActive === 0" size="small">有效</el-tag>
          <el-tag v-else size="small" type="danger">无效</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isAuth('transresources:trsaveowner:update') || isAuth('transresources:trsaveowner:info')"
        header-align="center"
        align="center"
        width="120"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('transresources:trsaveowner:update')" type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑
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
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-button @click="handleClose()">关闭</el-button>
      </el-col>
    </el-row>
    <delegate-add-or-update v-if="delegateAddOrUpdateVisible" ref="delegateAddOrUpdate" @refreshDataList="refreshData"></delegate-add-or-update>
    <custom-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false" @refreshDataList="refreshData"></custom-add-or-update>
  </div>
</template>

<script>
  import CustomAddOrUpdate from './custom-add-or-update'
  import DelegateAddOrUpdate from './delegate-add-or-update'
  import { toUnderScore, abbreviate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          saveOwnerCode: '',
          logisticsOwnerCode: '',
          shortOwnerName: '',
          ownerName: '',
          isInsideOwner: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListSelections: [],
        dataListLoading: false,
        addOrUpdateVisible: false,
        sort: {},
        dateValue: [],
        beforeTime: '',
        afterTime: '',
        loading: false,
        currentStatus: '',
        delegateAddOrUpdateVisible: false
      }
    },
    components: {
      CustomAddOrUpdate,
      DelegateAddOrUpdate
    },
    created () {
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
        if (this.dateValue) {
          this.beforeTime = new Date(this.dateValue[0])
          this.afterTime = new Date(new Date(this.dateValue[1]).getTime() + 24 * 3600 * 1000)
        } else {
          this.beforeTime = ''
          this.afterTime = ''
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trsaveowner/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm,
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
      selectable (row) {
        if (this.dataListSelections.length && row.isActive !== this.currentStatus) {
          return false
        }
        return true
      },
      // 启用禁用
      handleStatus (status) {
        let ids = this.dataListSelections.map(item => {
          return item.id
        })
        this.$http({
          url: this.$http.adornUrl('/transresources/trsaveowner/updateActive'),
          method: 'post',
          data: this.$http.adornData({
            'ids': ids,
            'isActive': status
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
          } else {
            this.$message.error(data.msg)
          }
          this.refreshData()
        })
      },
      resetForm () {
        this.dataForm = {}
        this.dateValue = []
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      },
      selectionChangeHandle (val) {
        if (val.length) {
          this.currentStatus = val[0].isActive
        } else {
          this.currentStatus = ''
        }
        this.dataListSelections = val
      },
      handleAdd () {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(this.dataListSelections)
        })
      },
      // 新增
      addOrUpdateHandle (id) {
        this.delegateAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.delegateAddOrUpdate.init(id)
        })
      },
      // 导出报表
      outPutExcel () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trsaveowner/outPutExcel'),
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
            window.navigator.msSaveOrOpenBlob(blob, `SAVE货主导出${fileName}.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `SAVE货主导出${fileName}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
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
      handleClose () {
        this.$emit('handleClose')
      },
      refreshData () {
        this.$refs.tableList.clearSelection()
        this.getSearchDataList()
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>

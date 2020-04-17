<template>
  <el-dialog
    title="添加SAVE货主"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getSearchDataList()">
      <el-form-item>
        <el-input v-model="dataForm.saveOwnerCode" placeholder="SAVE货主编码"  maxlength="50" clearable style="width: 200px;"></el-input>
        <el-input v-model="dataForm.ownerName" placeholder="全称" maxlength="16" clearable style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
        <el-button style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      ref="tableList"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      @sort-change="changeSort"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="60">
      </el-table-column>
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="60"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="saveOwnerCode"
        width="150"
        header-align="center"
        align="center"
        label="SAVE货主编码">
      </el-table-column>
      <el-table-column
        prop="shortOwnerName"
        width="200"
        header-align="center"
        align="center"
        label="简称">
      </el-table-column>
      <el-table-column
        prop="ownerName"
        header-align="center"
        align="center"
        label="全称"
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { toUnderScore, abbreviate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          saveOwnerCode: '',
          ownerName: '',
          list: [],
          sort: {}
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        submitFlag: true
      }
    },
    methods: {
      init (id, type) {
        this.visible = true
        this.resetForm()
        this.dataForm.id = id
        this.saveType = type
      },
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trsaveowner/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'saveOwnerCode': this.dataForm.saveOwnerCode,
            'ownerName': this.dataForm.ownerName,
            'fullName': this.dataForm.fullName,
            'sort': this.dataForm.sort,
            'isActive': 0
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
        // this.dataForm.list = val
      },
      // 表单提交
      dataFormSubmit () {
        if (this.submitFlag) {
          this.submitFlag = false
          setTimeout(() => {
            this.submitFlag = true
          }, 2000)
          if (this.dataListSelections.length < 1) {
            this.$message.warning('请至少选择一项')
            return false
          }
          this.$http({
            url: this.$http.adornUrl('/transresources/ttrconsignor/add'),
            method: 'post',
            data: this.$http.adornData({
              id: this.$route.query.id,
              saveOwners: this.dataListSelections
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '新增成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      },
      resetForm () {
        // resetData(this.dataForm)
        this.dataForm = {}
        this.$nextTick(() => {
          this.$refs['tableList'].clearSort()
        })
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      },
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      changeSort (sortRule) {
        let column = toUnderScore(sortRule.prop)
        if (column === 'type_name') {
          column = 'type'
        }
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

<template>
  <el-dialog
    title="委托方列表"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="委托方名称">
            <xkl-select style="width: 100%" v-model="dataForm.ownerName" keyType="ownerName" labelType="ownerName" placeholder="委托方名称" linkage="/transresources/ttrconsignor/noPowerList"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-button type="warning" icon="el-icon-search" @click="searchDataList()">查询</el-button>
          <el-button style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      ref="table"
      :data="dataList"
      border
      :row-key="getRowKeys"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        :reserve-selection="true">
      </el-table-column>
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        label="序号"
        width="70">
      </el-table-column>
      <el-table-column
        prop="consignorNo"
        header-align="center"
        align="center"
        label="委托方编码"
        width="240"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="ownerName"
        header-align="center"
        align="center"
        label="全称"
        min-width="240"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="shortOwnerName"
        header-align="center"
        align="center"
        label="简称"
        width="240"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="状态"
        width="180">
        <template slot-scope="{row}">
          <el-tag v-if="!row.status" size="mini" type="success">有效</el-tag>
          <el-tag v-else size="mini" type="danger">无效</el-tag>
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible=false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        chooseFlag: false,
        dataForm: {
          ownerName: '',
          consignorIds: []
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        consignorIds: [],
        consignors: []
      }
    },
    activated () {
    },
    watch: {
      'dataListSelections' (newVal, oldVal) {
        this.$nextTick(() => {
          this.chooseFlag = true
        })
        if (newVal.length > oldVal.length) {
          this.consignors = this.consignors.concat(this.dataListSelections)
        } else if (newVal.length < oldVal.length && this.chooseFlag) {
          let tempIds = newVal.map(res => res.id)
          let deleteIds = oldVal.filter(res => tempIds.indexOf(res.id) < 0).map(res => res.id)
          this.consignors = this.consignors.filter(res => deleteIds.indexOf(res.id) < 0)
        }
        this.consignors = this.consignors.filter((res, index, self) => {
          let arrIds = []
          this.consignors.forEach((item, i) => {
            arrIds.push(item.id)
          })
          return arrIds.indexOf(res.id) === index
        })
      }
    },
    methods: {
      init (consignorIds, consignors) {
        this.clickFlag = true
        this.visible = true
        this.chooseFlag = false
        this.$nextTick(() => {
          this.$refs.table.clearSelection()
        })
        this.resetForm()
        this.dataForm.consignorIds = consignorIds || 0
        this.consignors = consignors
      },
      searchDataList () {
        this.pageIndex = 1
        this.getDataList()
      },
      getDataList () {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$http({
            url: this.$http.adornUrl(`/transresources/ttrconsignor/list`),
            method: 'post',
            data: this.$http.adornData({
              'page': this.pageIndex,
              'limit': this.pageSize,
              'ownerName': this.dataForm.ownerName
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.page.list
              this.dataList = this.dataList.map(res => {
                res.checked = false
                this.dataForm.consignorIds.map(res1 => {
                  if (res1 === res.id) {
                    res.checked = true
                  }
                })
                return res
              })
              this.dataList.map(res => {
                this.$refs.table.toggleRowSelection(res, res.checked)
              })
              this.totalPage = data.page.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      getRowKeys (row) {
        return row.id
      },
      resetForm () {
        this.dataForm = {}
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      },
      // 表单提交
      dataFormSubmit () {
        this.visible = false
        this.$emit('getParams', this.consignors)
      }
    }
  }
</script>

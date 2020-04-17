<template>
  <el-dialog
    title="司机列表"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="司机姓名" prop="driverName">
            <el-input v-model="dataForm.driverName" style="width: 100%;" placeholder="司机姓名" maxlength="10" @input="change($event)" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-button type="warning" icon="el-icon-search" @click="searchDataList(dataForm.ids)">查询</el-button>
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
        prop="driverName"
        header-align="center"
        align="center"
        label="司机姓名"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="driverIdcard"
        header-align="center"
        align="center"
        label="身份证号"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="driverSex"
        header-align="center"
        align="center"
        label="性别"
        width="100">
        <template slot-scope="{row}">
          <el-tag v-if="!row.driverSex" size="mini" type="success">男</el-tag>
          <el-tag v-else size="mini" type="warning">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="driveAllowTypeName"
        header-align="center"
        align="center"
        label="准驾车型">
      </el-table-column>
      <el-table-column
        prop="certificationDtm"
        header-align="center"
        align="center"
        label="初次领证日期"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="validDate"
        header-align="center"
        align="center"
        label="证件有效期至"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="120"
        label="状态">
        <template slot-scope="{row}">
          <el-tag v-if="!row.isEnabled" size="mini" type="success">有效</el-tag>
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
  import { formatDate } from '@/utils';
  import ImportDelegate from './import-delegate'
  import DelegateInfo from './delegate-info'
  export default {
    data () {
      return {
        visible: false,
        chooseFlag: false,
        dataForm: {
          ids: [],
          driverName: '',
          driverIds: []
        },
        dataList: [
          {
            name: '',
            code: ''
          }
        ],
        drivers: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    components: {
      ImportDelegate,
      DelegateInfo
    },
    activated () {
    },
    watch: {
      'dataListSelections' (newVal, oldVal) {
        this.$nextTick(() => {
          this.chooseFlag = true
        })
        if (newVal.length > oldVal.length) {
          this.drivers = this.drivers.concat(this.dataListSelections)
        } else if (newVal.length < oldVal.length && this.chooseFlag) {
          let tempIds = newVal.map(res => res.id)
          let deleteIds = oldVal.filter(res => tempIds.indexOf(res.id) < 0).map(res => res.id)
          this.drivers = this.drivers.filter(res => deleteIds.indexOf(res.id) < 0)
        }
        this.drivers = this.drivers.filter((res, index, self) => {
          let arrIds = []
          this.drivers.forEach((item, i) => {
            arrIds.push(item.id)
          })
          return arrIds.indexOf(res.id) === index
        })
      }
    },
    methods: {
      init (ids, driverIds, drivers) {
        this.dataForm = {}
        this.dataForm.ids = ids || 0
        this.dataForm.driverIds = driverIds || 0
        this.drivers = drivers
        this.visible = true
        this.chooseFlag = false
        this.$nextTick(() => {
          this.$refs.table.clearSelection()
        })
        this.resetForm()
      },
      searchDataList () {
        this.pageIndex = 1
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl(`/transresources/trrecorddetails/confirmChoiceDriver`),
            method: 'post',
            data: this.$http.adornData({
              'page': this.pageIndex,
              'limit': this.pageSize,
              'carrierIds': this.dataForm.ids,
              'driverName': this.dataForm.driverName
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.driverList.list
              this.dataList = this.dataList.map(res => {
                if (res.certificationDtm) {
                  res.certificationDtm = formatDate(res.certificationDtm)
                }
                if (res.validDate) {
                  res.validDate = formatDate(res.validDate)
                }
                return res
              })
              this.dataList = this.dataList.map(res => {
                res.checked = false
                this.dataForm.driverIds.map(res1 => {
                  if (res1 === res.id) {
                    res.checked = true
                  }
                })
                return res
              })
              this.dataList.map(res => {
                this.$refs.table.toggleRowSelection(res, res.checked)
              })
              this.totalPage = data.driverList.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
            }
          })
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
        // this.dataListSelections = this.dataListSelections.filter((x, index) => {
        //   let arrids = []
        //   this.dataListSelections.forEach((item) => {
        //     arrids.push(item.id)
        //   })
        //   let judgeOne = arrids.indexOf(x.id) === index
        //   return judgeOne
        // })
        // this.dataForm.list = val
      },
      getRowKeys (row) {
        return row.id
      },
      change (e) {
        this.$forceUpdate()
      },
      resetForm () {
        this.dataForm.driverName = ''
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      },
      // 表单提交
      dataFormSubmit () {
        if (!this.drivers.length) {
          this.$message({
            type: 'warning',
            message: '请至少选择一项'
          })
          return false
        }
        this.visible = false
        this.$emit('getParams', this.drivers, 'driver')
      }
    }
  }
</script>

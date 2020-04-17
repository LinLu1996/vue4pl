<template>
  <el-dialog
    title="车辆列表"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="承运商名称">
            <!--<el-input v-model="dataForm.carrierName" placeholder="承运商名称"></el-input>-->
            <xkl-select style="width: 100%" v-model="dataForm.carrierName" keyType="carrierName" labelType="carrierName" placeholder="承运商名称" @input="change($event)" linkage="/transresources/trcarrier/noPowerList"></xkl-select>
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
        :reserve-selection="true"
        align="center">
      </el-table-column>
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        label="序号"
        width="70">
      </el-table-column>
      <el-table-column
        prop="carNumber"
        header-align="center"
        align="center"
        width="120"
        label="车牌号"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierName"
        header-align="center"
        align="center"
        label="承运商"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carValue"
        header-align="center"
        width="120"
        align="center"
        label="车型"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carLoad"
        header-align="center"
        width="100"
        align="center"
        label="载重"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="warmAreaName"
        header-align="center"
        align="center"
        label="温区"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="isChecked"
        header-align="center"
        width="100"
        align="center"
        label="验证状态">
        <template slot-scope="{ row }">
          <el-tag v-if="!row.isChecked" size="mini" type="warning">未验证</el-tag>
          <el-tag v-else size="mini" type="success">已验证</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        width="100"
        align="center"
        label="状态">
        <template slot-scope="{row}">
          <el-tag v-if="!row.isEnabled" size="mini">有效</el-tag>
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
  import ImportDelegate from './import-delegate'
  import DelegateInfo from './delegate-info'
  export default {
    data () {
      return {
        visible: false,
        chooseFlag: false,
        dataForm: {
          ids: [],
          carrierName: '',
          code: '',
          carIds: []
        },
        cars: [],
        dataList: [],
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
          this.cars = this.cars.concat(this.dataListSelections)
        } else if (newVal.length < oldVal.length && this.chooseFlag) {
          let tempIds = newVal.map(res => res.id)
          let deleteIds = oldVal.filter(res => tempIds.indexOf(res.id) < 0).map(res => res.id)
          this.cars = this.cars.filter(res => deleteIds.indexOf(res.id) < 0)
        }
        this.cars = this.cars.filter((res, index, self) => {
          let arrIds = []
          this.cars.forEach((item, i) => {
            arrIds.push(item.id)
          })
          return arrIds.indexOf(res.id) === index
        })
      }
    },
    methods: {
      init (ids, carIds, cars) {
        this.dataForm = {}
        this.dataForm.ids = ids || 0
        this.dataForm.carIds = carIds
        this.cars = cars
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
      getDataList () {
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl(`/transresources/trrecorddetails/confirmChoiceCar`),
            method: 'post',
            data: this.$http.adornData({
              'page': this.pageIndex,
              'limit': this.pageSize,
              'carrierIds': this.dataForm.ids,
              'carrierName': this.dataForm.carrierName
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.carList.list
              this.dataList = this.dataList.map(res => {
                res.checked = false
                this.dataForm.carIds.map(res1 => {
                  if (res1 === res.id) {
                    res.checked = true
                  }
                })
                return res
              })
              this.dataList.map(res => {
                this.$refs.table.toggleRowSelection(res, res.checked)
              })
              this.totalPage = data.carList.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
            }
          })
        })
      },
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
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
        this.dataForm.carrierName = ''
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      },
      // 表单提交
      dataFormSubmit () {
        if (!this.cars.length) {
          this.$message({
            type: 'warning',
            message: '请至少选择一项'
          })
          return false
        }
        this.visible = false
        this.$emit('getParams', this.cars, 'car')
      }
    }
  }
</script>

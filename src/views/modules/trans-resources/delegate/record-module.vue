<template>
  <el-dialog
    title="备案模板"
    :visible.sync="visible"
    width="60%">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="委托方名称">
            <xkl-select style="width: 100%" v-model="dataForm.carType" select-type="CAR_TYPE" placeholder="委托方名称" linkage="/generator/trcooler/list"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备案名称">
            <el-input v-model="dataForm.carrierName" placeholder="备案名称" maxlength="30" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;padding-right: 5px">
          <el-form-item label-width="0">
            <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      ref="tableList"
      style="width: 100%;">
      <el-table-column
        type="selection"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="carrierName"
        header-align="center"
        align="center"
        label="委托方名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carValue"
        header-align="center"
        align="center"
        label="备案名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carValue"
        header-align="center"
        align="center"
        label="备案时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carValue"
        header-align="center"
        align="center"
        label="备案状态"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { toUnderScore, abbreviate } from '@/utils'
  export default {
    data () {
      return {
        reachType: '',
        visible: false,
        dataForm: {
          carrierId: '',
          carrierName: '',
          carType: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        checkVisible: false,
        resultVisible: false,
        selectionDataList: [],
        dataListSelections: [],
        sort: {}
      }
    },
    components: {
    },
    activated () {
      this.dataForm.carrierId = this.$route.query.id ? this.$route.query.id : ''
      this.pageIndex = 1
      this.pageSize = 10
      this.getDataList()
    },
    methods: {
      init (type) {
        this.visible = true
        this.reachType = type
        this.getDataList()
      },
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`${this.reachType === 'cooler' ? '/generator/trcooler/list' : '/generator/trgps/list'}`),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list.length > 0 ? data.page.list.map(item => {
              item.isEnabled === 0 ? item.isEnabled = true : item.isEnabled = false
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
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        this.$router.push({
          name: 'car-add-or-update'
        })
        // this.addOrUpdateVisible = true
        // this.$nextTick(() => {
        //   this.$refs.addOrUpdate.init(id, this.values)
        // })
      },
      // 新增 / 编辑
      check (id, scope) {
        this.checkVisible = true
        this.$nextTick(() => {
          this.$refs.check.init(id, scope)
        })
      },
      // 验证结果
      handleResult (id) {
        this.resultVisible = true
        this.$nextTick(() => {
          this.$refs.resultUpdate.init(id, this.values)
        })
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定删除${!this.dataListSelections.length ? '这条' : '选中'}数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/transresources/trcar/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
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
        }).catch(() => {
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
      // 编辑状态
      handleStatus (val, id) {
        const isEnabled = val === true ? 0 : 1
        this.$http({
          url: this.$http.adornUrl('/transresources/trcar/updateIsEnabledById'),
          method: 'post',
          data: this.$http.adornData({
            'id': id,
            'carrierName': this.dataForm.carrierName,
            'isEnabled': isEnabled
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.getDataList()
          } else {
            this.$message(data.msg)
          }
        })
      },
      resetForm () {
        this.dataForm = {}
        this.pageIndex = 1
        this.pageSize = 10
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
<style lang="scss">
  .el-table__body-wrapper{
    button{
      width: auto!important;
      height: 25px;
      line-height: 25px;
      padding: 0 4px;
      text-align: center;
      background: none;
      color: #3E8EF7;
      border: none;
    }
  }
</style>

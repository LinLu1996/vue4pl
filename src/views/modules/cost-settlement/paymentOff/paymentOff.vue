<template>
  <div class="mod-config">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="承运商名称">
            <el-input v-model="dataForm.name" maxlength="100" placeholder="承运商名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="日期">
            <el-date-picker
              style="width: 100%"
              v-model="dataForm.time"
              type="date"
              placeholder="日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;padding-right: 5px">
          <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          <el-button style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <template>
      <el-table
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column
          type="index"
          width="60"
          align="center"
          label="No.">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="承运商名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="开票日期"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="开票金额"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="付款截止日"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          width="100"
          label="已付金额"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          width="100"
          label="未付金额"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          width="100"
          label="付款状态"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          fixed="right"
          width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="addOrUpdateHandle(scope.row.id)">
              <icon-svg name="核销" style="vertical-align: middle"></icon-svg>
              核销</el-button>
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
    <paymentOff-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></paymentOff-add-or-update>
  </div>
</template>

<script>
  import paymentOffAddOrUpdate from './paymentOff-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          name: '',
          time: ''
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
        addOrUpdateVisible: false
      }
    },
    components: {
      paymentOffAddOrUpdate
    },
    activated () {
      // this.resetForm()
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
          url: this.$http.adornUrl('/sys/config/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'operator': this.operator
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
      },
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除${!this.dataListSelections.length ? '这条' : '选中'}数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/config/delete'),
            method: 'post',
            data: this.$http.adornData({
              'ids': ids
            })
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
</style>

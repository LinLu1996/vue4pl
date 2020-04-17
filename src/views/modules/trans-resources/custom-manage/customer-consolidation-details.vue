<template>
  <div class="mod-config">
    <el-form label-width="50px" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-row>
        <el-col :span="6">
          <el-form-item label="编码:">
            <span style="display: block">
              {{dataForm.consignorNo}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="简称:">
            <span style="display: block">
              {{dataForm.shortOwnerName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="全称:">
            <span style="display: block">
              {{dataForm.ownerName}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right">
          <el-form-item style="margin-bottom: 5px">
<!--            v-if="(isAuth('basic:add:save:customer') && urlType === 'TOSAVE')-->
<!--            || (isAuth('basic:add:merge:customer') && urlType !== 'TOSAVE' )"-->
            <el-button v-if="isAuth('transresources:ttrconsignor:add')" type="success" size="mini" icon="el-icon-plus"
                       @click="addOrUpdateHandle(dataForm.id)">{{urlType === 'TOSAVE' ? '添加SAVE货主' : '添加合并客户'}}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
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
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="saveOwnerCode"
        header-align="center"
        align="center"
        label="SAVE货主编码">
      </el-table-column>
      <el-table-column
        prop="shortOwnerName"
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
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="是否有效">
        <template slot-scope = '{row}'>
          <el-tag v-if="row.isActive === 0" size="small">有效</el-tag>
          <el-tag v-else size="small" type="danger">无效</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="状态">-->
<!--        <template slot-scope = '{row}'>-->
<!--          <el-tag v-if="row.status === 0" size="small" type="danger">未确认</el-tag>-->
<!--          <el-tag v-else size="small">已确认</el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      v-if="isAuth('basic:save:customer:delete:save') || isAuth('basic:save:customer:delete:merge')"-->
      <el-table-column
        v-if="isAuth('transresources:trsaveowner:delete')"
        header-align="center"
        align="center"
        fixed="right"
        width="150"
        label="操作">
        <template slot-scope="scope">
<!--          v-if="isAuth('basic:save:customer:delete:save') || isAuth('basic:save:customer:delete:merge')"-->
          <el-button v-if="isAuth('transresources:trsaveowner:delete')" type="danger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 20px"></div>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-button @click="$router.go(-1)">关闭</el-button>
      </el-col>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './customer-add-merged'
  import { toUnderScore, abbreviate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          consignorNo: '',
          shortOwnerName: '',
          ownerName: ''
        },
        urlType: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        this.dataForm = {}
        let RECEIVE = this.$route.query
        this.dataForm.id = RECEIVE.id
        this.urlType = RECEIVE.type || ''
        this.$refs['tableList'].clearSort()
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/ttrconsignor/merge'),
          method: 'post',
          data: this.$http.adornData({
            ...this.dataForm
          })
        }).then(({data}) => {
          if (data && data.code === 0 && data.data) {
            this.dataList = data.data.saveOwners
            this.dataForm.id = data.data.id
            this.dataForm.consignorNo = data.data.consignorNo
            this.dataForm.shortOwnerName = data.data.shortOwnerName
            this.dataForm.ownerName = data.data.ownerName
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          if (this.urlType === 'TOSAVE') {
            this.$refs.addOrUpdate.init(id, 'TOSAVE')
          } else {
            this.$refs.addOrUpdate.init(id, '')
          }
        })
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
      },
      // 删除
      deleteHandle (id) {
        if (this.dataList.length === 1) {
          this.$message.warning('必须保留一条数据！')
          return
        }
        this.$confirm(`确定删除这条数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/transresources/trsaveowner/delete'),
            method: 'get',
            params: this.$http.adornParams({
              'id': id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '删除成功',
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
      }
    }
  }
</script>

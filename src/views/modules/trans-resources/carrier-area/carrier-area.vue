<template>
  <div class="mod-config" v-loading="loading">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="承运商">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" keyType="id" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList" placeholder="选择或输入查找"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运区域">
            <xkl-select style="width: 100%" v-model="dataForm.areaIds" keyType="id" :multiple="true" labelType="name" linkage="/sys/sysregion/noPowerList" placeholder="选择或输入查找"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运作区域">
            <xkl-select style="width: 100%" v-model="dataForm.usedIds" keyType="id" labelType="name" :multiple="true" linkage="/sys/sysregion/noPowerList" placeholder="选择或输入查找"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="优势区域">
            <xkl-select style="width: 100%" v-model="dataForm.goodIds" keyType="id" labelType="name" :multiple="true" linkage="/sys/sysregion/noPowerList" placeholder="选择或输入查找"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item>
            <el-button v-if="isAuth('transresources:trcarrierarea:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button v-if="isAuth('transresources:trcarrierarea:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('transresources:trcarrierarea:saveAreaA')" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
            <el-button v-if="isAuth('transresources:trcarrierarea:export')" icon="el-icon-download" type="success" @click="exportExcel()" size="mini">导出</el-button>
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
      @select-all="selectAll"
      @row-dblclick="dbShowDetails"
      style="width: 100%;">
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
        label="承运商"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierAreaStr"
        header-align="center"
        align="center"
        label="承运区域"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="runAreaStr"
        header-align="center"
        align="center"
        label="运作区域"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="goodAreaStr"
        header-align="center"
        align="center"
        label="优势区域"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="isAuth('transresources:trcarrierarea:saveAreaU') || isAuth('transresources:trcarrierarea:area')"
        header-align="center"
        align="center"
        width="160"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('transresources:trcarrierarea:saveAreaU')" type="primary" size="small" @click="addOrUpdateHandle(scope.row.carrierId)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑</el-button>
          <el-button v-if="isAuth('transresources:trcarrierarea:area')" type="warning" size="small" @click="showDetails(scope.row.carrierId)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情</el-button>
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
    <!-- 弹窗, 新增 / 编辑 -->
    <area-details v-if="isShowDetails" ref="showDetails" @refreshDataList="getDataList"></area-details>
    <add-o-r-update v-if="isShowAgreement" ref="agreementList" @refreshDataList="getDataList"></add-o-r-update>
  </div>
</template>

<script>
  import areaDetails from './area-details'
  import AddORUpdate from './area-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          carrierId: '',
          areaIds: [],
          usedIds: [],
          goodIds: []
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dateValue: [],
        dataListLoading: false,
        selectionDataList: [],
        addOrUpdateVisible: false,
        isShowDetails: false,
        isShowAgreement: false,
        currentStatus: '',
        loading: false
      }
    },
    components: {
      areaDetails,
      AddORUpdate
    },
    activated () {
      this.resetForm()
    },
    methods: {
      init () {
        if (this.$route.params.id === 'AD') {
          this.showAgreement()
        }
      },
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trcarrierarea/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'carrierId': this.dataForm.carrierId,
            'areaIdList': this.dataForm.areaIds,
            'usedIdList': this.dataForm.usedIds,
            'goodIdList': this.dataForm.goodIds
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.dataList = this.dataList.map(res => {
              let carrierAreaNameList = [];
              let goodAreaNameList = [];
              let runAreaNameList = [];
              if (res.carrierAreaList && res.carrierAreaList.length > 0) {
                res.remark = res.carrierAreaList[0].remark;
                res.carrierAreaList.forEach((item, index) => {
                  carrierAreaNameList.push(item.areaName);
                  if (item.isGoodArea === 1) {
                    goodAreaNameList.push(item.areaName);
                  }
                  if (item.isUsedArea === 1) {
                    runAreaNameList.push(item.areaName);
                  }
                });
              }
              res.carrierAreaStr = carrierAreaNameList.join('、');
              res.goodAreaStr = goodAreaNameList.join('、');
              res.runAreaStr = runAreaNameList.join('、');
              return res
            })
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = [{name: 1}]
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
        if (val.length) {
          this.currentStatus = val[0].status
        } else {
          this.currentStatus = ''
        }
        this.selectionDataList = val
      },
      selectAll () {
        this.selectionDataList = this.selectionDataList.filter(res => res.status === this.currentStatus)
      },
      selectable (row) {
        if (row.status === 2) {
          return false
        }
        if (this.selectionDataList.length && row.status !== this.currentStatus) {
          return false
        }
        return true
      },
      toORBackExamine (status) {
        if (!this.selectionDataList.length) {
          this.$message({
            type: 'warning',
            message: '请至少选择一条合同'
          })
          return false
        }
        let ids = this.selectionDataList.map(item => {
          return item.id
        })
        let fineMonth = this.selectionDataList.map(item => {
          return item.cargoDamageMonth
        })
        this.$confirm(`承运商：${ids} 扣罚账期：${fineMonth}`, `确定${status === 2 ? '作废' : (status === 1 ? '反审核' : '审核')}该货损单？`, {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/transresources/trcontract/audit'),
            method: 'post',
            data: this.$http.adornData({
              ids,
              carrierStatus: status
            }, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: `${status === 2 ? '作废' : (status === 1 ? '反审核' : '审核')}成功`,
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
      showDetails (id) {
        this.$router.push({
          path: '/carrier-area/area-detail',
          query: {
            carrierId: id
          }
        })
      },
      // 双击显示详情
      dbShowDetails (row) {
        this.$router.push({
          path: '/carrier-area/area-detail',
          query: {
            carrierId: row.carrierId
          }
        })
      },
      // 新增 / 编辑
      addOrUpdateHandle (id, type) {
        this.$router.push({
          path: '/carrier-area/area-add-or-update',
          query: {
            carrierId: id
          }
        })
      },
      // 导出
      exportExcel () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trcarrierarea/export'),
          method: 'post',
          data: this.$http.adornData({
            'carrierId': this.dataForm.carrierId,
            'areaIdList': this.dataForm.areaIds,
            'goodIdList': this.dataForm.goodIds
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
            window.navigator.msSaveOrOpenBlob(blob, `承运区域${fileName}.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `承运区域${fileName}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      },
      addAgreement (id) {
        this.$router.push({
          path: '/contract/agreement-add',
          query: {
            id: id
          }
        })
      },
      showAgreement (id) {
        this.isShowAgreement = true
        this.$nextTick(() => {
          this.$refs.agreementList.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除${!this.dataListSelections.length ? '这条' : '选中'}数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/transresources/trcontract/delete'),
            method: 'delete',
            data: this.$http.adornData(ids, false)
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
      },
      resetForm () {
        this.dataForm = { carrierId: '',
          areaIds: [],
          goodIds: []
        }
        this.dateValue = []
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
        this.init()
      }
    }
  }
</script>

<template>
  <div class="mod-config" v-loading="loading">
    <el-form>
      <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
        <el-radio-button label="left">已合并</el-radio-button>
        <el-radio-button label="right">待合并</el-radio-button>
      </el-radio-group>
    </el-form>
    <el-form :model="dataForm" @keyup.enter.native="getDataList(listType)" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="编码">
            <el-input v-model="dataForm.code" placeholder="编码" maxlength="25" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="简称">
            <el-input v-model="dataForm.shortName" placeholder="简称" maxlength="25" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="全称">
            <el-input v-model="dataForm.fullName" placeholder="全称" maxlength="50" clearable></el-input>
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
          <el-form-item>
            <el-button type="warning" icon="el-icon-search" @click="getDataList(listType)">查询</el-button>
            <el-button style="background-color: #30b6aa; color: white" plain icon="el-icon-refresh" @click="resetForm(listType)">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="listType === 'BEENMERGED' && isAuth('basic:customer:generate')" type="warning" size="mini" @click="generateFormal()">
              <icon-svg name="generate" style="font-size: 15px; vertical-align: sub;margin-right: 4px"></icon-svg>
              生成客户</el-button>
            <el-button v-if="listType !== 'BEENMERGED' && isAuth('basic:customer:merge')" type="success" size="mini" @click="addOrUpdateHandle('TOMERGE', dataListSelections)">
              <icon-svg name="merge" style="font-size: 15px; vertical-align: sub;margin-right: 4px"></icon-svg>
              合并SAVE货主</el-button>
            <el-button v-if="listType === 'BEENMERGED' && isAuth('basic:out:customers')" icon="el-icon-upload" type="success" size="mini" @click="outPutExcel(listType)">导出</el-button>
            <el-button v-if="listType !== 'BEENMERGED' && isAuth('basic:out:save:customers')" icon="el-icon-upload" type="success" size="mini" @click="outPutExcel(listType)">导出</el-button>
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
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="60">
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
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="code"
        width="180"
        header-align="center"
        align="center"
        label="客户编码"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="shortName"
        width="200"
        header-align="center"
        align="center"
        label="委托方简称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fullName"
        header-align="center"
        align="center"
        label="委托方全称"
        sortable="'custom'"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="listType === 'BEENMERGED'"
        width="180"
        header-align="center"
        align="center"
        label="合并客户数">
        <template slot-scope="{ row }">{{ row.customerNumber }}</template>
      </el-table-column>
      <el-table-column
        v-if="(listType === 'BEENMERGED' && isAuth('basic:merge:save:customer'))||(listType !== 'BEENMERGED' && isAuth('basic:customer:generate'))"
        header-align="center"
        align="center"
        fixed="right"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-document" type="success" size="mini" v-if="listType === 'BEENMERGED' && isAuth('basic:merge:save:customer')" @click="goPage('DETAILS',scope.row.id)">明细</el-button>
          <el-button v-if="listType !== 'BEENMERGED' && isAuth('basic:customer:generate')"  type="warning" size="mini" style="width: 80px" @click="addOrUpdateHandle('GENERATE',scope.row)">
            <icon-svg name="generate" style="font-size: 15px; vertical-align: sub;margin-right: 4px"></icon-svg>
            生成客户</el-button>
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
    <el-form v-if="queryType">
      <el-form-item>
        <el-button @click="$router.push({path: '/'})">返回</el-button>
      </el-form-item>
    </el-form>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList(listType)"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './customer-merge-generate'
  import { toUnderScore, abbreviate, getSelectDate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          code: '',
          shortName: '',
          fullName: ''
        },
        beforeTime: '',
        afterTime: '',
        tabPosition: 'left',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        listType: 'BEENMERGED',
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        queryType: false,
        dateValue: [],
        loading: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      if (this.$route.query.type  === 'UNTREATED') {
        this.queryType = true
      }
      this.init()
    },
    watch: {
      '$route.query.type' (newVal, oldVal) {
        newVal === 'PROCESSED' ? this.queryType = true : this.queryType = false
      },
      tabPosition (newVal) {
        this.dataForm = {}
        this.$refs['tableList'].clearSort()
        this.pageIndex = 1
        this.pageSize = 10
        if (newVal === 'left') {
          this.getDataList('BEENMERGED')
        } else {
          this.getDataList('NOTMERGED')
        }
      }
    },
    methods: {
      init () {
        if (this.$route.query.type === 'UNTREATED') {
          this.tabPosition = 'left'
        }
        if (this.$route.query.type === 'NOTICE') {
          this.tabPosition = 'right'
        }
        if (this.$route.query.time) {
          this.dataForm.condition = this.$route.query.time
          if (this.$route.query.time && this.$route.query.time !== 'customize') {
            this.dateValue = getSelectDate(this.dataForm.condition)
            this.beforeTime = new Date(this.dateValue[0])
            this.afterTime = new Date(new Date(this.dateValue[1]).getTime() + 24 * 3600 * 1000)
            this.getDataList()
          }
          if (this.$route.query.timeValue) {
            this.dateValue = this.$route.query.timeValue.split(',')
            this.beforeTime = new Date(this.dateValue[0])
            this.afterTime = new Date(new Date(this.dateValue[1]).getTime() + 24 * 3600 * 1000)
            this.getDataList()
          }
        } else {
          this.resetForm()
        }
      },
      // 导出报表
      outPutExcel (listType) {
        this.loading = true
        let customers
        let saveCustomers
        let fileName
        if (listType !== 'NOTMERGED') {
          customers =  this.dataListSelections
          fileName = '已合并客户'
        } else {
          saveCustomers = this.dataListSelections
          fileName = '待合并客户'
        }
        this.$http({
          url: listType === 'NOTMERGED' ? this.$http.adornUrl('/basic/save/customer/outPutSaveCustomers') : this.$http.adornUrl('/basic/customer/outPutCustomers'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'code': this.dataForm.code,
            'shortName': this.dataForm.shortName,
            'fullName': this.dataForm.fullName,
            'sort': this.dataForm.sort,
            'beforeTime': this.beforeTime,
            'afterTime': this.afterTime,
            'customers': customers,
            'saveCustomers': saveCustomers
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
          // for IE
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, `${fileName}.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `${fileName}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      },
      // 获取数据列表
      getDataList (listType) {
        this.listType = listType
        if (this.dateValue) {
          this.beforeTime = new Date(this.dateValue[0])
          this.afterTime = new Date(new Date(this.dateValue[1]).getTime() + 24 * 3600 * 1000)
        } else {
          this.beforeTime = ''
          this.afterTime = ''
        }
        this.dataListLoading = true
        this.$http({
          url: listType === 'NOTMERGED' ? this.$http.adornUrl('/transresources/trsaveowner/list') : this.$http.adornUrl('/transresources/trsaveowner/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'code': this.dataForm.code,
            'shortName': this.dataForm.shortName,
            'fullName': this.dataForm.fullName,
            'sort': this.dataForm.sort,
            'beforeTime': this.beforeTime,
            'afterTime': this.afterTime
            // 'condition': this.dataForm.condition
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
        this.getDataList(this.listType)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.listType)
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (type, params) {
        if (type === 'TOMERGE' && this.dataListSelections.length < 1) {
          this.$message.warning('请至少选择一项')
          return false
        }
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(type, params)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除${!this.dataListSelections.length ? '这条' : '选中'}数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/dictionary/delete'),
            method: 'delete',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList(this.listType)
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      goPage (URL, id) {
        if (URL === 'DETAILS') {
          this.$router.push({
            path: '/customer-consolidation-details',
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
        this.$refs['tableList'].clearSort()
        this.getDataList(this.listType)
      },
      generateFormal () {
        if (this.dataListSelections.length < 1) {
          this.$message.warning('请至少选择一项')
          return false
        }
        this.$confirm(`确定生成正式客户?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/basic/customer/addCustomers'),
            method: 'post',
            data: this.$http.adornData({customers: this.dataListSelections})
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '已生成正式客户',
                type: 'success',
                duration: 1500
              })
              this.getDataList(this.listType)
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      changeSort (sortRule) {
        const column = toUnderScore(sortRule.prop)
        const order = abbreviate(sortRule.order)
        this.dataForm.sort = {
          column: column,
          order: order
        }
        this.getDataList(this.listType)
      }
    }
  }
</script>

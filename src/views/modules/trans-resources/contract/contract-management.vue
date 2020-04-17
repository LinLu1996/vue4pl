<template>
  <div class="mod-config" v-loading="loading">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同编号">
            <el-input v-model="dataForm.carrierCode" placeholder="合同编号" maxlength="50" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运商">
            <xkl-select style="width: 100%" v-model="dataForm.shortName" keyType="carrierName" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList" placeholder="承运商名称"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同名称">
            <el-input v-model="dataForm.carrierName" placeholder="合同名称" maxlength="30" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同类型">
            <xkl-select style="width: 100%" v-model="dataForm.carrierType" keyType="carrierType" select-type="CONTRACT_TYPE" placeholder="合同类型"></xkl-select>
          </el-form-item>
        </el-col>
        <!--<el-col :span="8">-->
          <!--<el-form-item label="签订部门">-->
            <!--<xkl-select style="width: 100%" v-model="dataForm.signDep" keyType="departId" labelType="departName" linkage="/sys/sysdepart/getByCompanyId" placeholder="签订部门"></xkl-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="8">
          <el-form-item label="签订部门" prop="signDep">
            <el-popover
              width="200"
              ref="menuListPopover"
              placement="bottom-start"
              trigger="click"
              v-model="menuVisible">
              <el-tree
                :data="menuList"
                :props="menuListTreeProps"
                node-key="departId"
                ref="menuListTree"
                class="menu-el-tree"
                @current-change="menuListTreeCurrentChangeHandle"
                :default-expand-all="true"
                :highlight-current="true"
                :expand-on-click-node="false">
              </el-tree>
            </el-popover>
            <el-input v-model="signDepName" v-popover:menuListPopover placeholder="签订部门" readonly class="menu-list__input" clearable @focus="getMenuList()"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="涉及项目">
            <el-input v-model="dataForm.subProject" placeholder="涉及项目" maxlength="30" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="到期日期">
            <xkl-date-picker type="date" v-model="dataForm.carrierEndDtm" placeholder="到期日期"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同状态">
            <el-select style="width: 100%" v-model="dataForm.carrierStatus" placeholder="合同状态" clearable>
              <el-option value="0" label="待审核"></el-option>
              <el-option value="1" label="已审核"></el-option>
              <el-option value="2" label="已过期"></el-option>
              <el-option value="3" label="生效中"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;padding-right: 5px">
          <el-button v-if="isAuth('transresources:trcontract:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          <el-button v-if="isAuth('transresources:trcontract:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('transresources:trcontract:save')" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
            <el-button v-if="isAuth('transresources:trcontract:auditA')" type="success" size="mini" :disabled="currentStatus === 1 || currentStatus === 3 || this.selectionDataList.length === 0" @click="toORBackExamine(1)">
              <icon-svg name="审核" style="vertical-align: middle"></icon-svg>
              审核</el-button>
            <el-button v-if="isAuth('transresources:trcontract:auditT')" type="success" size="mini" :disabled="currentStatus === 0 || this.selectionDataList.length === 0" @click="toORBackExamine(0)">
              <icon-svg name="反审核" style="vertical-align: middle"></icon-svg>
              反审核</el-button>
            <el-button v-if="isAuth('transresources:trcontract:auditI')" type="danger" size="mini" @click="toORBackExamine(2)">
              <icon-svg name="作废" style="vertical-align: middle"></icon-svg>
              作废</el-button>

            <el-button v-if="isAuth('transresources:trcontractsideagreement:save')" type="primary" size="mini" :disabled="currentStatus === ''|| this.selectionDataList.length>1"
                       @click="addAgreement()">
              <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
              添加补充协议</el-button>
              <el-button v-if="isAuth('transresources:trcontract:outPutContract')" type="success" size="mini" style="margin-bottom: 5px"  icon="el-icon-download" @click="outPutExcel">导出</el-button>
            <el-button type="primary" size="small"
                       v-if="isAuth('transresources:trcontract:takeEffect')
            && isAuth('transresources:trcontract:update')
            && isAuth('transresources:trcontract:info')"
                       :disabled="currentStatus !== 1 || this.selectionDataList.length !== 1" @click="showEffectDetails(true)">
              <icon-svg name="审核" style="vertical-align: middle"></icon-svg>
              生效</el-button>
            <!--<el-button v-if="isAuth('sys:dict:delete')" type="danger" @click="deleteHandle()" size="mini" :disabled="dataListSelections.length <= 0">-->
              <!--<icon-svg name="批量删除" style="vertical-align: middle"></icon-svg>-->
              <!--批量删除</el-button>-->
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
        type="selection"
        header-align="center"
        align="center"
        width="60"
        :selectable="selectable">
      </el-table-column>
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="carrierCode"
        header-align="center"
        width="180"
        align="center"
        label="合同编号"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierName"
        header-align="center"
        align="center"
        label="合同名称"
        min-width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="shortName"
        header-align="center"
        align="center"
        label="承运商"
        min-width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="contractTypeName"
        header-align="center"
        align="center"
        label="合同类型"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierEndDtm"
        header-align="center"
        align="center"
        label="履行期限"
        width="200"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ `${row.carrierStartDtm ? $formatDate(row.carrierStartDtm) : ''}
          ~ ${row.carrierEndDtm ? $formatDate(row.carrierEndDtm) : ''}`}}
        </template>
      </el-table-column>
      <el-table-column
        prop="signDtm"
        header-align="center"
        align="center"
        label="签订日期"
        width="120"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ row.signDtm ? $formatDate(row.signDtm) : '' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="departName"
        header-align="center"
        align="center"
        label="签订部门"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="subProject"
        header-align="center"
        align="center"
        label="涉及项目"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierStatus"
        header-align="center"
        align="center"
        label="状态"
        width="120"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-tag v-if="row.carrierStatus === 0" size="mini">待审核</el-tag>
          <el-tag v-if="row.carrierStatus === 1" size="mini" type="success">已审核</el-tag>
          <el-tag v-if="row.carrierStatus === 2" size="mini" type="info">已过期</el-tag>
          <el-tag v-if="row.carrierStatus === 3" size="mini" type="warning">生效中</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isAuth('transresources:trcontract:update') || isAuth('transresources:trcontract:info') || isAuth('transresources:trcontractsideagreement:list')"
        header-align="center"
        align="center"
        width="240"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('transresources:trcontract:update')" type="primary" size="small" @click="addOrUpdateHandle(scope.row.id, scope.row.carrierStatus)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑</el-button>
          <!--<el-button icon="el-icon-circle-plus-outline" type="success" size="mini" @click="addAgreement(scope.row.id)">添加补充协议</el-button>-->
          <el-button v-if="isAuth('transresources:trcontract:info')" type="warning" size="small" @click="showDetails(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情</el-button>
          <el-button v-if="isAuth('transresources:trcontractsideagreement:list')" type="primary" size="small" @click="showAgreement(scope.row.id)">
            <icon-svg name="合同管理" style="vertical-align: middle"></icon-svg>
            补充协议</el-button>
          <!--<el-button v-if="isAuth('sys:dict:delete')" type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>-->
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
    <contract-details v-if="isShowDetails" ref="showDetails" @refreshDataList="resetForm"></contract-details>
    <agreement-list v-if="isShowAgreement" ref="agreementList" @refreshDataList="getDataList"></agreement-list>
  </div>
</template>

<script>
  import { formatDate, treeDataTranslate } from '@/utils';
  import ContractDetails from './contract-details'
  import AgreementList from './agreement-list'
  export default {
    data () {
      return {
        dataForm: {
          carrierCode: '',
          shortName: '',
          carrierName: '',
          carrierType: '',
          signDep: '',
          subProject: '',
          carrierEndDtm: '',
          carrierStatus: ''
        },
        signDepName: '',
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
        loading: false,
        menuVisible: false,
        menuList: [],
        menuListTreeProps: {
          label: 'departName',
          children: 'children'
        }
      }
    },
    components: {
      ContractDetails,
      AgreementList
    },
    activated () {
      this.resetForm()
      this.$nextTick(() => {
        this.init()
      })
    },
    watch: {
      'signDepName' (newVal) {
        if (newVal === '') {
          this.dataForm.signDep = undefined
        }
      }
    },
    methods: {
      init () {
        if (this.$route.params.id) {
          this.showAgreement(this.$route.params.id)
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
          url: this.$http.adornUrl('/transresources/trcontract/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm,
            'carrierEndDtm': this.dataForm.carrierEndDtm ? formatDate(this.dataForm.carrierEndDtm) : ''
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.dataList = this.dataList.map(res => {
              if (res.signDtm) {
                res.signDtm = formatDate(res.signDtm)
              }
              res.carrierStartDtm = res.carrierStartDtm ? formatDate(res.carrierStartDtm) : ''
              res.carrierEndDtm = res.carrierEndDtm ? formatDate(res.carrierEndDtm) : ''
              return res
            })
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      getMenuList () {
        this.$http({
          url: this.$http.adornUrl('/sys/sysdepart/getByCompanyId'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            // 'limit': this.linkage ? this.pageSize : 999,
            'limit': 999
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.menuList = treeDataTranslate(data.page.list, 'departId', 'parentDepartId');
            this.menuList = this.menuList.map(res => {
              res.disabled = true
              return res
            })
            // this.$store.commit('dict/updateList', this.dataList)
            this.totalPage = data.page.totalCount
          } else {
            this.menuList = []
            this.totalPage = 0
          }
          this.loading = false
        })
      },
      menuListTreeCurrentChangeHandle (data, node) {
        // this.dataForm.parentId = data.menuId
        this.dataForm.signDep = data.departId
        this.signDepName = data.departName
        this.menuVisible = false
      },
      outPutExcel () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trcontract/outPutContract'),
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
            window.navigator.msSaveOrOpenBlob(blob, `合同信息${fileName}.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `合同信息${fileName}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
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
          this.currentStatus = val[0].carrierStatus
        } else {
          this.currentStatus = ''
        }
        this.selectionDataList = val.filter(res => res.carrierStatus === this.currentStatus)
      },
      selectAll () {
        this.selectionDataList = this.selectionDataList.filter(res => res.carrierStatus === this.currentStatus)
      },
      selectable (row) {
        if (row.carrierStatus === 2) {
          return false
        }
        if (this.selectionDataList.length && row.carrierStatus !== this.currentStatus) {
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
        let carrierNames = this.selectionDataList.map(item => {
          return item.carrierName
        })
        this.$confirm(`合同名称：${carrierNames}`, `确定${status === 2 ? '作废' : (status === 0 ? '反审核' : '审核')}该合同？`, {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          dangerouslyUseHTMLString: true,
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
                message: `${status === 2 ? '作废' : (status === 0 ? '反审核' : '审核')}成功`,
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
        this.isShowDetails = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(id)
        })
      },
      showEffectDetails (isEdit) {
        const id = this.selectionDataList[0].id
        this.isShowDetails = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(id, isEdit)
        })
      },
      // 双击显示详情
      dbShowDetails (row) {
        this.isShowDetails = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(row.id)
        })
      },
      // 新增 / 编辑
      addOrUpdateHandle (id, type) {
        if (type && type !== 0) {
          this.$message.warning('该条数据不能编辑')
          return
        }
        this.$router.push({
          path: '/contract/contract-add-or-update',
          query: {
            id: id
          }
        })
      },
      addAgreement (id) {
        this.$router.push({
          path: '/contract/agreement-add',
          query: {
            contractId: this.selectionDataList[0].id,
            signCompany: this.selectionDataList[0].signCompany
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
        this.dataForm = {}
        this.dateValue = []
        this.signDepName = ''
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/.menu-el-tree{
    width: 100%;
    height: 200px;
    overflow-y: scroll;
  }
</style>

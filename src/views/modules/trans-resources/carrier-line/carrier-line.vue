<template>
  <div class="mod-config" v-loading="loading">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="承运商">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" keyType="id" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList" placeholder="请选择或者输入查找"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运区域">
            <xkl-select style="width: 100%" v-model="dataForm.carriageAreaId" keyType="id" labelType="name" linkage="/sys/sysregion/noPowerList " placeholder="请选择或者输入查找"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="始发地">
            <xkl-select style="width: 100%" v-model="dataForm.startCityId" keyType="id" labelType="name" linkage="/sys/sysregion/citySelect " placeholder="请选择或者输入查找"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目的地省">
            <xkl-select style="width: 100%" v-model="dataForm.endProvinceId" keyType="id" labelType="name" linkage="/sys/sysregion/provinceSelect " placeholder="请选择或者输入查找"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目的地城市">
            <xkl-select style="width: 100%" v-model="dataForm.endCityId" keyType="id" labelType="name" linkage="/sys/sysregion/citySelect " placeholder="请选择或者输入查找"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="优选顺序">
<!--            <xkl-select style="width: 100%" v-model="dataForm.goodSort" keyType="carrierName" labelType="carrierName" linkage="/transresources/trcarrier/findList " placeholder="选择或输入查找"></xkl-select>-->
            <el-input style="width: 100%" v-model="dataForm.goodSort" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属项目">
            <el-input style="width: 100%" v-model="dataForm.belongProject" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否优势线路">
            <el-select style="width: 100%" v-model="dataForm.isGoodLine" placeholder="请选择" clearable>
              <el-option value="0" label="是"></el-option>
              <el-option value="1" label="否"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;padding-right: 5px">
          <el-button v-if="isAuth('transresources:trcarrierline:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          <el-button v-if="isAuth('transresources:trcarrierline:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('transresources:trcarrierline:save')" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
            <!--<xkl-upload v-model="dataForm.carLicence.attachments" :config="uploadConfig"></xkl-upload>-->
            <el-button v-if="isAuth('transresources:trcarrierline:trueExport')" type="success" size="mini" icon="el-icon-upload" @click="uploadPageHandle(dataForm.id)">导入</el-button>
            <el-button v-if="isAuth('transresources:trcarrierline:export')" type="success" size="mini"  icon="el-icon-download" @click="outPutExcel">导出</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      @row-dblclick="dbShowDetails"
      @selection-change="selectionChangeHandle"
      @select-all="selectAll"
      style="width: 100%;">
      <el-table-column
        prop="id"
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="carrierName"
        header-align="center"
        width="120"
        align="center"
        label="承运商"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="prdName"
        header-align="center"
        align="center"
        width="120"
        label="产品"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carriageAreaName"
        header-align="center"
        align="center"
        label="承运区域"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="startCityName"
        header-align="center"
        align="center"
        label="始发地"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="endProvinceName"
        header-align="center"
        align="center"
        label="目的地省"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="endCityName"
        header-align="center"
        align="center"
        label="目的地城市"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="belongProject"
        header-align="center"
        align="center"
        label="所属项目"
        min-width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="isGoodLine"
        header-align="center"
        align="center"
        label="是否优势线路"
        width="140"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isGoodLine== 0" size="small">是</el-tag>
          <el-tag v-if="scope.row.isGoodLine== 1" size="small" type="danger">否</el-tag>
         <!-- <el-switch
            @change="(val) => handleStatus(val, scope.row.id)"
            v-model="scope.row.isGoodLine"
            active-color="#13ce66"
          >
          </el-switch>-->
        </template>
      </el-table-column>
      <el-table-column
        prop="goodSort"
        header-align="center"
        align="center"
        label="优选顺序"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="isAuth('transresources:trcarrierline:update') || isAuth('transresources:trcarrierline:info')"
        header-align="center"
        align="center"
        width="160"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('transresources:trcarrierline:update')" type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑</el-button>
          <el-button v-if="isAuth('transresources:trcarrierline:info')" type="warning" size="small" @click="showDetails(scope.row.id)">
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
    <upload-page
      v-if="importVisible"
      ref="uploadPage"
      title="承运线路导入"
      fileName="承运线路导入模板.xlsx"
      uploadUrl="/transresources/trcarrierline/import"
      submitUrl="/transresources/trcarrierline/trueExport"
      :acceptType="['xls', 'xlsx']"
      @refreshDataList="getDataList"></upload-page>
    <line-details v-if="isShowDetails" ref="showDetails" @refreshDataList="getDataList"></line-details>
    <add-o-r-update v-if="isShowAgreement" ref="agreementList" @refreshDataList="getDataList"></add-o-r-update>
    <upload-road-feedback v-if="uploadRoadFeedbackVisible" ref="uploadRoadFeedback" @refreshDataList="getSearchDataList"></upload-road-feedback>
  </div>
</template>

<script>
  import lineDetails from './line-details'
  import AddORUpdate from './line-add-or-update'
  import uploadPage from '@/components/upload/upload-page'
  import UploadRoadFeedback from '../../trans-resources/carrier/upload-road-feedback'
  export default {
    data () {
      return {
        dataForm: {
          carrierId: '',
          carriageAreaId: '',
          startCityId: '',
          endProvinceId: '',
          endCityId: '',
          goodSort: '',
          isGoodLine: '',
          belongProject: ''
        },
        importVisible: false,
        dataList: [],
        uploadConfig: {
          fileListType: 'text', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: false, // 当使用导入功能时置为false 默认true
          uploadUrl: '', // 文件上传地址
          downloadUrl: '', // 文件下载地址
          single: false // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
        },
        urls: '',
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
        dataListSelections: [],
        uploadRoadFeedbackVisible: false,
        loading: false
      }
    },
    watch: {
    },
    components: {
      lineDetails,
      AddORUpdate,
      UploadRoadFeedback,
      uploadPage
    },
    activated () {
      this.urls = this.$http.adornUrl(`/transresources/trcarrierline/import?token=${this.$cookie.get('token')}`)
      this.resetForm()
    },
    methods: {
      init () {
        if (this.$route.params.id === 'AD') {
          this.showAgreement()
        }
      },
      // 编辑状态
      handleStatus (isGoodLine) {
        let ids = this.selectionDataList.map(item => {
          return item.id
        })
        this.$http({
          url: this.$http.adornUrl('/transresources/trcarrierline/updateIsGoodLineByIds'),
          method: 'post',
          data: this.$http.adornData({
            'ids': ids,
            'isGoodLine': isGoodLine
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.getDataList()
          } else {
            this.$message(data.msg)
          }
        })
      },
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      outPutExcel () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trcarrierline/export'),
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
            window.navigator.msSaveOrOpenBlob(blob, `承运线路${fileName}.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `承运线路${fileName}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trcarrierline/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'carrierId': this.dataForm.carrierId,
            'carriageAreaId': this.dataForm.carriageAreaId,
            'startCityId': this.dataForm.startCityId,
            'endProvinceId': this.dataForm.endProvinceId,
            'endCityId': this.dataForm.endCityId,
            'goodSort': this.dataForm.goodSort,
            'isGoodLine': this.dataForm.isGoodLine,
            'belongProject': this.dataForm.belongProject
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            // this.dataList = data.page.list
            this.dataList = data.page.list
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
        this.isShowDetails = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(id)
        })
      },
      // 双击显示详情
      dbShowDetails (row) {
        this.isShowDetails = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(row.id)
        })
      },
      uploadPageHandle (id) {
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPage.init(id)
        })
      },
      // 新增 / 编辑
      addOrUpdateHandle (id, type) {
        this.$router.push({
          path: '/carrier-line/line-add-or-update',
          query: {
            id: id,
            type: type
          }
        })
      },
      handleAvatarSuccess (response) {
        this.uploadRoadFeedbackVisible = true
        this.$nextTick(() => {
          this.$refs.uploadRoadFeedback.init(response)
        })
      },
      handleChange (file) {
        this.dataListLoading = true
        if (file.status === 'success') {
          this.dataListLoading = true
        }
      },
      checkUpload (file) {
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          this.$message.warning('文件不能大于50M')
          return false
        }
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
            url: this.$http.adornUrl('/transresources/trcarrierline/delete'),
            method: 'post',
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
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
        this.init()
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/.el-form-item__label{
    font-family: Roboto;
    font-weight: 400;
    font-size: 12px;
    color: rgb(16, 16, 16);
    font-style: normal;
    letter-spacing: 0px;
    line-height: 17px;
    text-decoration: none;
    float: none;
    padding: 0;
  }
</style>

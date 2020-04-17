<template>
  <div class="mod-config" v-loading="loading">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="车牌号">
            <el-input v-model="dataForm.carNumber" placeholder="车牌号" maxlength="20" clearable></el-input>
            <!--<xkl-select style="width: 100%" v-model="dataForm.carrierId" labelType="carrierName" linkage="/transresources/trcarrier/findList" select-type="OPERATION_TYPE" placeholder="承运商名称"></xkl-select>-->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运商">
<!--            <el-input v-model="dataForm.carrierName" placeholder="承运商名称" maxlength="30" clearable></el-input>-->
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList" select-type="OPERATION_TYPE" placeholder="承运商"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车型">
            <xkl-select style="width: 100%" v-model="dataForm.carType" select-type="CAR_TYPE" placeholder="车辆类型"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="验证状态">
            <el-select v-model="dataForm.isChecked" style="width: 100%;" :clearable="true">
              <el-option key="0" label="不合格" :value="0">
              </el-option>
              <el-option key="1" label="合格" :value="1">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select v-model="dataForm.isEnabled" style="width: 100%;" :clearable="true">
              <el-option key="0" label="有效" :value="0">
              </el-option>
              <el-option key="1" label="无效" :value="1">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;padding-right: 5px">
          <el-button v-if="isAuth('transresources:trcar:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          <el-button v-if="isAuth('transresources:trcar:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('transresources:trcar:save')" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
            <el-button v-if="isAuth('transresources:trcar:updateIsEnabledByIdso')"
              @click="handleStatus(0)"
              size="mini" icon="el-icon-check"
              :disabled="this.dataListSelections.length === 0 || currentStatus === 0"
              type="danger">启用</el-button>
            <el-button v-if="isAuth('transresources:trcar:updateIsEnabledByIdsc')"
              @click="handleStatus(1)"
              size="mini" icon="el-icon-close"
              :disabled="this.dataListSelections.length === 0 || currentStatus === 1"
              type="danger">禁用</el-button>
            <el-button v-if="isAuth('transresources:trcar:trueExport')" type="success" size="mini" icon="el-icon-upload" @click="uploadPageHandle(dataForm.id, 'info')">导入</el-button>
            <el-button v-if="isAuth('transresources:trcar:exportannex')" type="success" size="mini" icon="el-icon-upload" @click="uploadPageHandle(dataForm.id)">附件导入</el-button>
            <el-button v-if="isAuth('transresources:trcar:outPutExcel')" type="success" size="mini"  icon="el-icon-download" @click="outPutExcel">导出</el-button>
              <el-button v-if="isAuth('transresources:trcar:annualReview')" type="success" size="mini" @click="annualReview">
                <icon-svg name="审核" style="vertical-align: middle"></icon-svg>
                年审</el-button>
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
      style="width: 100%;"
      @selection-change="selectionChangeHandle"
      @row-dblclick="dbShowDetails">
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
        prop="carNumber"
        header-align="center"
        align="center"
        label="车牌号"
        min-width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierName"
        header-align="center"
        align="center"
        label="承运商"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carValue"
        header-align="center"
        align="center"
        width="120"
        label="车型"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carLoad"
        header-align="center"
        align="center"
        width="120"
        label="载重"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="warmArea"
        header-align="center"
        align="center"
        min-width="160"
        label="温区"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="validTime"
        header-align="center"
        align="center"
        min-width="120"
        label="有效期"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          {{row.validTime ? $formatDate(row.validTime) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="isChecked"
        header-align="center"
        align="center"
        width="120"
        label="验证状态"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <!--{{scope.row.isChecked === 0 ? '验证不合格' : '验证合格'}}-->
          <el-tag v-if="scope.row.isChecked== 0" size="small" type="warning">不合格</el-tag>
          <el-tag v-if="scope.row.isChecked== 1" size="small" type="success">合格</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isEnabled"
        header-align="center"
        align="center"
        width="120"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled== 0" size="small">有效</el-tag>
          <el-tag v-if="scope.row.isEnabled== 1" size="small" type="danger">无效</el-tag>
          <!--<label class="el-form-item__label" v-if="scope.row.isEnabled== 0">有效</label>
          <label class="el-form-item__label" v-if="scope.row.isEnabled== 1">无效</label>-->
          <!--<el-switch
            @change="(val) => handleStatus(val, scope.row.id)"
            v-model="scope.row.isEnabled"
            active-color="#13ce66"
          >
          </el-switch>-->
        </template>
      </el-table-column>
      <el-table-column
        v-if="isAuth('transresources:trcar:update') || isAuth('transresources:trcar:detail') || isAuth('transresources:trcarcheck:list')"
        header-align="center"
        align="center"
        width="260"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('transresources:trcar:update')" type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑
          </el-button>
          <el-button v-if="isAuth('transresources:trcar:detail')" type="warning" size="small" @click="showDetails(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情</el-button>
<!--          <el-button style="width: 80px" type="primary" size="small" @click="handleCarMaintenance(scope.row.id)">-->
<!--            <icon-svg name="detail" style="vertical-align: middle"></icon-svg>-->
<!--            维保记录-->
<!--          </el-button>-->
<!--          <el-button style="width: 80px" type="primary" size="small" @click="check(scope.row.id, scope)">-->
<!--            <icon-svg name="luruyanzheng" style="vertical-align: middle"></icon-svg>-->
<!--            录入验证-->
<!--          </el-button>-->
          <el-button v-if="isAuth('transresources:car:trcarcheck') && isAuth('transresources:trcarcheck:list')" style="width: 80px" type="primary" size="small" @click="handleResult(scope.row.id)">
            <icon-svg name="detail" style="vertical-align: middle"></icon-svg>
            验证结果
          </el-button>
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
      v-if="importVisible1"
      ref="uploadPage1"
      title="车辆信息导入"
      fileName="车辆导入模板.xlsx"
      uploadUrl="/transresources/trcar/export"
      submitUrl="/transresources/trcar/trueExport"
      :acceptType="['xls', 'xlsx']"
      @refreshDataList="getDataList"></upload-page>
    <upload-page
      v-if="importVisible2"
      ref="uploadPage2"
      title="车辆附件导入"
      fileName="车辆附件模板.zip"
      uploadUrl="/transresources/trcar/exportannex"
      submitUrl=""
      subText="支持扩展名.zip文件"
      :acceptType="['zip']"
      @refreshDataList="getDataList"></upload-page>
    <check v-if="checkVisible" ref="check" @refreshDataList="getDataList"></check>
    <car-details v-if="isShowDetails" ref="showDetails" @refreshDataList="getDataList"></car-details>
    <upload-road-feedback v-if="uploadRoadFeedbackVisible" ref="uploadRoadFeedback" @refreshDataList="getSearchDataList"></upload-road-feedback>
    <validation-record v-if="resultVisible" ref="resultUpdate" @refreshDataList="getDataList"></validation-record>
  </div>
</template>

<script>
  import Check from './check'
  import { toUnderScore, abbreviate, formatDate } from '@/utils'
  import UploadRoadFeedback from '../carrier/upload-road-feedback'
  import uploadPage from '@/components/upload/upload-page'
  import carDetails from './car-details'
  import validationRecord from '../car-validation/validation-record'
  export default {
    data () {
      return {
        dataForm: {
          carNumber: '',
          carrierId: '',
          carrierName: '',
          carType: '',
          isChecked: '',
          isEnabled: ''
        },
        importVisible1: false,
        importVisible2: false,
        dataList: [],
        isShowDetails: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        checkVisible: false,
        resultVisible: false,
        dataListSelections: [],
        sort: {},
        selectionVisible: false,
        urls: '',
        uploadRoadFeedbackVisible: false,
        currentStatus: '',
        loading: false
      }
    },
    components: {
      Check,
      UploadRoadFeedback,
      carDetails,
      validationRecord,
      uploadPage
    },
    activated () {
      this.urls = this.$http.adornUrl(`/transresources/trcar/export?token=${this.$cookie.get('token')}`)
      this.selectionVisible = false
      this.dataForm.carrierId = this.$route.query.id ? this.$route.query.id : ''
      this.pageIndex = 1
      this.pageSize = 10
      this.getDataList()
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
          url: this.$http.adornUrl('/transresources/trcar/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.dataList = this.dataList.map(res => {
              if (res.validTime) {
                res.validTime = formatDate(res.validTime)
              }
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
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        this.$router.push({
          path: '/car/car-add-or-update',
          query: {
            id: id
          }
        })
      },
      // 导出报表
      outPutExcel () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trcar/outPutExcel'),
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
            window.navigator.msSaveOrOpenBlob(blob, `车辆导出${fileName}.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `车辆导出${fileName}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      },
      // 检查
      check (id, scope) {
        this.checkVisible = true
        this.$nextTick(() => {
          this.$refs.check.init(id, scope)
        })
      },
      // 年审
      annualReview () {
        if (this.dataListSelections.length < 1) {
          this.$message({
            type: 'warning',
            message: '至少选择一条数据'
          })
          return false
        }
        let carIds = this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定年审${!carIds ? '这条' : '选中'}数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/transresources/trcar/annualReview'),
            method: 'post',
            data: this.$http.adornData(carIds, false)
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
        })
      },
      // 验证结果
      handleResult (id) {
        this.resultVisible = true
        this.$nextTick(() => {
          this.$refs.resultUpdate.init(id, this.values)
        })
      },
      uploadPageHandle (id, type) {
        if (type === 'info') {
          this.importVisible1 = true
          this.$nextTick(() => {
            this.$refs.uploadPage1.init(id)
          })
        } else {
          this.importVisible2 = true
          this.$nextTick(() => {
            this.$refs.uploadPage2.init(id)
          })
        }
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
      // 多选
      selectionChangeHandle (val) {
        if (val.length) {
          this.currentStatus = val[0].isEnabled
        } else {
          this.currentStatus = ''
        }
        this.dataListSelections = val
      },
      selectAll () {
        this.dataListSelections = this.dataListSelections.filter(res => res.isEnabled === this.currentStatus)
      },
      selectable (row) {
        if (this.dataListSelections.length && row.isEnabled !== this.currentStatus) {
          return false
        }
        return true
      },
      // 编辑状态
      handleStatus (status) {
        let ids = this.dataListSelections.map(item => {
          return item.id
        })
        this.$http({
          url: this.$http.adornUrl('/transresources/trcar/updateIsEnabledByIds'),
          method: 'post',
          data: this.$http.adornData({
            'ids': ids,
            'isEnabled': status
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 维保记录
      handleCarMaintenance (id) {
        this.$router.push({
          path: '/carMaintenance',
          query: {
            id: id
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
      },
      /* handleSelectionChange (val) {
        this.dataListSelections = val
      }, */
      checkUpload (file) {
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          this.$message.warning('文件不能大于50M')
          return false
        }
      },
      handleChange (file) {
        this.dataListLoading = true
        if (file.status === 'success') {
          this.dataListLoading = true
        }
      },
      handleAvatarSuccess (response) {
        console.log(response)
        this.uploadRoadFeedbackVisible = true
        this.$nextTick(() => {
          this.$refs.uploadRoadFeedback.init(response)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/.el-table__body-wrapper{
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
  /deep/.el-form-item__label{
    font-family: Roboto;
    font-weight: 400;
    font-size: 12px;
    color: rgb(16, 142, 233);
    font-style: normal;
    letter-spacing: 0px;
    line-height: 17px;
    text-decoration: none;
    float: none;
    padding: 0;
  }
</style>

<template>
  <div class="mod-config" v-loading="loading">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="司机姓名">
            <el-input v-model="dataForm.driverName" maxlength="16" placeholder="司机姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运商">
<!--            <el-input v-model="dataForm.carrierName" placeholder="承运商" clearable maxlength="30"></el-input>-->
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList" select-type="OPERATION_TYPE" placeholder="承运商名称"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证号">
            <el-input v-model="dataForm.driverIdcard" maxlength="18" placeholder="身份证号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="准驾车型">
            <xkl-select style="width: 100%" v-model="dataForm.driveAllowType" select-type="PERMIT_DRIVEING_TYPE" placeholder="请选择"></xkl-select>
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
          <el-button v-if="isAuth('transresources:trdriver:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          <el-button v-if="isAuth('transresources:trdriver:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('transresources:trdriver:save')" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
            <el-button v-if="isAuth('transresources:trdriver:updateIsEnabledByIdso')"
              @click="handleStatus(0)"
              size="mini" icon="el-icon-check"
              :disabled="this.dataListSelections.length === 0 || currentStatus === 0"
              type="danger">启用</el-button>
            <el-button v-if="isAuth('transresources:trdriver:updateIsEnabledByIdsc')"
              @click="handleStatus(1)"
              size="mini" icon="el-icon-close"
              :disabled="this.dataListSelections.length === 0 || currentStatus === 1"
              type="danger">禁用</el-button>
            <el-button v-if="isAuth('transresources:trdriver:trueExport')" type="success" size="mini" icon="el-icon-upload" @click="uploadPageHandle(dataForm.id, 'info')">导入</el-button>
            <el-button v-if="isAuth('transresources:trdriver:exportannex')" type="success" size="mini" icon="el-icon-upload" @click="uploadPageHandle(dataForm.id)">附件导入</el-button>
            <el-button v-if="isAuth('transresources:trdriver:outPutExcel')" type="success" size="mini"  icon="el-icon-download" @click="outPutExcel">导出</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      @row-dblclick="dbHandleDetail"
      @selection-change="selectionChangeHandle"
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
        prop="driverName"
        header-align="center"
        align="center"
        width="120"
        label="司机姓名"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="driverIdcard"
        header-align="center"
        align="center"
        width="180"
        label="身份证号"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierName"
        align="center"
        label="承运商"
        min-width="160"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="driveAllowType"
        align="center"
        width="120"
        label="准驾车型"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="certificationTime"
        align="center"
        width="150"
        label="初次领证日期"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          {{$formatDate(row.certificationTime)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="validTime"
        align="center"
        width="150"
        label="证件有效期至"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          {{$formatDate(row.validTime)}}
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
        v-if="isAuth('transresources:trdriver:update') || isAuth('transresources:trdriver:detail')"
        header-align="center"
        align="center"
        fixed="right"
        width="160"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('transresources:trdriver:update')" type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑</el-button>
          <el-button v-if="isAuth('transresources:trdriver:detail')" type="warning" size="mini" @click="handleDetail(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情</el-button>
<!--          <el-button v-if="isAuth('sys:config:delete')" type="danger" size="mini" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>-->
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
      title="司机信息导入"
      fileName="司机导入模板.xlsx"
      uploadUrl="/transresources/trdriver/export"
      submitUrl="/transresources/trdriver/trueExport"
      :acceptType="['xls', 'xlsx']"
      @refreshDataList="getDataList"></upload-page>
    <upload-page
      v-if="importVisible2"
      ref="uploadPage2"
      title="司机附件导入"
      fileName="司机附件模板.zip"
      uploadUrl="/transresources/trdriver/exportannex"
      submitUrl=""
      subText="支持扩展名.zip文件"
      :acceptType="['zip']"
      @refreshDataList="getDataList"></upload-page>
    <driver-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false" @refreshDataList="getDataList"></driver-add-or-update>
    <driver-detail v-if="detailVisible" ref="detailUpdate" @refreshDataList="getDataList"></driver-detail>
    <upload-road-feedback v-if="uploadRoadFeedbackVisible" ref="uploadRoadFeedback" @refreshDataList="getSearchDataList"></upload-road-feedback>
  </div>
</template>

<script>
  import { formatDate } from '@/utils'
  import DriverAddOrUpdate from './driver-add-or-update'
  import uploadPage from '@/components/upload/upload-page'
  import DriverDetail from './driver-detail'
  import UploadRoadFeedback from '../carrier/upload-road-feedback'
  export default {
    data () {
      return {
        dataForm: {
          carrierId: '',
          driverName: '',
          driveAllowType: '',
          carrierName: '',
          driverIdcard: '',
          isEnabled: ''
        },
        dataList: [
          {}
        ],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        detailVisible: false,
        importVisible1: false,
        importVisible2: false,
        urls: '',
        uploadRoadFeedbackVisible: false,
        currentStatus: '',
        loading: false
      }
    },
    components: {
      DriverAddOrUpdate,
      DriverDetail,
      UploadRoadFeedback,
      uploadPage
    },
    activated () {
      this.urls = this.$http.adornUrl(`/transresources/trdriver/export?token=${this.$cookie.get('token')}`)
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
          url: this.$http.adornUrl('/transresources/trdriver/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list.length ? data.page.list.map(item => {
              item.driverBirthday = formatDate(item.driverBirthday)
              item.certificationTime = formatDate(item.certificationTime)
              item.validTime = formatDate(item.validTime)
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
          url: this.$http.adornUrl('/transresources/trdriver/updateIsEnabledByIds'),
          method: 'post',
          data: this.$http.adornData({
            'ids': ids,
            'isEnabled': status
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.getDataList()
          } else {
            this.$message(data.msg)
          }
        })
      },
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 导出报表
      outPutExcel () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trdriver/outPutExcel'),
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
            window.navigator.msSaveOrOpenBlob(blob, `司机导出${fileName}.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `司机导出${fileName}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
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
      // 详情
      handleDetail (id) {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.detailUpdate.init(id)
        })
      },
      // 双击显示详情
      dbHandleDetail (row) {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.detailUpdate.init(row.id)
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
            url: this.$http.adornUrl('/transresources/trdriver/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
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

<template>
  <div>
    <el-form :model="dataForm" ref="dataForm" label-width="90px">
      <el-row>
        <el-col :span="24" style="text-align: right; margin-bottom: 10px;">
          <div style="display: inline-block">
            <el-upload
              :action="urls"
              :show-file-list="false"
              :before-upload="checkUpload"
              :on-change="handleChange"
              :on-success="handleAvatarSuccess"
            >
              <el-button type="primary" size="mini" >导入</el-button>
            </el-upload>
          </div>
          <el-button icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      v-loading="dataListLoading"
      border
      style="width: 100%;">
      <el-table-column
        prop="maintenanceDtm"
        header-align="center"
        align="center"
        label="维保日期">
      </el-table-column>
      <el-table-column
        prop="maintenanceItem"
        header-align="center"
        align="center"
        label="维保项目">
      </el-table-column>
      <el-table-column
        prop="changeComponent"
        header-align="center"
        align="center"
        label="更换部件">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        width="330"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑
          </el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">
            删除
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel()">关闭</el-button>
    </span>
    <maintenance-add-or-update v-if="maintenanceAddOrUpdateVisible" ref="maintenanceAddOrUpdate" @refreshDataList="getSearchDataList"></maintenance-add-or-update>
    <upload-road-feedback v-if="uploadRoadFeedbackVisible" ref="uploadRoadFeedback" @refreshDataList="getSearchDataList"></upload-road-feedback>
  </div>
</template>

<script>
  import MaintenanceAddOrUpdate from './maintenance-add-or-update'
  import UploadRoadFeedback from '../carrier/upload-road-feedback'
  export default {
    data () {
      return {
        dataForm: {
          carId: ''
        },
        urls: '',
        visible: false,
        clickFlag: true,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        maintenanceAddOrUpdateVisible: false,
        uploadRoadFeedbackVisible: false
      }
    },
    components: {
      UploadRoadFeedback,
      MaintenanceAddOrUpdate
    },
    activated () {
      const id = this.$route.query.id || null
      this.init(id)
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.carId = id || 0
        this.urls = this.$http.adornUrl(`/transresources/trcarmaintenance/export?token=${this.$cookie.get('token')}&carId=${this.dataForm.carId}`)
        this.visible = true
        this.$nextTick(() => {
          this.getSearchDataList()
        })
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
        if (response.code === 0) {
          if (response.feedBack.falseNumber === 0) {
            this.$message.success('上传成功');
            this.$nextTick(() => {
              this.getSearchDataList()
            })
          } else {
            this.uploadRoadFeedbackVisible = true
            this.$nextTick(() => {
              this.$refs.uploadRoadFeedback.init(response)
            })
          }
        } else {
          this.$message.error('上传失败');
          this.getSearchDataList()
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
          url: this.$http.adornUrl('/transresources/trcarmaintenance/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'carId': this.dataForm.carId
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
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        this.maintenanceAddOrUpdateVisible = true
        let carId = this.dataForm.carId
        this.$nextTick(() => {
          this.$refs.maintenanceAddOrUpdate.init(id, carId)
        })
      },
      // 删除
      deleteHandle (id) {
        let ids = [id]
        this.$confirm(`确定删除这条数据`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/transresources/trcarmaintenance/delete'),
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
        }).catch(() => {
        })
      },
      handleCancel () {
        window.history.go(-1)
      }
    }
  }
</script>

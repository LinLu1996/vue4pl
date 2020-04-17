<template>
  <div class="examCon-config">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="考核分类">
            <xkl-select style="width: 100%" v-model="dataForm.categoryId" :level="1" labelType="name" linkage="/performancemanagement/tkpiassessmentstandard/selectList" placeholder="考核分类"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="考核项目">
            <xkl-select style="width: 100%" v-model="dataForm.projectId" :level="2" :parentId="dataForm.categoryId" labelType="name" :linkage="dataForm.categoryId ? '/performancemanagement/tkpiassessmentstandard/selectList' : ''" placeholder="考核项目" @click.native="sendMessage()"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select style="width: 100%" v-model="dataForm.status" placeholder="状态" clearable>
              <el-option value="0" label="有效"></el-option>
              <el-option value="1" label="无效"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px;">
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-button v-if="isAuth('performancemanagement:tkpiassessmentstandard:list')" type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          <el-button v-if="isAuth('performancemanagement:tkpiassessmentstandard:list')" style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px;">
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-button v-if="isAuth('performancemanagement:tkpiassessmentstandard:savec')" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增分类</el-button>
          <el-button v-if="isAuth('performancemanagement:tkpiassessmentstandard:changeStatuso')"
            @click="handleStatus(0)"
            size="mini" icon="el-icon-check"
            :disabled="this.dataListSelections.length === 0 || currentStatus === 0"
            type="danger">启用</el-button>
          <el-button v-if="isAuth('performancemanagement:tkpiassessmentstandard:changeStatusc')"
            @click="handleStatus(1)"
            size="mini" icon="el-icon-close"
            :disabled="this.dataListSelections.length === 0 || currentStatus === 1"
            type="danger">禁用</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-if="expandFlagBefore"
      v-loading="dataListLoading"
      row-key="id"
      :default-expand-all="expandFlag"
      :tree-props="{children: 'childrenList', hasChildren: 'hasChildren'}"
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
        header-align="center"
        prop="name"
        align="left"
        label="名称"
        min-width="400"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="120"
        label="状态"
      >
        <template slot-scope="{ row }">
          <el-tag v-if="row.status== 0" size="small">有效</el-tag>
          <el-tag v-if="row.status== 1" size="small" type="danger">无效</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isAuth('performancemanagement:tkpiassessmentstandard:update') || isAuth('performancemanagement:tkpiassessmentstandard:savep') || isAuth('performancemanagement:tkpiassessmentstandard:savei')"
        header-align="center"
        align="center"
        fixed="right"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('performancemanagement:tkpiassessmentstandard:update')" type="primary" size="small" @click="handleEdit(scope.row)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑</el-button>
          <el-button v-if="scope.row.type === 1" type="primary" size="small" @click="addProject(scope.row)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg></el-button>
          <el-button v-if="scope.row.level === 1 && isAuth('performancemanagement:tkpiassessmentstandard:savep')" type="primary" icon="el-icon-circle-plus-outline" size="small" @click="addProject(scope.row, 'add')">
            新增项目</el-button>
          <el-button v-if="scope.row.level === 2 && isAuth('performancemanagement:tkpiassessmentstandard:savei')" icon="el-icon-circle-plus-outline" type="primary" size="small" @click="addIndex(scope.row, 'add')">
            新增指标</el-button>
          <!--<el-button v-if="isAuth('sys:dict:delete')" type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div v-else style="height: 400px"  v-loading="true" element-loading-text="拼命加载中"></div>
    <!-- 弹窗, 新增 / 编辑 -->
    <add-or-update-classify v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update-classify>
    <add-or-update-project v-if="addProjectVisible" ref="addProject" @refreshDataList="getDataList"></add-or-update-project>
    <add-or-update-index v-if="addIndexVisible" ref="addIndex" @refreshDataList="getDataList"></add-or-update-index>
  </div>
</template>

<script>
  import AddOrUpdateClassify from './add-or-update-classify'
  import AddOrUpdateProject from './add-or-update-project'
  import AddOrUpdateIndex from './add-or-update-index'
  export default {
    data () {
      return {
        dataForm: {
          categoryId: '',
          projectId: '',
          status: ''
        },
        dataList: [],
        expandFlagBefore: true,
        expandFlag: false,
        dataListLoading: false,
        addOrUpdateVisible: false,
        addProjectVisible: false,
        addIndexVisible: false,
        dataListSelections: [],
        currentStatus: ''
      }
    },
    components: {
      AddOrUpdateClassify,
      AddOrUpdateProject,
      AddOrUpdateIndex
    },
    activated () {
      this.resetForm()
    },
    watch: {
      'dataForm.categoryId' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.projectId = ''
        }
      }
    },
    methods: {
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.expandFlagBefore = false
        this.$http({
          url: this.$http.adornUrl('/performancemanagement/tkpiassessmentstandard/list'),
          method: 'post',
          data: this.$http.adornData({
            'categoryId': this.dataForm.categoryId,
            'projectId': this.dataForm.projectId,
            'status': this.dataForm.status
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.list
            Object.keys(this.dataForm).map(res => {
              return this.dataForm[res]
            }).every(res => res === '') ? this.expandFlag = false : this.expandFlag = true
            this.expandFlagBefore = true
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },
      // 多选
      selectionChangeHandle (val) {
        if (val.length) {
          this.currentStatus = val[0].status
        } else {
          this.currentStatus = ''
        }
        this.dataListSelections = val
      },
      selectable (row) {
        if (this.dataListSelections.length && row.status !== this.currentStatus) {
          return false
        }
        return true
      },
      sendMessage () {
        if (!this.dataForm.categoryId) {
          this.$message.warning('请先选择考核分类')
        }
      },
      // 新增 / 编辑
      addOrUpdateHandle (id, type) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, type)
        })
      },
      // 新增 编辑项目
      addProject (row, type) {
        if (row.status === false) {
          this.$message('禁用状态下不可进行新增和编辑操作')
          return
        }
        this.addProjectVisible = true
        this.$nextTick(() => {
          this.$refs.addProject.init(row, type)
        })
      },
      // 新增 编辑指标
      addIndex (row, type) {
        if (row.status === false) {
          this.$message('禁用状态下不可进行新增和编辑操作')
          return
        }
        this.addIndexVisible = true
        this.$nextTick(() => {
          this.$refs.addIndex.init(row, type)
        })
      },
      // 编辑
      handleEdit (row) {
        if (row.status === false) {
          this.$message('禁用状态下不可进行新增和编辑操作')
          return
        }
        if (row.level === 1) {
          this.addOrUpdateHandle(row.id)
        } else if (row.level === 2) {
          this.addProject(row, 'edit')
        } else {
          this.addIndex(row, 'edit')
        }
      },
      // 删除
      deleteHandle (id) {
        this.$confirm('确定删除这条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/performancemanagement/tkpiassessmentstandard/delete'),
            method: 'post',
            data: this.$http.adornData({
              'id': id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  if (this.dataList.length === 1) {
                    this.pageIndex = this.pageIndex === 1 ? 1 : this.pageIndex - 1
                  }
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      handleStatus (status) {
        let ids = this.dataListSelections.map(item => {
          return item.id
        })
        this.$http({
          url: this.$http.adornUrl('/performancemanagement/tkpiassessmentstandard/changeStatus'),
          method: 'post',
          data: this.$http.adornData({
            'ids': ids,
            'status': status
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
      resetForm () {
        this.dataForm = {
          'categoryId': '',
          'projectId': ''
        }
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      }
    }
  }
</script>
<style lang="scss">
  .el-select-dropdown{
    max-width: 500px!important;
  }
</style>

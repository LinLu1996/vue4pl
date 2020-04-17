<template>
 <div>
   <el-form :model="dataForm" ref="dataForm" label-width="90px">
     <el-row>
       <el-col :span="8">
         <el-form-item label="是否优势" prop="isGoodLine">
           <el-select v-model="dataForm.isGoodLine" style="width: 100%;" :clearable="true">
             <el-option key="0" label="是" :value="0">
             </el-option>
             <el-option key="1" label="否" :value="1">
             </el-option>
           </el-select>
         </el-form-item>
       </el-col>
       <el-col :span="8">
         <el-form-item label="运输方式" prop="tpmodeId">
           <xkl-select style="width: 100%" v-model="dataForm.tpmodeId" labelType="carrierTpmodeName" select-type="TRANSPORT_TYPE" placeholder="请选择"></xkl-select>
         </el-form-item>
       </el-col>
       <el-col :span="8" style="text-align: right;padding-right: 5px">
         <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
         <div style="display: inline-block">
           <el-upload
             :action="urls"
             :show-file-list="false"
             :before-upload="checkUpload"
             :on-change="handleChange"
             :on-success="handleAvatarSuccess"
           >
             <el-button type="primary">导入</el-button>
           </el-upload>
         </div>
       </el-col>
     </el-row>
   </el-form>
   <el-table
     :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
     :data="dataList"
     v-loading="dataListLoading"
     style="width: 100%;">
     <el-table-column
       prop="startCityName"
       header-align="center"
       align="center"
       label="始发地">
     </el-table-column>
     <el-table-column
       prop="endCityName"
       header-align="center"
       align="center"
       label="目的地">
     </el-table-column>
     <el-table-column
       prop="tpmodeName"
       header-align="center"
       align="center"
       label="运输方式">
     </el-table-column>
     <el-table-column
       prop="linePrice"
       header-align="center"
       align="center"
       label="价格">
     </el-table-column>
     <el-table-column
       prop="isGoodLine"
       header-align="center"
       align="center"
       label="是否优势">
       <template slot-scope="scope">
         <el-switch
           @change="(val) => handleStatus(val, scope.row.id)"
           v-model="scope.row.isGoodLine"
           active-color="#13ce66"
         >
         </el-switch>
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
   <upload-road-feedback v-if="uploadRoadFeedbackVisible" ref="uploadRoadFeedback" @refreshDataList="getSearchDataList"></upload-road-feedback>
 </div>
</template>

<script>
  import UploadRoadFeedback from './upload-road-feedback'
  export default {
    data () {
      return {
        urls: '',
        visible: false,
        clickFlag: true,
        dataForm: {
          id: 0,
          carrierName: '',
          tpmodeId: '',
          isGoodLine: null
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataRule: {},
        dataListLoading: false,
        uploadRoadFeedbackVisible: false
      }
    },
    components: {
      UploadRoadFeedback
    },
    activated () {
      const id = this.$route.query.id || null
      this.init(id)
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.urls = this.$http.adornUrl(`/transresources/trcarrierline/export?token=${this.$cookie.get('token')}&carrierId=${this.dataForm.id}`)
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
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
        this.uploadRoadFeedbackVisible = true
        this.$nextTick(() => {
          this.$refs.uploadRoadFeedback.init(response)
        })
        // if (response.code === 0) {
        //   this.$message.success('上传成功');
        //   this.$nextTick(() => {
        //     this.$refs['dataForm'].resetFields()
        //     this.getSearchDataList()
        //   })
        // } else {
        //   this.$message.error('上传失败');
        // }
      },
      // 获取数据列表
      getSearchDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trcarrierline/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'carrierId': this.dataForm.id,
            'carrierName': this.dataForm.carrierName,
            'tpmodeId': this.dataForm.tpmodeId,
            'isGoodLine': this.dataForm.isGoodLine
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list.length ? data.page.list.map(item => {
              item.isGoodLine === 0 ? item.isGoodLine = true : item.isGoodLine = false
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
      handleStatus (val, id) {
        const isGoodLine = val === true ? 0 : 1
        this.$refs['dataForm'].resetFields()
        this.$http({
          url: this.$http.adornUrl('/transresources/trcarrierline/update'),
          method: 'post',
          data: this.$http.adornData({
            'id': id,
            'isGoodLine': isGoodLine
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.getSearchDataList(id)
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getSearchDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getSearchDataList()
      },
      handleCancel () {
        window.history.go(-1)
      }
    }
  }
</script>

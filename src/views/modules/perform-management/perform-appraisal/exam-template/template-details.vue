<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label-width="0">
        <el-tag>基本信息</el-tag>
      </el-form-item>
      <el-row style="border-bottom: 1px solid #CCCCCC;margin-bottom: 20px">
        <el-col :span="22">
          <el-col :span="12">
            <el-form-item label="模板名称：">
              <span style="width: 90%; display: block">
                {{dataForm.templateName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板编号：">
              <span style="width: 90%; display: block">
                {{dataForm.templateCode}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批准日期：">
              <span style="width: 90%; display: block">
                {{dataForm.templateAproveDate}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实施日期：">
              <span style="width: 90%; display: block">
                {{dataForm.templateImplementedDate}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模板说明：">
              <span style="width: 90%; display: block">
                {{dataForm.templateRemark}}
              </span>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <el-tag>考核信息</el-tag>
      </el-form-item>
      <el-row v-if="!dataForm.kpiTemplateRelationEntityList.length">
        <div>
          <h2 style="text-align: center;color: #dddddd;padding-right: 180px">当前无可用模板！</h2>
        </div>
      </el-row>
      <el-row v-else v-for="(addItem, index) in dataForm.kpiTemplateRelationEntityList" :key="index" style="border-bottom: 1px solid #CCCCCC;margin-bottom: 20px">
        <el-col :span="24">
          <el-row>
            <el-col :span="12">
              <el-form-item label="考核分类：" prop="type">
                <span style="width: 90%; display: block">
                  {{addItem.assessmentClassificationName}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考核项目：" prop="carrierType">
                <span style="width: 90%; display: block">
                  {{addItem.assessmentProjectName}}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                :data="addItem.relationEntityList"
                style="width: 100%">
                <el-table-column
                  label="考核指标："
                  prop="assessmentStandardName">
                </el-table-column>
                <el-table-column
                  label="百分比标准："
                  prop="percentStandard">
                  <template slot-scope="{row}">
                    {{row.percentStandard + '%'}}
                  </template>
                </el-table-column>
                <el-table-column type="expand" width="80">
                  <template slot-scope="{ row }">
                    <el-form v-for="(item, index) in row.kpiStandardScoreRuleEntityList" :key="index" label-position="left" inline class="demo-table-expand">
                      <el-form-item label="百分比起始：" style="margin-bottom: 0">
                        <span>{{ item.percentStandardStart }}</span>
                      </el-form-item>
                      <el-form-item label="百分比结尾：" style="margin-bottom: 0">
                        <span>{{item.percentStandardEnd }}</span>
                      </el-form-item>
                      <el-form-item label="权重分：" style="margin-bottom: 0">
                        <span>{{ item.weightScore }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">关闭</el-button>
      <el-button type="success" size="small" icon="el-icon-view" :disabled="!dataForm.kpiTemplateRelationEntityList.length" @click="goPreview()">预览</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // import contractUpload from './contract-upload'
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        linkage: '1',
        dataForm: {
          id: 0,
          templateName: '',
          templateCode: '',
          templateAproveDate: '',
          templateImplementedDate: '',
          templateRemark: '',
          printHeaderShow: true,
          kpiTemplateRelationEntityList: []
        },
        openType: ''
      }
    },
    watch: {
    },
    components: {
      // contractUpload
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.visible = true
        this.dataForm.id = id || 0
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmenttemplate/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.tKpiAssessmentTemplate
                if (data.tKpiAssessmentTemplate.templateAproveDate) {
                  this.dataForm.templateAproveDate = this.$formatDate(data.tKpiAssessmentTemplate.templateAproveDate)
                }
                if (data.tKpiAssessmentTemplate.templateAproveDate) {
                  this.dataForm.templateImplementedDate = this.$formatDate(data.tKpiAssessmentTemplate.templateImplementedDate)
                }
                this.dataForm.kpiTemplateRelationEntityList = data.tKpiAssessmentTemplate.kpiTemplateRelationEntityList
              }
            })
          } else {
            this.isDisabled = false
            this.dataForm.attachmentUrl = ''
          }
        })
      },
      goPreview () {
        this.$router.push({
          name: 'template-view',
          params: this.dataForm.kpiTemplateRelationEntityList
        })
      },
      closeForm () {
        this.visible = false
        // this.$refs['elecSeal'].init()
        // this.$refs['certificate'].init()
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/.el-table .el-table__body tr:hover>td{
    background-color: #ffffff!important;
  }
  /deep/.el-table .el-table__body{
    border: 0;
    th,
    tr,
    td{
      border: 0;
      background-color: #fff;
    }
    .el-table__expand-icon {
      width: 60px;
    }
    .el-table__expand-icon:after {
      content: '阶梯标准';
      color: #ffffff;
      border: 1px solid #67c23a;
      padding: 3px;
      background-color: #67c23a;
      border-radius: 2px;
    }
    .el-table__expand-icon > i {
      display: none;
    }
    .el-table__expand-icon--expanded {
      transform: rotate(0) !important;
    }
  }
  /deep/ .el-table th.is-leaf {
    border-bottom: 0;
  }
  .demo-table-expand {
    margin-left: 10%;
    /deep/.el-form-item {
      .el-form-item__label {
        color: #99a9bf;
      }
    }
  }
</style>

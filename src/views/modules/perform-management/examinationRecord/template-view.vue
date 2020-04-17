<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="90px">
    <el-row>
      <el-col :span="8">
        <el-form-item label="考核月度" prop="rensureMonth">
          <el-date-picker
            style="width: 100%"
            v-model="dataForm.rensureMonth"
            type="month"
            :disabled="btnLoading"
            placeholder="选择考核月度">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运商" prop="carrierId">
          <xkl-select style="width: 100%"  v-model="dataForm.carrierId" :disabled="btnLoading" linkage="/transresources/trcarrier/findList" labelType="carrierName" placeholder="选择承运商" @getLabel="getLabel"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="所属项目" prop="projectKpi">
          <xkl-select style="width: 100%"  v-model="dataForm.projectKpi" :disabled="btnLoading" labelType="projectKpiName" :recordId="assessmentRecordId" placeholder="请选择运输项目" linkage="/performancemanagement/project/noPowerList"></xkl-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="委托方统计方式" label-width="130px" prop="ownerCalculationMethod">
          <el-select style="width: 100%" v-model="dataForm.ownerCalculationMethod" :disabled="btnLoading">
            <el-option value="1" label="包含"></el-option>
            <el-option value="2" label="不包含"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="委托方" prop="ownerId">
          <xkl-select style="width: 100%"  v-model="dataForm.ownerId" :disabled="btnLoading" :multiple="true" :projectKpiId="dataForm.projectKpi" :projectType="secondChoice" keyType="ownerId" labelType="ownerName" placeholder="选择委托方" linkage="/performancemanagement/projectconsignorrelation/findByProjectKpiId"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="运输方式" prop="transportType">
          <xkl-select  style="width: 100%"  v-model="dataForm.transportType" :disabled="btnLoading" :projectKpiId="dataForm.projectKpi" :projectType="secondChoice" @getLabel="getLabel" keyType="transportType" labelType="transportTypeName" placeholder="选择运输方式" linkage="/performancemanagement/projecttemplaterelation/findByProjectKpiId"></xkl-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="考核模板" prop="templateId">
          <xkl-select  style="width: 100%"  v-model="dataForm.templateId" :disabled="btnLoading" :projectKpiId="dataForm.projectKpi" :transportType="dataForm.transportType" :projectType="projectType" :recordId="recordId"  keyType="templateId" labelType="templateName" placeholder="选择考核模板" linkage="/performancemanagement/projecttemplaterelation/findByProjectKpiIdTemplate"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="16" style="text-align: right">
        <el-button v-if="!btnLoading" type="primary" @click="dataFormSubmit('generate')">生成</el-button>
        <el-button v-else type="primary" :loading="btnLoading">生成中</el-button>
        <el-button :disabled="!templateShow" type="success" @click="dataForm.id ? checkSubmit('edit') : dataFormSubmit('save')">保存</el-button>
      </el-col>
    </el-row>
    <template-view v-if="templateShow" ref="templateData" :headForm="dataForm" :templateData="templateData"></template-view>
    <div v-else style="color: #eeeeee; font-size: 80px; text-align: center;height: 460px;line-height: 460px">点击右上角生成考核绩效</div>
    <el-row style="margin-top: 20px">
      <el-col style="margin-top: 20px; text-align: right">
        <el-form-item label-width="50px">
          <el-button @click="$router.go(-1)">关闭</el-button>
          <!--<el-button v-if="dataForm.id" type="primary" @click="checkSubmit('edit')">保存</el-button>-->
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import { formatDate } from '../../../../utils';
  import TemplateView from '../perform-appraisal/exam-template/template-view'
  export default {
    data () {
      return {
        dataForm: {
          id: 0,
          rensureMonth: '',
          carrierId: '',
          carrierName: '',
          projectKpi: '',
          projectKpiName: '',
          templateId: '',
          templateName: '',
          ownerId: [],
          ownerNames: '',
          transportType: '',
          ownerCalculationMethod: '',
          transportTypeName: ''
        },
        projectType: '2',
        secondChoice: '',
        recordId: '',
        assessmentRecordId: '',
        clickFlag: true,
        btnLoading: false,
        templateData: [],
        templateShow: false,
        dataRule: {
          rensureMonth: [
            { required: true, message: '请选择考核月度', trigger: 'change' }
          ],
          carrierId: [
            { required: true, message: '请选择承运商', trigger: 'change' }
          ],
          projectKpi: [
            { required: true, message: '请选择运输项目', trigger: 'change' }
          ],
          transportType: [
            { required: true, message: '请选择运输方式', trigger: 'change' }
          ],
          ownerId: [
            { required: true, message: '请选择委托方', trigger: 'change' }
          ],
          templateId: [
            { required: true, message: '请选择考核模板', trigger: 'change' }
          ],
          ownerCalculationMethod: [
            { required: true, message: '请选择委托方统计方式', trigger: 'change' }
          ]
        },
        tableData: [],
        initialData: [],
        spanArr: [],
        position: 0
      }
    },
    components: {
      TemplateView
    },
    created () {
      this.init()
    },
    computed: {
    },
    watch: {
      dataForm: {
        handler () {
          this.templateShow = false
        },
        deep: true
      },
      'dataForm.projectKpi' (newVal, oldVal) {
        if (oldVal !== '') {
          this.dataForm.transportType = ''
          this.dataForm.ownerId = []
          this.dataForm.templateId = ''
          this.recordId = ''
          this.assessmentRecordId = ''
        }
      },
      'dataForm.transportType' (newVal, oldVal) {
        // if (oldVal !== '') {
        this.dataForm.templateId = ''
        // }
        this.projectType = newVal ? '1' : '2'
      }
    },
    methods: {
      init () {
        this.dataForm.id = this.$route.query.id
        this.recordId = this.dataForm.id
        this.assessmentRecordId = this.dataForm.id
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentrecord/editInfo/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.templateData = data.tKpiAssessmentRecord.kpiTemplateRelationEntityList
                this.dataForm.carrierName = data.tKpiAssessmentRecord.carrierName
                this.dataForm.carrierId = data.tKpiAssessmentRecord.carrierId
                this.dataForm.projectKpi = data.tKpiAssessmentRecord.projectKpi
                this.dataForm.projectKpiName = data.tKpiAssessmentRecord.projectKpiName
                this.dataForm.ownerCalculationMethod = data.tKpiAssessmentRecord.ownerCalculationMethod
                this.dataForm.ownerId = data.tKpiAssessmentRecord.ownerId.split(',')
                this.dataForm.ownerNames = data.tKpiAssessmentRecord.ownerNames
                this.dataForm.transportType = data.tKpiAssessmentRecord.transportType
                this.dataForm.transportTypeName = data.tKpiAssessmentRecord.transportTypeName
                this.dataForm.rensureMonth = formatDate(data.tKpiAssessmentRecord.rensureMonth, 'Month')
                this.$nextTick(() => {
                  this.dataForm.templateId = data.tKpiAssessmentRecord.templateId
                  this.dataForm.templateName = data.tKpiAssessmentRecord.templateName
                  this.$nextTick(() => {
                    this.templateShow = true
                    this.secondChoice = '2'
                  })
                  this.$nextTick(() => {
                    this.assessmentRecordId = ''
                  })
                })
              }
            })
          } else {
            this.secondChoice = '2'
          }
        })
      },
      getLabel (label) {
        this.dataForm.transportTypeName = label
      },
      // 表单提交
      checkSubmit (type) {
        if (this.$refs['templateData'].$refs['modelHappenedNumber']) {
          this.$refs['templateData'].$refs['modelHappenedNumber'].validate((valid) => {
            if (valid) {
              this.$refs['templateData'].$refs['modelTotalNumber'].validate((valid) => {
                if (valid) {
                  this.dataFormSubmit(type)
                }
              })
            }
          })
        } else {
          this.dataFormSubmit(type)
        }
      },
      dataFormSubmit (type) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (type === 'generate') this.templateShow = false
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            setTimeout(() => {
              this.clickFlag = true
            }, 1000)
            this.btnLoading = true
            this.dataForm.rensureMonth = formatDate(this.dataForm.rensureMonth, 'Month')
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentrecord/${type === 'edit' ? 'updateRecord' : (type === 'save' ? 'saveRecord' : 'generate')}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'templateId': this.dataForm.templateId || undefined,
                'rensureMonth': type === 'save' || type === 'generate' || type === 'edit' ? this.dataForm.rensureMonth.split('-').join('') : undefined,
                'carrierId': type === 'save' || type === 'generate' || type === 'edit' ? this.dataForm.carrierId : undefined,
                'ownerId': type === 'save' || type === 'generate' || type === 'edit' ? this.dataForm.ownerId.join(',') : undefined,
                'ownerCalculationMethod': type === 'save' || type === 'generate' || type === 'edit' ? this.dataForm.ownerCalculationMethod : undefined,
                'transportType': type === 'save' || type === 'generate' || type === 'edit' ? this.dataForm.transportType : undefined,
                'projectKpi': type === 'save' || type === 'generate' || type === 'edit' ? this.dataForm.projectKpi : undefined,
                'kpiTemplateRelationEntityList': type === 'save' || type === 'edit' ? this.templateData : undefined
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (type === 'save' || type === 'edit') {
                  this.$message({
                    type: 'success',
                    message: '操作成功',
                    duration: 1500,
                    onClose: () => {
                      window.history.go(-1)
                    }
                  })
                } else {
                  this.templateShow = true
                  this.templateData = data.tKpiAssessmentTemplate.kpiTemplateRelationEntityList
                }
              } else {
                this.clickFlag = true
                this.$message.error(data.msg)
              }
              this.btnLoading = false
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
.table-wrap{
  h2{
    text-align: center;
    letter-spacing: 5px;
  }
  p{
    letter-spacing: 5px;
    span:nth-child(1) {
      margin-left: 10px;
    }
    span:nth-child(2) {
      float: right;
      margin-right: 20px;
    }
  }
  /deep/.el-table__body tr:hover>td{
    background-color: #ffffff!important;
  }
}
</style>

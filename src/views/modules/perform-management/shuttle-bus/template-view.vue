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
        <el-form-item label="所属项目" prop="projectKpi">
          <xkl-select style="width: 100%"  labelType="projectKpiName" :disabled="btnLoading"  v-model="dataForm.projectKpi" placeholder="请选择项目KPI" linkage="/performancemanagement/project/powerList"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="考核模板" prop="templateId">
          <xkl-select style="width: 100%" v-model="dataForm.templateId" :disabled="btnLoading" :projectKpiId="dataForm.projectKpi" :transportType="dataForm.transportType" :projectType="secondChoice" keyType="templateId" labelType="templateName" placeholder="选择考核模板" linkage="/performancemanagement/projecttemplaterelation/findByBusKpiIdTemplate"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运商" prop="carrierId">
          <xkl-select style="width: 100%"  v-model="dataForm.carrierId" :disabled="btnLoading" linkage="/transresources/trcarrier/findList" labelType="carrierName" placeholder="选择承运商" @getLabel="getLabel"></xkl-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="text-align: right">
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
          projectKpi: '',
          projectKpiName: '',
          carrierId: '',
          carrierName: '',
          templateId: '',
          templateName: '',
          transportTypeName: '',
          busType: true
        },
        clickFlag: true,
        btnLoading: false,
        secondChoice: '',
        templateData: [],
        templateShow: false,
        dataRule: {
          rensureMonth: [
            { required: true, message: '请选择考核月度', trigger: 'change' }
          ],
          carrierId: [
            { required: true, message: '请选择承运商', trigger: 'change' }
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
          this.dataForm.carrierId = ''
          this.dataForm.templateId = ''
        }
      }
    },
    methods: {
      init () {
        this.dataForm.id = this.$route.query.id
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/kpishuttlebusrecord/editInfo/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.carrierName = data.KpiShuttleBusRecordEntity.carrierName
                this.dataForm.rensureMonth = data.KpiShuttleBusRecordEntity.rensureMonth
                this.dataForm.projectKpi = data.KpiShuttleBusRecordEntity.projectKpi
                this.dataForm.projectKpiName = data.KpiShuttleBusRecordEntity.projectKpiName
                this.dataForm.carrierId = data.KpiShuttleBusRecordEntity.carrierId
                this.dataForm.templateId = data.KpiShuttleBusRecordEntity.templateId
                this.dataForm.templateName = data.KpiShuttleBusRecordEntity.templateName
                this.dataForm.transportTypeName = data.KpiShuttleBusRecordEntity.transportTypeName
                this.templateData = data.KpiShuttleBusRecordEntity.kpiTemplateRelationEntityList
                const kpiYear = data.KpiShuttleBusRecordEntity.rensureMonth.substring(0, 4)
                const kpiMon = data.KpiShuttleBusRecordEntity.rensureMonth.substring(4)
                this.dataForm.rensureMonth = `${kpiYear}-${kpiMon}`
                this.$nextTick(() => {
                  this.templateShow = true
                  this.secondChoice = '2'
                })
              }
            })
          } else {
            this.secondChoice = '2'
          }
        })
      },
      getLabel (label) {
        this.dataForm.carrierName = label
        this.dataForm.ownerName = label
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
              url: this.$http.adornUrl(`/performancemanagement/kpishuttlebusrecord/${type === 'edit' ? 'updateRecord' : (type === 'save' ? 'saveRecord' : 'generate')}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'templateId': this.dataForm.templateId || undefined,
                'projectKpi': this.dataForm.projectKpi || undefined,
                'rensureMonth': type === 'save' || type === 'generate' || type === 'edit' ? this.dataForm.rensureMonth.split('-').join('') : undefined,
                'carrierId': type === 'save' || type === 'generate' || type === 'edit' ? this.dataForm.carrierId : undefined,
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
                  this.templateData = data.tKpiAssessmentTemplateEntity.kpiTemplateRelationEntityList
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

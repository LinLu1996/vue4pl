<template>
  <el-form :model="dataForm"  ref="dataForm"
           label-width="90px">
    <el-row>
      <el-col :span="8">
        <el-form-item label="考核月度：" prop="rensureMonth">
          <span style="display: inline-block">
              {{$formatDate(dataForm.rensureMonth, 'Month')}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运商：" prop="carrierId">
          <span style="display: inline-block">
              {{dataForm.carrierName}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="委托方统计方式：" label-width="130px" prop="ownerCalculationMethod">
          <span style="display: inline-block">
              {{dataForm.ownerCalculationMethod === '1' ? '包含' : '不包含'}}
          </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="运输项目：" prop="projectKpiId">
          <span style="display: inline-block">
              {{dataForm.projectKpiName}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="运输方式：">
          <span style="display: inline-block">
              {{dataForm.transportTypeName}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="委托方：" prop="ownerId">
          <span style="display: inline-block">
              {{dataForm.ownerNames}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="考核模板：" prop="templateId">
          <span style="display: inline-block">
              {{dataForm.templateName}}
          </span>
        </el-form-item>
      </el-col>
    </el-row>
    <template-view v-if="templateShow" :isDetail="true" :headForm="dataForm" :templateData="templateData"></template-view>
    <el-row style="margin-top: 20px">
      <el-col style="margin-top: 20px; text-align: right">
        <el-form-item label-width="50px">
          <el-button @click="$router.go(-1)">关闭</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import TemplateView from '../perform-appraisal/exam-template/template-view'
  import {formatDate} from '../../../../utils';
  export default {
    data () {
      return {
        dataForm: {
          id: 0,
          rensureMonth: '',
          carrierId: '',
          carrierName: '',
          projectKpiName: '',
          projectKpi: '',
          templateId: '',
          ownerId: '',
          ownerNames: '',
          transportType: '',
          ownerCalculationMethod: '',
          transportTypeName: '',
          pageTypeOfDetail: true
        },
        clickFlag: true,
        templateData: [],
        templateShow: false,
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
    methods: {
      init () {
        this.dataForm.id = this.$route.query.id
        this.type = this.$route.query.type
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentrecord/editInfo/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.carrierName = data.tKpiAssessmentRecord.carrierName
                this.dataForm.rensureMonth = data.tKpiAssessmentRecord.rensureMonth
                this.dataForm.carrierId = data.tKpiAssessmentRecord.carrierId
                this.dataForm.templateId = data.tKpiAssessmentRecord.templateId
                this.dataForm.projectKpiName = data.tKpiAssessmentRecord.projectKpiName
                this.dataForm.templateName = data.tKpiAssessmentRecord.templateName
                this.dataForm.ownerCalculationMethod = data.tKpiAssessmentRecord.ownerCalculationMethod
                this.dataForm.ownerId = data.tKpiAssessmentRecord.ownerId.split(',')
                this.dataForm.ownerNames = data.tKpiAssessmentRecord.ownerNames
                this.dataForm.transportType = data.tKpiAssessmentRecord.transportType
                this.dataForm.transportTypeName = data.tKpiAssessmentRecord.transportTypeName
                this.templateShow = true
                this.templateData = data.tKpiAssessmentRecord.kpiTemplateRelationEntityList
                this.dataForm.carrierName = data.tKpiAssessmentRecord.carrierName
                this.dataForm.rensureMonth = data.tKpiAssessmentRecord.rensureMonth
                this.dataForm.rensureMonth = formatDate(data.tKpiAssessmentRecord.rensureMonth, 'Month')
              }
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

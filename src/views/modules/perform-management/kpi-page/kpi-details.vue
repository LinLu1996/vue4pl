<template>
  <el-form :model="dataForm"  ref="dataForm"
           label-width="90px">
    <el-row>
      <el-col :span="8">
        <el-form-item label="KPI月度：" prop="rensureMonth">
          <span style="display: inline-block">
              {{$formatDate(dataForm.rensureMonth, 'Month')}}
          </span>
        </el-form-item>
      </el-col>
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
    </el-row>
    <template-view id="printer" v-if="templateShow" :isDetail="true" :headForm="dataForm" :templateData="templateData" :isProjectKpi="true"></template-view>
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
          projectKpiName: '',
          projectKpi: '',
          transportType: '',
          transportTypeName: '',
          pageTypeOfDetail: true
        },
        clickFlag: true,
        templateData: [],
        templateShow: false
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
              url: this.$http.adornUrl(`/performancemanagement/projectrecord/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.templateId = data.tKpiAssessmentRecord.templateId
                this.dataForm.projectKpiName = data.tKpiAssessmentRecord.projectKpiName
                this.dataForm.transportType = data.tKpiAssessmentRecord.transportType
                this.dataForm.transportTypeName = data.tKpiAssessmentRecord.transportTypeName
                this.templateShow = true
                this.templateData = data.tKpiAssessmentRecord.kpiTemplateRelationEntityList
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

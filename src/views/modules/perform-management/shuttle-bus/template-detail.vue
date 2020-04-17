<template>
  <el-form :model="dataForm"  ref="dataForm"
           label-width="90px">
    <el-row>
      <el-col :span="8">
        <el-form-item label="考核月度：" prop="rensureMonth">
          <span style="display: inline-block">
              {{dataForm.rensureMonth}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="项目KPI：" prop="projectKpi">
          <span style="display: inline-block">
              {{dataForm.projectKpiName}}
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
  export default {
    data () {
      return {
        dataForm: {
          id: 0,
          rensureMonth: '',
          projectKpiName: '',
          carrierId: '',
          carrierName: '',
          templateId: '',
          templateName: '',
          transportTypeName: ''
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
              url: this.$http.adornUrl(`/performancemanagement/kpishuttlebusrecord/editInfo/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.carrierName = data.KpiShuttleBusRecordEntity.carrierName
                this.dataForm.rensureMonth = data.KpiShuttleBusRecordEntity.rensureMonth
                this.dataForm.carrierId = data.KpiShuttleBusRecordEntity.carrierId
                this.dataForm.templateId = data.KpiShuttleBusRecordEntity.templateId
                this.dataForm.templateName = data.KpiShuttleBusRecordEntity.templateName
                this.dataForm.projectKpiName = data.KpiShuttleBusRecordEntity.projectKpiName
                this.dataForm.transportTypeName = data.KpiShuttleBusRecordEntity.transportTypeName
                this.templateShow = true
                this.templateData = data.KpiShuttleBusRecordEntity.kpiTemplateRelationEntityList
                this.dataForm.rensureMonth = this.$formatDate(data.KpiShuttleBusRecordEntity.rensureMonth, 'Month')
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

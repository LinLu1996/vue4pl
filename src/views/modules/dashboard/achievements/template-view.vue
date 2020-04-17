<template>
  <el-form :model="dataForm" ref="dataForm" label-width="90px">
    <div style="font-size: 20px;font-weight: bold">
      <span style="display: inline-block; margin-right: 40px">{{`${dataForm.carrierName}${dataForm.rensureMonth.slice(0, 4)}年${dataForm.rensureMonth.slice(4)}月绩效`}}</span>
      <span>{{`评分 ${dataForm.score}分`}}</span>
    </div>
    <template-view v-if="templateShow" :isDetail="true" :isProjectKpi="type === 'shipperKpi' ? true : false" ref="templateData" :headForm="dataForm" :templateData="templateData"></template-view>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-button @click="$router.go(-1)">关闭</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import TemplateView from '../../perform-management/perform-appraisal/exam-template/template-view'
  export default {
    data () {
      return {
        dataForm: {
          id: 0,
          rensureMonth: '',
          carrierId: '',
          carrierName: '',
          transportTypeName: '',
          score: ''
        },
        clickFlag: true,
        templateData: [],
        templateShow: false,
        tableData: [],
        initialData: [],
        type: ''
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
        this.dataForm.rensureMonth = this.$route.query.rensureMonth
        this.type = this.$route.query.type || ''
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            if (this.type === 'shipperKpi') {
              this.getShipperInfo()
            } else {
              this.$http({
                url: this.$http.adornUrl(`/shippingplatform/trshippingplatform/carrierRecordByMonthList`),
                method: 'post',
                data: this.$http.adornData({
                  'id': this.dataForm.id ? this.dataForm.id : '',
                  'rensureMonth': this.dataForm.rensureMonth.split('-').join('')
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.carrierName = data.tKpiAssessmentRecordByMonth.carrierName
                  this.dataForm.rensureMonth = data.tKpiAssessmentRecordByMonth.rensureMonth
                  this.dataForm.score = data.tKpiAssessmentRecordByMonth.score
                  this.templateData = data.tKpiAssessmentRecordByMonth.kpiTemplateRelationEntityList
                  this.templateShow = true
                }
              })
            }
          }
        })
      },
      getShipperInfo () {
        this.$http({
          url: this.$http.adornUrl(`/performancemanagement/projectrecord/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.carrierName = data.tKpiAssessmentRecord.templateName
            this.dataForm.transportTypeName = data.tKpiAssessmentRecord.transportTypeName
            this.dataForm.score = data.tKpiAssessmentRecord.score
            this.templateData = data.tKpiAssessmentRecord.kpiTemplateRelationEntityList
            this.templateShow = true
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

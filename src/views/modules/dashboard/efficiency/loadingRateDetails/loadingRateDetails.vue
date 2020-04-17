<template>
  <div>
    <h1>{{queryData.name}} {{dataForm.kpiMonth.split('-')[0]}}年{{dataForm.kpiMonth.split('-')[1]}}月
      &nbsp&nbsp整车装载率：<span style="color: #009688">{{dataForm.percent}}%</span>
    </h1>
    <el-row>
      <el-col :span="24">
        <h4>{{dataForm.kpiMonth.split('-')[0]}}年{{dataForm.kpiMonth.split('-')[1]}}月各承运商{{queryData.name}}始发整车装载率排行</h4>
        <carrier-loading-ranking ref="carrierLoadingRanking"></carrier-loading-ranking>
      </el-col>
      <el-col :span="24">
        <h4>{{dataForm.kpiMonth.split('-')[0]}}年{{queryData.name}}始发整车装载率统计</h4>
        <whole-car-loading-rate ref="wholeCarLoadingRate" @changeData="changeData"></whole-car-loading-rate>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-button @click="$router.go(-1)">关闭</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  // import {formatDate} from '../../../../../utils';
  import carrierLoadingRanking from './carrierLoadingRanking'
  import wholeCarLoadingRate from './wholeCarLoadingRate'
  import {formatDate} from '../../../../../utils';
  export default {
    data () {
      return {
        queryData: {},
        dataForm: {
          kpiMonth: '',
          percent: 0,
          notColdChainNum: 0,
          byVehicleType: [],
          byConsignorName: [],
          byMonth: []
        }
      }
    },
    components: {
      carrierLoadingRanking,
      wholeCarLoadingRate
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        this.queryData = this.$route.params.data || {}
        if (JSON.stringify(this.queryData) === '{}') {
          this.$router.go(-1)
        }
        this.$http({
          url: this.$http.adornUrl('/tms/shipment/getLoadingRateInfo'),
          method: 'post',
          data: this.$http.adornData({
            ...this.queryData
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.kpiMonth = formatDate(data.shipment.kpiMonth)
            this.dataForm.percent = data.shipment.percent
            this.dataForm.byCarrierName = data.shipment.byCarrierName
            this.dataForm.byConsignorName = data.shipment.byConsignorName
            this.dataForm.byMonth = data.shipment.byMonth
            this.$refs.carrierLoadingRanking.init(this.dataForm.byCarrierName)
            // this.$refs.shipperRanking.init(this.dataForm.byConsignorName)
            this.$refs.wholeCarLoadingRate.init(this.dataForm.byMonth, this.queryData)
          } else {
            this.totalPage = 0
          }
        })
      },
      changeData (params) {
        Object.assign(this.queryData, params)
        this.init()
      }
    }
  }
</script>

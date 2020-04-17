<template>
  <div>
    <h1>{{queryData.name}} {{dataForm.kpiMonth.split('-')[0]}}年{{dataForm.kpiMonth.split('-')[1]}}月
      &nbsp&nbsp整车发车车次：<span style="color: #009688">{{dataForm.totalNum}}</span>
      &nbsp&nbsp冷链： <span style="color: #259b24">{{dataForm.coldChainNum}}</span>
      &nbsp&nbsp非冷链：<span style="color: #96f02e">{{dataForm.wholeCarNum}}</span>
    </h1>
    <el-row>
      <el-col :span="12">
        <h4>{{dataForm.kpiMonth.split('-')[0]}}年{{dataForm.kpiMonth.split('-')[1]}}月各车型{{queryData.name}}始发整车车次排行</h4>
        <vehicle-ranking ref="vehicleRanking"></vehicle-ranking>
      </el-col>
      <el-col :span="12">
        <h4>{{dataForm.kpiMonth.split('-')[0]}}年{{dataForm.kpiMonth.split('-')[1]}}月各货主{{queryData.name}}始发整车车次排行</h4>
        <shipper-ranking ref="shipperRanking"></shipper-ranking>
      </el-col>
      <el-col :span="24">
        <h4>{{dataForm.kpiMonth.split('-')[0]}}年{{queryData.name}}始发整车发车统计</h4>
        <vehicle-statistics ref="vehicleStatistics" @changeData="changeData"></vehicle-statistics>
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
  import VehicleRanking from './vehicle-ranking'
  import ShipperRanking from './shipper-ranking'
  import VehicleStatistics from './vehicle-statistics'
  export default {
    data () {
      return {
        queryData: {},
        dataForm: {
          kpiMonth: '',
          totalNum: 0,
          wholeCarNum: 0,
          coldChainNum: 0,
          notColdChainNum: 0,
          byVehicleType: [],
          byConsignorName: [],
          byMonth: []
        }
      }
    },
    components: {
      VehicleRanking,
      ShipperRanking,
      VehicleStatistics
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
          url: this.$http.adornUrl('/shippingplatform/trefficiencyplatform/getWholeCarInfo'),
          method: 'post',
          data: this.$http.adornData({
            ...this.queryData
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.kpiMonth = data.wholeCar.kpiMonth
            this.dataForm.totalNum = data.wholeCar.totalNum
            this.dataForm.coldChainNum = data.wholeCar.coldChainNum
            // this.dataForm.notColdChainNum = data.wholeCar.notColdChainNum
            this.dataForm.wholeCarNum = data.wholeCar.wholeCarNum
            this.dataForm.byVehicleType = data.wholeCar.byVehicleType
            this.dataForm.byConsignorName = data.wholeCar.byConsignorName
            this.dataForm.byMonth = data.wholeCar.byMonth
            this.$refs.vehicleRanking.init(this.dataForm.byVehicleType)
            this.$refs.shipperRanking.init(this.dataForm.byConsignorName)
            this.$refs.vehicleStatistics.init(this.dataForm.byMonth, this.queryData)
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

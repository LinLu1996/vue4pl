<template>
  <div class="mod-demo-echarts">
    <el-row :gutter="30">
      <el-col :span="isAuthNum === 1 ? 24 : 12" style="margin: 15px 0" v-if="isAuth('transresources:auditrecord:getCount')">
        <chart-home-page1 ref="chartHomePage1"></chart-home-page1>
      </el-col>
      <el-col :span="isAuthNum === 1 ? 24 : 12" style="margin: 15px 0" v-if="isAuth('sys:expirenotice:getCount')">
        <chart-home-page2 ref="chartHomePage2"></chart-home-page2>
      </el-col>
      <el-col :span="isAuthNum === 1 ? 24 : 12" style="margin: 15px 0" v-if="isAuth('sys:expirenotice:getContractCount')">
        <chart-home-page3 ref="chartHomePage3"></chart-home-page3>
      </el-col>
      <el-col :span="isAuthNum === 1 ? 24 : 12" style="margin: 15px 0" v-if="isAuth('sys:expirenotice:getInvoiceCount')">
        <chart-home-page4 ref="chartHomePage4"></chart-home-page4>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import chartHomePage1 from './homePages/chartHomePage1'
  import chartHomePage2 from './homePages/chartHomePage2'
  import chartHomePage3 from './homePages/chartHomePage3'
  import chartHomePage4 from './homePages/chartHomePage4'
  // import 'echarts-liquidfill'

  export default {
    data () {
      return {
        chartHomePage3: null,
        percent: '',
        page2Map: {},
        isAuthNum: 0
      }
    },
    components: {
      chartHomePage1,
      chartHomePage2,
      chartHomePage3,
      chartHomePage4
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        this.isAuthNum = this.$isAuthNum
        if (!this.isAuthNum) {
          if (this.isAuth('dashboard:achievements:achievements')) {
            this.$router.replace({ path: '/dashboard-achievements/achievements' })
          } else if (this.isAuth('dashboard:efficiency:efficiency')) {
            this.$router.replace({ path: '/dashboard-efficiency/efficiency' })
          } else if (this.isAuth('dashboard:financials:financial')) {
            this.$router.replace({ path: '/dashboard-financials/financial' })
          }
          return
        }
        this.$http({
          url: this.$http.adornUrl('/sys/expirenotice/getCount'),
          method: 'post',
          data: this.$http.adornData()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$refs.chartHomePage2 && this.$refs.chartHomePage2.init(data.map)
            this.$refs.chartHomePage3 && this.$refs.chartHomePage3.init(data.map)
            this.$refs.chartHomePage4 && this.$refs.chartHomePage4.init(data.map)
          } else {
            this.page2Map = {}
            this.totalPage = 0
          }
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/transresources/auditrecord/getCount'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$refs.chartHomePage1 && this.$refs.chartHomePage1.init(data.count.toBeAuditedNumber, data.count.auditedNumber)
            } else {
              this.page2Map = {}
              this.totalPage = 0
            }
          })
        })
      }
    }
  }
</script>


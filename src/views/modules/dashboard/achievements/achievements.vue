<template>
  <div class="bg-wrap">
    <!--<el-row>-->
      <!--<el-col>-->
        <!--<div style="height: 80px; line-height: 40px;text-align: center;font-size: 30px;color: orangered">4PL承运平台看板</div>-->
      <!--</el-col>-->
    <!--</el-row>-->
    <el-row>
      <el-col :span="7">
        <div>
          <shipper-kpi></shipper-kpi>
        </div>
      </el-col>
      <el-col :span="10">
        <div>
          <department-kpi></department-kpi>
        </div>
      </el-col>
      <el-col :span="7">
        <div>
          <carrier-kpi></carrier-kpi>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import CarrierKpi from './carrierKPI'
  import DepartmentKpi from './departmentKPI'
  import ShipperKpi from './shipperKPI'
  export default {
    data () {
      return {}
    },
    components: {
      CarrierKpi,
      DepartmentKpi,
      ShipperKpi
    }
  }
</script>
<style lang="scss" scoped>
  .bg-wrap {
    padding: 2rem;
    background-color: #ebebeb;
    background: url("~@/assets/img/main.png") no-repeat;
    background-size: 100% 100%;
  }
</style>
<style>
  /*.el-picker-panel{*/
    /*background-color: rgba(0, 0, 0, 0.8);*/
    /*border: none;*/
  /*}*/
  /*.el-picker-panel .el-picker-panel__body .el-date-picker__header .el-date-picker__header-label {*/
    /*color: #ffffff;*/
  /*}*/
  /*.el-picker-panel .el-picker-panel__body .el-picker-panel__content .el-month-table tbody tr td div a{*/
    /*color: #ffffff;*/
  /*}*/
</style>

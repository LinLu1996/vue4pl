<template>
  <div class="bg-wrap">
    <el-row>
      <el-col :span="12">
        <div class="left-title">
           <div :class="{fc_bg: true, fc_bg_active: fcActive}" @click="getMap('fc')">整车发车统计</div>
           <div :class="{mz_bg: true, mz_bg_active: mzActive}" @click="getMap('mz')">整车满足率</div>
           <div :class="{zz_bg: true, zz_bg_active: zzActive}" @click="getMap('zz')">整车装载率</div>
        </div>
        <div class="map-wrap" v-if="mapStatus === 'fc'">
          <vehicle-departure></vehicle-departure>
        </div>
        <div class="map-wrap" v-if="mapStatus === 'mz'">
          <vehicle-meets></vehicle-meets>
        </div>
        <div class="map-wrap" v-if="mapStatus === 'zz'">
          <vehicle-loading-rate></vehicle-loading-rate>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="height: 3rem">
          <div class="date-wrap">
            <xkl-date-picker type="year" size="mini" :pickerOptions="pickerOptions" placeholder="请选择" v-model="dataForm.rensureYear" @change="handleYear" clearable></xkl-date-picker>
          </div>
        </div>
        <div class="bg-color">
          <carrier-total-fine ref="totalFine"></carrier-total-fine>
        </div>
        <div class="bg-color">
          <carrier-total-freight ref="totalFreight"></carrier-total-freight>
        </div>
        <div class="bg-color">
          <carrier-total-damage ref="totalDamage"></carrier-total-damage>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 1rem">
      <el-col :span="8">
        <div>
          <carrier-fine></carrier-fine>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <carrier-freight></carrier-freight>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <carrier-damage></carrier-damage>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import VehicleDeparture from './vehicleDeparture'
  import VehicleMeets from './vehicleMeets'
  import VehicleLoadingRate from './vehicleLoadingRate'
  import CarrierFine from './carrierFine/carrierFine'
  import CarrierTotalFine from './carrierFine/carrierTotalFine'
  import CarrierFreight from './carrierFreight/carrierFreight'
  import CarrierTotalFreight from './carrierFreight/carrierTotalFreight'
  import CarrierDamage from './carrierDamage/carrierDamage'
  import CarrierTotalDamage from './carrierDamage/carrierTotalDamage'
  export default {
    data () {
      return {
        mapStatus: 'fc',
        fcActive: true,
        mzActive: false,
        zzActive: false,
        dataForm: {
          rensureYear: new Date()
        },
        pickerOptions: {
          disabledDate (value) {
            if (Date.now() - 24 * 60 * 60 * 1000 <= value) {
              return true
            }
            return false
          }
        }
      }
    },
    components: {
      VehicleDeparture,
      VehicleMeets,
      VehicleLoadingRate,
      CarrierFine,
      CarrierTotalFine,
      CarrierFreight,
      CarrierDamage,
      CarrierTotalFreight,
      CarrierTotalDamage
    },
    beforeRouteEnter (to, from, next) {
      // 注意，在路由进入之前，组件实例还未渲染，所以无法获取this实例，只能通过vm来访问组件实例
      if (from.name === 'efficiency-loadingRateDetails') {
        next(vm => {
          vm.mapStatus = 'zz'
          vm.getMap('zz')
        })
      }
      next()
    },
    activated () {
      this.handleYear()
    },
    methods: {
      getMap (type) {
        this.mapStatus = type
        switch (type) {
          case 'fc':
            this.fcActive = true
            this.mzActive = false
            this.zzActive = false
            break
          case 'mz':
            this.fcActive = false
            this.mzActive = true
            this.zzActive = false
            break
          case 'zz':
            this.fcActive = false
            this.mzActive = false
            this.zzActive = true
        }
      },
      handleYear (val) {
        this.$nextTick(() => {
          this.$refs.totalFine.init(this.dataForm.rensureYear)
          this.$refs.totalFreight.init(this.dataForm.rensureYear)
          this.$refs.totalDamage.init(this.dataForm.rensureYear)
        })
        // this.init()
      }
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
  .mask {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 1000;
    border: 1px solid #ffffff;
    p{
      font-size: 35px;
      color: #666666;
      position: absolute;
      left: 38%;
      top: 38%;
    }
  }
  .left-title {
    div{
      display: inline-block;
      color: #ffffff;
      width: 12rem;
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      cursor: pointer;
    }
    .fc_bg {
      background-color: #ebebeb;
      background: url("~@/assets/img/fc_bg_light.png") no-repeat;
      background-size: 100% 100%;
    }
    .fc_bg_active {
      background-color: #ebebeb;
      background: url("~@/assets/img/fc_bg_dark.png") no-repeat;
      background-size: 100% 100%;
    }
    .mz_bg {
      background-color: #ebebeb;
      background: url("~@/assets/img/mz_bg_light.png") no-repeat;
      background-size: 100% 100%;
    }
    .mz_bg_active {
      background-color: #ebebeb;
      background: url("~@/assets/img/mz_bg_dark.png") no-repeat;
      background-size: 100% 100%;
    }
    .zz_bg {
      background-color: #ebebeb;
      background: url("~@/assets/img/zz_bg_light.png") no-repeat;
      background-size: 100% 100%;
    }
    .zz_bg_active {
      background-color: #ebebeb;
      background: url("~@/assets/img/fc_bg_dark.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .map-wrap {
    margin-top: 2rem;
  }
  .date-wrap{
    width: 12rem;
    height: 2.5rem;
    line-height: 2.5rem;
    float: right;
    /*margin: 0.625rem;*/
    background-color: #ebebeb;
    background: url("~@/assets/img/map_date.png") no-repeat;
    background-size: 100% 100%;
    padding-left: 3rem;
    /deep/.el-date-editor{
      background: none;
      .el-input__inner{
        background: none;
        border: none;
        color: #ffffff;
      }
    }
  }
  .bg-color {
    background-color: rgba(150, 150, 150, 0.1);
    &:hover{
      background-color: rgba(150, 150, 150, 0.2);
    }
  }
</style>

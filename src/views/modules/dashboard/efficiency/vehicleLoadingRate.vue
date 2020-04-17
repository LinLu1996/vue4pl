<template>
  <div>
    <div class="date-wrap">
      <xkl-date-picker type="month" size="mini" :pickerOptions="pickerOptions" placeholder="请选择" v-model="dataForm.kpiMonth" @change="handleMonth" clearable></xkl-date-picker>
    </div>
    <div id="myChartChina3" style="width:100%;height: 30rem;margin: 0 auto"></div>
    <el-row style="margin-top: 1.5rem">
      <el-col :span="24">
        <el-form>
          <el-col :span="24" style="color: #ffffff">
            <p style="font-size: 2rem">
              <span>整车装载率:</span>
              <strong>{{dataForm.percent}}</strong>
            </p>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  // import {formatDate} from '../../../../utils';
  import china from 'echarts/map/json/china.json'
  import {formatDate} from '../../../../utils';
  // import cities from '../../trans-resources/carrier/cities'
  const echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/map')
  require('echarts/lib/chart/scatter')
  require('echarts/lib/chart/effectScatter')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/geo')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/visualMap')
  echarts.registerMap('china', china)
  export default {
    data () {
      return {
        dataForm: {
          kpiMonth: new Date(new Date().setDate(1)).setMonth(new Date().getMonth() - 1),
          totalNum: 0,
          coldChainNum: 0,
          wholeCarNum: 0,
          percent: 0
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
    created () {
    },
    mounted () {
      this.init()
    },
    activated () {
    },
    methods: {
      init () {
        document.getElementById('myChartChina3').removeAttribute('_echarts_instance_');
        this.$http({
          url: this.$http.adornUrl('/tms/shipment/getLoadingRate'),
          method: 'post',
          data: this.$http.adornData({
            'kpiMonth': this.dataForm.kpiMonth ? formatDate(this.dataForm.kpiMonth, 'Month').replace('-', '') : formatDate(new Date().getTime(), 'Month').replace('-', '')
          })
        }).then(({data}) => {
          if (data && data.code === 0 && data.shipment) {
            this.dataForm.totalNum = data.shipment.totalNum
            this.dataForm.coldChainNum = data.shipment.coldChainNum
            this.dataForm.wholeCarNum = data.shipment.wholeCarNum
            this.dataForm.percent = data.shipment.percent + '%'
            let mapData = data.shipment.byProvince
            mapData = mapData.map(res => {
              if (res.fromProvince) {
                res.city = res.fromProvince
                let replace = ['省', '市', '自治区', '特别行政区', '壮族', '回族', '维吾尔']
                replace.map(x => {
                  res.fromProvince = res.fromProvince.replace(x, '')
                })
              }
              let json = {
                name: res.fromProvince,
                value: res.percent,
                fromProvince: res.city,
                kpiMonth: this.dataForm.kpiMonth ? formatDate(this.dataForm.kpiMonth, 'Month').replace('-', '') : formatDate(new Date().getTime(), 'Month').replace('-', '')
              }
              return json
            })
            this.drawLine(mapData)
          } else {
            this.drawLine([])
            this.totalPage = 0
          }
        })
      },
      handleMonth (val) {
        this.init()
      },
      drawLine (mapData) {
        // 基于准备好的dom，初始化echarts实例
        var myChartChina3 = echarts.init(document.getElementById('myChartChina3'))
        // 绘制图表
        var mapName = 'china'
        var data = mapData;

        var geoCoordMap = {};

        /* 获取地图数据 */
        myChartChina3.showLoading();
        var mapFeatures = echarts.getMap(mapName).geoJson.features;
        myChartChina3.hideLoading();
        mapFeatures.forEach(function (v) {
          // 地区名称
          var name = v.properties.name;
          // 地区经纬度
          geoCoordMap[name] = v.properties.cp;
        });
        let _that = this
        var convertData = function (data) {
          var res = [];
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
              res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value),
                fromProvince: data[i].fromProvince,
                kpiMonth: _that.dataForm.kpiMonth ? formatDate(_that.dataForm.kpiMonth, 'Month').replace('-', '') : formatDate(new Date().getTime(), 'Month').replace('-', '')
              });
            }
          }
          return res;
        };
        var option = {
          tooltip: {
            show: true,
            formatter: function (r) {
              return r.seriesName + '<br/>' + r.name + ' : ' + (r.value || '') + '%'
            }
          },
          geo: {
            show: true,
            zoom: 1.4,
            map: mapName,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#2682E2',
                borderColor: '#c1feff'
              },
              emphasis: {
                areaColor: '#4499d0'
              }
            }
          },
          series: [{
            name: '',
            type: 'scatter',
            coordinateSystem: 'geo',
            tooltip: {
              show: false
            },
            data: convertData(data),
            symbolSize: function (val) {
              return 10;
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: '#FFFC00'
              }
            }
          },
          {
            name: '整车装载率',
            type: 'map',
            map: mapName,
            geoIndex: 0,
            aspectScale: 0.75, // 长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: '#fff'
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#031525',
                borderColor: '#3B5077'
              },
              emphasis: {
                areaColor: '#2B91B7'
              }
            },
            animation: false,
            data: data
          },
          {
            name: '',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 6
          },
          {
            name: '',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(data.sort(function (a, b) {
              return b.value - a.value;
            }).slice(0, 10)),
            symbolSize: function (val) {
              return 5;
            },
            tooltip: {
              show: false
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: '{b}',
                position: 'left',
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: '#FFFC00',
                shadowBlur: 10,
                shadowColor: '#FFFC00'
              }
            },
            zlevel: 1
          }

          ]
        };
        myChartChina3.setOption(option);
        window.onresize = function () {
          // resizeMyChartContainer();
          myChartChina3.resize();
        }
        var _this = this
        myChartChina3.on('click', function (params) {
          if (params.data && params.data.kpiMonth) {
            _this.$router.push({name: 'efficiency-loadingRateDetails', params: {data: params.data}})
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .date-wrap{
    width: 12rem;
    height: 2.5rem;
    line-height: 2.5rem;
    margin: 0.625rem;
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
</style>

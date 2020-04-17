<template>
  <div>
    <div class="date-wrap">
      <xkl-date-picker type="month" size="mini" :pickerOptions="pickerOptions" placeholder="请选择" v-model="dataForm.kpiMonth" @change="handleMonth" clearable></xkl-date-picker>
    </div>
    <div id="myChartChina2" style="width:100%;height: 30rem;margin: 0 auto"></div>
  </div>
</template>
<script>
  import {formatDate} from '../../../../utils';
  import china from 'echarts/map/json/china.json'
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
        document.getElementById('myChartChina2').removeAttribute('_echarts_instance_');
        this.drawLine([{name: '上海', value: '2'}])
        this.$http({
          url: this.$http.adornUrl('/shippingplatform/trefficiencyplatform/getWholeCar'),
          method: 'post',
          data: this.$http.adornData({
            'kpiMonth': this.dataForm.kpiMonth ? formatDate(this.dataForm.kpiMonth, 'Month').replace('-', '') : formatDate(new Date().getTime(), 'Month').replace('-', '')
          })
        }).then(({data}) => {
          // if (data && data.code === 0) {
          //   this.dataForm.totalNum = data.wholeCar.totalNum
          //   this.dataForm.coldChainNum = data.wholeCar.coldChainNum
          //   this.dataForm.wholeCarNum = data.wholeCar.wholeCarNum
          //   this.dataForm.percent = parseInt((this.dataForm.coldChainNum / this.dataForm.totalNum) * 100)
          //   let mapData = data.wholeCar.byProvince
          //   mapData = mapData.map(res => {
          //     if (res.province) {
          //       res.city = res.province
          //       let replace = ['省', '市', '自治区', '特别行政区', '壮族', '回族', '维吾尔']
          //       replace.map(x => {
          //         res.province = res.province.replace(x, '')
          //       })
          //     }
          //     let json = {
          //       name: res.province,
          //       value: res.number,
          //       province: res.city,
          //       kpiMonth: this.dataForm.kpiMonth ? formatDate(this.dataForm.kpiMonth, 'Month').replace('-', '') : formatDate(new Date().getTime(), 'Month').replace('-', '')
          //     }
          //     return json
          //   })
          //   this.drawLine(mapData)
          // } else {
          //   this.totalPage = 0
          // }
        })
      },
      handleMonth (val) {
        this.init()
      },
      drawLine (mapData) {
        // 基于准备好的dom，初始化echarts实例
        var myChartChina2 = echarts.init(document.getElementById('myChartChina2'))
        // 绘制图表
        var mapName = 'china'
        var data = mapData;

        var geoCoordMap = {};

        /* 获取地图数据 */
        myChartChina2.showLoading();
        var mapFeatures = echarts.getMap(mapName).geoJson.features;
        myChartChina2.hideLoading();
        mapFeatures.forEach(function (v) {
          // 地区名称
          var name = v.properties.name;
          // 地区经纬度
          geoCoordMap[name] = v.properties.cp;
        });
        var convertData = function (data) {
          var res = [];
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
              res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
              });
            }
          }
          return res;
        };
        var option = {
          tooltip: {
            show: true
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
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#333'
              }
            }
          },
          {
            type: 'map',
            map: mapName,
            geoIndex: 0,
            aspectScale: 0.75, // 长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: true
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
                color: '#cc10cc',
                shadowBlur: 10,
                shadowColor: '#cc10cc'
              }
            },
            zlevel: 1
          }

          ]
        };
        myChartChina2.setOption(option);
        window.onresize = function () {
          // resizeMyChartContainer();
          myChartChina2.resize();
        }
        var _this = this
        myChartChina2.on('click', function (params) {
          _this.$message.warning('功能建设中。。。')
          // if (params.data.kpiMonth) {
          //   _this.$router.push({name: 'efficiency-vehicleDepartureDetail', params: {data: params.data}})
          // }
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

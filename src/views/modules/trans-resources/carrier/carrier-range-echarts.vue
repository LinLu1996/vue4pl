<template>
  <div class="mod-demo-echarts">
    <el-alert
      title="承运范围："
      type="info"
      :closable="false">
    </el-alert>
    <el-tag>承运区域</el-tag>
    <el-row :gutter="20">
      <el-col :span="24">
        <div id="myChartChina" style="width:100%;height: 500px;margin: 0 auto"></div>
      </el-col>
    </el-row>
    <el-tag>详细数据</el-tag>
    <el-row>
      <el-col style="margin: 20px 0;">
        <el-card shadow="never">
          <div>
            <p style="padding:0 30%;line-height: 30px">
              <strong>承运区域</strong>
              <span style="margin-left: 20px;">{{carrierAreas | chooseArea()}}</span>
            </p>
            <p style="padding:0 30%;line-height: 30px">
              <strong>运作区域</strong>
              <span style="margin-left: 20px">{{usedArea.length ? usedArea.join('、') : ''}}</span>
            </p>
            <p style="padding:0 30%;line-height: 30px">
              <strong>优势区域</strong>
              <span style="margin-left: 20px">{{carrierAreas | chooseArea(5)}}</span>
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-tag>承运线路</el-tag>
    <el-row :gutter="20">
      <el-col :span="24">
        <div id="mapBox" style="width:100%;height: 500px;margin: 0 auto"></div>
      </el-col>
    </el-row>
    <el-tag>详细数据</el-tag>
    <el-row>
      <el-col style="margin: 20px 0;">
        <el-card shadow="never">
          <div>
            <p style="padding:0 30%;line-height: 30px">
              <strong>承运线路</strong>
              <span style="margin-left: 20px">{{carrierLines | chooseLine(1)}}</span>
            </p>
            <p style="padding:0 30%;line-height: 30px">
              <strong>运作线路</strong>
              <span style="margin-left: 20px">{{carrierLines | chooseUsedLine(1)}}</span>
            </p>
            <p style="padding:0 30%;line-height: 30px">
              <strong>优势线路</strong>
              <span style="margin-left: 20px">{{carrierLines | chooseLine(0)}}</span>
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import china from 'echarts/map/json/china.json'
  // import cities from './cities'
  const echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/map')
  require('echarts/lib/chart/bar')
  require('echarts/lib/chart/line')
  require('echarts/lib/chart/lines')
  require('echarts/lib/chart/effectScatter')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/geo')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/visualMap')
  const mapProvince = require('echarts/map/json/china.json')
  const mapJson = require('echarts/map/json/china-cities.json')
  echarts.registerMap('china', china)
  export default {
    data () {
      return {
        carrierAreas: [],
        carrierLines: [],
        usedArea: []
      }
    },
    created () {
      const ID = this.$route.query.id
      this.getDataList(ID)
    },
    mounted () {
    },
    activated () {
    },
    filters: {
      chooseArea (item, type) {
        let temp = []
        if (!type) {
          temp = item
        } else {
          temp = item.filter(res => {
            return type ? res.value === type : res.value
          })
        }
        return temp.map(res => {
          return res.name
        }).join('、')
      },
      chooseLine (item, type) {
        let temp = []
        if (type === 1) {
          temp = item.filter(res => {
            return res[0].name !== res[1].name
          })
        } else {
          temp = item.filter(res => {
            return res[0].isGoodLine === type && res[0].name !== res[1].name
          })
        }
        return temp.map(res => {
          return res[0].name + ' → ' + res[1].name
        }).join('、')
      },
      chooseUsedLine (item, type) {
        let temp = item.filter(res => {
          return res[0].isUsedLine === type && res[0].name !== res[1].name
        })
        return temp.map(res => {
          return res[0].name + ' → ' + res[1].name
        }).join('、')
      }
    },
    methods: {
      getDataList (id) {
        this.$nextTick(() => {
          if (id) {
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcarrier/carrierLimit/${id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                let carrierAreas = data.trCarrier.carrierAreas
                carrierAreas = carrierAreas.map(res => {
                  let replace = ['省', '市', '自治区', '特别行政区', '壮族', '回族', '维吾尔']
                  replace.map(x => {
                    res.areaName = res.areaName.replace(x, '')
                  })
                  if (res.areaName && res.isUsedArea === 1) {
                    this.usedArea.push(res.areaName)
                  }
                  if (res.areaName && res.isUsedArea === 0) {
                    let json = {
                      name: res.areaName,
                      value: 10
                    }
                    return json
                  } else if (res.areaName && res.isGoodArea === 1) {
                    let json = {
                      name: res.areaName,
                      value: 5
                    }
                    return json
                  } else {
                    let json = {
                      name: res.areaName,
                      value: 9
                    }
                    return json
                  }
                })
                this.carrierAreas = carrierAreas
                let carrierLines = data.trCarrier.carrierLines
                carrierLines = carrierLines.map(res => {
                  let replace = ['省', '市', '自治区', '特别行政区', '壮族', '回族', '维吾尔', '自治州', '哈尼族', '彝族', '土家族', '苗族', '布依族']
                  replace.map(x => {
                    res.startCityName = res.startCityName.replace(x, '')
                    res.endCityName = res.endCityName.replace(x, '')
                    res.endProvinceName = res.endProvinceName ? res.endProvinceName.replace(x, '') : ''
                  })
                  if (res.startCityName) {
                    let arr = [{name: res.startCityName, isGoodLine: res.isGoodLine, isUsedLine: res.isUsedLine}, {name: res.endCityName || res.endProvinceName, value: Math.round(Math.random() * 500)}]
                    return arr
                  }
                })
                this.carrierLines = carrierLines
                this.drawLine();
                this.drawMapLine();
              }
            })
          }
        })
      },
      drawLine () {
        // 基于准备好的dom，初始化echarts实例
        var myChartContainer = document.getElementById('myChartChina');
        var myChartChina = echarts.init(myChartContainer);
        // 绘制图表
        var optionMap = {
          backgroundColor: '#FFFFFF',
          title: {},
          tooltip: {
            show: false
          },
          visualMap: {
            show: true,
            left: '20%',
            splitList: [
              {start: 10, end: 10, label: '承运区域'}, {start: 9, end: 9, label: '运作区域'}, {start: 5, end: 5, label: '优势区域'}
            ],
            color: ['#666', 'yellow',  '#b5e520']
          },
          selectedMode: 'single',
          series: [
            {
              name: '数据',
              type: 'map',
              mapType: 'china',
              roam: true,
              zoom: 1.40,
              label: {
                normal: {
                  show: true
                },
                emphasis: {
                  show: false
                }
              },
              data: this.carrierAreas
            }
          ]
        }
        myChartChina.setOption(optionMap);
        window.onresize = function () {
          // resizeMyChartContainer();
          myChartChina.resize();
        }
      },
      drawMapLine () {
        var mapBoxEchart = echarts.init(document.getElementById('mapBox'));
        // var mapName = 'chinaCities'
        // var mapFeatures = require(mapName).geoJson.features;
        let province = {}
        mapProvince.features.forEach(res => {
          province[res.properties.name] = res.properties.cp
        })
        let cities = {}
        mapJson.features.forEach(res => {
          cities[res.properties.name] = res.properties.cp
        })
        Object.assign(cities, province)
        var geoCoordMap = cities

        var CYData = this.carrierLines.filter(res => res[0].isUsedLine === 0)
        var YSData = this.carrierLines.filter(res => res[0].isGoodLine === 0)
        var usedSData = this.carrierLines.filter(res => res[0].isUsedLine === 1 && res[0].isGoodLine === 1)
        var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

        var convertData = function (data) {
          var res = [];
          for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geoCoordMap[dataItem[0].name];
            var toCoord = geoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
              res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                coords: [fromCoord, toCoord]
              });
            }
          }
          return res;
        };

        var color = ['#3e8ef7', 'yellow', '#ffa022'];
        var series = [];
        [['承运线路', CYData], ['运作线路', usedSData],  ['优势线路', YSData]].forEach(function (item, i) {
          series.push({
            name: item[0],
            type: 'lines',
            zlevel: 1,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: '#fff',
              symbolSize: 8
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 1,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          },
            {
              name: item[0],
              type: 'lines',
              zlevel: 2,
              symbol: ['none', 'arrow'],
              symbolSize: 3,
              // label: {
              //   normal: {
              //     show: true,
              //     position: 'right',
              //     offset: [5, 0],
              //     formatter: function (params) { // 圆环显示文字
              //       return params.data.fromName;
              //     },
              //     fontSize: 13
              //   },
              //   emphasis: {
              //     show: true
              //   }
              // },
              effect: {
                show: true,
                period: 6,
                trailLength: 0,
                symbol: planePath,
                symbolSize: 8
              },
              lineStyle: {
                normal: {
                  color: color[i],
                  width: 1,
                  opacity: 0.6,
                  curveness: 0.2
                }
              },
              data: convertData(item[1])
            },
            {
              name: item[0],
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 2,
              rippleEffect: {
                brushType: 'stroke'
              },
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: '{b}'
                }
              },
              symbolSize: function (val) {
                return 11;
              },
              itemStyle: {
                label: {
                  show: true
                },
                normal: {
                  color: color[i]
                }
              },
              data: item[1].map(function (dataItem) {
                return {
                  name: dataItem[1].name,
                  value: geoCoordMap[dataItem[1].name] ? geoCoordMap[dataItem[1].name].concat([dataItem[1].value]) : [].concat([dataItem[1].value])
                };
              })
            });
        });

        // 指定相关的配置项和数据
        var mapBoxOption = {
          title: {},
          legend: {
            orient: 'vertical',
            top: 'bottom',
            left: '20%',
            data: ['承运线路', '运作线路', '优势线路'],
            textStyle: {
              color: '#333'
            }
          },
          geo: {
            map: 'china',
            roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
            aspectScale: 0.75,
            zoom: 1.40,
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#00a0c9'
                }
              },
              emphasis: { // 对应的鼠标悬浮效果
                show: false,
                textStyle: {
                  color: '#00a0c9'
                }
              }
            },
            itemStyle: {
              normal: {
                areaColor: '#84ccc98c',
                borderColor: '#0066ba'
              },
              emphasis: {
                borderWidth: 0,
                borderColor: '#0066ba',
                areaColor: '#0494e1',
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          series: series
        }
        // 使用制定的配置项和数据显示图表
        mapBoxEchart.setOption(mapBoxOption);
        // echart图表自适应
        window.addEventListener('resize', function () {
          mapBoxEchart.resize();
        })
      }
    }
  }
</script>

<style lang="scss">
  .mod-demo-echarts {
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -10px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-box {
      min-height: 400px;
    }
  }
</style>

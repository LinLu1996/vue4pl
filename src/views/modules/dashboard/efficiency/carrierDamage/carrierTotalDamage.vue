<template>
  <div>
    <div id="carrierDamage2"  style="width:100%;height: 14rem;margin: 0 auto"></div>
  </div>
</template>
<script>
  import { formatDate } from '@/utils'
  import echarts from 'echarts'

  export default {
    data () {
      return {
        dataForm: {
          rensureMonth: new Date(new Date().setDate(1)).setMonth(new Date().getMonth() - 1),
          rensureYear: new Date()
        },
        carrierDamage2: null,
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
    activated () {
      this.init()
    },
    methods: {
      init (val) {
        document.getElementById('carrierDamage2').removeAttribute('_echarts_instance_');
        this.dataForm.rensureYear = val
        this.$http({
          url: this.$http.adornUrl('/shippingplatform/trefficiencyplatform/efficiencyList'),
          method: 'post',
          data: this.$http.adornData({
            'statementMonth': this.dataForm.rensureMonth && formatDate(this.dataForm.rensureMonth, 'Month'),
            'statementYear': this.dataForm.rensureYear && new Date(this.dataForm.rensureYear).getFullYear(),
            'type': 3
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (this.carrierDamage2) {
              this.carrierDamage2.clear()
            }
            const datas = data.trEfficiencyPlatformEntity || {}
            const tKpiAssessmentRecordYearList = datas.fsCargoDamageYearList || []
            this.drawHomePage2(tKpiAssessmentRecordYearList)
          } else {
          }
        })
      },
      drawHomePage2 (datas) {
        var data = [];
        datas.length && datas.forEach(item => {
          data.push({
            carrierName: item.carrierName,
            carrierId: item.carrierId,
            value: item.totalDamageAmountCount
          })
        })
        var result = [];
        for (let i = 0, len = data.length; i < len; i += 4) {
          result.push(data.slice(i, i + 4));
        }
        var options = []
        var indexAll = []
        let totalIndex = 0
        result.forEach((item, index) => {
          let indexList = []
          let data = []
          let carrierList = []
          indexAll.push(index + 1)
          item.forEach((item2, index2) => {
            totalIndex = totalIndex + 1
            indexList.push(totalIndex)
            carrierList.push(item2.carrierName)
            data.push({
              carrierName: item2.carrierName,
              carrierId: item2.carrierId,
              value: item2.value
            })
          })
          options.push({
            yAxis: [
              {
                data: indexList
              }
            ],
            series: [
              {
                label: {
                  normal: {
                    show: true,
                    position: [2 * this.$ratio, -20 * this.$ratio],
                    color: '#fff',
                    fontSize: 14 * this.$ratio,
                    formatter: function (data) {
                      return carrierList[data.dataIndex];
                    }
                  }
                },
                data: data
              },
              {
                data: data
              }
            ]
          })
        })
        this.carrierDamage2 = echarts.init(document.getElementById('carrierDamage2'))
        var option = {
          baseOption: {
            timeline: {
              data: indexAll,
              axisType: 'category',
              left: '3%',
              right: '5%',
              bottom: '30%',
              label: {
                color: '#ccc',
                formatter: function (s) { return s; },
                normal: {
                  show: false
                }
              },
              autoPlay: false,
              itemStyle: {
                normal: {
                  color: '#ccc',
                  opacity: 0
                },
                emphasis: {
                  color: '#ccc',
                  opacity: 0
                }
              },
              lineStyle: {
                show: false
                // color: '#ccc'
                // type: 'dotted'
              },
              playInterval: 1000,
              checkpointStyle: {
                // symbol: 'diamond',
                symbolSize: 5 * this.$ratio,
                color: '#e37212',
                borderColor: '#e37212',
                opacity: 0
              },
              controlStyle: {
                itemSize: 20 * this.$ratio,
                showPlayBtn: false,
                itemGap: 30 * this.$ratio,
                normal: {
                  color: '#ccc',
                  borderColor: '#fff',
                  opacity: 0.3
                },
                emphasis: {
                  color: '#ccc',
                  borderColor: '#fff'
                },
                prevIcon: 'path://M512 0a512.512 512.512 0 0 1 512 512 512.512 512.512 0 0 1-512 512 512.512 512.512 0 0 1-512-512 512.512 512.512 0 0 1 512-512z m144 248.512a36.48 36.48 0 0 0-51.52-0.384L367.488 485.12a35.392 35.392 0 0 0-10.24 26.816 35.84 35.84 0 0 0 10.24 27.008l236.992 236.992c13.952 14.08 37.056 14.016 51.328-0.256a36.544 36.544 0 0 0 0.448-51.52L444.16 512.064l212.032-212.096a36.288 36.288 0 0 0-0.256-51.456z',
                nextIcon: 'M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m121.6 537.806452l-192 192a48.516129 48.516129 0 0 1-25.806452 12.8 48.516129 48.516129 0 0 1-25.806451-12.8 38.916129 38.916129 0 0 1 0-51.2l166.812903-166.606452-166.4-166.4a38.916129 38.916129 0 0 1 0-51.2 38.916129 38.916129 0 0 1 51.2 0l192 191.793548a29.935484 29.935484 0 0 1 0 51.612904z'
              }
              // bottom: -5 * this.$ratio
            },
            // backgroundColor: '#fff',
            title: {
              text: '承运商累计货损排行',
              x: 'center',
              y: 10,
              textStyle: {
                color: '#fff',
                fontSize: 16 * this.$ratio
              }
            },
            grid: {
              left: '15%',
              right: '15%',
              top: 50 * this.$ratio,
              bottom: 0
            },
            toolbox: {
              show: false
            },
            calculable: true,
            xAxis: [
              {
                type: 'value',
                boundaryGap: [0, 0.2],
                axisLabel: {
                  textStyle: {
                    fontSize: 13 * this.$ratio,
                    color: '#c31b1b'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#e4b5b5'
                  }
                },
                splitLine: {
                  show: false,
                  lineStyle: {
                    type: 'dashed',
                    color: '#DDD'
                  }
                }
              }
            ],
            yAxis: [
              {
                type: 'category',
                name: '',
                inverse: true,
                triggerEvent: true,
                axisLine: {
                  lineStyle: {
                    color: '#e4b5b5'
                  }
                },
                axisLabel: {
                  textStyle: {
                    fontSize: 12 * this.$ratio,
                    color: '#fff',
                    lineHeight: 20 * this.$ratio
                  },
                  rich: {
                    value: {
                      width: 20 * this.$ratio,
                      height: 20 * this.$ratio,
                      align: 'center',
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 50 * this.$ratio
                    }
                  },
                  formatter: function (value) {
                    return '{value|' + value + '}';
                  }
                }
              }
            ],
            series: [
              {
                type: 'bar',
                barGap: '-96%',
                barWidth: 14 * this.$ratio,
                itemStyle: {
                  normal: {
                    borderColor: '#FF5AAC',
                    borderWidth: 0,
                    barBorderRadius: 0,
                    color: '#FF5AAC'
                  }
                },
                z: 2
              },
              {
                name: '',
                type: 'bar',
                barWidth: 14 * this.$ratio,
                yAxisIndex: 0,
                label: {
                  normal: {
                    show: true,
                    position: 'right',
                    textStyle: {
                      color: '#FF5AAC',
                      fontSize: 16 * this.$ratio
                    },
                    formatter: function (s) { return s.value + '万'; }
                  }
                },
                z: 2,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                      offset: 0,
                      color: '#EA0B7A'
                    },
                    {
                      offset: 1,
                      color: '#FF5AAC'
                    }])

                  }

                }
              }
            ]
          },
          options: options
        };
        this.carrierDamage2.setOption(option)
        window.addEventListener('resize', () => {
          this.carrierDamage2.resize()
        })
        var _this = this
        this.carrierDamage2.on('click', function (params) {
          if (params.componentType !== 'timeline') {
            if (params.data || params.value) {
              _this.$router.push({
                path: '/dashboard-efficiency/efficiency/performance-information',
                query: {
                  id: (params.data && params.data.carrierId) || (data.length && data[parseInt(params.value) - 1].carrierId),
                  yearCount: new Date(_this.dataForm.rensureYear).getFullYear(),
                  title: `${params.data ? params.data.carrierName : data.length ? data[parseInt(params.value) - 1].carrierName : ''}${new Date(_this.dataForm.rensureYear).getFullYear()}度货损统计`,
                  type: 3
                }
              })
            }
          }
        })
      },
      handleYear (val) {
        this.init()
      }
    }
  }
</script>

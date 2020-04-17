<template>
  <div>
    <div class="date-wrap">
      <el-date-picker
        v-model="dataForm.rensureMonth"
        style="width: 34%;float: right"
        type="month"
        :clearable="false"
        size="mini"
        :pickerOptions="pickerOptions"
        @change="handleMonth"
        placeholder="选择月">
      </el-date-picker>
    </div>
    <div class="bg-wrap">
      <p style="padding: 0.625rem;margin:0;font-size: 1.5rem;color: #ffffff;text-align: center">承运商KPI统计</p>
      <div id="myChartCarrier" style="width:100%;height: 22rem;margin: 0 auto"></div>
    </div>
    <div class="date-wrap">
      <el-date-picker
        v-model="dataForm.rensureYear"
        style="width: 32%;float: right"
        type="year"
        value-format="yyyy"
        :clearable="false"
        size="mini"
        :pickerOptions="pickerOptions"
        @change="handleYear"
        placeholder="选择年"></el-date-picker>
    </div>
    <div class="left_right_footer">
      <div id="myChartCarrier2"  style="width:100%;height: 30rem;margin: 0 auto"></div>
    </div>
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
        chartCarrierPage: null,
        chartCarrierPage2: null,
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
      init () {
        document.getElementById('myChartCarrier').removeAttribute('_echarts_instance_');
        document.getElementById('myChartCarrier2').removeAttribute('_echarts_instance_');
        this.$http({
          url: this.$http.adornUrl('/shippingplatform/trshippingplatform/carrierRecordList'),
          method: 'post',
          data: this.$http.adornData({
            'rensureMonth': this.dataForm.rensureMonth && formatDate(this.dataForm.rensureMonth, 'Month').split('-').join(''),
            'rensureYear': this.dataForm.rensureYear && new Date(this.dataForm.rensureYear).getFullYear()
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (this.chartCarrierPage) {
              this.chartCarrierPage.clear()
            }
            if (this.chartCarrierPage2) {
              this.chartCarrierPage2.clear()
            }
            const datas = data.tKpiAssessmentRecordEntitys || {}
            const tKpiAssessmentRecordYearList = datas.tkpiAssessmentRecordYearList || []
            const tkpiAssessmentRecordMonthList = datas.tkpiAssessmentRecordMonthList || []
            this.drawHomePage(tkpiAssessmentRecordMonthList)
            this.drawHomePage2(tKpiAssessmentRecordYearList)
          } else {
          }
        })
      },
      drawHomePage (dataList) {
        var myColor = ['green', '#d90182', 'orange'];
        var data = []
        dataList.length && dataList.forEach(item => {
          data.push({
            carrierName: item.carrierName,
            id: item.id,
            value: item.score
          })
        })
        var result = [];
        for (let i = 0, len = data.length; i < len; i += 3) {
          result.push(data.slice(i, i + 3));
        }
        var options = []
        var indexAll = []
        let totalIndex = 0
        result.forEach((item, index) => {
          indexAll.push(index + 1)
          let indexList = []
          let data = []
          let carrierList = []
          item.forEach((item2, index2) => {
            totalIndex = totalIndex + 1
            indexList.push(totalIndex)
            carrierList.push(item2.carrierName)
            data.push({
              carrierName: item2.carrierName,
              id: item2.id,
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
                    position: [0, -20 * this.$ratio],
                    color: '#ffffff',
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
        this.chartCarrierPage = echarts.init(document.getElementById('myChartCarrier'))
        var option = {
          baseOption: {
            timeline: {
              data: indexAll,
              axisType: 'category',
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
                  color: '#ccc'
                },
                emphasis: {
                  color: '#ccc'
                }
              },
              lineStyle: {
                // show: false,
                color: '#ccc'
                // type: 'dotted'
              },
              playInterval: 1000,
              checkpointStyle: {
                // symbol: 'diamond',
                symbolSize: 5 * this.$ratio,
                color: '#e37212',
                borderColor: '#e37212'
              },
              controlStyle: {
                itemSize: 10 * this.$ratio,
                showPlayBtn: false,
                itemGap: 30 * this.$ratio,
                normal: {
                  color: '#ccc',
                  borderColor: '#fff'
                },
                emphasis: {
                  color: '#ccc',
                  borderColor: '#fff'
                }
                // prevIcon: 'path://M512 0a512.512 512.512 0 0 1 512 512 512.512 512.512 0 0 1-512 512 512.512 512.512 0 0 1-512-512 512.512 512.512 0 0 1 512-512z m144 248.512a36.48 36.48 0 0 0-51.52-0.384L367.488 485.12a35.392 35.392 0 0 0-10.24 26.816 35.84 35.84 0 0 0 10.24 27.008l236.992 236.992c13.952 14.08 37.056 14.016 51.328-0.256a36.544 36.544 0 0 0 0.448-51.52L444.16 512.064l212.032-212.096a36.288 36.288 0 0 0-0.256-51.456z',
                // nextIcon: 'M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m121.6 537.806452l-192 192a48.516129 48.516129 0 0 1-25.806452 12.8 48.516129 48.516129 0 0 1-25.806451-12.8 38.916129 38.916129 0 0 1 0-51.2l166.812903-166.606452-166.4-166.4a38.916129 38.916129 0 0 1 0-51.2 38.916129 38.916129 0 0 1 51.2 0l192 191.793548a29.935484 29.935484 0 0 1 0 51.612904z'
              },
              bottom: '-5'
            },
            // backgroundColor: '#fff',
            title: {
              text: '承运商KPI评分排行 ',
              x: 'center',
              y: 10,
              textStyle: {
                color: '#fff',
                fontSize: 16 * this.$ratio
              }
            },
            grid: {
              left: '6%',
              right: '20%',
              top: '10%',
              containLabel: true
            },
            toolbox: {
              show: false
            },
            calculable: true,
            xAxis: [
              {
                show: false
              }
            ],
            yAxis: [
              {
                type: 'category',
                name: '',
                inverse: true,
                triggerEvent: true,
                axisLabel: {
                  textStyle: {
                    fontSize: 18 * this.$ratio,
                    color: '#ffffff'
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
                },
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                }
              }
            ],
            series: [
              {
                type: 'bar',
                barGap: '-96%',
                barWidth: 20 * this.$ratio,
                itemStyle: {
                  normal: {
                    borderColor: function (params) {
                      var num = myColor.length;
                      return myColor[params.dataIndex % num]
                    },
                    borderWidth: 0,
                    barBorderRadius: 20 * this.$ratio,
                    color: function (params) {
                      var num = myColor.length;
                      return myColor[params.dataIndex % num]
                    }
                  }
                },
                z: 2
              },
              {
                name: '',
                type: 'bar',
                barGap: '-96%',
                barCateGoryGap: 20 * this.$ratio,
                barWidth: 20 * this.$ratio,
                yAxisIndex: 0,
                label: {
                  normal: {
                    show: true,
                    position: 'right',
                    textStyle: {
                      color: function (params) {
                        var num = myColor.length;
                        return myColor[params.dataIndex % num]
                      },
                      fontSize: 16 * this.$ratio
                    },
                    formatter: function (s) { return s.value + '分'; }
                  }
                },
                itemStyle: {
                  normal: {
                    barBorderRadius: 20 * this.$ratio,
                    color: function (params) {
                      var num = myColor.length;
                      return myColor[params.dataIndex % num]
                    }
                  }
                }
              }
            ]
          },
          options: options
        };
        this.chartCarrierPage.setOption(option)
        window.addEventListener('resize', () => {
          this.chartCarrierPage.resize()
        })
        const _this = this
        this.chartCarrierPage.on('click', function (params) {
          if (params.componentType !== 'timeline') {
            if (params.data || params.value) {
              _this.$router.push({
                path: '/dashboard-achievements/achievements/template-view',
                query: {
                  id: (params.data && params.data.id) || (data.length && data[parseInt(params.value) - 1].id),
                  rensureMonth: formatDate(_this.dataForm.rensureMonth, 'Month')
                }
              })
            }
          }
        })
      },
      drawHomePage2 (datas) {
        var data = [];
        datas.length && datas.forEach(item => {
          data.push({
            carrierName: item.carrierName,
            carrierId: item.carrierId,
            transportType: item.transportType,
            value: item.score
          })
        })
        var result = [];
        for (let i = 0, len = data.length; i < len; i += 6) {
          result.push(data.slice(i, i + 6));
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
              transportType: item2.transportType,
              value: item2.value
            })
          })
          options.push({
            // tooltip: {
            //   trigger: 'axis',
            //   formatter: '{b}：<br />{c}分'
            // },
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
                    position: [2, -20 * this.$ratio],
                    color: '#ffffff',
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
        this.chartCarrierPage2 = echarts.init(document.getElementById('myChartCarrier2'))
        var option = {
          baseOption: {
            timeline: {
              data: indexAll,
              axisType: 'category',
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
                  color: '#ccc'
                },
                emphasis: {
                  color: '#ccc'
                }
              },
              lineStyle: {
                // show: false,
                color: '#ccc'
                // type: 'dotted'
              },
              playInterval: 1000,
              checkpointStyle: {
                // symbol: 'diamond',
                symbolSize: 5 * this.$ratio,
                color: '#e37212',
                borderColor: '#e37212'
              },
              controlStyle: {
                itemSize: 10 * this.$ratio,
                showPlayBtn: false,
                itemGap: 30 * this.$ratio,
                normal: {
                  color: '#ccc',
                  borderColor: '#fff'
                },
                emphasis: {
                  color: '#ccc',
                  borderColor: '#fff'
                }
                // prevIcon: 'path://M512 0a512.512 512.512 0 0 1 512 512 512.512 512.512 0 0 1-512 512 512.512 512.512 0 0 1-512-512 512.512 512.512 0 0 1 512-512z m144 248.512a36.48 36.48 0 0 0-51.52-0.384L367.488 485.12a35.392 35.392 0 0 0-10.24 26.816 35.84 35.84 0 0 0 10.24 27.008l236.992 236.992c13.952 14.08 37.056 14.016 51.328-0.256a36.544 36.544 0 0 0 0.448-51.52L444.16 512.064l212.032-212.096a36.288 36.288 0 0 0-0.256-51.456z',
                // nextIcon: 'M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m121.6 537.806452l-192 192a48.516129 48.516129 0 0 1-25.806452 12.8 48.516129 48.516129 0 0 1-25.806451-12.8 38.916129 38.916129 0 0 1 0-51.2l166.812903-166.606452-166.4-166.4a38.916129 38.916129 0 0 1 0-51.2 38.916129 38.916129 0 0 1 51.2 0l192 191.793548a29.935484 29.935484 0 0 1 0 51.612904z'
              },
              bottom: -5 * this.$ratio
            },
            // backgroundColor: '#fff',
            title: {
              text: '承运商KPI累计评分排行 ',
              x: 'center',
              y: 10,
              textStyle: {
                color: '#fff',
                fontSize: 16 * this.$ratio
              }
            },
            grid: {
              left: '10%',
              bottom: '20%'
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
                    color: '#ffffff'
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
                    color: '#ffffff',
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
                    borderColor: '#ef6b44',
                    borderWidth: 0,
                    barBorderRadius: 0,
                    color: '#ef6b44'
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
                      color: '#ef6b44',
                      fontSize: 16 * this.$ratio
                    },
                    formatter: function (s) { return s.value + '分'; }
                  }
                },
                z: 2,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                      offset: 0,
                      color: '#e27110'
                    },
                    {
                      offset: 1,
                      color: '#fda254'
                    }])
                  }

                }
              }
            ]
          },
          options: options
        };
        this.chartCarrierPage2.setOption(option)
        window.addEventListener('resize', () => {
          this.chartCarrierPage2.resize()
        })
        var _this = this
        this.chartCarrierPage2.on('click', function (params) {
          if (params.componentType !== 'timeline') {
            if (params.data || params.value) {
              _this.$router.push({
                name: 'achievements-performance-information',
                query: {
                  id: (params.data && params.data.carrierId) || data[parseInt(params.value) - 1].carrierId,
                  yearCount: new Date(_this.dataForm.rensureYear).getFullYear(),
                  carrierName: (params.data && params.data.carrierName) || data[parseInt(params.value) - 1].carrierName,
                  transportType: (params.data && params.data.transportType) || data[parseInt(params.value) - 1].transportType
                }
              })
            }
          }
        })
      },
      handleMonth (val) {
        this.init()
      },
      handleYear (val) {
        this.init()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .date-wrap {
    height: 3rem;;
    line-height: 3rem;
    margin: 0.625rem;
    background-color: #ebebeb;
    background: url("~@/assets/img/carrier_date.png") no-repeat;
    background-size: 100% 100%;
    /deep/.el-date-editor{
      background: none;
      .el-input__inner{
        background: none;
        border: none;
        color: #ffffff;
      }
    }
  }
  .bg-wrap {
    margin: 0.625rem;
    background-color: #ebebeb;
    background: url("~@/assets/img/project_bg.png") no-repeat;
    background-size: 100% 100%;
  }
  .left_right_footer {
    margin: 0.625rem;
    background-color: #ebebeb;
    background: url("~@/assets/img/left_right_footer.png") no-repeat;
    background-size: 100% 100%;
  }
</style>

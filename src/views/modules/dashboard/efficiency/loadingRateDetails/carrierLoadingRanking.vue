<template>
  <div>
    <div id="myChartBar1" style="width:100%;height: 400px;margin: 0 auto"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    data () {
      return {
      }
    },
    activated () {
      // this.init()
    },
    methods: {
      init (data) {
        let xData = []
        let yData = []
        data.map(res => {
          xData.push(res.percent)
          yData.push(res.carrierName)
        })
        this.drawBar1(xData, yData)
      },
      handleData (params) {
        let inner = []
        let tempData = []
        params.forEach((res, idx) => {
          inner.push(res)
          if ((idx + 1) % 6 === 0) {
            tempData.push(inner)
            inner = []
          }
        })
        inner.length && tempData.push(inner)
        return tempData
      },
      drawBar1 (xData, yData) {
        var myChartBar1 = echarts.init(document.getElementById('myChartBar1'))
        let options = []
        let tempDataX = this.handleData(xData.reverse())
        let tempData = this.handleData(yData.reverse())
        let indexList = []
        tempData.forEach((res, index) => {
          indexList.push(index)
          options.push({yAxis: [{
            type: 'category',
            data: res,
            inverse: true,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 12,
                color: '#333'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#333'
              }
            }
          }],
            series: [
              {
                data: tempDataX[index]
              }
            ]
          })
        })
        var option = {
          baseOption: {
            timeline: {
              data: indexList,
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
                  borderColor: '#333'
                },
                emphasis: {
                  color: '#ccc',
                  borderColor: '#333'
                }
                // prevIcon: 'path://M512 0a512.512 512.512 0 0 1 512 512 512.512 512.512 0 0 1-512 512 512.512 512.512 0 0 1-512-512 512.512 512.512 0 0 1 512-512z m144 248.512a36.48 36.48 0 0 0-51.52-0.384L367.488 485.12a35.392 35.392 0 0 0-10.24 26.816 35.84 35.84 0 0 0 10.24 27.008l236.992 236.992c13.952 14.08 37.056 14.016 51.328-0.256a36.544 36.544 0 0 0 0.448-51.52L444.16 512.064l212.032-212.096a36.288 36.288 0 0 0-0.256-51.456z',
                // nextIcon: 'M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m121.6 537.806452l-192 192a48.516129 48.516129 0 0 1-25.806452 12.8 48.516129 48.516129 0 0 1-25.806451-12.8 38.916129 38.916129 0 0 1 0-51.2l166.812903-166.606452-166.4-166.4a38.916129 38.916129 0 0 1 0-51.2 38.916129 38.916129 0 0 1 51.2 0l192 191.793548a29.935484 29.935484 0 0 1 0 51.612904z'
              },
              bottom: -5 * this.$ratio
            },
            // color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(255,255,255,0.8)',
              extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);',
              textStyle: {
                color: '#6a717b'
              },
              formatter: function (s) {
                return '装载率' + s[0].value + '%';
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '15%',
              containLabel: true
            },
            xAxis: [{
              type: 'value',
              axisLabel: {
                margin: 10,
                textStyle: {
                  fontSize: 12,
                  color: '#333'
                }
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#333'
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#ccc'
                }
              }

            }],
            yAxis: { type: 'value', name: 'Mwh' },
            series: [{
              name: '装载率',
              type: 'bar',
              barWidth: 20,
              label: {
                normal: {
                  show: true,
                  position: 'insideRight',
                  formatter: function (param) {
                    return param.value + '%';
                  },
                  textStyle: {
                    color: 'white' // color of value
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                    offset: 0,
                    color: '#e37212' // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: '#fff' // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#e37212' // 100% 处的颜色
                  }], false)
                }
              }
            }]
          },
          options: options
        };
        myChartBar1.setOption(option);
        window.onresize = function () {
          // resizeMyChartContainer();
          myChartBar1.resize();
        }
      }
    }
  }
</script>

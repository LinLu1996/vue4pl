<template>
  <div>
    <div id="myChartBar3" style="width:100%;height: 300px;margin: 0 auto"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    data () {
      return {
        queryData: {}
      }
    },
    activated () {
      // this.init()
    },
    methods: {
      init (data, init) {
        this.queryData = init
        let xData = []
        let yData1 = []
        let yData2 = []
        data.map(res => {
          xData.push({value: res.kpiMonth, province: this.queryData.province})
          yData1.push({value: res.coldChainNum, province: this.queryData.province, kpiMonth: res.kpiMonth})
          yData2.push({value: res.wholeCarNum, province: this.queryData.province, kpiMonth: res.kpiMonth})
        })
        this.drawBar1(xData, yData1, yData2)
      },
      drawBar1 (xData, yData1, yData2) {
        var myChartBar3 = echarts.init(document.getElementById('myChartBar3'))
        // 排行数据
        var option = {
          title: {
            text: '',
            left: '20px',
            textStyle: {
              color: '#436EEE',
              fontSize: 17
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            itemWidth: 15,
            itemHeight: 15,
            x: 'center',
            y: 'bottom',
            data: ['冷链', '非冷链']
          },
          xAxis: {
            data: xData,
            splitLine: {
              show: false
            }
          },
          yAxis: {
            splitLine: {
              show: true
            }
          },
          series: [{
            name: '冷链',
            type: 'bar',
            barWidth: 25,
            stack: '使用情况',
            data: yData1,
            itemStyle: {
              normal: {color: '#4472c4'}
            }
          }, {
            name: '非冷链',
            type: 'bar',
            barWidth: 25,
            stack: '使用情况',
            data: yData2,
            itemStyle: {
              normal: {color: '#ed7d31'}
            },
            label: {
              normal: {
                show: true,
                fontSize: 17,
                position: 'top',
                formatter: function (param) {
                  let idxList = xData.map(res => res.value)
                  return param.data.value + yData1[idxList.indexOf(param.data.kpiMonth)].value;
                },
                textStyle: {
                  color: '#333' // color of value
                }
              }
            }
          }]
        };
        myChartBar3.setOption(option);
        window.onresize = function () {
          // resizeMyChartContainer();
          myChartBar3.resize();
        }
        var _this = this
        myChartBar3.on('click', function (params) {
          if (params.data.province) {
            _this.$emit('changeData', params.data)
          }
        })
      }
    }
  }
</script>

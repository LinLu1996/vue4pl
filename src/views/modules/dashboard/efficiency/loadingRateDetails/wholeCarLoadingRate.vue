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
        data.map(res => {
          xData.push({value: res.kpiMonth, fromProvince: this.queryData.fromProvince})
          yData1.push({value: res.percent, fromProvince: this.queryData.fromProvince, kpiMonth: res.kpiMonth})
          // yData2.push({value: res.wholeCarNum, province: this.queryData.province, kpiMonth: res.kpiMonth})
        })
        this.drawBar1(xData, yData1)
      },
      drawBar1 (xData, yData1) {
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
            trigger: 'axis',
            formatter: function (s) {
              return '装载率' + s[0].value + '%';
            }
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
            name: '装载率',
            type: 'bar',
            barWidth: 25,
            stack: '使用情况',
            data: yData1,
            itemStyle: {
              normal: {color: '#4472c4'}
            },
            label: {
              normal: {
                show: true,
                fontSize: 15,
                position: 'top',
                formatter: function (param) {
                  return param.data.value + '%';
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
          if (params.data.fromProvince) {
            _this.$emit('changeData', params.data)
          }
        })
      }
    }
  }
</script>

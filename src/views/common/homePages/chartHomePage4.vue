<template>
  <el-card shadow="never">
    <div id="chartHomePage4" style="width:100%;height: 500px;margin: 0 auto"></div>
  </el-card>
</template>
<script>
  import echarts from 'echarts'
  export default {
    data () {
      return {
        chartHomePage4: null
      }
    },
    methods: {
      init (value) {
        document.getElementById('chartHomePage4').removeAttribute('_echarts_instance_');
        this.drawHomePage4(value)
      },
      drawHomePage4 (value) {
        this.chartHomePage4 = echarts.init(document.getElementById('chartHomePage4'))
        // let percent = parseFloat(value.invoice / value.invoiceTotalCount).toFixed(2)
        // const rate = isNaN(percent) || !value.invoice ||  !value.invoiceTotalCount ? 0 : percent;
        var option = {
          title: [
            {
              text: '最晚付款核销期限提醒',
              x: 'center',
              textStyle: {
                fontSize: 18
              }
            }
            // {
            //   text: `${value.invoice || 0} 个`,
            //   x: 'center',
            //   y: '8%',
            //   subtext: '',
            //   subtextStyle: {
            //     fontSize: 14
            //   },
            //   textStyle: {
            //     fontSize: 28
            //   }
            // }
          ],
          series: [{
            name: '',
            type: 'liquidFill',
            center: ['50%', '55%'],
            data: [{
              value: 0.5,
              direction: 'right', // 控制移动方向 left | right
              itemStyle: {
                color: 'rgba(0, 191, 255, 1)'
              },
              label: {
                normal: {
                  show: true,
                  formatter: function (param) {
                    return (value.invoice || 0) + '个'
                  },
                  textStyle: {
                    color: '#333' // color of value
                  }
                }
              }
            },
            {
              value: 0.4,
              direction: 'right',
              itemStyle: {
                color: 'rgba(0, 191, 255, 0.6)'
              }
            },
            {
              value: 0.5,
              direction: 'right',
              itemStyle: {
                color: 'rgba(0, 191, 255, 0.8)'
              }
            }
            ],
            itemStyle: {
              opacity: 0.95
              // shadowBlur: 10,
              // shadowColor: 'rgba(0, 191, 255, 0.8)',
            },
            label: {
              fontSize: 50 // 控制中央字体大小
            },
            outline: {
              show: false // 外圈
            },
            radius: 240,
            waveAnimation: 10, // 动画时长
            amplitude: 30 // 振幅
          }, {
            name: '访问来源',
            type: 'pie',
            center: ['50%', '55%'],
            radius: [120, 128],
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            animationDuration: 2500, // 动画时长
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [{
              value: 0.5,
              name: '直接访问',
              itemStyle: {
                color: 'rgba(0, 191, 255, 0.6)'
              }
            }, {
              value: 0.5,
              name: '直接访问',
              itemStyle: {
                color: '#e0e0e0'
              }
            }]
          }]
        }
        this.chartHomePage4.setOption(option, true)
        window.addEventListener('resize', () => {
          this.chartHomePage4.resize()
        })
        var _this = this
        this.chartHomePage4.on('click', function (params) {
          if (params.data) {
            _this.$router.push({
              path: '/doList',
              query: {
                type: 'invoice'
              }
            })
          }
        })
      }
    }
  }
</script>

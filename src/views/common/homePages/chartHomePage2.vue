<template>
  <el-card shadow="never">
    <div id="chartHomePage2" style="width:100%;height: 500px;margin: 0 auto"></div>
  </el-card>
</template>
<script>
  import echarts from 'echarts'
  export default {
    data () {
      return {
        chartHomePage2: null
      }
    },
    methods: {
      init (value) {
        document.getElementById('chartHomePage2').removeAttribute('_echarts_instance_');
        this.drawHomePage2(value)
      },
      drawHomePage2 (value) {
        this.chartHomePage2 = echarts.init(document.getElementById('chartHomePage2'))
        let percent = parseInt((value.totalCount - value.failureNumber) / value.totalCount * 100)
        var scaleData = [{
          'name': '车辆行驶证',
          'value': value.carLicence || 0,
          'type': 'carLicence'
        },
        {
          'name': '车辆道路运输证',
          'value': value.roadTransportLicence || 0,
          'type': 'roadTransportLicence'
        },
        {
          'name': '承运商经营执照',
          'value': value.carrierLicence || 0,
          'type': 'carrierLicence'
        },
        {
          'name': '承运商经营许可证',
          'value': value.roadManagementLicence || 0,
          'type': 'roadManagementLicence'
        },
        {
          'name': '司机驾驶证',
          'value': value.driverLicence || 0,
          'type': 'driverLicence'
        }

        ];
        var placeHolderStyle = {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            color: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 0
          }
        };
        var data = [];
        var color = ['rgb(255, 153, 153)', 'rgb(255, 176, 63)', 'rgb(61, 186, 45)', 'rgb(43, 166, 254)', 'rgb(55, 120, 100)'];
        var colorBorder = ['rgba(255, 153, 153, 0.4)', 'rgba(255, 176, 63, 0.4)', 'rgba(61, 186, 45, 0.4)', 'rgba(43, 166, 254, 0.4)', 'rgba(55, 120, 100, 0.4)'];
        for (var i = 0; i < scaleData.length; i++) {
          data.push({
            data: scaleData[i].value,
            value: 20,
            name: scaleData[i].name,
            type: scaleData[i].type,
            itemStyle: {
              normal: {
                color: color[i],
                borderWidth: 20,
                borderColor: colorBorder[i]
              }
            }
          }, {
            value: 8,
            name: '',
            itemStyle: placeHolderStyle
          });
        }
        data.push({
          value: 40,
          name: '',
          itemStyle: placeHolderStyle
        })
        var seriesObj = [{
          name: '',
          type: 'pie',
          center: ['50%', '55%'],
          clockWise: false,
          radius: [60, 130],
          hoverAnimation: false,
          startAngle: -40,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'inner',
                fontSize: 14,
                lineHeight: 15,
                formatter: function (params) {
                  // var total = 0;
                  // for (var i = 0; i < scaleData.length; i++) {
                  //   total += scaleData[i].value;
                  // }
                  // var percent = ((params.value / total) * 100).toFixed(0);
                  if (params.name !== '') {
                    // return params.name + '\n' + params.data.data;
                    if (params.name.length > 4) {
                      return params.name.slice(0, 3) + '\n' + params.name.slice(3);
                    } else {
                      return params.name;
                    }
                  } else {
                    return '';
                  }
                }
              },
              labelLine: {
                length: 30,
                length2: 20,
                show: true
              }
            }
          },
          data: data
        }, {
          name: '',
          type: 'pie',
          clockWise: false,
          center: ['50%', '55%'],
          radius: [60, 130],
          hoverAnimation: false,
          startAngle: -42.5,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'outside',
                fontSize: 18,
                formatter: function (params) {
                  // var total = 0;
                  // for (var i = 0; i < scaleData.length; i++) {
                  //   total += scaleData[i].value;
                  // }
                  // var percent = ((params.value / total) * 100).toFixed(0);
                  if (params.name !== '') {
                    return params.data.data;
                  } else {
                    return '';
                  }
                }
              },
              labelLine: {
                length: 25,
                length2: 20,
                show: true
              }
            }
          },
          data: data
        }];
        var option = {
          title: [
            {
              text: '各证件累计即将到期及已到期数量',
              x: 'center',
              textStyle: {
                fontSize: 18
              }
            },
            {
              text: `${value.totalCount} 个`,
              x: 'center',
              y: '8%',
              subtext: '',
              subtextStyle: {
                fontSize: 14
              },
              textStyle: {
                fontSize: 28
              }
            }
          ],
          backgroundColor: '#fff',
          tooltip: {
            show: false
          },
          legend: {
            show: false
          },
          toolbox: {
            show: false
          },
          series: seriesObj,
          graphic: [{
            type: 'group',
            left: 'center',
            top: '50%',
            children: [{
              type: 'text',
              z: 100,
              left: 'center',
              top: '10',
              style: {
                fill: '#333',
                text: [
                  '(即将到期 / 总数量)'
                ],
                font: '16px Microsoft YaHei'
              }
            },
            {
              type: 'text',
              z: 100,
              left: 'center',
              top: '40',
              style: {
                fill: 'red',
                text: [
                  `${isNaN(percent) ? 0 + '%' : percent + '%'}`
                ],
                font: '26px Microsoft YaHei'
              }
            }
            ]
          }]
        }
        this.chartHomePage2.setOption(option, true)
        window.addEventListener('resize', () => {
          this.chartHomePage2.resize()
        })
        var _this = this
        this.chartHomePage2.on('click', function (params) {
          if (params.data) {
            _this.$router.push({
              path: '/doList',
              query: {
                type: params.data.type
              }
            })
          }
        })
      }
    }
  }
</script>

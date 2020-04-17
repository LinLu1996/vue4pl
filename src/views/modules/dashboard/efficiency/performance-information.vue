<template>
  <el-form :model="dataForm" ref="dataForm" label-width="50px">
    <div class="bg-wrap">
      <div id="myChart"></div>
    </div>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-button @click="$router.push('/dashboard-efficiency/efficiency')">关闭</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import echarts from 'echarts'
  import 'echarts-gl'
  import TemplateView from '../../perform-management/perform-appraisal/exam-template/template-view';
  // 引入主模块
  require('echarts/lib/chart/bar');
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  export default {
    data () {
      return {
        clickFlag: true,
        initialData: [],
        bar3dData: [],
        rensureMonth: '',
        yearCount: 0,
        type: 0,
        dataForm: {
          id: '',
          rensureMonth: '',
          carrierName: ''
        },
        title: ''
      }
    },
    components: {
      TemplateView
    },
    activated () {
      this.dataForm.id = this.$route.query.id || null
      this.yearCount = this.$route.query.yearCount || null
      this.type = this.$route.query.type || 0
      this.title = this.$route.query.title || ''
      this.dataForm.carrierName = this.$route.query.carrierName
      this.init()
    },
    mounted () {
    },
    methods: {
      init () {
        this.clickFlag = true
        this.visible = true
        this.initialData = []
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/shippingplatform/trefficiencyplatform/efficiencyDetailList`),
              method: 'post',
              data: this.$http.adornData({
                'carrierId': this.dataForm.id ? this.dataForm.id : '',
                'statementYear': this.yearCount ? this.yearCount : undefined,
                'type': this.type
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (this.type === 2) {
                  let tempArr = data.trEfficiencyPlatformEntity.fsFineYearList
                  tempArr.map(res => {
                    let temp = [res.fineMonth, 0, res.totalFineAmount, res.id]
                    this.bar3dData.push(temp)
                  })
                } else if (this.type === 1) {
                  let tempArr = data.trEfficiencyPlatformEntity.statementYearList
                  tempArr.map(res => {
                    let temp = [res.statementMonth, 0, res.totalCarriageAmtFax, res.id]
                    this.bar3dData.push(temp)
                  })
                } else if (this.type === 3) {
                  let tempArr = data.trEfficiencyPlatformEntity.damageYearList
                  tempArr.map(res => {
                    let temp = [res.cargoDamageMonth, 0, res.totalDamageAmount, res.id]
                    this.bar3dData.push(temp)
                  })
                }
                this.drawBar3d(this.bar3dData)
              }
            })
          } else {
            this.isDisabled = false
            // this.dataForm.attachmentUrl = ''
          }
        })
      },
      handleData (params) {
        let inner = []
        let tempData = []
        params.forEach((res, idx) => {
          inner.push(res)
          if ((idx + 1) % 12 === 0) {
            tempData.push(inner)
            inner = []
          }
        })
        inner.length && tempData.push(inner)
        return tempData
      },
      drawBar3d (bar3dData) {
        let myChart = echarts.init(document.getElementById('myChart'));
        let options = []
        let tempData = this.handleData(bar3dData)
        let tempDataX = bar3dData.map(res => res[0])
        tempDataX = this.handleData(tempDataX)
        let indexList = []
        tempData.forEach((res, index) => {
          indexList.push(index)
          options.push({
            xAxis3D: {
              name: '日期',
              type: 'category',
              data: tempDataX[index],
              nameTextStyle: {
                width: 500,
                // fontSize: 20,
                lineHeight: 60,
                padding: [0, 0, 0, 0]
              },
              axisLine: {
                lineStyle: {
                  color: '#fff',
                  width: 1
                }
              },
              axisLabel: {
                interval: 0,
                rotate: 45,
                textStyle: {
                  color: '#fff',
                  fontSize: 18 * this.$ratio
                }
              }
            },
            series: [
              {
                data: res
              }
            ]})
        })
        let option = {
          baseOption: {
            timeline: {
              show: false,
              data: indexList,
              left: '35%',
              right: '35%',
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
              text: ' ',
              x: 'center',
              subtext: this.title,
              subtextStyle: {
                fontWeight: 'normal',
                color: '#fff',
                fontSize: 30 * this.$ratio
              }
            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis3D: {},
            yAxis3D: {
              name: '',
              type: 'category',
              data: [''],
              axisLine: {
                lineStyle: {
                  color: '#fff',
                  width: 1
                }
              }
            },
            zAxis3D: {
              name: '得分',
              type: 'value',
              nameTextStyle: {
                // fontSize: 20,
                padding: [0, 20 * this.$ratio, 0, 0]
              },
              axisLine: {
                lineStyle: {
                  color: '#fff',
                  width: 1
                }
              },
              axisLabel: {
                interval: 0,
                rotate: 45,
                textStyle: {
                  color: '#fff',
                  fontSize: 18 * this.$ratio
                }
              },
              label: {
                show: false
              }
            },
            grid3D: {
              boxWidth: 300,
              boxDepth: 20,
              axisPointer: {
                show: false
              },
              light: {
                main: {
                  intensity: 1.2
                },
                ambient: {
                  intensity: 0.3
                }
              },
              viewControl: {
                alpha: 0,
                beta: 0,
                // autoRotate: true,
                zoomSensitivity: 0,
                autoRotateAfterStill: 15,
                distance: 200
              }
            },
            series: [
              {
                type: 'bar3D',
                name: '1',
                barSize: 15 * this.$ratio,
                itemStyle: {
                  normal: {
                    label: {
                      show: true
                    },
                    color: '#e37212'
                  }
                },
                // data: bar3dData,
                stack: 'stack',
                shading: 'lambert',
                emphasis: {
                  label: {
                    show: true
                  }
                }
              }
            ]
          },
          options: options
        };
        myChart.setOption(option)
        window.addEventListener('resize', function () {
          myChart.resize();
        })
        let _this = this
        myChart.on('click', function (params) {
          _this.$nextTick(() => {
            if (_this.dataForm.id && params.data.length) {
              _this.isDisabled = true
              if (parseInt(_this.type) === 2) {
                _this.$router.push({
                  path: '/dashboard-efficiency/efficiency/fine-detail',
                  query: {
                    id: params.data[3]
                  }
                })
              }
              if (parseInt(_this.type) === 1) {
                _this.$router.push({
                  path: '/dashboard-efficiency/efficiency/freight-detail',
                  query: {
                    id: params.data[3]
                  }
                })
              }
              if (parseInt(_this.type) === 3) {
                _this.$router.push({
                  path: '/dashboard-efficiency/efficiency/damage-detail',
                  query: {
                    id: params.data[3]
                  }
                })
              }
            } else {
              _this.isDisabled = false
            }
          })
        })
      },
      handleRowChange () {
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentrecord/byYearInfo`),
              method: 'post',
              data: this.$http.adornData({
                'carrierId': this.dataForm.id ? this.dataForm.id : '',
                'rensureMonth': this.rensureMonth ? this.rensureMonth : undefined,
                'yearCount': this.yearCount ? this.yearCount : undefined
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                let tempArr = data.tKpiAssessmentRecord.tkpiAssessmentRecordLists
                tempArr.map(res => {
                  let temp = [res.rensureMonth, 0, res.score]
                  this.bar3dData.push(temp)
                })
              }
              this.drawBar3d(this.bar3dData)
            })
          } else {
            this.isDisabled = false
            // this.dataForm.attachmentUrl = ''
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .bg-wrap {
    background-color: #ebebeb;
    background: url("~@/assets/img/main.png") no-repeat;
    background-size: 100% 100%;
  }
  h2{
    text-align: center;
    letter-spacing: 5px;
  }
  #myChart{
    width: 100rem;
    height: 40rem;
    margin: 0 auto;
  }
</style>

<template>
  <el-form :model="dataForm" ref="dataForm" label-width="50px">
    <div style="font-size: 20px;font-weight: bold;margin-bottom: 30px;">
      <span>{{`${dataForm.carrierName}${yearCount}年度绩效评分`}}</span>
    </div>
    <div class="bg-wrap">
      <div id="achievmentChart"></div>
    </div>
    <template-view v-if="templateShow" :isDetail="true" :isProjectKpi="kpiType === 'shipperKpi' ? true : false" :headForm="dataForm" :templateData="templateData"></template-view>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-button @click="$router.go(-1)">关闭</el-button>
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
        visible: false,
        clickFlag: true,
        templateShow: false,
        templateData: [],
        initialData: [],
        bar3dData: [],
        bar3dData2: [],
        rensureMonth: '',
        yearCount: 0,
        // radio: new Date().getFullYear(),
        dataForm: {
          id: '',
          rensureMonth: '',
          carrierName: '',
          transportTypeName: '',
          transportType: ''
        },
        title: '绩效评分',
        kpiType: '',
        transportMethod: ''
      }
    },
    components: {
      TemplateView
    },
    activated () {
      this.dataForm.id = this.$route.query.id || null
      this.yearCount = this.$route.query.yearCount || null
      this.title = this.$route.query.title || '绩效评分'
      this.dataForm.carrierName = this.$route.query.carrierName
      this.dataForm.transportType = this.$route.query.transportType
      this.transportMethod = this.$route.query.transportMethod || ''
      this.kpiType = this.$route.query.type || ''
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
            if (this.kpiType === 'shipperKpi') {
              this.getShipperInfo()
            } else {
              this.$http({
                url: this.$http.adornUrl(`/shippingplatform/trshippingplatform/carrierRecordByYearList`),
                method: 'post',
                data: this.$http.adornData({
                  'carrierId': this.dataForm.id ? this.dataForm.id : '',
                  'rensureYear': this.yearCount ? this.yearCount : undefined,
                  'transportType': this.dataForm.transportType ? this.dataForm.transportType : undefined
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  let tempArr = data.tKpiAssessmentRecordByYear.tkpiAssessmentRecordLists
                  tempArr.map(res => {
                    let temp = [res.rensureMonth, 0, res.score, res.id]
                    this.bar3dData.push(temp)
                  })
                }
                this.drawBar3d(this.bar3dData, null)
              })
            }
          } else {
            this.isDisabled = false
          }
        })
      },
      getShipperInfo () {
        let standardScore
        this.$http({
          url: this.$http.adornUrl(`/performancemanagement/projectrecord/getProjectKpiInfoByYear`),
          method: 'post',
          data: this.$http.adornData({
            'projectKpiId': this.dataForm.id ? this.dataForm.id : '',
            'kpiYear': this.yearCount ? this.yearCount : undefined,
            'transportMethod': this.transportMethod ? this.transportMethod : undefined
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            let tempArr = data.list
            standardScore = tempArr[0].standardScore
            tempArr.map(res => {
              let temp = [res.kpiMonth, 0, res.score, res.id]
              this.bar3dData.push(temp)
            })
          }
          this.handleInitialData(this.bar3dData)
          this.drawBar3d(this.initialData, standardScore)
        })
      },
      handleInitialData (params) {
        let year = new Date().getFullYear()
        let monthArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        this.initialData = monthArr.map(res => {
          let item = [year + res, 0, 0]
          params.forEach(inner => {
            if (item[0] === inner[0]) {
              item = inner
            }
          })
          return item
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
      drawBar3d (bar3dData, standardScore) {
        let achievmentChart = echarts.init(document.getElementById('achievmentChart'));
        let options = []
        let tempData = this.handleData(bar3dData)
        let tempDataX = bar3dData.map(res => res[0])
        tempDataX = this.handleData(tempDataX)
        let indexList = []
        let standardLine = {}
        if (standardScore === -1) {
          standardLine = {
            type: 'line3D',
            name: '标准分',
            lineStyle: {
              color: '#5caafc'
            }
          }
        } else {
          standardLine = {
            type: 'line3D',
            name: '标准分',
            lineStyle: {
              color: '#5caafc'
            },
            data: [[' ', 0, standardScore], ['  ', 0, standardScore]]
          }
        }
        tempData.forEach((res, index) => {
          indexList.push(index)
          options.push({
            xAxis3D: {
              name: '日期',
              type: 'category',
              data: [' '].concat(tempDataX[index]).concat(['  ']),
              nameTextStyle: {
                width: 500,
                // fontSize: 20,
                lineHeight: 60 * this.$ratio,
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
                name: '1',
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
              bottom: '-5'
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
            legend: {
              show: !!standardScore,
              left: 'left',
              top: '10%',
              data: [{name: '标准分'}],
              textStyle: {
                color: '#5caafc',
                fontSize: 22 * this.$ratio
              },
              formatter: function (name) {
                return name + (standardScore || 0) + '分'
              }
            },
            xAxis3D: {},
            yAxis3D: {
              name: '',
              type: 'category',
              data: [''],
              axisLine: {
                lineStyle: {
                  color: '#333',
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
              boxWidth: 320,
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
                barSize: 10 * this.$ratio,
                itemStyle: {
                  normal: {
                    label: {
                      show: true
                    },
                    color: '#e37212',
                    opacity: 0.9
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
              },
              standardLine
            ]
          },
          options: options
        };
        achievmentChart.setOption(option)
        window.addEventListener('resize', function () {
          achievmentChart.resize();
        })
        let _this = this
        achievmentChart.on('click', function (params) {
          _this.templateShow = false
          _this.$nextTick(() => {
            if (_this.dataForm.id && params.data.length) {
              _this.isDisabled = true
              if (_this.kpiType === 'shipperKpi') {
                _this.handleShipperDetail(params)
              } else {
                _this.$http({
                  url: _this.$http.adornUrl(`/performancemanagement/tkpiassessmentrecord/byMonthInfoOne`),
                  method: 'post',
                  data: _this.$http.adornData({
                    'id': params.data[3],
                    'rensureMon': params.data[0]
                  })
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    _this.templateShow = true
                    _this.visible = false
                    _this.dataForm.carrierName = data.tKpiAssessmentRecord.carrierName
                    _this.dataForm.rensureMonth = data.tKpiAssessmentRecord.rensureMonth
                    _this.templateData = data.tKpiAssessmentRecord.kpiTemplateRelationEntityList || []
                  }
                })
              }
            } else {
              _this.isDisabled = false
              // this.dataForm.attachmentUrl = ''
            }
          })
        })
      },
      handleShipperDetail (params) {
        this.$http({
          url: this.$http.adornUrl(`/performancemanagement/projectrecord/info/${params.data[3]}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.carrierName = data.tKpiAssessmentRecord.templateName
            this.dataForm.transportTypeName = data.tKpiAssessmentRecord.transportTypeName
            this.dataForm.score = data.tKpiAssessmentRecord.score
            this.dataForm.rensureMonth = data.tKpiAssessmentRecord.rensureMonth
            this.templateData = data.tKpiAssessmentRecord.kpiTemplateRelationEntityList
            this.templateShow = true
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
  #achievmentChart{
    width: 100rem;
    height: 40rem;
    margin: 0 auto;
  }
</style>

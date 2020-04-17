<template>
  <el-form :model="dataForm" ref="dataForm" label-width="50px">
    <el-row style="margin-top: 10px;">
      <el-col :span="7">
        <el-form-item label="时间">
          <el-radio-group v-model="yearCount" @change="handleRowChange">
            <el-radio :label="0">当年</el-radio>
            <el-radio :label="2">三年</el-radio>
            <el-radio :label="4">五年</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col  :span="8" v-if="yearCount === 0">
        <el-form-item label="选择年" label-width="60px">
          <el-date-picker
            v-model="rensureMonth"
            type="year"
            @blur="handleRowChange"
            value-format="yyyy"
            placeholder="选择年"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <div>
      <div id="myChart"></div>
    </div>
    <template-view v-if="templateShow" :templateData="templateData"></template-view>
    <product-drawer v-if="drawerVisible" ref="productDrawer"></product-drawer>
  </el-form>
</template>

<script>
  import ProductDrawer from '../product/product-drawer'
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
        drawerVisible: false,
        clickFlag: true,
        templateShow: false,
        templateData: [],
        initialData: [],
        bar3dData: [],
        myChart: null,
        rensureMonth: new Date(),
        yearCount: 0,
        // radio: new Date().getFullYear(),
        dataForm: {
          id: ''
        }
      }
    },
    components: {
      TemplateView,
      ProductDrawer
    },
    created () {
      this.dataForm.id = this.$route.query.id || null
      this.init()
      // this.handleRowChange()
    },
    mounted () {
    },
    watch: {
      // 'rensureMonth' (newVal) {
      //   if (newVal && parseInt(newVal) === new Date().getFullYear()) {
      //     this.yearCount = 0
      //   } else if (newVal) {
      //     this.yearCount = ''
      //   }
      // },
      yearCount (newVal) {
        if (newVal !== 0) {
          this.rensureMonth = ''
        } else {
          this.rensureMonth = new Date().getFullYear().toString()
        }
      }
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
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentrecord/editCarrierInfo/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                // this.templateData = data.tKpiAssessmentRecord.kpiTemplateRelationEntityList
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
            this.dataForm.attachmentUrl = ''
          }
        })
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
      drawBar3d (bar3dData) {
        document.getElementById('myChart').removeAttribute('_echarts_instance_');
        this.myChart = echarts.init(document.getElementById('myChart'));
        let options = []
        let tempData = this.handleData(bar3dData)
        let tempDataX = bar3dData.map(res => res[0])
        tempDataX = this.handleData(tempDataX)
        let indexList = []
        tempData.forEach((res, index) => {
          indexList.push(index)
          options.push({
            xAxis3D: {
              name: '月份',
              type: 'category',
              data: tempDataX[index],
              axisLine: {
                lineStyle: {
                  color: '#333',
                  width: 1
                }
              },
              axisLabel: {
                interval: 0,
                rotate: 45,
                textStyle: {
                  color: '#333',
                  fontSize: 12
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
              data: indexList,
              label: {
                formatter: function (s) { return '第' + (s + 1) + '页'; }
              },
              autoPlay: false,
              controlStyle: {
                showPlayBtn: false
              },
              playInterval: 1000,
              tooltip: {formatter: function (s) { return '第' + (s.value + 1) + '页'; }}
            },
            backgroundColor: '#fff',
            // color: ["#37b70c", "#fae521", "#f29c00", "#dd3f36", "#b3013f", "#a00398"],
            title: {
              text: ' ',
              x: 'center',
              subtext: '绩效评分',
              subtextStyle: {
                fontWeight: 'normal',
                color: '#000',
                fontSize: 30
              }
            },
            tooltip: {
              show: false,
              backgroundColor: 'rgba(0,0,0,0.9)'
            },
            xAxis3D: {
            },
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
              axisLine: {
                lineStyle: {
                  color: '#333',
                  width: 1
                }
              },
              label: {
                show: false
              }
            },
            grid3D: {
              boxWidth: 200,
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
                roam: true,
                zoomSensitivity: 0,
                autoRotateAfterStill: 15
                // distance: 250
              }
            },
            series: [{
              type: 'bar3D',
              name: '1',
              barSize: 15,
              itemStyle: {
                normal: {
                  label: {
                    show: true
                  },
                  color: function (params) {
                    // var colorList = [
                    //   '#0066ba'
                    // ];
                    return '#0066ba'
                  }
                }
              },
              stack: 'stack',
              shading: 'lambert',
              emphasis: {
                label: {
                  show: true
                }
              }
            }]
          },
          options: options
        };
        this.myChart.setOption(option, true)
        // window.addEventListener('resize', function () {
        //   this.myChart.resize();
        // })
        let _this = this
        _this.myChart.on('click', function (params) {
          _this.templateShow = false
          _this.$nextTick(() => {
            if (_this.dataForm.id && params.data.length) {
              _this.isDisabled = true
              _this.$http({
                url: _this.$http.adornUrl(`/performancemanagement/tkpiassessmentrecord/byMonthInfo`),
                method: 'post',
                data: _this.$http.adornData({
                  'carrierId': _this.dataForm.id ? _this.dataForm.id : '',
                  'rensureMon': params.data[0]
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  _this.templateShow = true
                  _this.templateData = data.tKpiAssessmentRecord.kpiTemplateRelationEntityList
                }
              })
            } else {
              _this.isDisabled = false
              // this.dataForm.attachmentUrl = ''
            }
          })
        })
      },
      handleRowChange () {
        this.bar3dData = []
        this.templateShow = false
        // this.myChart.resize();
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentrecord/byYearInfo`),
              method: 'post',
              data: this.$http.adornData({
                'carrierId': this.dataForm.id ? this.dataForm.id : '',
                'rensureMonth': this.rensureMonth ? this.rensureMonth : undefined,
                'yearCount': this.yearCount ? this.yearCount : 0
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
      },
      getDrawerInfo (id) {
        this.drawerVisible = true
        this.$nextTick(() => {
          this.$refs.productDrawer.init(id)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
    h2{
      text-align: center;
      letter-spacing: 5px;
    }
    #myChart{
      width: 70%;
      height: 500px;
      margin: 0 auto;
      border: 1px solid #ccc;
    }
</style>

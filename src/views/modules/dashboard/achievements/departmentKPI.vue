<template>
  <div>
    <div>
      <div>
        <!--<div class="date-wrap">-->
          <!--<el-date-picker-->
            <!--v-model="dataForm.rensureMonth"-->
            <!--style="width: 50%;"-->
            <!--type="month"-->
            <!--:clearable="false"-->
            <!--size="mini"-->
            <!--:pickerOptions="pickerOptions"-->
            <!--@change="handleMonth"-->
            <!--placeholder="选择月">-->
          <!--</el-date-picker>-->
        <!--</div>-->
        <div class="bg-wrap">
          <p style="padding: 0.625rem;margin:0;font-size: 1.5rem;text-align: center;color: #ffffff">部门KPI统计</p>
          <div id="chartDepartment" style="width:100%;height: 24rem;margin: 0 auto"></div>
        </div>
        <div class="depart_center">
          <div v-for="row in dataList" class="color_item">
            <span :style="`display: inline-block;width: 1.5rem;height: 0.3125rem;background-color: ${row.color};vertical-align: middle;position: relative;`">
              <span :style="`display: inline-block; width: 0.625rem; height: 0.625rem;border-radius: 50%;position: absolute;left:30%;top: -50%;background-color: ${row.color}`"></span>
            </span>
            <span style="color: #ffffff;font-size: 0.8rem">{{row.name}}</span>
          </div>
        </div>
        <div class="date-wrap">
          <xkl-date-picker style="width: 30%" type="month" size="mini" :pickerOptions="pickerOptions" placeholder="请选择" v-model="dataForm.kpiMonth" @change="handleMonth" clearable></xkl-date-picker>
        </div>
        <div class="depart_footer">
          <el-row style="line-height: 3rem;text-align: center;font-size: 1rem;font-weight: bold;color: #ffffff">
            <el-col :span="24">
              <el-col :span="5" :offset="14">
                同比
              </el-col>
              <el-col :span="5">
                环比
              </el-col>
          </el-col>
          </el-row>
          <el-row style="line-height: 2.5rem;text-align: center;font-size: 1rem;color: #ffffff">
            <el-col :span="24" v-for="(item, index) in headData" :key="index">
              <el-col :span="8" :offset="1" class="name">{{item.name}}</el-col>
              <el-col :span="5">
                <span style="color: #FF9800">{{item.ratio || 0}}%</span>
              </el-col>
              <el-col :span="5">
              <span :style="{color: item.yearColor}">
                {{(item.year ? item.year.toString().replace('-', '') : 0) + `%${!parseFloat(item.year) ? '' : (parseFloat(item.year) < 0 ? '↓' : '↑')}`}}
              </span>
              </el-col>
              <el-col :span="5">
              <span :style="{color: item.monthColor}">
                {{(item.month ? item.month.toString().replace('-', '') : 0) + `%${!parseFloat(item.month) ? '' : (parseFloat(item.month) < 0 ? '↓' : '↑')}`}}
              </span>
            </el-col>
          </el-col>
        </el-row>
        </div>
      </div>
    </div>
    <!--<div class="center-footer">-->
      <!--<el-table-->
        <!--:data="dataList"-->
        <!--ref="tableList"-->
        <!--style="width: 100%;">-->
        <!--<el-table-column-->
          <!--prop="name"-->
          <!--header-align="center"-->
          <!--align="left"-->
          <!--width="150"-->
          <!--fixed="left"-->
          <!--show-overflow-tooltip>-->
          <!--<template slot-scope="{row}">-->
            <!--<span :style="`display: inline-block;width: 24px;height: 5px;background-color: ${row.color};vertical-align: middle;position: relative;`">-->
              <!--<span :style="`display: inline-block; width: 10px; height: 10px;border-radius: 50%;position: absolute;left:30%;top: -50%;background-color: ${row.color}`"></span>-->
            <!--</span>-->
            <!--&nbsp;{{row.name}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-for="(item,index) in tableColumData"-->
          <!--:key="index"-->
          <!--:prop="item"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--:label="item"-->
          <!--width="100"-->
          <!--show-overflow-tooltip>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
    <!--</div>-->
  </div>
</template>
<script>
  import { formatDate } from '../../../../utils';
  import echarts from 'echarts'

  export default {
    data () {
      return {
        dataForm: {
          kpiMonth: new Date(new Date().setDate(1)).setMonth(new Date().getMonth() - 1)
        },
        chartDepartment: null,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        tableColumData: [],
        dataList: [],
        headData: [],
        ifNullData: [{name: '签收信息及时率'}, {name: '破损率(订单行)'}, {name: '破损率(细盒)'}, {name: '到货准时率'}, {name: '回单返回及时率'}, {name: '回单上传及时率'}, {name: '提退货返回及时率'}, {name: '拒收上报及时率'}],
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
        document.getElementById('chartDepartment').removeAttribute('_echarts_instance_');
        this.getDataList()
      },
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/shippingplatform/trshippingplatform/getDepartmentKPIInfo'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'kpiMonth': this.dataForm.kpiMonth ? formatDate(this.dataForm.kpiMonth, 'Month').replace('-', '') : formatDate(new Date().getTime(), 'Month').replace('-', '')
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.headData = data.kpiDepart && this.changeHeadDataObj(data.kpiDepart)
            this.tableColumData = data.existenceMonth
            this.dataList = data.targetListByYear || this.ifNullData
            this.dataList = this.dataList.map(res => {
              switch (res.name) {
                case '签收信息及时率':
                  res.color = 'red'
                  break
                case '破损率(订单行)':
                  res.color = 'orange'
                  break
                case '破损率(细盒)':
                  res.color = '#fddc17'
                  break
                case '到货准时率':
                  res.color = 'green'
                  break
                case '回单返回及时率':
                  res.color = 'cyan'
                  break
                case '回单上传及时率':
                  res.color = '#5757ff'
                  break
                case '提退货返回及时率':
                  res.color = 'purple'
                  break
                case '拒收上报及时率':
                  res.color = '#38ff00'
                  break
              }
              return res
            })
            this.drawDepartment()
            // this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      changeHeadDataObj (obj) {
        let tempArr = ['reachPunctual', 'receiptReturn', 'withdrawalReturn', 'damageRateBook', 'damageRateDetail', 'signRate', 'receiptUploadRate', 'rejectionReportRate']
        let finalArr = []
        let preName = ''
        tempArr.map(res => {
          return Object.keys(obj).filter(item => item.includes(res))
        }).map(res => {
          if (res[0].includes('reachPunctual')) preName = '到货准时率'
          if (res[0].includes('receiptReturn')) preName = '回单返回及时率'
          if (res[0].includes('withdrawalReturn')) preName = '提退货返回及时率'
          if (res[0].includes('damageRateBook')) preName = '破损率(订单行)'
          if (res[0].includes('damageRateDetail')) preName = ' 破损率(细盒)'
          if (res[0].includes('signRate')) preName = ' 签收信息及时率'
          if (res[0].includes('receiptUploadRate')) preName = '回单上传及时率'
          if (res[0].includes('rejectionReportRate')) preName = '拒收上报及时率'
          res.unshift(preName)
          let pushObj = {
            name: res[0],
            ratio: obj[res[1]],
            year: obj[res[2]],
            month: obj[res[3]],
            yearColor: !parseFloat(obj[res[2]]) ? '#ccc' : (parseFloat(obj[res[2]]) < 0 ? '#8BC34A' : '#E51C23'),
            monthColor: !parseFloat(obj[res[3]]) ? '#ccc' : (parseFloat(obj[res[3]]) < 0 ? '#8BC34A' : '#E51C23')
          }
          finalArr.push(pushObj)
        })
        return finalArr
      },
      drawDepartment (todo, done) {
        this.chartDepartment = echarts.init(document.getElementById('chartDepartment'))
        let tempX = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        tempX = tempX.map(res => {
          return res + '-' + new Date(this.dataForm.kpiMonth).getFullYear().toString().slice(2, 4)
        })
        let currentMonth = new Date(this.dataForm.kpiMonth).getFullYear().toString() === new Date().getFullYear().toString() ? new Date().getMonth() + 1 : 12
        let Xvalue = tempX.slice(0, currentMonth)
        let Yvalue = []
        Yvalue = this.dataList.map(res => {
          let tempArr = []
          Xvalue.map(item => {
            tempArr.push(parseFloat(res[item.toLowerCase().split('-')[0]]))
          })
          return tempArr
        })
        var option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '5%',
            right: '10%',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: Xvalue,
            axisLine: {
              lineStyle: {
                color: '#ffffff'
              }
            }
          },
          yAxis: {
            show: false,
            type: 'value'
          },
          dataZoom: [
            {
              type: 'slider',
              realtime: true, // 拖动滚动条时是否动态的更新图表数据
              height: 20 * this.$ratio, // 滚动条高度
              start: 0, // 滚动条开始位置（共100等份）
              end: 100 // 结束位置（共100等份）
            }
          ],
          series: [
            {
              name: '签收信息及时率',
              type: 'line',
              // stack: '总量',
              data: Yvalue[0],
              itemStyle: {normal: {label: {show: true}, color: 'red'}},
              lineStyle: {
                color: 'red'
              }
            },
            {
              name: '破损率(订单)',
              type: 'line',
              // stack: '总量',
              data: Yvalue[1],
              itemStyle: {normal: {label: {show: true}, color: 'orange'}},
              lineStyle: {
                color: 'orange'
              }
            },
            {
              name: '破损率(细单)',
              type: 'line',
              // stack: '总量',
              data: Yvalue[2],
              itemStyle: {normal: {label: {show: true}, color: '#fddc17'}},
              lineStyle: {
                color: '#fddc17'
              }
            },
            {
              name: '到货准时率',
              type: 'line',
              // stack: '总量',
              data: Yvalue[3],
              itemStyle: {normal: {label: {show: true}, color: 'green'}},
              lineStyle: {
                color: 'green'
              }
            },
            {
              name: '回单返回及时率',
              type: 'line',
              // stack: '总量',
              data: Yvalue[4],
              itemStyle: {normal: {label: {show: true}, color: 'cyan'}},
              lineStyle: {
                color: 'cyan'
              }
            },
            {
              name: '回单上传及时率',
              type: 'line',
              // stack: '总量',
              data: Yvalue[5],
              itemStyle: {normal: {label: {show: true}, color: '#5757ff'}},
              lineStyle: {
                color: '#5757ff'
              }
            },
            {
              name: '提退货返回及时率',
              type: 'line',
              // stack: '总量',
              data: Yvalue[6],
              itemStyle: {normal: {label: {show: true}, color: 'purple'}},
              lineStyle: {
                color: 'purple'
              }
            },
            {
              name: '拒收上报及时率',
              type: 'line',
              // stack: '总量',
              data: Yvalue[7],
              itemStyle: {normal: {label: {show: true}, color: '#38ff00'}},
              lineStyle: {
                color: '#38ff00'
              }
            }
          ]
        };
        this.chartDepartment.setOption(option)
        window.addEventListener('resize', () => {
          this.chartDepartment.resize()
        })
        // var _this = this
        this.chartDepartment.on('click', function (params) {
        })
      },
      handleMonth (val) {
        this.init()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .date-wrap {
    height: 2.5rem;
    line-height: 2.5rem;
    margin: 0.625rem;
    background-color: #ebebeb;
    background: url("~@/assets/img/depart_date.png") no-repeat;
    background-size: 100% 100%;
    /*padding-left: 5%;*/
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
  .depart_center {
    height: 8.5rem;
    margin: 0.625rem;
    padding-top: 0.625rem;
    padding-left: 1.25rem;
    background-color: #ebebeb;
    background: url("~@/assets/img/depart_center.png") no-repeat;
    background-size: 100% 100%;
    .color_item{
      display: inline-block;
      width: 9rem;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      margin: 0.25rem 1.875rem;
    }
  }
  .depart_footer {
    height: 23rem;
    margin: 0.625rem;
    background-color: #ebebeb;
    background: url("~@/assets/img/depart_footer.png") no-repeat;
    background-size: 100% 100%;
  }
  .name{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    text-align: left;
  }
  /deep/.center-footer .el-table__body tr:hover>td{
    background-color: #ffffff!important;
  }
  /deep/.center-footer .el-table__body{
    border: 0;
    th,
    tr,
    td{
      border: 0;
      background-color: #fff;
    }
  }
</style>

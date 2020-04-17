<template>
  <div>
    <p style="padding: 10px;margin:0;font-size: 20px">部门KPI统计</p>
    <div>
      <el-row style="line-height: 30px;font-weight: bold;text-align: center">
        <el-col :span="12">
          <el-col :span="14" class="name">
            <xkl-date-picker type="month" size="mini" placeholder="请选择" v-model="dataForm.kpiMonth" @change="handleMonth" clearable></xkl-date-picker>
          </el-col>
          <el-col :span="5">
            同比
          </el-col>
          <el-col :span="5">
            环比
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="5" :offset="14">
            同比
          </el-col>
          <el-col :span="5">
            环比
          </el-col>
        </el-col>
      </el-row>
      <el-row style="line-height: 30px;text-align: center">
        <el-col :span="12" v-for="(item, index) in headData" :key="index">
          <el-col :span="9" class="name">{{item.name}}</el-col>
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
    <div id="chartDepartment" style="width:100%;height: 300px;margin: 0 auto"></div>
    <div class="center-footer">
      <el-table
        :data="dataList"
        ref="tableList"
        style="width: 100%;">
        <el-table-column
          prop="name"
          header-align="center"
          align="left"
          width="150"
          fixed="left"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            <span :style="`display: inline-block;width: 24px;height: 5px;background-color: ${row.color};vertical-align: middle;position: relative;`">
              <span :style="`display: inline-block; width: 10px; height: 10px;border-radius: 50%;position: absolute;left:30%;top: -50%;background-color: ${row.color}`"></span>
            </span>
            &nbsp;{{row.name}}
          </template>
        </el-table-column>
        <el-table-column
          prop="jan"
          header-align="center"
          align="center"
          label="Jan"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="feb"
          width="100"
          header-align="center"
          align="center"
          label="Feb">
        </el-table-column>
        <el-table-column
          prop="mar"
          header-align="center"
          align="center"
          label="Mar"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="apr"
          header-align="center"
          align="center"
          label="Apr"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="may"
          header-align="center"
          align="center"
          label="May"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="jun"
          header-align="center"
          align="center"
          label="Jun"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="jul"
          header-align="center"
          align="center"
          label="Jul"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="aug"
          header-align="center"
          align="center"
          label="Aug"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="sep"
          header-align="center"
          align="center"
          label="Sep"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="oct"
          header-align="center"
          align="center"
          label="Oct"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="nov"
          header-align="center"
          align="center"
          label="Nov"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="dec"
          header-align="center"
          align="center"
          label="Dec"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
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
        dataList: [],
        headData: []
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
            this.dataList = data.targetListByYear
            this.dataList = this.dataList.map(res => {
              switch (res.name) {
                case '签收信息及时率':
                  res.color = 'red'
                  break
                case '破损率(订单)':
                  res.color = 'orange'
                  break
                case '破损率(细单)':
                  res.color = 'yellow'
                  break
                case '到货准时率':
                  res.color = 'green'
                  break
                case '回单返回及时率':
                  res.color = 'cyan'
                  break
                case '回单上传及时率':
                  res.color = 'blue'
                  break
                case '提退货返回及时率':
                  res.color = 'purple'
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
        let tempArr = ['reachPunctual', 'receiptReturn', 'withdrawalReturn', 'damageRateBook', 'damageRateDetail', 'signRate', 'receiptUploadRate']
        let finalArr = []
        let preName = ''
        tempArr.map(res => {
          return Object.keys(obj).filter(item => item.includes(res))
        }).map(res => {
          if (res[0].includes('reachPunctual')) preName = '到货准时率'
          if (res[0].includes('receiptReturn')) preName = '回单返回及时率'
          if (res[0].includes('withdrawalReturn')) preName = '提退货返回及时率'
          if (res[0].includes('damageRateBook')) preName = '破损率(订单)'
          if (res[0].includes('damageRateDetail')) preName = ' 破损率(细单)'
          if (res[0].includes('signRate')) preName = ' 签收信息及时率'
          if (res[0].includes('receiptUploadRate')) preName = '回单上传及时率'
          res.unshift(preName)
          let pushObj = {
            name: res[0],
            ratio: obj[res[1]],
            year: obj[res[2]],
            month: obj[res[3]],
            yearColor: !parseFloat(obj[res[2]]) ? '#333' : (parseFloat(obj[res[2]]) < 0 ? '#8BC34A' : '#E51C23'),
            monthColor: !parseFloat(obj[res[3]]) ? '#333' : (parseFloat(obj[res[3]]) < 0 ? '#8BC34A' : '#E51C23')
          }
          finalArr.push(pushObj)
        })
        return finalArr
      },
      drawDepartment (todo, done) {
        this.chartDepartment = echarts.init(document.getElementById('chartDepartment'))
        let tempX = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        tempX = tempX.map(res => {
          return res + '-' + new Date().getFullYear().toString().slice(2, 4)
        })
        let currentMonth = new Date().getMonth() + 1
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
            left: '0',
            right: '10%',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: Xvalue
          },
          yAxis: {
            show: false,
            type: 'value'
          },
          dataZoom: [
            {
              type: 'slider',
              realtime: true, // 拖动滚动条时是否动态的更新图表数据
              height: 20, // 滚动条高度
              start: 0, // 滚动条开始位置（共100等份）
              end: 50 // 结束位置（共100等份）
            }
          ],
          series: [
            {
              name: '签收信息及时率',
              type: 'line',
              stack: '总量',
              data: Yvalue[0],
              itemStyle: {normal: {label: {show: true}, color: 'red'}},
              lineStyle: {
                color: 'red'
              }
            },
            {
              name: '破损率(订单)',
              type: 'line',
              stack: '总量',
              data: Yvalue[1],
              itemStyle: {normal: {label: {show: true}, color: 'orange'}},
              lineStyle: {
                color: 'orange'
              }
            },
            {
              name: '破损率(细单)',
              type: 'line',
              stack: '总量',
              data: Yvalue[2],
              itemStyle: {normal: {label: {show: true}, color: 'yellow'}},
              lineStyle: {
                color: 'yellow'
              }
            },
            {
              name: '到货准时率',
              type: 'line',
              stack: '总量',
              data: Yvalue[3],
              itemStyle: {normal: {label: {show: true}, color: 'green'}},
              lineStyle: {
                color: 'green'
              }
            },
            {
              name: '回单返回及时率',
              type: 'line',
              stack: '总量',
              data: Yvalue[4],
              itemStyle: {normal: {label: {show: true}, color: 'cyan'}},
              lineStyle: {
                color: 'cyan'
              }
            },
            {
              name: '回单上传及时率',
              type: 'line',
              stack: '总量',
              data: Yvalue[5],
              itemStyle: {normal: {label: {show: true}, color: 'blue'}},
              lineStyle: {
                color: 'blue'
              }
            },
            {
              name: '提退货返回及时率',
              type: 'line',
              stack: '总量',
              data: Yvalue[6],
              itemStyle: {normal: {label: {show: true}, color: 'purple'}},
              lineStyle: {
                color: 'purple'
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

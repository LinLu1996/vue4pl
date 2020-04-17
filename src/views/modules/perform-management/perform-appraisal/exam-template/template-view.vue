<template>
  <div>
    <el-row v-if="headForm && headForm.pageTypeOfDetail">
      <el-col style="text-align: right">
        <el-button type="success" size="mini" icon="el-icon-printer" @click="printHere()">打印</el-button>
      </el-col>
    </el-row>
    <section ref="printer">
      <div class="table-wrap">
        <div v-if="printHeaderShow">
          <div style="display: inline-block">
            <img style="width: 80px; vertical-align: middle;" src="~@/assets/img/logo_for_print.png">
          </div>
          <div style="display: inline-block">
            <p style="margin: 0">国药集团医药物流有限公司</p>
            <p style="margin: 0"> Sinopharm Logistics Co., Ltd.</p>
          </div>
        </div>
        <h2 v-if="!isProjectKpi">承运商考核表{{headForm ? (headForm.transportTypeName ? `(${headForm.transportTypeName})` : '') : ''}}</h2>
        <h2 v-else>项目考核表{{headForm ? (headForm.transportTypeName ? `(${headForm.transportTypeName})` : '') : ''}}</h2>
        <p style="height: 20px">
          <span v-if="!isProjectKpi">{{headForm && headForm.carrierName ? '承运商名称：'+ headForm.carrierName : ''}}</span>
          <span v-if="printHeaderShow && isProjectKpi">{{headForm ? '运输项目：'+ headForm.projectKpiName : ''}}</span>
          <span style="float: right;margin-right: 20px">{{headForm ? $formatDate(headForm.rensureMonth, 'Month') : ''}}</span>
          <span v-if="printHeaderShow" style="margin-left: 20px">{{headForm ? '运输方式：' + headForm.transportTypeName : ''}}</span>
        </p>
        <el-popover
          v-if="!printHeaderShow"
          placement="right"
          width="200"
          trigger="click">
          <el-checkbox-group v-model="checkedCol" @change="handleCheckedColChange">
            <el-checkbox v-for="(col, index) in cols" :label="col" :key="index">{{col}}</el-checkbox>
          </el-checkbox-group>
          <span class="hideCol" v-if="!printHeaderShow" slot="reference">
            选择隐藏列
          </span>
        </el-popover>
        <el-table
          :data="tableData"
          show-summary
          :summary-method="getSummaries"
          :span-method="objectSpanMethod"
          @row-dblclick="rowChange"
          v-if="tableDataShow"
          :style="printWidth"
          align="center">
          <el-table-column
            v-if="checkedCol.indexOf('分类') === -1"
            prop="assessmentClassificationName"
            align="center"
            label="分类"
            min-width="80">
          </el-table-column>
          <el-table-column
            v-if="checkedCol.indexOf('考核项目') === -1"
            prop="assessmentProjectName"
            align="center"
            label="考核项目"
            min-width="80">
          </el-table-column>
          <el-table-column
            align="center"
            label="考核标准">
            <el-table-column
              prop="assessmentStandardName"
              header-align="center"
              label="项目说明"
              min-width="200">
            </el-table-column>
            <el-table-column
              prop="happenedNumber"
              align="center"
              label="发生次数"
              min-width="60">
              <template slot-scope="{ row }">
            <span v-if="!row.seen">
              {{ row.happenedNumber || 0 }}
            </span>
                <el-form v-else ref="modelHappenedNumber" :model="row" :rules="rules">
                  <el-form-item prop="happenedNumber" style="margin-bottom: 0;">
                    <el-input
                      v-model.number="row.happenedNumber"
                      size="mini"
                      @blur="getScore(row)"
                      maxLength="5">
                    </el-input>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalNumber"
              align="center"
              label="汇总"
              min-width="80">
              <template slot-scope="{ row }">
            <span v-if="!row.seen">
              {{ row.totalNumber || 0}}
            </span>
                <el-form v-else ref="modelTotalNumber" :model="row" :rules="rules">
                  <el-form-item prop="totalNumber" style="margin-bottom: 0;">
                    <el-input
                      v-model.number="row.totalNumber"
                      @blur="getScore(row)"
                      size="mini"
                      maxLength="5">
                    </el-input>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="percentStandard"
              align="center"
              label="百分比标准"
              min-width="80">
              <template slot-scope="{ row }">
                {{row.percentStandard + '%'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="actualPercent"
              align="center"
              label="实际百分比"
              min-width="100">
              <template slot-scope="{ row }">
                {{ row.actualPercent }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="weightScoreCount"
            align="center"
            label="权重分"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="scorceCount"
            align="center"
            label="得分"
            min-width="80"
            show-overflow-tooltip>
            <template slot-scope="{ row }">
              {{ row.scorceCount || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="assessmentRemark"
            align="center"
            label="备注"
            min-width="100">
            <template slot-scope="{ row }">
            <span v-if="!row.seen">
              {{ row.assessmentRemark }}
            </span>
              <el-input
                v-else
                v-model="row.assessmentRemark"
                size="mini"
                maxLength="30"
                clearable
                @keyup.enter.native="row.seen = false">
              </el-input>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 10px">
          注：有效的投诉包含货主投诉、国药物流投诉、客户投诉、承运商提货未听从甲方现场指挥，未排队装车，未按标准码放，未分清批号和件数、未按要求送货（怕热、怕冻等特殊要求）、使用违规车辆送货，药品受潮，温度异常，车辆事故等以上各类情况所造成的投诉，并且出现一笔服务质量减7分，以此类推，出现三笔服务质量得0分。
        </div>
        <div style="height: 40px;line-height: 40px" v-if="printHeaderShow">
          <div style="float: right">
            <span style="display: inline-block; width: 200px">制表：</span>
            <span style="display: inline-block; width: 200px">考评：</span>
            <span style="display: inline-block; width: 200px">审核：</span>
          </div>
        </div>
        <el-form style="margin-top: 20px; text-align: right" v-if="$route.name === 'template-view'">
          <el-form-item label-width="50px">
            <el-button @click="$router.go(-1)">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>
<script>
  export default {
    props: {
      templateData: {
        type: Array
      },
      headForm: {
        type: Object
      },
      isDetail: {
        type: Boolean,
        default: false
      },
      isProjectKpi: {
        type: Boolean,
        default: false
      }
    },
    components: {
    },
    data () {
      let verifyPositiveNumber = (rule, value, callback) => {
        if (isNaN(value) || value < 0 || !Number.isInteger(value)) {
          callback(new Error('请输入大于等于0的整数'))
        }
        callback()
      }
      return {
        tableData: [],
        dataForm: {
          happenedNumber: 0,
          totalNumber: 0,
          templateRelationId: 0
        },
        cols: ['分类', '考核项目'],
        checkedCol: [],
        printWidth: 'width: 100%',
        tableDataShow: true,
        printHeaderShow: false,
        pageTypeOfDetail: false,
        rules: {
          happenedNumber: [
            {required: true, message: '请输入发生次数', trigger: 'blur'},
            {validator: verifyPositiveNumber}
          ],
          totalNumber: [
            {required: true, message: '请输入汇总次数', trigger: 'blur'},
            {validator: verifyPositiveNumber}
          ]
        },
        initialData: [],
        spanArr: [],
        position: 0,
        currenTypeId: '',
        chooseMap: [],
        clickDisabled: false,
        templateShow: false,
        secondColFirst: false
      }
    },
    watch: {
      '$route' () {
        if (this.$route.name === 'template-view') {
          this.$nextTick(() => {
            this.init()
          })
        }
      }
    },
    created () {
      this.init()
    },
    computed: {
      realPercent () {
        return function (row) {
          let last = (row.totalNumber - row.happenedNumber) / row.totalNumber || 0
          last = (last * 100).toFixed(2) > 0  ?  (last * 100).toFixed(2) + '%' : '0.00%'
          row.actualPercent = last
          return last
        }
      }
    },
    methods: {
      init () {
        let routes = ['template-view', 'carrierDetail', 'achievements-template-view', 'shuttle-bus-template-view']
        if (routes.indexOf(this.$route.name) > -1 || this.isDetail || !this.isAuth('performancemanagement:tkpiassessmentrecord:updateHappendTotal')) {
          this.clickDisabled = true
        }
        this.tableData = []
        this.initialData = []
        if (JSON.stringify(this.$route.params) === '{}' && !this.$route.query.id && !this.templateData) {
          this.$router.go(-1)
          // this.initialData = this.templateData || this.$route.params
          // this.changeData()
        } else {
          this.initialData = JSON.stringify(this.$route.params) === '{}' ? this.templateData || [] : this.$route.params
          this.changeData()
        }
        let projectIds = [];
        const map = new Map();
        this.tableData.map(item => {
          map.set(item.assessmentProject, item)
        });
        for (let key of map.keys()) {
          projectIds.push(key)
        }
        projectIds.map(item => {
          let project = [];
          let id = item;
          this.tableData.map(item => {
            if (item.assessmentProject === id) {
              project.push(item)
            }
          });
          let weightScore = 0
          let score = 0
          project.map(item => {
            weightScore = ((weightScore * 100 + (Number(item.weightScore) || 0) * 100) / 100).toFixed(2)
            score = ((score * 100 + (Number(item.score) || 0) * 100) / 100).toFixed(2)
          });
          this.tableData.map(item => {
            if (item.assessmentProject === id) {
              item.weightScoreCount = weightScore
              item.scorceCount = score
            }
          });
        })
      },
      changeData () {
        this.initialData.map(res => {
          res.relationEntityList.map(resExam => {
            resExam.assessmentClassificationName = res.assessmentClassificationName
            resExam.assessmentClassification = res.assessmentClassification
            resExam.assessmentProjectName = res.assessmentProjectName
            resExam.assessmentProject = res.assessmentProject
            // this.getScore(resExam)
            this.tableData.push(resExam)
          })
          return res
        })
        this.$route.query.type === 'view' && this.tableData.sort(this.sortData)
        this.rowspan(0, 'assessmentClassification')
        this.rowspan(1, 'assessmentProject')
        this.rowspan(7 - this.checkedCol.length, 'weightScoreCount')
        this.rowspan(8 - this.checkedCol.length, 'scorceCount')
      },
      sortData (a, b) {
        return a.assessmentClassification > b.assessmentClassification ? 1 : -1
      },
      objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
        switch (columnIndex) {
          case 0 - (!this.secondColFirst ? this.checkedCol.length : 0):
            const _row0 = this.spanArr[0][rowIndex];
            return {
              rowspan: _row0,
              colspan: _row0 > 0 ? 1 : 0
            }
          case 1 - (!this.secondColFirst ? this.checkedCol.length : 3):
            const _row1 = this.spanArr[1][rowIndex];
            return {
              rowspan: _row1,
              colspan: _row1 > 0 ? 1 : 0
            }
          case 7 - this.checkedCol.length:
            const _row7 = this.spanArr[7][rowIndex];
            return {
              rowspan: _row7,
              colspan: _row7 > 0 ? 1 : 0
            }
          case 8 - this.checkedCol.length:
            const _row8 = this.spanArr[8][rowIndex];
            return {
              rowspan: _row8,
              colspan: _row8 > 0 ? 1 : 0
            }
        }
      },
      rowspan (idx, prop) {
        this.spanArr[idx] = [];
        this.position = 0;
        this.tableData.forEach((item, index) => {
          if (index === 0) {
            this.spanArr[idx].push(1);
            this.position = 0;
          } else {
            if (prop === 'assessmentClassification') {
              if (this.tableData[index][prop] === this.tableData[index - 1][prop]) {
                this.spanArr[idx][this.position] += 1;
                this.spanArr[idx].push(0);
              } else {
                this.spanArr[idx].push(1);
                this.position = index;
              }
            } else {
              if (this.tableData[index]['assessmentProject'] === this.tableData[index - 1]['assessmentProject'] && this.tableData[index][prop] === this.tableData[index - 1][prop]) {
                this.spanArr[idx][this.position] += 1;
                this.spanArr[idx].push(0);
              } else {
                this.spanArr[idx].push(1);
                this.position = index;
              }
            }
          }
        })
      },
      rowChange (row, column, cell, event) {
        if (this.clickDisabled) {
          return false
        }
        this.$set(row, 'seen', true)
        this.getScore(row)
      },
      getScore (row) {
        this.$http({
          url: this.$http.adornUrl(`/performancemanagement/${!this.headForm.busType ? 'tkpiassessmentrecord' : 'kpishuttlebusrecord'}/updateHappendTotal`),
          method: 'post',
          data: this.$http.adornData({
            'id': row.id || undefined,
            'happenedNumber': row.happenedNumber || 0,
            'totalNumber': row.totalNumber || 0
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$set(row, 'score', !this.headForm.busType ? data.tKpiRecordRelationEntity.score : data.kpiShuttleBusRelationEntity.score)
            this.$set(row, 'weightScore', !this.headForm.busType ? data.tKpiRecordRelationEntity.weight : data.kpiShuttleBusRelationEntity.weight)
            this.$set(row, 'actualPercent', !this.headForm.busType ? data.tKpiRecordRelationEntity.actualPercent : data.kpiShuttleBusRelationEntity.actualPercent)
            this.$nextTick(() => {
              let realScore = []
              let realWeight = []
              this.tableData.map(res => {
                if (res.assessmentClassification === row.assessmentClassification && res.assessmentProject === row.assessmentProject) {
                  realScore.push(parseFloat(res.score))
                  realWeight.push(parseFloat(res.weightScore) || 0)
                }
              })
              let s = 0;
              realScore.forEach(function (val, idx, arr) {
                s = ((s * 100 + Number(val) * 100) / 100).toFixed(2);
              }, 0);
              let w = 0;
              realWeight.forEach(function (val, idx, arr) {
                w = ((w * 100 + Number(val) * 100) / 100).toFixed(2);
              }, 0);
              this.tableData = this.tableData.map(res => {
                if (res.assessmentClassification === row.assessmentClassification && res.assessmentProject === row.assessmentProject) {
                  res.scorceCount = s
                  res.weightScoreCount = w
                }
                return res
              })
              this.$forceUpdate()
            })
          }
        })
        // if (row.percentStandard < this.realPercent(row) || this.realPercent(row) === '100.00%') {
        //   this.$set(row, 'score', row.weightScore)
        // } else {
        //   this.$set(row, 'score', 0)
        // }
      },
      getSummaries (param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '得分';
            return;
          }
          if (index === 8) {
            const map = new Map();
            data.map(item => {
              map.set(item.assessmentProject, item.scorceCount)
            })
            let total = 0;
            for (let value of map.values()) {
              total = ((total * 100 + Number(value) * 100) / 100).toFixed(2)
            }
            sums[index] = total || 0;
          }
        });
        return sums;
      },
      printHere () {
        this.printWidth = 'width: 1050px'
        this.tableDataShow = false
        this.printHeaderShow = true
        setTimeout(() => {
          this.tableDataShow = true
        }, 50)
        setTimeout(() => {
          this.$print(this.$refs.printer)
          this.printWidth = 'width: 100%'
          this.printHeaderShow = false
        }, 100)
      },
      handleCheckedColChange (params) {
        if (params.length === 1 && params[0] === '考核项目') {
          this.secondColFirst = true
        } else {
          this.secondColFirst = false
        }
        this.tableDataShow = false
        setTimeout(() => {
          this.tableDataShow = true
        }, 50)
      }
    }
}
</script>
<style lang="scss" scoped>
.table-wrap{
  h2{
    text-align: center;
    letter-spacing: 5px;
  }
  p{
    letter-spacing: 5px;
    span:nth-child(1) {
      margin-left: 10px;
    }
    span:nth-child(2) {
      float: right;
      margin-right: 20px;
    }
  }
  /deep/.el-table__body tr:hover>td{
    background-color: #ffffff!important;
  }
  .hideCol{
    display: inline-block;
    width: 1.4rem;
    text-align: center;
    font-size: 0.8rem;
    padding: 2px 0;
    border-radius: 3px;
    position: absolute;
    left: 15px;
    color: #ffffff;
    background-color: #85ce61;
    cursor: pointer;
    z-index: 1000;
  }
}
</style>
<style type="text/css" media="print">
  @page { size: landscape; margin: 20px}
  @media print {
    body {
       -webkit-print-color-adjust: exact;
     }
    .table-wrap .print-table{
      /*width: 1115px!important;*/
      /*background-color: red;*/
      /*width: 95%;*/
      /*margin: 0 auto;*/
    }
    /*.table-wrap h2{*/
      /*text-align: center;*/
      /*letter-spacing: 5px;*/
    /*}*/
    /*.table-wrap p{*/
      /*letter-spacing: 5px;*/
    /*}*/
    /*.table-wrap p span:nth-child(1) {*/
      /*margin-left: 10px;*/
    /*}*/
    /*.table-wrap p span:nth-child(2) {*/
      /*float: right;*/
      /*margin-right: 20px;*/
    /*}*/
  }
</style>

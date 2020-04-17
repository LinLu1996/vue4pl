<template>
  <div class="table-wrap">
    <el-form>
      <el-form-item label-width="0">
        <el-tag>服务标准</el-tag>
      </el-form-item>
    </el-form>
    <el-row v-if="!isDetail">
      <el-col style="text-align: right">
        <el-form-item style="margin-bottom: 5px;margin-right: 5px">
          <el-button type="success" @click="getStandard" size="mini">
            <icon-svg name="选择" style="vertical-align: middle"></icon-svg>
            选择</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table
          :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
          :data="tableData"
          :span-method="objectSpanMethod"
          border
          v-if="tableDataShow"
          style="width: 100%;">
          <el-table-column
            type="index"
            width="60"
            align="center"
            label="No.">
          </el-table-column>
          <el-table-column
            prop="assessmentClassificationName"
            header-align="center"
            width="120"
            align="center"
            label="考核分类"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="assessmentProjectName"
            header-align="center"
            align="center"
            label="考核项目"
            width="300"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="assessmentStandardName"
            header-align="center"
            align="center"
            label="考核指标"
            min-width="300"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="shortName"
            header-align="center"
            align="center"
            label="标准分值1"
            width="200"
            show-overflow-tooltip>
            <template slot-scope="{ row, $index }">
              <span v-if="isDetail">{{row.standardSourceLow}}</span>
              <el-form v-else :ref="'service1Form' + $index" :model="row" :rules="rules">
                <el-form-item  prop="standardSourceLow" style="margin-bottom: 15px;">
                  <el-input v-model="row.standardSourceLow" maxLength="5">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="signDtm"
            header-align="center"
            align="center"
            label="标准分值2"
            width="200"
            show-overflow-tooltip>
            <template slot-scope="{ row, $index }">
              <span v-if="isDetail">{{row.standardSourceHigh}}</span>
              <el-form v-else :model="row" :ref="'service2Form' + $index" :rules="rules">
                <el-form-item  prop="standardSourceHigh" style="margin-bottom: 15px;">
                  <el-input v-model="row.standardSourceHigh" maxLength="5">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <service-template ref="templateShow" v-if="templateShow" @getList="getList" @hideTable="hideTable"></service-template>
  </div>
</template>
<script>
  import serviceTemplate from './service-template'
  export default {
    props: {
      templateData: {
        type: Array
      },
      isDetail: {
        type: Boolean
      },
      standardId: {
        type: String
      }
    },
    data () {
      let verifyPositiveNumber = (rule, value, callback) => {
        if (value === '' || value == null) {
          callback()
        }
        if (isNaN(value) || value < 0) {
          callback(new Error('请输入大于等于0的数字'))
        }
        callback()
      }
      return {
        initId: '',
        initialData: [],
        tableData: [],
        spanArr: [],
        position: 0,
        templateShow: false,
        tableDataShow: true,
        rules: {
          standardSourceLow: [
            { validator: verifyPositiveNumber, trigger: 'blur' }
          ],
          standardSourceHigh: [
            { validator: verifyPositiveNumber, trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      serviceTemplate
    },
    watch: {
      standardId () {
        this.init()
      }
    },
    created () {
      this.init()
    },
    methods: {
      getList (serviceStandard, modelList, standardLength) {
        this.$emit('getStandardId', serviceStandard, modelList, standardLength)
        this.$nextTick(() => {
          this.init()
          this.tableDataShow = true
        })
      },
      hideTable () {
        this.tableDataShow = false
      },
      init () {
        this.initId = this.$route.query.id || ''
        this.tableData = []
        this.initialData = []
        this.initialData = this.templateData
        this.changeData()
      },
      changeData () {
        this.initialData.reverse().map(res => {
          res.relationEntityList.reverse().map(resExam => {
            resExam.assessmentClassificationName = res.assessmentClassificationName
            resExam.assessmentClassification = res.assessmentClassification
            resExam.assessmentProjectName = res.assessmentProjectName
            resExam.assessmentProject = res.assessmentProject
            this.tableData.push(resExam)
          })
          return res
        })
        this.tableData.sort(this.sortData)
        this.rowspan(1, 'assessmentClassification')
        this.rowspan(2, 'assessmentProject')
      },
      sortData (a, b) {
        return a.assessmentClassification > b.assessmentClassification ? 1 : -1
      },
      getStandard () {
        this.templateShow = true
        // this.tableDataShow = false
        this.$nextTick(() => {
          this.$refs.templateShow.init()
        })
      },
      objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
        switch (columnIndex) {
          case 1:
            const _row1 = this.spanArr[1][rowIndex];
            return {
              rowspan: _row1,
              colspan: _row1 > 0 ? 1 : 0
            }
          case 2:
            const _row2 = this.spanArr[2][rowIndex];
            return {
              rowspan: _row2,
              colspan: _row2 > 0 ? 1 : 0
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  .table-wrap {
    /deep/ .el-table__body tr:hover > td {
      background-color: #ffffff !important;
    }
  }
</style>

<template>
  <el-dialog
    :title="type === 'add' ? '新增指标' : '编辑指标'"
    :close-on-click-modal="false"
    width="80%"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="考核分类" prop="categoryName">
            <el-input v-model="dataForm.categoryName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="考核项目" prop="projectName">
            <el-input v-model="dataForm.projectName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="考核指标" prop="targetName">
            <el-input v-model="dataForm.targetName" maxLength="100"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否配置别名" prop="isAlias">
            <el-radio-group v-model="dataForm.isAlias">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="dataForm.isAlias === 0">
        <el-row>
          <el-col :span="24" style="text-align: right;margin-bottom: 20px">
            <el-button type="primary" size="mini" @click="addName()">添加</el-button>
          </el-col>
        </el-row>
        <el-row v-for="(item, index) in dataForm.projectStandardList" :key="index">
          <el-col :span="10">
            <el-form-item label="运输项目" :prop="'projectStandardList.'+ index +'.projectId'" :rules="dataRule.projectId">
              <xkl-select style="width: 100%"  v-model="item.projectId" labelType="projectKpiName" placeholder="运输项目" linkage="/performancemanagement/project/noPowerList" @getLabel="getProjectLabel(arguments[0], item)"></xkl-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="别名" :prop="'projectStandardList.'+ index +'.standardName'" :rules="dataRule.standardName">
              <el-input v-model="item.standardName" placeholder="别名" maxlength="160"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: right">
            <el-form-item label-width="0">
              <el-button type="danger" size="mini" @click="deleteName(index)">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-row>
        <el-form-item label-width="0">
          <el-tag>分子设置</el-tag>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="配置公式" prop="fenSon.configType" :rules="dataRule.configType">
              <xkl-select style="width: 100%" v-model="dataForm.fenSon.configType" select-type="CONFIG_TYPE" placeholder="请选择"></xkl-select>
            </el-form-item>
          </el-col>
          <template v-if="dataForm.fenSon.configType === '1'">
            <el-col :span="8" v-if="dataForm.fenSon.configType === '1'">
              <el-form-item label="分子" prop="fenSon.numerator" :rules="dataRule.numerator">
                <el-input v-model="dataForm.fenSon.numerator" maxlength="5"></el-input>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="dataForm.fenSon.configType === '2'">
            <el-col :span="8">
              <el-form-item label="系统环境" prop="fenSon.systemSource" :rules="dataRule.systemSource">
                <xkl-select style="width: 100%" v-model="dataForm.fenSon.systemSource" select-type="SYSTEM_SOURCE" placeholder="请选择"></xkl-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据源" prop="fenSon.dataSource" :rules="dataRule.dataSource">
                <xkl-select style="width: 100%" v-model="dataForm.fenSon.dataSource" :select-type="dataForm.fenSon.systemSource" placeholder="请选择"></xkl-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="统计列数" prop="fenSon.calculationNumber" :rules="dataRule.calculationNumber">
                <xkl-select style="width: 100%" v-model="dataForm.fenSon.calculationNumber" :disabled="fenDisabled" select-type="CALCULATION_NUMBER" placeholder="请选择"></xkl-select>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="dataForm.fenSon.calculationNumber">
            <template v-if="dataForm.fenSon.calculationNumber === '1'">
              <el-col :span="8">
                <el-form-item label="计算方式" prop="fenSon.calculationMethod" :rules="dataRule.calculationMethod">
                  <xkl-select style="width: 100%" v-model="dataForm.fenSon.calculationMethod" :disabled="fenDisabled" select-type="CALCULATION_METHOD" placeholder="请选择"></xkl-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="统计列" prop="fenSon.calculationColumn" :rules="dataRule.calculationColumn" v-if="dataForm.fenSon.calculationMethod!=='COUNT' || dataForm.fenSon.calculationMethod==='COUNT' && dataForm.fenSon.dataSource==='t_tm_customer_complaints'">
                  <xkl-select style="width: 100%" v-model="dataForm.fenSon.calculationColumn" labelType="carrierTpmodeName" :select-type="dataForm.fenSon.calculationMethod==='COUNT' && dataForm.fenSon.dataSource==='t_tm_customer_complaints' ? 'MATTER_TYPE' : dataForm.fenSon.dataSource" placeholder="请选择"></xkl-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="分组列" prop="fenSon.groupColumn" :rules="dataRule.groupColumn" v-if="dataForm.fenSon.calculationMethod==='COUNT' && dataForm.fenSon.systemSource==='TMS_SYSTEM'">
                  <xkl-select style="width: 100%" v-model="dataForm.fenSon.groupColumn" labelType="carrierTpmodeName" :select-type="dataForm.fenSon.calculationMethod==='COUNT' && dataForm.fenSon.dataSource==='t_tm_customer_complaints' ? 'MATTER_TYPE' : dataForm.fenSon.dataSource" placeholder="请选择"></xkl-select>
                </el-form-item>
              </el-col>
            </template>
            <template v-else>
              <el-col :span="8">
                <el-form-item label="统计列" prop="fenSon.calculationColumn" :rules="dataRule.calculationColumn">
                  <xkl-select style="width: 100%" v-model="dataForm.fenSon.calculationColumn" :select-type="dataForm.fenSon.dataSource==='t_tm_customer_complaints' ? 'MATTER_TYPE' : dataForm.fenSon.dataSource" placeholder="请选择" @getLabel="getLabel(1)"></xkl-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="运算方式" prop="fenSon.operationMethod" :rules="dataRule.operationMethod">
                  <xkl-select style="width: 100%" v-model="dataForm.fenSon.operationMethod" select-type="OPERATION_METHOD" placeholder="请选择"></xkl-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="统计列" prop="fenSon.calculationColumnTwo" :rules="dataRule.calculationColumnTwo">
                  <xkl-select style="width: 100%" v-model="dataForm.fenSon.calculationColumnTwo" :select-type="dataForm.fenSon.dataSource==='t_tm_customer_complaints' ? 'MATTER_TYPE' : dataForm.fenSon.dataSource" placeholder="请选择" @getLabel="getLabel(2)"></xkl-select>
                </el-form-item>
              </el-col>
            </template>
          </template>
        </el-row>
        <el-form-item label-width="0">
          <el-tag>分母设置</el-tag>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="配置公式" prop="denominator2.configType" :rules="dataRule.configType">
              <xkl-select style="width: 100%" v-model="dataForm.denominator2.configType" select-type="CONFIG_TYPE" placeholder="请选择"></xkl-select>
            </el-form-item>
          </el-col>
          <template v-if="dataForm.denominator2.configType === '1'">
            <el-col :span="8">
              <el-form-item label="分母" prop="denominator2.denominator" :rules="dataRule.denominator">
                <el-input v-model="dataForm.denominator2.denominator" maxlength="5"></el-input>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="dataForm.denominator2.configType === '2'">
            <el-col :span="8">
              <el-form-item label="系统环境" prop="denominator2.systemSource" :rules="dataRule.systemSource">
                <xkl-select style="width: 100%" v-model="dataForm.denominator2.systemSource" select-type="SYSTEM_SOURCE" placeholder="请选择"></xkl-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据源" prop="denominator2.dataSource" :rules="dataRule.dataSource">
                <xkl-select style="width: 100%" v-model="dataForm.denominator2.dataSource"  :select-type="dataForm.denominator2.systemSource" placeholder="请选择"></xkl-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="统计列数" prop="denominator2.calculationNumber" :rules="dataRule.calculationNumber">
                <xkl-select style="width: 100%" v-model="dataForm.denominator2.calculationNumber" :disabled="denominator2Disabled" select-type="CALCULATION_NUMBER" placeholder="请选择"></xkl-select>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="dataForm.denominator2.calculationNumber">
            <template v-if="dataForm.denominator2.calculationNumber === '1'">
              <el-col :span="8">
                <el-form-item label="计算方式" prop="denominator2.calculationMethod" :rules="dataRule.calculationMethod">
                  <xkl-select style="width: 100%" v-model="dataForm.denominator2.calculationMethod" :disabled="denominator2Disabled" select-type="CALCULATION_METHOD" placeholder="请选择"></xkl-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="统计列" prop="denominator2.calculationColumn" :rules="dataRule.calculationColumn" v-if="dataForm.denominator2.calculationMethod!=='COUNT' || dataForm.denominator2.calculationMethod==='COUNT' && dataForm.denominator2.dataSource==='t_tm_customer_complaints'">
                  <xkl-select style="width: 100%" v-model="dataForm.denominator2.calculationColumn" labelType="carrierTpmodeName" :select-type="dataForm.denominator2.calculationMethod==='COUNT' && dataForm.denominator2.dataSource==='t_tm_customer_complaints' ? 'MATTER_TYPE' : dataForm.denominator2.dataSource" placeholder="请选择"></xkl-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="分组列" prop="denominator2.groupColumn" :rules="dataRule.groupColumn" v-if="dataForm.denominator2.calculationMethod==='COUNT' && dataForm.denominator2.systemSource==='TMS_SYSTEM'">
                  <xkl-select style="width: 100%" v-model="dataForm.denominator2.groupColumn" labelType="carrierTpmodeName" :select-type="dataForm.denominator2.calculationMethod==='COUNT' && dataForm.denominator2.dataSource==='t_tm_customer_complaints' ? 'MATTER_TYPE' : dataForm.denominator2.dataSource" placeholder="请选择"></xkl-select>
                </el-form-item>
              </el-col>
            </template>
            <template v-else>
              <el-col :span="8">
                <el-form-item label="统计列" prop="denominator2.calculationColumn" :rules="dataRule.calculationColumn">
                  <xkl-select style="width: 100%" v-model="dataForm.denominator2.calculationColumn" :select-type="dataForm.denominator2.dataSource==='t_tm_customer_complaints' ? 'MATTER_TYPE' : dataForm.denominator2.dataSource" placeholder="请选择" @getLabel="getLabel2(1)"></xkl-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="运算方式" prop="denominator2.operationMethod" :rules="dataRule.operationMethod">
                  <xkl-select style="width: 100%" v-model="dataForm.denominator2.operationMethod" select-type="OPERATION_METHOD" placeholder="请选择"></xkl-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="统计列" prop="denominator2.calculationColumnTwo" :rules="dataRule.calculationColumnTwo">
                  <xkl-select style="width: 100%" v-model="dataForm.denominator2.calculationColumnTwo" :select-type="dataForm.denominator2.dataSource==='t_tm_customer_complaints' ? 'MATTER_TYPE' : dataForm.denominator2.dataSource" placeholder="请选择" @getLabel="getLabel2(2)"></xkl-select>
                </el-form-item>
              </el-col>
            </template>
          </template>
        </el-row>
      </el-row>
    </el-form>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-button @click="closeForm()">关闭</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      let verifyPositiveZero = (rule, value, callback) => {
        let patrn = /^[0-9][0-9]{0,4}$/;
        if (isNaN(value) || value <= 0) {
          callback(new Error('请输入不等于0的数字'))
        } else if (!patrn.exec(value)) {
          callback(new Error('只能输入不超过5位的正整数'))
        }
        callback()
      }
      let verifyParseInt = (rule, value, callback) => {
        let patrn = /^[0-9][0-9]{0,4}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入不超过5位的正整数'))
        }
        callback()
      }
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: 0,
          categoryName: '',
          projectName: '',
          targetName: '',
          fenSon: {
            configType: null,
            numerator: null,
            systemSource: null,
            dataSource: null,
            calculationNumber: null,
            operationMethod: null,
            calculationMethod: null,
            calculationColumn: null,
            calculationColumnTwo: null,
            type: 1
          },
          denominator2: {
            configType: null,
            denominator: null,
            systemSource: null,
            dataSource: null,
            calculationNumber: null,
            operationMethod: null,
            calculationMethod: null,
            calculationColumn: null,
            calculationColumnTwo: null,
            type: 2
          },
          isAlias: '',
          projectStandardList: [
            {
              projectId: '',
              standardName: ''
            }
          ]
        },
        dataRule: {
          targetName: [
            { required: true, message: '请输入考核指标', trigger: 'blur' }
          ],
          denominator: [
            { required: true, message: '请输入分母', trigger: 'change' },
            { validator: verifyPositiveZero, trigger: 'change' }
          ],
          numerator: [
            { required: true, message: '请输入分子', trigger: 'change' },
            { validator: verifyParseInt, trigger: 'change' }
          ],
          systemSource: [
            {required: true, message: '请选择操作系统', trigger: 'change'}
          ],
          dataSource: [
            {required: true, message: '请选择数据源', trigger: 'change'}
          ],
          calculationNumber: [
            {required: true, message: '请选择统计列数', trigger: 'change'}
          ],
          calculationMethod: [
            {required: true, message: '请选择计算方式', trigger: 'change'}
          ],
          operationMethod: [
            {required: true, message: '请选择运算方式', trigger: 'change'}
          ],
          groupColumn: [
            {required: true, message: '请选择分组列', trigger: 'change'}
          ],
          calculationColumn: [
            {required: true, message: '请选择统计列', trigger: 'change'}
          ],
          calculationColumnTwo: [
            {required: true, message: '请选择统计列', trigger: 'change'}
          ],
          configType: [
            {required: true, message: '请选择配置公式', trigger: 'change'}
          ],
          isAlias: [
            { required: true, message: '请选择是否配置别名', trigger: 'blur' }
          ],
          projectId: [
            { required: true, message: '请选择所属醒目', trigger: 'change' }
          ],
          standardName: [
            { required: true, message: '请输入别名', trigger: 'blur' }
          ]
        },
        type: '',
        standardCode: '',
        parentId: '',
        fenDisabled: false,
        denominator2Disabled: false
      }
    },
    watch: {
      'dataForm.fenSon.configType' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.fenSon.systemSource = null
          this.dataForm.fenSon.numerator = null
          this.dataForm.fenSon.calculationNumber = null
          this.dataForm.fenSon.operationMethod = null
          this.dataForm.fenSon.calculationMethod = null
          this.dataForm.fenSon.groupColumn = null
          this.dataForm.fenSon.calculationColumn = null
          this.dataForm.fenSon.calculationColumnTwo = null
          this.dataForm.numerator = null
        }
      },
      'dataForm.denominator2.configType' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.denominator2.systemSource = null
          this.dataForm.denominator2.denominator = null
          this.dataForm.denominator2.calculationNumber = null
          this.dataForm.denominator2.operationMethod = null
          this.dataForm.denominator2.calculationMethod = null
          this.dataForm.denominator2.groupColumn = null
          this.dataForm.denominator2.calculationColumn = null
          this.dataForm.denominator2.calculationColumnTwo = null
          this.dataForm.denominator = null
        }
      },
      'dataForm.fenSon.systemSource' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.fenSon.dataSource = null
          this.dataForm.fenSon.calculationColumn = null
          this.dataForm.fenSon.groupColumn = null
        }
      },
      'dataForm.denominator2.systemSource' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.denominator2.dataSource = null
          this.dataForm.denominator2.groupColumn = null
        }
      },
      'dataForm.fenSon.dataSource' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.fenSon.calculationColumn = null
          this.dataForm.fenSon.calculationColumnTwo = null
          if (newVal !== 't_tm_customer_complaints') {
            this.dataForm.fenSon.calculationNumber = ''
            this.dataForm.fenSon.calculationMethod = ''
            this.fenDisabled = false
          }
        }
        if (newVal === 't_tm_customer_complaints') {
          this.dataForm.fenSon.calculationNumber = '1'
          this.dataForm.fenSon.calculationMethod = 'COUNT'
          this.fenDisabled = true
        }
      },
      'dataForm.fenSon.calculationNumber' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.fenSon.calculationColumn = null
          this.dataForm.fenSon.calculationColumnTwo = null
          this.dataForm.fenSon.operationMethod = null
          this.dataForm.fenSon.calculationMethod = null
          this.dataForm.fenSon.groupColumn = null
        }
      },
      'dataForm.fenSon.calculationMethod' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.fenSon.groupColumn = null
          this.dataForm.fenSon.calculationColumn = null
        }
      },
      'dataForm.denominator2.dataSource' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.denominator2.calculationColumn = null
          this.dataForm.denominator2.calculationColumnTwo = null
          if (newVal !== 't_tm_customer_complaints') {
            this.dataForm.denominator2.calculationNumber = ''
            this.dataForm.denominator2.calculationMethod = ''
            this.denominator2Disabled = false
          }
        }
        if (newVal === 't_tm_customer_complaints') {
          this.dataForm.denominator2.calculationNumber = '1'
          this.dataForm.denominator2.calculationMethod = 'COUNT'
          this.denominator2Disabled = true
        }
      },
      'dataForm.denominator2.calculationMethod' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.denominator2.groupColumn = null
          this.dataForm.denominator2.calculationColumn = null
        }
      },
      'dataForm.denominator2.calculationNumber' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.denominator2.calculationColumn = null
          this.dataForm.denominator2.calculationColumnTwo = null
          this.dataForm.denominator2.operationMethod = null
          this.dataForm.denominator2.calculationMethod = null
          this.dataForm.denominator2.groupColumn = null
        }
      }
    },
    methods: {
      init (row, type) {
        this.clickFlag = true
        this.visible = true
        this.dataForm.id = row.id || 0
        this.type = type || ''
        this.parentId = row.id || ''
        this.standardCode = row.standardCode || ''
        this.dataForm.fenDisabled = false
        this.dataForm.denominator2Disabled = false
        this.$nextTick(() => {
          this.dataForm =  {
            id: row.id || 0,
            categoryName: '',
            projectName: '',
            targetName: '',
            fenSon: {
              systemSource: null,
              numerator: null,
              configType: null,
              dataSource: null,
              calculationNumber: null,
              operationMethod: null,
              calculationMethod: null,
              groupColumn: null,
              calculationColumn: null,
              calculationColumnTwo: null,
              type: 1
            },
            denominator2: {
              systemSource: null,
              denominator: null,
              configType: null,
              dataSource: null,
              calculationNumber: null,
              operationMethod: null,
              calculationMethod: null,
              groupColumn: null,
              calculationColumn: null,
              calculationColumnTwo: null,
              type: 2
            },
            projectStandardList: [{
              projectId: '',
              standardName: ''
            }],
            isAlias: 1
          }
          this.$refs['dataForm'].resetFields()
          this.$http({
            url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentstandard/info`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'level': row.level
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.categoryName = data.assessmentStandard.categoryName
              this.dataForm.projectName = data.assessmentStandard.projectName
              if (this.type === 'add') {
                return
              }
              this.dataForm.targetName = data.assessmentStandard.targetName
              this.dataForm.numerator = data.assessmentStandard.numerator !== null ?  data.assessmentStandard.numerator : ''
              this.dataForm.denominator = data.assessmentStandard.denominator !== null ? data.assessmentStandard.denominator : ''
              this.dataForm.formulaId = data.assessmentStandard.formulaId !== null ? data.assessmentStandard.formulaId : ''
              this.dataForm.fenSon = data.assessmentStandard.details && data.assessmentStandard.details.length ? data.assessmentStandard.details.filter(item => item.type === 1)[0] : {
                systemSource: null,
                numerator: null,
                configType: null,
                dataSource: null,
                calculationNumber: null,
                operationMethod: null,
                calculationMethod: null,
                groupColumn: null,
                calculationColumn: null,
                calculationColumnTwo: null,
                type: 1
              }
              this.dataForm.denominator2 = data.assessmentStandard.details && data.assessmentStandard.details.length ? data.assessmentStandard.details.filter(item => item.type === 2)[0] : {
                systemSource: null,
                denominator: null,
                configType: null,
                dataSource: null,
                calculationNumber: null,
                operationMethod: null,
                calculationMethod: null,
                groupColumn: null,
                calculationColumn: null,
                calculationColumnTwo: null,
                type: 2
              }
              this.dataForm.fenSon.configType = this.dataForm.fenSon.configType ? this.dataForm.fenSon.configType.toString() : ''
              this.dataForm.denominator2.configType = this.dataForm.denominator2.configType ? this.dataForm.denominator2.configType.toString() : ''
              this.dataForm.isAlias = data.assessmentStandard.isAlias
              this.dataForm.projectStandardList = data.assessmentStandard.projectStandardList && data.assessmentStandard.projectStandardList.length ? data.assessmentStandard.projectStandardList : [
                {
                  projectId: '',
                  standardName: ''
                }
              ]
            }
          })
        })
      },
      addName () {
        this.dataForm.projectStandardList.push({
          projectId: '',
          standardName: ''
        })
      },
      deleteName (index) {
        if (this.dataForm.projectStandardList.length === 1) {
          this.$message.warning('至少保留一条数据')
          return
        }
        this.dataForm.projectStandardList.splice(index, 1)
      },
      getProjectLabel (label, item) {
        const projectList = this.dataForm.projectStandardList.map(item => item.projectId)
        let set = new Set(projectList);
        if (set.size !== this.dataForm.projectStandardList.length) {
          this.$message.warning('一个项目只能有一个别名')
          item.projectId = ''
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            const details = []
            details.push(this.dataForm.fenSon)
            details.push(this.dataForm.denominator2)
            let data = {
              'parentId': this.dataForm.id || undefined,
              'configType': this.dataForm.configType || undefined,
              'formulaId': this.dataForm.formulaId || undefined,
              'standardCode': this.standardCode || undefined,
              'level': 3
            }
            if (this.type === 'edit') {
              data = {
                'id': this.dataForm.id || undefined,
                'configType': this.dataForm.configType || undefined,
                'formulaId': this.dataForm.formulaId || undefined,
                'level': 3
              }
            }
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentstandard/${this.type === 'add' ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                ...data,
                'name': this.dataForm.targetName.trim(),
                'details': details,
                'projectStandardList': this.dataForm.isAlias === 0 ? this.dataForm.projectStandardList : undefined,
                'isAlias': this.dataForm.isAlias
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.clickFlag = true
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      closeForm () {
        this.visible = false
      },
      getLabel (type) {
        const item1 = this.dataForm.fenSon.calculationColumn
        const item2 = this.dataForm.fenSon.calculationColumnTwo
        if (item1 === item2) {
          if (type === 1) {
            this.dataForm.fenSon.calculationColumn = ''
          } else {
            this.dataForm.fenSon.calculationColumnTwo = ''
          }
          this.$message({
            type: 'warning',
            message: '统计列不能相同'
          })
        }
      },
      getLabel2 (type) {
        const item1 = this.dataForm.denominator2.calculationColumn
        const item2 = this.dataForm.denominator2.calculationColumnTwo
        if (item1 === item2) {
          if (type === 1) {
            this.dataForm.denominator2.calculationColumn = ''
          } else {
            this.dataForm.denominator2.calculationColumnTwo = ''
          }
          this.$message({
            type: 'warning',
            message: '统计列不能相同'
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>

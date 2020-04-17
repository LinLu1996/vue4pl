<template>
  <div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label-width="0">
        <el-tag>基本信息</el-tag>
      </el-form-item>
      <el-row style="border-bottom: 1px solid #CCCCCC;margin-bottom: 20px">
        <el-col :span="22">
          <el-col :span="12">
            <el-form-item label="模板名称" prop="templateName">
              <el-input v-model="dataForm.templateName" maxLength="10" placeholder="模板名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板编号" prop="templateCode">
              <el-input v-model="dataForm.templateCode" maxLength="30" placeholder="模板编号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批准日期">
              <xkl-date-picker type="date" v-model="dataForm.templateAproveDate" placeholder="批准日期" clearable></xkl-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实施日期">
              <xkl-date-picker type="date" v-model="dataForm.templateImplementedDate" placeholder="实施日期" clearable></xkl-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模板说明">
              <el-input type="textarea" v-model="dataForm.templateRemark" maxLength="160" placeholder="模板说明" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <el-tag>考核信息</el-tag>
        <el-form-item label-width="50px" style="height: 30px;">
          <div style="box-shadow: 1px 1px 1px 1px #666666;background-color:#3698ce;position: fixed;border-radius:2px;z-index: 2000;right: 20px;">
            <el-button type="primary" size="small" icon="el-icon-plus" style="background: #3698ce;color: #ffffff;" @click="addTemplate()">新增考核项</el-button>
          </div>
        </el-form-item>
      </el-form-item>
      <el-row v-if="!dataForm.kpiTemplateRelationEntityList.length">
        <div>
          <h2 style="text-align: center;color: #dddddd;padding-right: 180px">当前无可用模板！</h2>
        </div>
      </el-row>
      <el-row v-else :gutter="20">
        <el-col v-if="dataChangeShow" :span="12" v-for="(addItem, index) in dataForm.kpiTemplateRelationEntityList" :key="index" v-show="addItem.relationStatus !== 'delete'" style="margin-bottom: 20px">
          <el-card>
            <div slot="header" class="clearfix">
              <h3 style="display: inline-block">
                <strong>所属分类：</strong>
                <span>{{addItem.assessmentClassificationName}}</span>
              </h3>
              <el-button style="float: right; padding: 3px 0;font-size: 20px" type="text" icon="el-icon-close" @click="deleteHandle(addItem.relationEntityList, index, addItem)"></el-button>
            </div>
            <el-row>
              <el-col>
                <el-row>
                  <el-col :span="18">
                    <el-form-item label="考核项目" :prop="'kpiTemplateRelationEntityList.'+ index +'.assessmentProject'" :rules="dataRule.assessmentProject">
                      <xkl-select style="width: 100%" v-model="addItem.assessmentProject" keyType="id" labelType="name" placeholder="考核项目" :selectId="addItem.assessmentClassification" assessmentProjectLevel="2" linkage="/performancemanagement/tkpiassessmentstandard/assessmentStandard" @clear="getLabel(arguments[0], addItem, 2)" @getLabel="getLabel(arguments[0], addItem, 2)"></xkl-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label-width="20px">
                      <el-button type="primary" size="mini" :disabled="!addItem.assessmentProject" @click="addOrRemoveExam(addItem.relationEntityList, 1)">添加指标</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form ref="addItem" label-width="100px" label-position="top" :model="addItem">
                      <el-row>
                        <el-col :span="10" :offset="1">
                          <span style="padding: 10px 0;display: block">考核指标：</span>
                        </el-col>
                        <el-col :span="5" :offset="1">
                          <span style="padding: 10px 0;display: block">百分比标准：</span>
                        </el-col>
                      </el-row>
                      <ul class="infinite-list" style="overflow:auto">
                        <el-row v-for="(item, index) in addItem.relationEntityList" :key="index" v-show="item.relationStatus !== 'delete'">
                          <el-col :span="10" :offset="1">
                            <el-form-item :prop="'relationEntityList.'+ index +'.assessmentStandard'" :rules="dataRule.assessmentStandard">
                              <xkl-select style="width: 100%" v-model="item.assessmentStandard" keyType="id" labelType="name" placeholder="考核指标" :selectId="addItem.assessmentProject" assessmentStandardLevel="3" linkage="/performancemanagement/tkpiassessmentstandard/assessmentStandard" @clear="getLabel(arguments[0], item, 3)" @getLabel="getLabel(arguments[0], item, 3)"></xkl-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="5" :offset="1">
                            <el-form-item :prop="'relationEntityList.'+ index +'.percentStandard'" :rules="dataRule.percentStandard">
                              <el-input v-model="item.percentStandard" @blur="getWeightScore(item)" maxLength="5">
                                <template slot="append">%</template>
                              </el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item>
                              <el-button :disabled="!item.assessmentStandard" circle style="margin-left: 10px" type="warning" size="mini" @click="checkStandard(item)">
                                <icon-svg name="阶梯" style="vertical-align: center"></icon-svg>
                              </el-button>
                              <el-button type="danger" size="mini" circle icon="el-icon-delete" @click="addOrRemoveExam(addItem.relationEntityList, 0, index, item)"></el-button>
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </ul>
                    </el-form>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
    <el-form style="margin-top: 20px;text-align: center;">
      <el-form-item label-width="0">
        <el-button type="success" size="small" icon="el-icon-document" :disabled="!dataForm.kpiTemplateRelationEntityList.length" @click="dataFormSubmit()">保存</el-button>
        <el-button type="success" size="small" icon="el-icon-view" :disabled="!dataForm.kpiTemplateRelationEntityList.length" @click="goPreview()">预览</el-button>
      </el-form-item>
    </el-form>
    <el-form style="margin-top: 20px;text-align: right">
      <el-form-item label-width="50px">
        <el-button @click="$router.go(-1)">关闭</el-button>
      </el-form-item>
    </el-form>
    <ladder-standard ref="ladderStandard" :ladderStandard="dataForm.kpiStandardScoreRuleEntityList" v-if="standardShow"></ladder-standard>
    <classification-add ref="classificationAdd" v-if="classificationShow" @getTempData="getTempData"></classification-add>
  </div>
</template>

<script>
  import {formatDate} from '../../../../../utils';
  import ladderStandard from './ladder-standard'
  import classificationAdd from './classification-add'
  export default {
    data () {
      let verifyPassword = (rule, value, callback) => {
        let patrn = /^(\w){0,30}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入字母、数字、下划线'))
        }
        callback()
      }
      let verifyPositiveNumber = (rule, value, callback) => {
        if (value === '' || value == null) {
          callback(new Error('请输入百分比标准'))
        }
        if (isNaN(value) || value < 0) {
          callback(new Error('请输入大于等于0的数字'))
        }
        callback()
      }
      return {
        visible: false,
        clickFlag: true,
        dataChangeShow: true,
        linkage: '1',
        dataForm: {
          id: 0,
          templateName: '',
          templateCode: '',
          templateAproveDate: '',
          templateImplementedDate: '',
          templateRemark: '',
          kpiTemplateRelationEntityList: [],
          kpiStandardScoreRuleEntityList: []
        },
        ladderStandard: [],
        finalScoreIds: [],
        repeatFlag: false,
        currentLabel: '',
        standardShow: false,
        classificationShow: false,
        openType: '',
        dataRule: {
          templateName: [
            { required: true, message: '请填写模板名称', trigger: 'change' }
          ],
          templateCode: [
            { required: true, message: '请填写模板编号', trigger: 'change' },
            { validator: verifyPassword, trigger: 'blur' }
          ],
          templateAproveDate: [
            { required: true, message: '请选择批准日期', trigger: 'blur' }
          ],
          templateImplementedDate: [
            { required: true, message: '请选择实施日期', trigger: 'change' }
          ],
          carrierName: [
            { required: true, message: '请填写合同有效期', trigger: 'blur' }
          ],
          certificatePassword: [
            { required: true, message: '请填写所属项目名称', trigger: 'blur' },
            { validator: verifyPassword, trigger: 'blur' }
          ],
          assessmentClassification: [
            { required: true, message: '请选择考核分类', trigger: 'change' }
          ],
          assessmentProject: [
            { required: true, message: '请选择考核项目', trigger: 'change' }
          ],
          assessmentStandard: [
            { required: true, message: '请选择考核指标', trigger: 'change' }
          ],
          percentStandard: [
            { validator: verifyPositiveNumber, trigger: 'change' }
          ],
          weightScore: [
            { validator: verifyPositiveNumber, trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
    },
    created () {
      this.dataForm.id = this.$route.query.id
      this.init()
    },
    components: {
      ladderStandard,
      classificationAdd
    },
    computed: {},
    methods: {
      init () {
        this.clickFlag = true
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmenttemplate/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.tKpiAssessmentTemplate
                this.dataForm.kpiTemplateRelationEntityList = data.tKpiAssessmentTemplate.kpiTemplateRelationEntityList
                this.dataForm.kpiStandardScoreRuleEntityList = []
                this.dataForm.kpiTemplateRelationEntityList.map(res => {
                  res.relationStatus = ''
                  res.editClassification = res.assessmentClassification
                  res.editProject = res.assessmentProject
                  if (res.relationEntityList.length) {
                    res.relationEntityList.map(item => {
                      item.relationStatus = ''
                      item.editStandard = item.assessmentStandard
                      item.editPercent = item.percentStandard
                      if (item.kpiStandardScoreRuleEntityList.length) {
                        this.dataForm.kpiStandardScoreRuleEntityList.push(...item.kpiStandardScoreRuleEntityList)
                      }
                    })
                  }
                })
              }
            })
          } else {
            this.isDisabled = false
            this.dataForm.attachmentUrl = ''
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            setTimeout(() => {
              this.clickFlag = true
            }, 1000)
            let flag = this.preSubmit()
            if (!flag) return false
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmenttemplate/${!this.dataForm.id ? 'saveKpiAssessmentTemplate' : 'editKpiAssessmentTemplate'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                ...this.dataForm,
                'templateAproveDate': this.dataForm.templateAproveDate ? formatDate(this.dataForm.templateAproveDate) : undefined,
                'templateImplementedDate': this.dataForm.templateImplementedDate ? formatDate(this.dataForm.templateImplementedDate) : undefined
              })
            }).then(({data}) => {
              if (data && data.code === 500) {
                this.$message.error(data.msg)
                return false
              }
              if (data && data.code === 0 && !data.map) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    window.history.go(-1)
                  }
                })
              } else {
                this.clickFlag = true
                let str = Object.keys(data.map).join('、')
                this.$message.error('(' + str + ')' + ' → ' + Object.values(data.map)[0])
              }
            })
          }
        })
      },
      preSubmit () {
        let prevent1 = true
        let prevent2 = true
        this.dataForm.kpiTemplateRelationEntityList.map(res => {
          if (!res.relationEntityList.length) {
            prevent1 = false
          }
          res.relationEntityList.map(res1 => {
            if ((res1.assessmentStandard === '' || res1.percentStandard === '') && res1.relationStatus !== 'delete') {
              prevent2 = false
            }
          })
        })
        if (!prevent1) {
          // this.$message.warning('至少添加一条考核指标')
          // return false
        }
        if (!prevent2) {
          this.$message.warning('考核指标或百分比标准不能为空')
          return false
        }
        this.dataForm.kpiTemplateRelationEntityList.map(res => {
          if (res.relationEntityList.length) {
            res.relationEntityList.map(item => {
              this.finalScoreIds.push(item.assessmentStandard)
            })
          }
          if (res.tempList && res.tempList.length && res.tempList[0].assessmentStandard) {
            res.tempList.map(inner => {
              inner.relationStatus = 'delete'
            })
            res.relationEntityList.push(...res.tempList)
          }
        })
        this.dataForm.kpiStandardScoreRuleEntityList = this.dataForm.kpiStandardScoreRuleEntityList.filter(res => {
          return this.finalScoreIds.indexOf(res.templateRelationId) > -1 && res.percentStandardStart !== '' && !isNaN(res.percentStandardStart)  &&  res.weightScore !== ''
        })
        return true
      },
      addTemplate () {
        this.classificationShow = true
        this.$nextTick(() => {
          this.$refs.classificationAdd.init()
        })
      },
      getTempData (data) {
        this.dataForm.kpiTemplateRelationEntityList.push(...data)
      },
      async deleteHandle (params, index, addItem) {
        let relationIds = params.map(res => res.relationId)
        let keysEdit = Object.keys(addItem)
        let result = this.dataForm.id && keysEdit.length > 10 ? await this.deleteStandard(relationIds) : undefined
        this.$confirm(`确定删除该考核项?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          if (result && result.code === 500 && params.length &&  params[0].id) {
            this.$message.error(result.msg)
          } else {
            this.dataChangeShow = false
            this.$nextTick(() => {
              this.dataChangeShow = true
              this.$set(addItem, 'relationStatus', 'delete')
              this.dataForm.kpiStandardScoreRuleEntityList = this.dataForm.kpiStandardScoreRuleEntityList.filter(res => {
                return res.templateRelationId !== params[0].assessmentStandard
              })
              if (keysEdit.length < 10) {
                this.dataForm.kpiTemplateRelationEntityList.splice(index, 1)
              }
              this.$forceUpdate()
            })
            this.$message.success('删除成功')
          }
        }).catch(() => {})
      },
      async addOrRemoveExam (params, type, index, item) {
        if (type === 1) {
          params.push({assessmentStandard: '', percentStandard: '', weightScore: '', relationStatus: ''})
        } else {
          let keysEdit = Object.keys(item)
          let relationIds = [item.relationId]
          let result = this.dataForm.id && keysEdit.length > 10 ? await this.deleteStandard(relationIds) : undefined
          this.$confirm(`确定删除这条数据?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (result && result.code === 500 && item.id) {
              this.$message.error(result.msg)
            } else {
              this.dataForm.kpiStandardScoreRuleEntityList = this.dataForm.kpiStandardScoreRuleEntityList.filter(res => {
                return res.templateRelationId !== params[index].assessmentStandard
              })
              this.$set(item, 'relationStatus', 'delete')
              this.$forceUpdate()
              if (keysEdit.length < 10) {
                params.splice(index, 1)
              }
              this.$message.success('删除成功')
            }
          }).catch(() => {})
        }
      },
      deleteStandard (relationIds) {
        return this.$http({
          url: this.$http.adornUrl(`/performancemanagement/tkpiassessmenttemplate/deleteByTemplateId/`),
          method: 'post',
          data: this.$http.adornData({
            ids: relationIds
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
          }
          return data
        }).catch(() => {})
      },
      clearNext (item, type) {
        this.$set(item, 'relationStatus', 'insert')
        if (type === 1) {
          this.$set(item, 'assessmentProject', '')
        } else if (type === 2) {
          item.tempList = item.relationEntityList
          this.$set(item, 'relationEntityList', [{assessmentStandard: '', percentStandard: '', weightScore: '', relationStatus: ''}])
        }
      },
      async getLabel (label, item, type) {
        let keys = Object.keys(item)
        let relationIds = []
        if (type === 1 || type === 2) {
          relationIds = item.relationEntityList.map(res => res.relationId)
        } else {
          relationIds = [item.relationId]
        }
        let result = this.dataForm.id && keys.length > 10 ? await this.deleteStandard(relationIds) : undefined
        if (result && result.code === 500) {
          item.assessmentClassification = item.editClassification
          item.assessmentProject = item.editProject
          item.assessmentStandard = item.editStandard
          this.$message.error(result.msg)
          return false
        } else {
          this.clearNext(item, type)
        }
        let kpiTemplate = this.dataForm.kpiTemplateRelationEntityList
        let length = this.dataForm.kpiTemplateRelationEntityList.length
        let assessmentProject = []
        kpiTemplate.map(res => {
          if (length > 1 && res.assessmentProject && res.relationStatus !== 'delete') {
            assessmentProject.push(res.assessmentProject)
          }
          let set = new Set(assessmentProject);
          if (set.size !== assessmentProject.length) {
            item.assessmentProject = ''
            this.repeatFlag = true
          }
          if (res.relationEntityList.length > 1) {
            let assessmentStandard = []
            res.relationEntityList.map(inner => {
              if (inner.assessmentStandard && inner.relationStatus !== 'delete') {
                assessmentStandard.push(inner.assessmentStandard)
              }
            })
            let set = new Set(assessmentStandard);
            if (set.size !== assessmentStandard.length) {
              item.assessmentStandard = ''
              this.repeatFlag = true
            }
          }
        })
        if (this.repeatFlag) {
          this.$message({
            type: 'warning',
            message: '该项内容已存在'
          })
        }
        this.repeatFlag = false
        if (type === 1) {
          this.$set(item, 'assessmentClassificationName', label)
        } else if (type === 2) {
          this.currentLabel = label
          this.$set(item, 'assessmentProjectName', label)
        } else {
          this.$set(item, 'assessmentStandardName', label)
        }
      },
      goPreview () {
        this.dataForm.kpiTemplateRelationEntityList = this.dataForm.kpiTemplateRelationEntityList.map(res => {
          if (res.relationEntityList.length) {
            res.relationEntityList = res.relationEntityList.filter(inner => inner.relationStatus !== 'delete')
            return res
          }
        }).filter(res => res.relationStatus !== 'delete')
        let list = JSON.parse(JSON.stringify(this.dataForm.kpiTemplateRelationEntityList));
        this.$router.push({
          name: 'template-view',
          params: list,
          query: {
            type: 'view'
          }
        })
      },
      async getWeightScore (item) {
        let keysEdit = Object.keys(item)
        let relationIds = [item.relationId]
        let result = this.dataForm.id && keysEdit.length > 10 ? await this.deleteStandard(relationIds) : undefined
        if (result && result.code === 500) {
          item.percentStandard = item.editPercent
          this.$message.error(result.msg)
          return false
        }
        let keys = Object.keys(item)
        this.$set(item, 'relationStatus', `${keys.length > 5 ? 'update' : 'insert'}`)
      },
      async checkStandard (item) {
        let keysEdit = Object.keys(item)
        let relationIds = [item.relationId]
        let result = this.dataForm.id && keysEdit.length > 10 ? await this.deleteStandard(relationIds) : undefined
        if (result && result.code === 500) {
          this.$message.error(result.msg)
          return false
        }
        this.standardShow = true
        let keys = Object.keys(item)
        this.$set(item, 'relationStatus', `${keys.length > 5 ? 'update' : 'insert'}`)
        this.$nextTick(() => {
          this.$refs.ladderStandard.init(item)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/.el-form-item .el-form-item__content {
    .el-input-group__append {
      padding: 0 10px;
    }
  }
  .infinite-list {
    height: 200px;
    padding: 0;
  }
</style>

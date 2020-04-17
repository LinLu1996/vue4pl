<template>
  <div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="150px">
      <el-form-item label-width="0">
        <el-tag>基本信息</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目全称" prop="projectKpiName">
            <el-input v-model="dataForm.projectKpiName" placeholder="项目全称" maxLength="33" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目简称" prop="shortName">
            <el-input v-model="dataForm.shortName" placeholder="项目简称" maxLength="16" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属运营中心" prop="logisticsId">
            <xkl-select style="width: 100%" v-model="dataForm.logisticsId" labelType="fullName" linkage="/sys/toperationcenter/list" placeholder="请选择运营中心"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否适用于绩效" prop="isAssessment">
            <el-radio-group v-model="dataForm.isAssessment">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否适用于费用结算" prop="isCostSettlement">
            <el-radio-group v-model="dataForm.isCostSettlement">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!--<el-col :span="8">-->
          <!--<el-form-item label="是否适用于班车" prop="isShuttleBus">-->
            <!--<el-radio-group v-model="dataForm.isShuttleBus" @change="changeModule()">-->
              <!--<el-radio :label="1">是</el-radio>-->
              <!--<el-radio :label="0">否</el-radio>-->
            <!--</el-radio-group>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input style="width: 100%;" v-model="dataForm.remark" maxlength="160" type="textarea" placeholder="备注" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px" v-if="dataForm.isShuttleBus === 0">
        <el-col :span="8">
          <el-form-item label-width="0">
            <el-tag>委托方信息</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-col :span="20">
            <el-form-item label="委托方名称" label-width="120px" prop="consignorIds">
              <el-input style="width: 100%;" v-model="consignorName" maxlength="160" readonly type="textarea" placeholder="点击右侧选择委托方" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" :offset="1">
            <el-button type="success" size="mini" @click="changeConsignor">
              <icon-svg name="选择" style="vertical-align: middle"></icon-svg>
              选择</el-button>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px" v-if="dataForm.isAssessment === 1">
        <el-col :span="8">
          <el-form-item label-width="0">
            <el-tag>模板信息</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-button icon="el-icon-circle-plus-outline" type="primary" size="mini" @click="addTemplateRelationList" style="background: #3698ce;color: #ffffff">新增</el-button>
        </el-col>
      </el-row>
      <template v-if="dataForm.isAssessment === 1">
        <el-row v-for="(item, index) in dataForm.projectTemplateRelations" :key="index" style="margin-bottom: 0px">
          <el-col :span="7">
            <el-form-item label="绩效模板" :prop="'projectTemplateRelations.'+ index +'.templateId'" :rules="dataRule.templateId">
              <xkl-select style="width: 100%" v-model="item.templateId" keyType="id" :selectId="forTempId" labelType="templateName" placeholder="选择考核模板" @change="checkData(item)" linkage="/performancemanagement/tkpiassessmenttemplate/noPowerlist"></xkl-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" style="text-align: center">
            <el-form-item label="运输方式" v-if="dataForm.isShuttleBus === 0" :prop="'projectTemplateRelations.'+ index +'.transportMethod'" :rules="dataRule.transportMethod">
              <xkl-select style="width: 100%" v-model="item.transportMethod" select-type="TRANSPORT_TYPE" @change="checkData(item)" placeholder="选择运输方式"></xkl-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" style="text-align: center">
            <el-form-item label="标准评分" v-if="dataForm.isShuttleBus === 0" :prop="'projectTemplateRelations.'+ index +'.standardScore'">
              <el-input style="width: 100%" v-model="item.standardScore"  placeholder="标准评分"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: right">
            <el-button  icon="el-icon-delete" type="danger" size="mini" @click="deleteTemplateRelationList(index)"></el-button>
          </el-col>
        </el-row>
      </template>
      <el-row style="margin-top: 20px;text-align: right">
        <el-col>
          <el-form-item>
            <el-button @click="$router.go(-1)">关闭</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <consignor-list v-if="getConsignorListVisible" ref="getConsignorList" @getParams="receiveParams"></consignor-list>
  </div>
</template>

<script>
  import ConsignorList from './consignor-list'
  export default {
    components: {
      ConsignorList
    },
    data () {
      return {
        clickFlag: true,
        dataForm: {
          id: '',
          projectKpiName: '',
          shortName: '',
          logisticsId: '',
          isAssessment: 0,
          isCostSettlement: 0,
          isShuttleBus: 0,
          remark: '',
          consignorIds: [],
          consignorNames: [],
          projectTemplateRelations: [{
            templateId: '',
            transportMethod: '',
            standardScore: ''
          }]
        },
        consignorName: '',
        consignors: [],
        forTempId: '',
        getConsignorListVisible: false,
        dataRule: {
          projectKpiName: [
            {required: true, message: '请输入项目全称', trigger: 'blur'}
          ],
          shortName: [
            {required: true, message: '请输入项目简称', trigger: 'blur'}
          ],
          logisticsId: [
            {required: true, message: '请选择运营中心', trigger: 'change'}
          ],
          consignorIds: [
            {required: true, message: '请选择委托方', trigger: 'change'}
          ],
          templateId: [
            {required: true, message: '请选择模板', trigger: 'change'}
          ]
        }
      }
    },
    activated () {
      const id = this.$route.query.id || null
      this.init(id)
    },
    watch: {
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.forTempId = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/project/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.projectKpiName = data.project.projectKpiName
                this.dataForm.shortName = data.project.shortName
                this.dataForm.logisticsId = data.project.logisticsId
                this.dataForm.isAssessment = data.project.isAssessment
                this.dataForm.isCostSettlement = data.project.isCostSettlement
                this.dataForm.isShuttleBus = data.project.isShuttleBus
                this.dataForm.remark = data.project.remark
                this.consignors = data.project.consignors
                this.dataForm.consignorIds = data.project.consignors ? data.project.consignors.map(res => {
                  return res.consignorId
                }) : []
                this.dataForm.consignorNames = data.project.consignors ? data.project.consignors.map(res => {
                  return res.consignorName
                }) : []
                this.consignorName = this.dataForm.consignorNames.join('、')
                this.dataForm.projectTemplateRelations = data.project.projectTemplateRelations || this.dataForm.projectTemplateRelations
                this.$nextTick(() => {
                  this.forTempId = ''
                })
              }
            })
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
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/project/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                ...this.dataForm
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
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
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      addTemplateRelationList () {
        this.dataForm.projectTemplateRelations.push(
          {
            templateId: '',
            transportMethod: '',
            standardScore: ''
          }
        )
      },
      deleteTemplateRelationList (index) {
        if (this.dataForm.projectTemplateRelations.length < 2) {
          this.$message.warning('至少保留一条数据')
          return false
        }
        this.$confirm('确定删除这条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          this.dataForm.projectTemplateRelations.splice(index, 1)
        }).catch(() => {})
      },
      changeConsignor () {
        this.getConsignorListVisible = true
        this.$nextTick(() => {
          this.$refs.getConsignorList.init(this.dataForm.consignorIds, this.consignors)
        })
      },
      receiveParams (params) {
        this.consignors = params.filter(res => res.id)
        this.dataForm.consignorNames = this.consignors.map(res => {
          return res.ownerName
        })
        this.dataForm.consignorIds = this.consignors.map(res => {
          return res.id
        })
        this.consignorName = this.dataForm.consignorNames.join('、')
      },
      checkData (item) {
        if (this.dataForm.isShuttleBus) {
          let templatesBus =  this.dataForm.projectTemplateRelations.map(res => res.templateId).filter(res => res !== '')
          if (templatesBus.length !== new Set(templatesBus).size) {
            !item.transportMethod && this.$message.warning(`该模板已存在`)
            item.templateId = ''
          }
        } else {
          let templates =  this.dataForm.projectTemplateRelations.map(res => res.transportMethod).filter(res => res !== '' && res !== null)
          if (templates.length !== new Set(templates).size) {
            this.$message.warning(`该运输方式只能存在一个`)
            item.transportMethod = ''
          }
        }
      },
      changeModule () {
        this.dataForm.projectTemplateRelations = [{templateId: '', transportMethod: '', standardScore: ''}]
        this.dataForm.consignorIds = []
        this.dataForm.consignorNames = []
        this.consignorName = ''
        this.consignors = []
      }
    }
  }
</script>

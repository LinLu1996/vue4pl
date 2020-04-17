<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" ref="dataForm" label-width="150px">
      <el-form-item label-width="0">
        <el-tag>基本信息</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目全称：" prop="projectKpiName">
            <span style="display: inline-block">
                {{dataForm.projectKpiName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目简称：" prop="shortName">
            <span style="display: inline-block">
                {{dataForm.shortName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属运营中心：" prop="logisticsId">
            <span style="display: inline-block">
                {{dataForm.logisticsName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否适用于绩效：" prop="isAssessment">
            <span style="display: inline-block">
                {{dataForm.isAssessment ? '是' : '否'}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否适用于费用结算：" prop="isCostSettlement" label-width="160px">
            <span style="display: inline-block">
                {{dataForm.isCostSettlement ? '是' : '否'}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否适用于班车" prop="isShuttleBus">
            <span style="display: inline-block">
                {{dataForm.isShuttleBus ? '是' : '否'}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：" prop="remark">
            <span style="display: inline-block">
                {{dataForm.remark}}
            </span>
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
          <el-form-item label="委托方名称：">
            <span style="display: inline-block">
                {{consignorName}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px">
        <el-col :span="8">
          <el-form-item label-width="0">
            <el-tag>模板信息</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <template>
        <el-row v-for="(item, index) in dataForm.projectTemplateRelations" :key="index" style="margin-bottom: 0px">
          <el-col :span="8">
            <el-form-item label="绩效模板：">
              <span style="display: inline-block">
                {{item.templateName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="dataForm.isShuttleBus === 0">
            <el-form-item label="运输方式：">
              <span style="display: inline-block">
                {{item.transportValue}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="dataForm.isShuttleBus === 0">
            <el-form-item label="标准评分：">
              <span style="display: inline-block">
                {{item.standardScore}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
    <consignor-list v-if="getConsignorListVisible" ref="getConsignorList" @getParams="receiveParams"></consignor-list>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
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
          logisticsName: '',
          isShuttleBus: '',
          isAssessment: 0,
          isCostSettlement: 0,
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
        getConsignorListVisible: false,
        visible: false
      }
    },
    activated () {
    },
    watch: {
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.visible = true
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
                this.dataForm.logisticsName = data.project.logisticsName
                this.dataForm.isAssessment = data.project.isAssessment
                this.dataForm.isShuttleBus = data.project.isShuttleBus
                this.dataForm.isCostSettlement = data.project.isCostSettlement
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
              }
            })
          }
        })
      }
    }
  }
</script>

<template>
  <el-dialog
    :title="type === 'add' ? '新增项目' : '编辑项目'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="考核分类" prop="categoryName">
            <el-input v-model="dataForm.categoryName" disabled ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="考核项目" prop="projectName">
            <el-input v-model="dataForm.projectName" maxLength="100"></el-input>
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
              <xkl-select style="width: 100%"  v-model="item.projectId" labelType="projectKpiName" placeholder="运输项目" linkage="/performancemanagement/project/noPowerList" @getLabel="getLabel(arguments[0], item)"></xkl-select>
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
  // import contractUpload from './contract-upload'
  // import XklDatePicker from '../../../../components/global/xkl-datePicker';
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        linkage: '1',
        dataForm: {
          id: 0,
          categoryName: '',
          projectName: '',
          isAlias: 1,
          projectStandardList: [
            {
              projectId: '',
              standardName: ''
            }
          ]
        },
        dataRule: {
          projectName: [
            { required: true, message: '请填写考核项目', trigger: 'blur' }
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
        parentId: ''
      }
    },
    methods: {
      init (row, type) {
        this.clickFlag = true
        this.dataForm.id = row.id || 0
        this.type = type || ''
        this.parentId = row.id || ''
        this.standardCode = row.standardCode || ''
        this.visible = true
        this.dataForm.categoryName = row.name
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (type === 'edit') {
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
                this.dataForm.isAlias = data.assessmentStandard.isAlias
                this.dataForm.projectStandardList = data.assessmentStandard.projectStandardList && data.assessmentStandard.projectStandardList.length ? data.assessmentStandard.projectStandardList : [{
                  projectId: '',
                  standardName: ''
                }]
              }
            })
          }
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
      getLabel (label, item) {
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
            let data = {
              'parentId': this.dataForm.id || undefined,
              'standardCode': this.standardCode || undefined,
              'level': 2
            }
            if (this.type === 'edit') {
              data = {
                'id': this.dataForm.id || undefined,
                'level': 2
              }
            }
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentstandard/${this.type === 'add' ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                ...data,
                'name': this.dataForm.projectName.trim(),
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
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>

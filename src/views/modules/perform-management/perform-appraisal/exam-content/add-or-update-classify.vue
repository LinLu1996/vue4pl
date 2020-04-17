<template>
  <el-dialog
    :title="!dataForm.id ? '新增分类' : '编辑分类'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="考核分类" prop="name">
            <el-input v-model="dataForm.name" maxLength="100" clearable></el-input>
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
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: 0,
          name: '',
          isAlias: 1,
          projectStandardList: [
            {
              projectId: '',
              standardName: ''
            }
          ]
        },
        dataRule: {
          name: [
            { required: true, message: '请填写考核分类', trigger: 'blur' }
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
        }
      }
    },
    components: {
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentstandard/info`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'level': 1
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.assessmentStandard.categoryName
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
              'level': 1
            }
            if (this.dataForm.id) {
              data = {
                'id': this.dataForm.id || undefined,
                'level': 1
              }
            }
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentstandard/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                ...data,
                'name': this.dataForm.name.trim(),
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

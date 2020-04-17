<template>
  <el-dialog
    title="生成"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRules" ref="dataForm" label-width="100px">
      <el-form-item label="KPI月度" prop="kpiMonth">
        <xkl-date-picker type="month" v-model="dataForm.kpiMonth" placeholder="考核月度"></xkl-date-picker>
      </el-form-item>
      <el-form-item label="KPI项目"  prop="projectKpiIds">
        <xkl-select style="width: 100%" v-model="dataForm.projectKpiIds" labelType="projectKpiName" multiple placeholder="考核项目" linkage="/performancemanagement/project/containsPowerList"></xkl-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button v-if="clickFlag" type="primary" @click="dataFormSubmit()">确定</el-button>
      <el-button v-else type="primary" :loading="btnLoading">生成中</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import {formatDate} from '../../../../utils';

  export default {
    components: {
    },
    data () {
      return {
        dataForm: {
          kpiMonth: '',
          projectKpiIds: []
        },
        dataRules: {
          kpiMonth: [
            {required: true, message: '请选择考核月度', trigger: 'change'}
          ],
          projectKpiIds: [
            {required: true, message: '请选择考核项目', trigger: 'change'}
          ]
        },
        visible: false,
        clickFlag: true,
        btnLoading: true
      }
    },
    methods: {
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
        })
      },
      dataFormSubmit (val) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/projectrecord/generateAndSave`),
              method: 'post',
              data: this.$http.adornData({
                ...this.dataForm,
                kpiMonth: formatDate(this.dataForm.kpiMonth, 'Month').replace('-', '')
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '生成成功',
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              }
              this.clickFlag = true
            })
          }
        })
      }
    }
  }
</script>

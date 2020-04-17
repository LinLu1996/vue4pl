<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="公式名称" prop="formulaName">
            <el-input v-model="dataForm.formulaName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="公式说明" prop="remark">
            <el-input v-model="dataForm.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <el-tag>分子设置</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="操作系统" prop="fenSon.systemSource" :rules="dataRule.systemSource">
            <xkl-select style="width: 100%" v-model="dataForm.fenSon.systemSource" select-type="SYSTEMSOURCE" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数据源" prop="fenSon.dataSource" :rules="dataRule.dataSource">
            <xkl-select style="width: 100%" v-model="dataForm.fenSon.dataSource" :select-type="dataForm.fenSon.systemSource" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计算方式" prop="fenSon.calculationMethod" :rules="dataRule.calculationMethod">
            <xkl-select style="width: 100%" v-model="dataForm.fenSon.calculationMethod" select-type="CALCULATION_METHOD" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="统计列" prop="fenSon.calculationColumn" :rules="dataRule.calculationColumn" v-if="dataForm.fenSon.calculationMethod==='sum' || dataForm.fenSon.calculationMethod==='one' || dataForm.fenSon.calculationMethod==='count' && dataForm.fenSon.dataSource==='t_tm_customer_complaints'">
            <xkl-select style="width: 100%" v-model="dataForm.fenSon.calculationColumn" labelType="carrierTpmodeName" :select-type="dataForm.fenSon.calculationMethod==='count' && dataForm.fenSon.dataSource==='t_tm_customer_complaints' ? 'CARRIER_QUESTION' : dataForm.fenSon.dataSource" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <el-tag>分母设置</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="操作系统" prop="denominator.systemSource" :rules="dataRule.systemSource">
            <xkl-select style="width: 100%" v-model="dataForm.denominator.systemSource" select-type="SYSTEMSOURCE" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数据源" prop="denominator.dataSource" :rules="dataRule.dataSource">
            <xkl-select style="width: 100%" v-model="dataForm.denominator.dataSource" labelType="carrierTpmodeName" :select-type="dataForm.denominator.systemSource" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计算方式" prop="denominator.calculationMethod" :rules="dataRule.calculationMethod">
            <xkl-select style="width: 100%" v-model="dataForm.denominator.calculationMethod" labelType="carrierTpmodeName" select-type="CALCULATION_METHOD" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="统计列" prop="denominator.calculationColumn" :rules="dataRule.calculationColumn" v-if="dataForm.denominator.calculationMethod==='sum' || dataForm.denominator.calculationMethod==='one' || dataForm.denominator.calculationMethod==='count' && dataForm.denominator.dataSource==='t_tm_customer_complaints'">
            <xkl-select style="width: 100%" v-model="dataForm.denominator.calculationColumn" labelType="carrierTpmodeName" :select-type="dataForm.denominator.calculationMethod==='count' && dataForm.denominator.dataSource==='t_tm_customer_complaints' ? 'CARRIER_QUESTION' : dataForm.denominator.dataSource" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
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
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: 0,
          formulaName: '',
          remark: '',
          fenSon: {
            systemSource: '',
            dataSource: '',
            calculationMethod: '',
            calculationColumn: '',
            type: 1
          },
          denominator: {
            systemSource: '',
            dataSource: '',
            calculationMethod: '',
            calculationColumn: '',
            type: 2
          }
        },
        dataRule: {
          formulaName: [
            {required: true, message: '请输入公式名称', trigger: 'change'}
          ],
          systemSource: [
            {required: true, message: '请选择操作系统', trigger: 'change'}
          ],
          dataSource: [
            {required: true, message: '请选择数据源', trigger: 'change'}
          ],
          calculationMethod: [
            {required: true, message: '请选择计算方式', trigger: 'change'}
          ],
          calculationColumn: [
            {required: true, message: '请选择统计列', trigger: 'change'}
          ]
        }
      }
    },
    watch: {
      'dataForm.fenSon.systemSource' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.fenSon.dataSource = ''
          this.dataForm.fenSon.calculationColumn = ''
        }
      },
      'dataForm.denominator.systemSource' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.denominator.dataSource = ''
          this.dataForm.denominator.calculationColumn = ''
        }
      },
      'dataForm.fenSon.dataSource' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.fenSon.calculationColumn = ''
        }
      },
      'dataForm.denominator.dataSource' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.denominator.calculationColumn = ''
        }
      }
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          this.dataForm = {
            id: id || 0,
            formulaName: '',
            remark: '',
            fenSon: {
              systemSource: '',
              dataSource: '',
              calculationMethod: '',
              calculationColumn: '',
              type: 1
            },
            denominator: {
              systemSource: '',
              dataSource: '',
              calculationMethod: '',
              calculationColumn: '',
              type: 2
            }
          }
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/kpiformulaconfig/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.formulaName = data.config.formulaName
                this.dataForm.remark = data.config.remark
                this.dataForm.fenSon = data.config.details.filter(item => item.type === 1)[0]
                this.dataForm.denominator = data.config.details.filter(item => item.type === 2)[0]
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
            const details = []
            details.push(this.dataForm.fenSon)
            details.push(this.dataForm.denominator)
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/kpiformulaconfig/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'formulaName': this.dataForm.formulaName,
                'remark': this.dataForm.remark,
                'details': details
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

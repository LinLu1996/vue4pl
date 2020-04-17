<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :visible.sync="visible"
    width="60%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="KPI月度" prop="kpiMonth">
            <xkl-date-picker type="month" v-model="dataForm.kpiMonth" placeholder="KPI月度" clearable></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="承运商" prop="carrierId">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" keyType="carrierId" labelType="carrierName" linkage="/transresources/trcarrier/findList" placeholder="承运商"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="委托方" prop="ownerId">
            <xkl-select style="width: 100%" v-model="dataForm.ownerId" keyType="id" labelType="ownerName" linkage="/transresources/ttrconsignor/noPowerList" placeholder="委托方"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运输方式" prop="transportMethod">
            <xkl-select style="width: 100%" v-model="dataForm.transportMethod" select-type="TRANSPORT_TYPE" placeholder="运输方式"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="培训次数" prop="trainNum">
            <el-input v-model="dataForm.trainNum" placeholder="培训次数" maxLength="5" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="达标次数" prop="trainCompletionNum">
            <el-input v-model="dataForm.trainCompletionNum" placeholder="达标次数" maxLength="5" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="dataForm.remark" placeholder="备注" maxLength="166" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { formatDate } from '@/utils'
  export default {
    components: {
    },
    data () {
      let verifyNumber = (rule, value, callback) => {
        if (value) {
          let patrn = /^(([1-9][0-9]{1,6})|([0-9]{1}))?$/;
          if (!patrn.exec(value)) {
            callback(new Error('请输入正整数'))
          }
          if (this.dataForm.trainCompletionNum && this.dataForm.trainNum) {
            if (this.dataForm.trainCompletionNum > this.dataForm.trainNum) {
              callback(new Error('培训次数不能小于达标次数'))
            }
          }
        }
        callback()
      }
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: '',
          kpiMonth: '',
          ownerId: '',
          carrierId: '',
          transportMethod: '',
          trainNum: '',
          trainCompletionNum: '',
          remark: ''
        },
        dataRule: {
          kpiMonth: [
            {required: true, message: '请选择KPI月度', trigger: 'change'}
          ],
          ownerId: [
            {required: true, message: '请选择委托方', trigger: 'change'}
          ],
          carrierId: [
            {required: true, message: '请选择承运商', trigger: 'change'}
          ],
          transportMethod: [
            {required: true, message: '请选择运输方式', trigger: 'change'}
          ],
          trainNum: [
            {required: true, message: '请填写培训次数', trigger: 'input'},
            {validator: verifyNumber, trigger: 'blur'}
          ],
          trainCompletionNum: [
            {required: true, message: '请填写达标次数', trigger: 'input'},
            {validator: verifyNumber, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/transmanagement/tmtrain/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                const kpiYear = data.train.kpiMonth.substring(0, 4)
                const kpiMon = data.train.kpiMonth.substring(4)
                this.dataForm.kpiMonth = `${kpiYear}-${kpiMon}`
                this.dataForm.carrierId = data.train.carrierId
                this.dataForm.ownerId = data.train.ownerId
                this.dataForm.transportMethod = data.train.transportMethod
                this.dataForm.trainNum = data.train.trainNum
                this.dataForm.trainCompletionNum = data.train.trainCompletionNum
                this.dataForm.remark = data.train.remark
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
              url: this.$http.adornUrl(`/transmanagement/tmtrain/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                id: this.dataForm.id || undefined,
                kpiMonth: this.dataForm.kpiMonth ? formatDate(this.dataForm.kpiMonth, 'Month').split('-').join('') : '',
                ownerId: this.dataForm.ownerId,
                carrierId: this.dataForm.carrierId,
                transportMethod: this.dataForm.transportMethod,
                trainNum: this.dataForm.trainNum,
                trainCompletionNum: this.dataForm.trainCompletionNum,
                remark: this.dataForm.remark
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.clickFlag = true
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
      }
    }
  }
</script>

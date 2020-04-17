<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="160px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="KPI月度：">
            <span style="width: 200px; display: block">
                {{dataForm.kpiMonth}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="承运商：">
             <span style="width: 200px; display: block">
                {{dataForm.carrierName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="委托方：">
             <span style="width: 200px; display: block">
                {{dataForm.ownerName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运输方式：">
             <span style="width: 200px; display: block">
                {{dataForm.transportValue}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="培训次数：">
             <span style="width: 200px; display: block">
                {{dataForm.trainNum}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="达标次数：">
             <span style="width: 200px; display: block">
                {{dataForm.trainCompletionNum}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：">
           <span style="width: 500px; display: block;white-space:normal; word-break:break-all;">
              {{dataForm.remark}}
           </span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    components: {
    },
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: '',
          kpiMonth: '',
          carrierName: '',
          ownerName: '',
          transportValue: '',
          trainNum: '',
          trainCompletionNum: '',
          remark: ''
        },
        dataRule: {
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.dataForm.id = id || 0
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/transmanagement/tmtrain/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.id = data.train.id
              this.dataForm.kpiMonth = this.$formatDate(data.train.kpiMonth, 'Month')
              this.dataForm.carrierName = data.train.carrierName
              this.dataForm.ownerName = data.train.ownerName
              this.dataForm.transportValue = data.train.transportValue
              this.dataForm.trainNum = data.train.trainNum
              this.dataForm.trainCompletionNum = data.train.trainCompletionNum
              this.dataForm.remark = data.train.remark
            }
          })
        }
      }
    }
  }
</script>

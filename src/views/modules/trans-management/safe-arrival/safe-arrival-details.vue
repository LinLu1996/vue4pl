<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    width="60%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="200px">
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
          <el-form-item label="受潮变形温度超标件数：">
             <span style="width: 200px; display: block">
                {{dataForm.exceedNumber}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { formatDate } from '@/utils'
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
          exceedNumber: '',
          timelyBackNum: '',
          realityBackNum: '',
          timelyRate: '',
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
            url: this.$http.adornUrl(`/transmanagement/tmsafearrival/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.id = formatDate(data.safeArrival.id)
              this.dataForm.kpiMonth = this.$formatDate(data.safeArrival.kpiMonth, 'Month')
              this.dataForm.carrierName = data.safeArrival.carrierName
              this.dataForm.ownerName = data.safeArrival.ownerName
              this.dataForm.transportValue = data.safeArrival.transportValue
              this.dataForm.exceedNumber = data.safeArrival.exceedNumber
            }
          })
        }
      }
    }
  }
</script>

<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    width="70%">
    <div class="vehicel-detail">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
               label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="承运商名称：" prop="carrierId">
              <span style="width: 200px; display: block">
                  {{dataForm.carrierName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="KPI月度：" prop="kpiMonth">
              <span style="width: 200px; display: block">
                  {{dataForm.kpiMonth}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划车次数：" prop="planedCarNum">
              <span style="width: 200px; display: block">
                  {{dataForm.planedCarNum}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支援车次数：" prop="supportCarNum">
              <span style="width: 200px; display: block">
                  {{dataForm.supportCarNum}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际车次数：" prop="realityCarNum">
              <span style="width: 200px; display: block">
                  {{dataForm.realityCarNum}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运力满足率：" prop="fillRate">
              <span style="width: 200px; display: block">
                  {{dataForm.fillRate}}%
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="未保障车次数：" prop="unprotectedNumber">
              <span style="width: 200px; display: block">
                  {{dataForm.unprotectedNumber}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="委托方：" prop="ownerName">
              <span style="width: 200px; display: block">
                  {{dataForm.ownerName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运输方式：" prop="transportTypeName">
              <span style="width: 200px; display: block">
                  {{dataForm.transportTypeName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <span style="width: 90%;display: block;white-space:normal; word-break:break-all;">
                  {{dataForm.remark}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // import { formatDate } from '@/utils'
  export default {
    components: {},
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: '',
          carrierId: '',
          carrierName: '',
          consignorId: '',
          kpiMonth: '',
          planedCarNum: '',
          supportCarNum: '',
          realityCarNum: '',
          fillRate: '',
          unprotectedNumber: '',
          ownerName: '',
          transportTypeName: '',
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
            url: this.$http.adornUrl(`/transmanagement/tmcarensurerate/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.carrierId = data.tTmCarEnsurerate.carrierId
              this.dataForm.carrierName = data.tTmCarEnsurerate.carrierName
              const kpiYear = data.tTmCarEnsurerate.kpiMonth.substring(0, 4)
              const kpiMon = data.tTmCarEnsurerate.kpiMonth.substring(4)
              this.dataForm.kpiMonth = `${kpiYear}年${kpiMon}月`
              this.dataForm.planedCarNum = data.tTmCarEnsurerate.planedCarNum
              this.dataForm.supportCarNum = data.tTmCarEnsurerate.supportCarNum
              this.dataForm.realityCarNum = data.tTmCarEnsurerate.realityCarNum
              this.dataForm.fillRate = data.tTmCarEnsurerate.fillRate
              this.dataForm.unprotectedNumber = data.tTmCarEnsurerate.unprotectedNumber
              this.dataForm.ownerName = data.tTmCarEnsurerate.ownerName
              this.dataForm.transportTypeName = data.tTmCarEnsurerate.transportTypeName
              this.dataForm.remark = data.tTmCarEnsurerate.remark
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .vehicel-detail .el-form .el-form-item .el-form-item__content span{
    display: block;
    width: 100%!important;
  }
</style>

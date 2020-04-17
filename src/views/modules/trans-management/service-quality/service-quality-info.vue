<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    width="70%">
    <div class="service-detail">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
               label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="承运商名称：" prop="carrierName">
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
            <el-form-item label="销退提货单数：" prop="returnExtractNum">
              <span style="width: 200px; display: block">
                  {{dataForm.returnExtractNum}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销退准时返回数：" prop="returnPunctualNum">
              <span style="width: 200px; display: block">
                  {{dataForm.returnPunctualNum}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退回准时率：" prop="returnPunctualRate">
              <span style="width: 200px; display: block">
                  {{dataForm.returnPunctualRate}}%
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="准时提货次数：" prop="extractPunctualNum">
              <span style="width: 200px; display: block">
                  {{dataForm.extractPunctualNum}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="准时提货率：" prop="extractPunctualRate">
              <span style="width: 200px; display: block">
                  {{dataForm.extractPunctualRate}}%
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
              <span style="width: 200px; display: block;white-space:normal; word-break:break-all;">
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
          carrierName: '',
          kpiMonth: '',
          returnExtractNum: '',
          returnPunctualNum: '',
          returnPunctualRate: '',
          extractPunctualNum: '',
          extractPunctualRate: '',
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
            url: this.$http.adornUrl(`/transmanagement/tmqualitystatistics/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.carrierName = data.tTmQualityStatistics.carrierName
              const kpiYear = data.tTmQualityStatistics.kpiMonth ? data.tTmQualityStatistics.kpiMonth.substring(0, 4) : ''
              const kpiMon = data.tTmQualityStatistics.kpiMonth ? data.tTmQualityStatistics.kpiMonth.substring(4) : ''
              this.dataForm.kpiMonth = `${kpiYear}年${kpiMon}月`
              this.dataForm.returnExtractNum = data.tTmQualityStatistics.returnExtractNum
              this.dataForm.returnPunctualNum = data.tTmQualityStatistics.returnPunctualNum
              this.dataForm.returnPunctualRate = data.tTmQualityStatistics.returnPunctualRate
              this.dataForm.extractPunctualNum = data.tTmQualityStatistics.extractPunctualNum
              this.dataForm.extractPunctualRate = data.tTmQualityStatistics.extractPunctualRate
              this.dataForm.ownerName = data.tTmQualityStatistics.ownerName
              this.dataForm.transportTypeName = data.tTmQualityStatistics.transportTypeName
              this.dataForm.remark = data.tTmQualityStatistics.remark
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .service-detail .el-form .el-form-item .el-form-item__content span{
    display: block;
    width: 100%!important;
  }
</style>

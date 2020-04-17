<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="KPI月度：">
            <span style="width: 200px; display: block">
                {{dataForm.kpiMonth}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投诉日期：">
            <span style="width: 200px; display: block">
                {{dataForm.complaintDtm}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发生日期：">
             <span style="width: 200px; display: block">
                {{dataForm.occurDtm}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发运日期：">
             <span style="width: 200px; display: block">
                {{dataForm.leaveDtm}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库：">
             <span style="width: 200px; display: block">
                {{dataForm.warehoseName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拣货单号：">
             <span style="width: 200px; display: block">
                {{dataForm.pickingOrderNumber}}
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
          <el-form-item label="承运商：">
             <span style="width: 200px; display: block">
                {{dataForm.carrierName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问题类型：">
             <span style="width: 200px; display: block">
                {{dataForm.matterValue}}
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
        <el-col :span="24">
          <el-form-item label="具体情况：">
            <span style="width: 90%; display: block">
                {{dataForm.matterContent}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="书面投诉：">
            <span style="width: 200px; display: block">
                {{dataForm.isPaperComplaint === 0 ? '否' : '是'}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处理结果：">
             <span style="width: 100%; display: block">
                {{dataForm.handleResult}}
             </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处理天数：">
             <span style="width: 200px; display: block">
                {{dataForm.handleDay}}
             </span>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
          <!--<el-form-item label="后续处理：">-->
             <!--<span style="width: 200px; display: block">-->
                <!--{{dataForm.postProcessing}}-->
             <!--</span>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="12">
          <el-form-item label="扣罚建议：">
             <span style="width: 200px; display: block">
                {{dataForm.finePropose}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扣罚金额：">
             <span style="width: 200px; display: block">
                {{dataForm.fineAmount}}&nbsp&nbsp元
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：">
             <span style="width: 90%; display: block;white-space:normal; word-break:break-all;">
                {{dataForm.remark}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="投诉记录人：">
           <span style="width: 200px; display: block">
              {{dataForm.complaintBy}}
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
  // import { formatDate } from '@/utils'
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
          complaintDtm: '',
          occurDtm: '',
          warehoseId: '',
          warehoseName: '',
          ownerId: '',
          ownerName: '',
          carrierId: '',
          carrierName: '',
          matterType: '',
          matterValue: '',
          transportValue: '',
          matterContent: '',
          isPaperComplaint: 0,
          // postProcessing: '',
          finePropose: '',
          fineAmount: '',
          remark: '',
          sysCrtByName: '',
          leaveDtm: '',
          pickingOrderNumber: '',
          handleResult: '',
          handleDay: ''
        },
        dataRule: {
        }
      }
    },
    methods: {
      init (id, values) {
        this.visible = true
        this.dataForm.id = id || 0
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/transmanagement/tmcustomercomplaints/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.kpiMonth = this.$formatDate(data.customerComplaints.kpiMonth, 'Month')
              this.dataForm.complaintDtm = this.$formatDate(data.customerComplaints.complaintDtm)
              this.dataForm.occurDtm = this.$formatDate(data.customerComplaints.occurDtm)
              this.dataForm.warehoseId = data.customerComplaints.warehoseId
              this.dataForm.warehoseName = data.customerComplaints.warehoseName
              this.dataForm.wareName = data.customerComplaints.wareName
              this.dataForm.ownerId = data.customerComplaints.ownerId
              this.dataForm.ownerName = data.customerComplaints.ownerName
              this.dataForm.carrierId = data.customerComplaints.carrierId
              this.dataForm.carrierName = data.customerComplaints.carrierName
              this.dataForm.matterType = data.customerComplaints.matterType
              this.dataForm.matterValue = data.customerComplaints.matterValue
              this.dataForm.transportValue = data.customerComplaints.transportValue
              this.dataForm.matterContent = data.customerComplaints.matterContent
              this.dataForm.isPaperComplaint = data.customerComplaints.isPaperComplaint
              // this.dataForm.postProcessing = data.customerComplaints.postProcessing
              this.dataForm.finePropose = data.customerComplaints.finePropose
              this.dataForm.fineAmount = data.customerComplaints.fineAmount
              this.dataForm.remark = data.customerComplaints.remark
              this.dataForm.complaintBy = data.customerComplaints.complaintBy
              this.dataForm.leaveDtm = this.$formatDate(data.customerComplaints.leaveTime)
              this.dataForm.pickingOrderNumber = data.customerComplaints.pickingOrderNumber
              this.dataForm.handleResult = data.customerComplaints.handleResult
              this.dataForm.handleDay = data.customerComplaints.handleDay
            }
          })
        }
      }
    }
  }
</script>

<template>
  <el-dialog
    title="详情"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-row>
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
          <el-form-item label="仓库：">
             <span style="width: 200px; display: block">
                {{dataForm.wareName}}
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
                {{dataForm.matterTypeName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="具体情况：">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="dataForm.matterContent">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="书面投诉：">
            <el-radio-group readonly v-model="dataForm.isPaperComplaint">
              <el-radio :label="1">有</el-radio>
              <el-radio :label="0">没有</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="后续处理：">
             <span style="width: 200px; display: block">
                {{dataForm.postProcessing}}
            </span>
          </el-form-item>
        </el-col>
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
                {{dataForm.fineAmount}}&nbsp&nbsp万元
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：">
             <span style="width: 200px; display: block;white-space:normal; word-break:break-all;">
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
          complaintDtm: '',
          occurDtm: '',
          warehoseId: '',
          consignorId: '',
          carrierId: '',
          matterType: '',
          matterTypeName: '',
          matterContent: '',
          isPaperComplaint: 0,
          postProcessing: '',
          finePropose: '',
          fineAmount: '',
          remark: '',
          complaintBy: ''
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
            url: this.$http.adornUrl(`/transmanagement/ttmmatter/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.complaintDtm = formatDate(data.tTmMatter.complaintDtm)
              this.dataForm.occurDtm = formatDate(data.tTmMatter.occurDtm)
              this.dataForm.warehoseId = data.tTmMatter.warehoseId
              this.dataForm.wareName = data.tTmMatter.wareName
              this.dataForm.consignorId = data.tTmMatter.consignorId
              this.dataForm.ownerName = data.tTmMatter.ownerName
              this.dataForm.carrierId = data.tTmMatter.carrierId
              this.dataForm.matterType = data.tTmMatter.matterType
              this.dataForm.carrierName = data.tTmMatter.carrierName
              this.dataForm.matterTypeName = data.tTmMatter.matterTypeName
              this.dataForm.matterContent = data.tTmMatter.matterContent
              this.dataForm.isPaperComplaint = data.tTmMatter.isPaperComplaint
              this.dataForm.postProcessing = data.tTmMatter.postProcessing
              this.dataForm.finePropose = data.tTmMatter.finePropose
              this.dataForm.fineAmount = data.tTmMatter.fineAmount
              this.dataForm.remark = data.tTmMatter.remark
              this.dataForm.complaintBy = data.tTmMatter.complaintBy
            }
          })
        }
      }
    }
  }
</script>

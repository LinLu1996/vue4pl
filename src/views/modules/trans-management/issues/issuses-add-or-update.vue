<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="投诉日期" prop="complaintDtm">
            <xkl-date-picker type="date" v-model="dataForm.complaintDtm" placeholder="投诉日期"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发生日期" prop="occurDtm">
            <xkl-date-picker type="date" v-model="dataForm.occurDtm" placeholder="发生日期"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库" prop="warehoseId">
            <xkl-select style="width: 100%" v-model="dataForm.warehoseId" keyType="id" labelType="wareName" linkage="/generator/trwarehouse/noPowerList " placeholder="仓库"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="委托方" prop="consignorId">
            <xkl-select style="width: 100%" v-model="dataForm.consignorId" keyType="id" labelType="ownerName" linkage="/transresources/ttrconsignor/noPowerList" placeholder="委托方"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="承运商" prop="carrierId">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" keyType="carrierId" labelType="carrierName" linkage="/transresources/trcarrier/findList " placeholder="承运商"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问题类型" prop="matterType">
            <xkl-select style="width: 100%" v-model="dataForm.matterType" select-type="MATTER_TYPE" placeholder="问题类型"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="具体情况" prop="matterContent">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="dataForm.matterContent">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="书面投诉" prop="isPaperComplaint">
            <el-radio-group v-model="dataForm.isPaperComplaint">
              <el-radio :label="1">有</el-radio>
              <el-radio :label="0">没有</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="后续处理" prop="postProcessing">
            <el-input v-model="dataForm.postProcessing" placeholder="后续处理" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扣罚建议" prop="finePropose">
            <el-input v-model="dataForm.finePropose" placeholder="扣罚建议" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扣罚金额" prop="fineAmount">
            <el-input v-model="dataForm.fineAmount" placeholder="扣罚金额" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" placeholder="备注" clearable></el-input>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
        <!--<el-form-item label="投诉记录人">-->
        <!--<el-input v-model="dataForm.complaintBy" placeholder="投诉记录人" clearable></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
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
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/transmanagement/ttmmatter/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.complaintDtm = data.tTmMatter.complaintDtm
                this.dataForm.occurDtm = data.tTmMatter.occurDtm
                this.dataForm.warehoseId = data.tTmMatter.warehoseId
                this.dataForm.consignorId = data.tTmMatter.consignorId
                this.dataForm.carrierId = data.tTmMatter.carrierId
                this.dataForm.matterType = data.tTmMatter.matterType
                this.dataForm.matterContent = data.tTmMatter.matterContent
                this.dataForm.isPaperComplaint = data.tTmMatter.isPaperComplaint
                this.dataForm.postProcessing = data.tTmMatter.postProcessing
                this.dataForm.finePropose = data.tTmMatter.finePropose
                this.dataForm.fineAmount = data.tTmMatter.fineAmount
                this.dataForm.remark = data.tTmMatter.remark
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
              url: this.$http.adornUrl(`/transmanagement/ttmmatter/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                id: this.dataForm.id || undefined,
                complaintDtm: formatDate(this.dataForm.complaintDtm),
                occurDtm: formatDate(this.dataForm.occurDtm),
                warehoseId: this.dataForm.warehoseId,
                consignorId: this.dataForm.consignorId,
                carrierId: this.dataForm.carrierId,
                matterType: this.dataForm.matterType,
                matterContent: this.dataForm.matterContent,
                isPaperComplaint: this.dataForm.isPaperComplaint,
                postProcessing: this.dataForm.postProcessing,
                finePropose: this.dataForm.finePropose,
                fineAmount: this.dataForm.fineAmount,
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

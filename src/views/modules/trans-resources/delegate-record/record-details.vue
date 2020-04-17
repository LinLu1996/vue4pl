<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row>
        <el-col v-if="dataForm.id" :span="8">
          <el-form-item label="备案编号：" prop="">
            <span style="width: 200px; display: block">
                {{dataForm.recordNo}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备案名称：" prop="">
            <span style="width: 200px; display: block">
                {{dataForm.recordName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="委托方名称：" prop="">
            <span style="width: 200px; display: block">
                {{dataForm.ownerName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="适用范围：" prop="">
            <span style="width: 90%; display: block">
                {{dataForm.supportRange}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生效时间：">
            <span style="width: 200px; display: block">
                {{dataForm.effectDtm}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备案时间：">
            <span style="width: 200px; display: block">
                {{$formatDate(dataForm.recordDtm)}}
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
        <el-col :span="24">
          <el-form-item label="审核备注：">
            <span style="width: 90%; display: block;white-space:normal; word-break:break-all;">
                {{dataForm.approveRemark}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="承运商：" prop="">
        <span style="width: 90%; display: block">
            {{dataForm.carrierName}}
        </span>
      </el-form-item>
      <el-form-item label="车辆：" prop="">
        <span style="width: 90%; display: block">
            {{dataForm.carNumber}}
        </span>
      </el-form-item>
      <el-form-item label="司机：" prop="">
        <span style="width: 90%; display: block">
            {{dataForm.driverName}}
        </span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" plain @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { formatDate } from '@/utils';
  import ImportDelegate from '../delegate/import-delegate'
  import DelegateInfo from '../delegate/delegate-info'
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          recordName: '',
          consignorId: '',
          supportRange: '',
          recordDtm: '',
          effectDtm: '',
          ownerName: '',
          car: '',
          driver: '',
          carrierName: '',
          carrierIds: [],
          carNumber: '',
          carIds: [],
          driverName: '',
          driverIds: [],
          approveRemark: ''
        },
        dataList: [],
        isDisabled: false,
        visible: false,
        pageIndex: 1,
        message: '',
        recordId: '',
        recordStatus: '',
        dataListLoading: false,
        addOrUpdateVisible: false,
        importDelegateVisible: false,
        delegateInfoVisible: false
      }
    },
    components: {
      ImportDelegate,
      DelegateInfo
    },
    activated () {
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/transresources/trrecord/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.recordNo = data.tTrRecord.recordNo
                this.dataForm.ownerName = data.tTrRecord.ownerName
                this.dataForm.consignorId = data.tTrRecord.consignorId
                this.dataForm.recordName = data.tTrRecord.recordName
                this.dataForm.carrierId = data.tTrRecord.carrierId
                this.dataForm.recordDtm = data.tTrRecord.recordDtm ? formatDate(data.tTrRecord.recordDtm) : ''
                this.dataForm.effectDtm = data.tTrRecord.effectDtm ? formatDate(data.tTrRecord.effectDtm) : ''
                this.dataForm.contractAttachment = data.tTrRecord.contractFileList
                this.dataForm.remark = data.tTrRecord.remark
                this.dataForm.approveRemark = data.tTrRecord.approveRemark
                this.dataForm.supportRange = data.tTrRecord.supportRange
                this.dataForm.carrierIds = data.tTrRecord.trRecordEntityMap[0] ? data.tTrRecord.trRecordEntityMap[0].map(res => {
                  return res.resourceId
                }) : []
                this.dataForm.carrierName = data.tTrRecord.trRecordEntityMap[0] ? data.tTrRecord.trRecordEntityMap[0].map(res => {
                  return res.resourceName
                }).join('、') : ''
                this.dataForm.carIds = data.tTrRecord.trRecordEntityMap[1] ? data.tTrRecord.trRecordEntityMap[1].map(res => {
                  return res.resourceId
                }) : []
                this.dataForm.carNumber = data.tTrRecord.trRecordEntityMap[1] ? data.tTrRecord.trRecordEntityMap[1].map(res => {
                  return res.resourceName
                }).join('、') : ''
                this.dataForm.driverIds = data.tTrRecord.trRecordEntityMap[2] ? data.tTrRecord.trRecordEntityMap[2].map(res => {
                  return res.resourceId
                }) : []
                this.dataForm.driverName = data.tTrRecord.trRecordEntityMap[2] ? data.tTrRecord.trRecordEntityMap[2].map(res => {
                  return res.resourceName
                }).join('、') : ''
              }
            })
          } else {
            this.isDisabled = false
            this.dataForm.attachmentUrl = ''
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .el-table__body-wrapper{
    button{
      width: auto;
      height: 25px;
      line-height: 25px;
      padding: 0;
      text-align: center;
      background: none;
      color: #3E8EF7;
      border: none;
    }
  }
</style>

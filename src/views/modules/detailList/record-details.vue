<template>
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
        <el-col :span="24">
          <el-form-item label="适用范围：" prop="">
            <span style="width: 90%; display: block">
                {{dataForm.supportRange}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备案时间：">
            <span style="width: 200px; display: block">
                {{dataForm.recordDtm}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生效时间：">
            <span style="width: 200px; display: block">
                {{dataForm.effectDtm}}
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
      <el-row style="display: flex;justify-content: flex-end;margin-top: 20px">
        <el-button type="primary" @click="approve(3)">通过</el-button>
        <el-button type="primary" @click="handleReverseAudit">不通过</el-button>
        <el-button type="warning" @click="handleBack()">返回</el-button>
      </el-row>
      <sea-son v-if="seaSonVisible" ref="seaSon"></sea-son>
    </el-form>
</template>

<script>
  import { formatDate } from '@/utils';
  import SeaSon from './seaSon'
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
          driverIds: []
        },
        visible: false,
        pageIndex: 1,
        message: '',
        seaSonVisible: false,
        recordId: ''
      }
    },
    components: {
      SeaSon
    },
    activated () {
      this.recordId = this.$route.query.id || null
      this.dataForm.id = this.$route.query.srcPk || null
      this.init()
    },
    methods: {
      init (id) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
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
                this.dataForm.effectDtm = formatDate(data.tTrRecord.effectDtm)
                this.dataForm.recordDtm = formatDate(data.tTrRecord.recordDtm)
                this.dataForm.contractAttachment = data.tTrRecord.contractFileList
                this.dataForm.remark = data.tTrRecord.remark
                this.dataForm.supportRange = data.tTrRecord.supportRange
                this.dataForm.carrierIds = data.tTrRecord.trRecordEntityMap[0].map(res => {
                  return res.resourceId
                })
                this.dataForm.carrierName = data.tTrRecord.trRecordEntityMap[0].map(res => {
                  return res.resourceName
                }).join('、')
                this.dataForm.carIds = data.tTrRecord.trRecordEntityMap[1].map(res => {
                  return res.resourceId
                })
                this.dataForm.carNumber = data.tTrRecord.trRecordEntityMap[1].map(res => {
                  return res.resourceName
                }).join('、')
                this.dataForm.driverIds = data.tTrRecord.trRecordEntityMap[2].map(res => {
                  return res.resourceId
                })
                this.dataForm.driverName = data.tTrRecord.trRecordEntityMap[2].map(res => {
                  return res.resourceName
                }).join('、')
              }
            })
          }
        })
      },
      // 表单提交
      approve (approveStatus) {
        if (!this.clickFlag) {
          return;
        }
        this.clickFlag = false
        this.$http({
          url: this.$http.adornUrl(`/sys/auditrecord/approve`),
          method: 'post',
          data: this.$http.adornData({
            id: this.recordId,
            approveStatus: approveStatus
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.handleBack()
              }
            })
          } else {
            this.clickFlag = true
            this.$message.error(data.msg)
          }
        })
      },
      handleReverseAudit () {
        if (!this.dataForm.season) {
          this.seaSonVisible = true
          this.$nextTick(() => {
            this.$refs.seaSon.init(this.recordId)
          })
          return false
        }
      },
      handleBack () {
        this.$router.push({
          path: '/todoList'
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

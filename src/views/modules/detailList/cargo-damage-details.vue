<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
    <el-form-item label-width="0">
      <el-tag>货损单信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="货损单号：">
           <span style="width: 200px; display: block">
                {{dataForm.cargoDamageNo}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="货损账期：">
           <span style="width: 200px; display: block">
                {{dataForm.cargoDamageMonth}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运商：">
           <span style="width: 200px; display: block">
                {{dataForm.carrierName}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="货损金额：">
             <span style="width: 200px; display: block">
                {{dataForm.totalDamageAmount}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="备注信息：">
           <span style="width: 200px; display: block">
                {{dataForm.remark}}
            </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0">
      <el-tag>货损单委托方明细</el-tag>
    </el-form-item>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;"
    >
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="ownerName"
        header-align="center"
        align="center"
        label="委托方"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cargoDamageAmount"
        header-align="center"
        align="center"
        label="货损金额（元）"
        width="300"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="!row.editing">
            {{row.cargoDamageAmount}}
          </span>
          <el-input v-else v-model="row.cargoDamageAmount" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="!row.editing">
            {{row.remark}}
          </span>
          <el-input v-else v-model="row.remark" size="mini"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="display: flex;justify-content: flex-end;margin-top: 20px">
      <el-button type="primary" @click="approve(3)">通过</el-button>
      <el-button type="primary" @click="handleReverseAudit">不通过</el-button>
      <el-button type="warning" @click="handleBack()">返回</el-button>
    </el-row>
    <sea-son v-if="seaSonVisible" ref="seaSon"></sea-son>
  </el-form>
</template>

<script>
  import SeaSon from './seaSon'
  export default {
    data () {
      return {
        visible: false,
        drawerVisible: false,
        clickFlag: true,
        linkage: '1',
        dataListLoading: false,
        isShow: true,
        dataForm: {
          id: 0,
          cargoDamageNo: '',
          cargoDamageMonth: '',
          totalDamageAmount: '',
          carrierName: '',
          remark: ''
        },
        recordId: '',
        dataList: [{name: 1, ownerCode: '222'}, {name: 1, ownerCode: '333'}],
        dataRule: {},
        seaSonVisible: false
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
      init () {
        this.clickFlag = true
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/feesettlement/fscargodamage/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.cargoDamageNo = data.fsCargoDamage ? data.fsCargoDamage.cargoDamageNo : ''
                this.dataForm.cargoDamageMonth = data.fsCargoDamage ? data.fsCargoDamage.cargoDamageMonth : ''
                this.dataForm.totalDamageAmount = data.fsCargoDamage ? data.fsCargoDamage.totalDamageAmount : ''
                this.dataForm.remark = data.fsCargoDamage ? data.fsCargoDamage.remark : ''
                this.dataForm.carrierName = data.fsCargoDamage ? data.fsCargoDamage.carrierName : ''
                this.dataList = data.fsCargoDamage ? data.fsCargoDamage.cargoDamageDetails : []
              }
            })
          } else {
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
<style lang="scss" scoped>
  /deep/.el-checkbox-button {
    .el-checkbox-button__inner{
      min-width: 280px!important;
      border-color: #ffffff!important;
      padding: 0;
    }
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
    display: block;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card{
    /deep/.el-card__header {
      background-color: #3e8ef76b;
    }
  }
</style>

<template>
  <div v-loading="dataListLoading">
    <el-form ref="dataForm" label-width="100px">
      <div style="font-size: 20px;font-weight: bold;margin-bottom: 30px">
        <span>{{`${dataForm.carrierName}${dataForm.year}年${dataForm.month}月货损`}}</span>
        <span style="margin-left: 20px;color: red">{{dataForm.fsCargoDamage}}万</span>
      </div>
      <el-form-item label-width="0">
        <el-tag>货损单货主明细</el-tag>
      </el-form-item>
      <el-table
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataList"
        border
        style="width: 100%;">
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
            <el-input-number v-else v-model="row.cargoDamageAmount" :min="0" :precision="2" :step="0.1" size="mini"></el-input-number>
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
            <el-input v-else v-model="row.remark" maxLength="50" size="mini"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top: 20px;text-align: right">
        <el-col>
          <el-form-item>
            <el-button @click="handleCancel()">关闭</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        drawerVisible: false,
        clickFlag: true,
        dataListLoading: false,
        dataForm: {
          id: 0,
          carrierName: '',
          year: '',
          month: '',
          fsCargoDamage: ''
        },
        dataList: [],
        signDepData: [],
        productLists: [],
        fileList: [],
        isDisabled: false
      }
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        this.clickFlag = true
        this.dataForm.id = this.$route.query.id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl('/shippingplatform/trefficiencyplatform/efficiencyDetailList'),
              method: 'post',
              data: this.$http.adornData({
                'page': this.pageIndex,
                'limit': this.pageSize,
                'id': this.dataForm.id,
                'type': 3
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.year = data.fsCargoDamage.cargoDamageMonth.split('-')[0]
                this.dataForm.month = data.fsCargoDamage.cargoDamageMonth.split('-')[1]
                this.dataForm.fsCargoDamage = (data.fsCargoDamage.totalDamageAmount / 10000).toFixed(5)
                this.dataList = data.fsCargoDamage.cargoDamageDetails
              }
            })
          } else {
            this.isDisabled = false
          }
        })
      },
      handleCancel () {
        window.history.go(-1)
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

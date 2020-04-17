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
    <el-row>
      <el-col style="text-align: right; ">
        <el-form-item style="margin-bottom: 5px">
          <el-button v-if="isAuth('feesettlement:fscargodamageownerdetail:outPutExcel')" type="success" size="mini"  icon="el-icon-download" @click="outPutExcel">导出</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
<!--      <el-table-column-->
<!--        type="selection"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        width="60">-->
<!--      </el-table-column>-->
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
          <el-input-number v-else v-model="row.cargoDamageAmount" :max="99999999" :min="0" :precision="5" :step="0.1" size="mini"></el-input-number>
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
          <el-input v-else v-model="row.remark" maxlength="50" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isEdit === 2 && isAuth('feesettlement:fscargodamageownerdetail:update')"
        header-align="center"
        align="center"
        fixed="right"
        width="120"
        label="操作">
        <template slot-scope="{ row }">
          <el-button v-if="isAuth('feesettlement:fscargodamageownerdetail:update')" v-show="!row.editing" type="warning" size="small" @click="updateHandle(row)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑</el-button>
          <div v-show="row.editing">
            <el-button size="mini" @click="row.editing = false, init()">关闭</el-button>
            <el-button type="primary" size="mini" @click="editSubmit(row)">确定</el-button>
          </div>
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
</template>

<script>
  // import { formatDate } from '@/utils'
  import Upload from '@/components/upload/upload'
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
          remark: '',
          status: ''
        },
        dataList: [{name: 1, ownerCode: '222'}, {name: 1, ownerCode: '333'}],
        signDepData: [],
        productLists: [],
        loadUrl: '/transresources/trcontract/upload',
        downloadUrl: '/transresources/trcontract/download',
        dataRule: {},
        fileList: [],
        levelDate: '',
        isDisabled: false,
        isEdit: 2
      }
    },
    watch: {
      '$route.params' (newVal) {
        if (this.$route.params.length) {
          this.productLists = this.$route.params
          this.dataForm.contractProductIds = this.productLists.map(res => {
            return res.id
          })
        }
      }
    },
    components: {
      Upload
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.clickFlag = true
        this.dataForm.id = this.$route.query.id || 0
        this.dataForm.status = this.$route.query.status || 0
        this.isEdit = this.$route.query.isEdit || 2
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/feesettlement/fscargodamage/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.cargoDamageNo = data.fsCargoDamage.cargoDamageNo
                this.dataForm.cargoDamageMonth = this.$formatDate(data.fsCargoDamage.cargoDamageMonth, 'Month')
                this.dataForm.totalDamageAmount = data.fsCargoDamage.totalDamageAmount
                this.dataForm.remark = data.fsCargoDamage.remark
                this.dataForm.carrierName = data.fsCargoDamage.carrierName
                this.dataList = data.fsCargoDamage.cargoDamageDetails
              }
            })
          } else {
            this.isDisabled = false
            this.dataForm.attachmentUrl = ''
          }
        })
      },
      updateHandle (row) {
        if (this.dataForm.status !== 0) {
          this.$message({
            type: 'warning',
            message: '该数据不能编辑'
          })
          return
        }
        this.$set(row, 'editing', true);
      },
      editSubmit (row) {
        row.editing = false
        this.dataFormSubmit(row)
      },
      toEdit (row) {
        this.$set(row, 'editing', true);
      },
      // 表单提交
      dataFormSubmit (row) {
        this.$http({
          url: this.$http.adornUrl(`/feesettlement/fscargodamageownerdetail/update`),
          method: 'post',
          data: this.$http.adornData({
            ...row
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.init()
              }
            })
          } else {
            this.clickFlag = true
            this.$message.error(data.msg)
          }
        })
      },
      // 导出报表
      outPutExcel () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/feesettlement/fscargodamageownerdetail/outPutExcel'),
          method: 'post',
          data: this.$http.adornData({
            'id': this.dataForm.id
          }),
          responseType: 'blob'
        }).then(({data}) => {
          this.loading = false
          const link = document.createElement('a')
          let blob = new Blob([data], {type: 'application/vnd.ms-excel'});
          if (blob.size === 0) {
            this.$message.error('准备导出的数据为0条')
            return
          }
          let fileName = this.dataForm.carrierName + '-'
          // for IE
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, `${fileName}委托方明细.xlsx`);
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `${fileName}委托方明细.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
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

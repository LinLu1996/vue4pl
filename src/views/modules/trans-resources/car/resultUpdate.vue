<template>
  <el-dialog
    title="验证结果"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div class="mod-config">
      <el-form :inline="true" :model="dataForm" label-width="100px" @keyup.enter.native="getSearchDataList()">
        <el-row>
          <el-col :span="12">
            <el-form-item label="承运商：">
              <span>
                {{dataForm.carrierName}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号：">
              <span style="width: 200px; display: block">
                {{dataForm.carNumber}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车型:">
              <span style="width: 200px; display: block">
                {{dataForm.carValue}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataForm.dataList"
        border
        ref="tableList"
        style="width: 100%;">
        <el-table-column
          type="index"
          width="60"
          align="center"
          label="No.">
        </el-table-column>
        <el-table-column
          prop="checkTime"
          header-align="center"
          align="center"
          label="验证日期"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="validDate"
          header-align="center"
          align="center"
          label="有效日期"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="checkResult"
          header-align="center"
          align="center"
          label="验证结果"
        >
          <template slot-scope="scope">
            {{scope.row.checkResult === 0 ? '验证不合格' : scope.row.checkResult === 1 ? '验证合格' : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          label="备注"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {formatDate} from '@/utils';

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          carrierName: '',
          carNumber: '',
          carType: '',
          dataList: []
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id
        this.visible = true
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/transresources/trcarcheck/list`),
          method: 'post',
          data: this.$http.adornData({
            id: this.dataForm.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.carrierName = data.carCheck.carrierName
            this.dataForm.carNumber = data.carCheck.carNumber
            this.dataForm.carValue = data.carCheck.carValue
            this.dataForm.dataList = data.carCheck.carChecks.map(res => {
              if (res.checkTime) {
                res.checkTime = formatDate(res.checkTime)
              }
              return res
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>

<template>
  <el-dialog
    title="验证结果"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <div class="mod-config">
      <el-form :inline="true" ref="dataForm" :model="dataForm" label-width="100px" @keyup.enter.native="getDataList()">
        <el-row>
          <el-col :span="8">
            <el-form-item label="承运商名称：">
              <span style="display: inline-block">
                {{dataForm.carrierName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车牌号：">
              <span style="display: inline-block">
                {{dataForm.carNumber}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验证状态：">
              <span style="display: inline-block">
                {{dataForm.isChecked}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="首次验证日期：" label-width="120px">
              <span style="display: inline-block">
                {{dataForm.firstCheckTime ? $formatDate(dataForm.firstCheckTime) : ''}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最近夏季验证日期：" label-width="140px">
              <span style="display: inline-block">
                {{dataForm.lastSummerCheckTime ? $formatDate(dataForm.lastSummerCheckTime) : ''}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最近冬季验证日期：" label-width="140px">
              <span style="display: inline-block">
                {{dataForm.lastWinnerCheckTime ? $formatDate(dataForm.lastWinnerCheckTime) : ''}}
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
          <template slot-scope="{row}">
            {{ $formatDate(row.checkTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="validTime"
          header-align="center"
          align="center"
          label="验证有效期"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            {{ $formatDate(row.validTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="checkResult"
          header-align="center"
          align="center"
          label="验证结果">
          <template slot-scope="scope">
            {{scope.row.checkResult === 0 ? '验证不合格' : scope.row.checkResult === 1 ? '验证合格' : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          label="验证说明"
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
          isChecked: '',
          firstCheckTime: '',
          lastSummerCheckTime: '',
          lastWinnerCheckTime: '',
          dataList: []
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.dataForm = {
          carrierName: '',
          carNumber: '',
          carType: '',
          isChecked: '',
          firstCheckTime: '',
          lastSummerCheckTime: '',
          lastWinnerCheckTime: '',
          dataList: []
        }
        this.dataForm.id = id
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
            this.dataForm.isChecked = data.carCheck.isChecked === 0 ? '不合格' : data.carCheck.isChecked === 1 ? '合格' : ''
            this.dataForm.firstCheckTime = data.carCheck.firstCheckTime ? formatDate(data.carCheck.firstCheckTime) : null;
            this.dataForm.lastSummerCheckTime = data.carCheck.lastSummerCheckTime ? formatDate(data.carCheck.lastSummerCheckTime) : null;
            this.dataForm.lastWinnerCheckTime = data.carCheck.lastWinnerCheckTime ? formatDate(data.carCheck.lastWinnerCheckTime) : null;
            this.dataForm.dataList = data.carCheck.carChecks.map(res => {
              res.checkTime = res.checkTime ? formatDate(res.checkTime) : null;
              res.validTime = res.validTime ? formatDate(res.validTime) : null;
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

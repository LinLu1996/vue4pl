<template>
  <el-dialog
    :title="reachType === 'cooler' ? '冷机品牌' : 'GPS品牌'"
    :visible.sync="visible"
    width="60%">
    <el-form :model="dataForm" @keyup.enter.native="getDataList()" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="冷机品牌" v-if="reachType === 'cooler'">
            <xkl-select style="width: 100%" ref="coolerSelect" v-model="dataForm.coolerBrand" placeholder="冷机品牌" keyType="coolerBrand" labelType="coolerBrand" linkage="/transresources/trcooler/list"></xkl-select>
          </el-form-item>
          <el-form-item label="GPS品牌" v-else>
            <xkl-select style="width: 100%" v-model="dataForm.gpsBrand" placeholder="GPS品牌" keyType="gpsBrand" labelType="gpsBrand" linkage="/transresources/trgps/list"></xkl-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="冷机设备号" v-if="reachType === 'cooler'">
            <el-input v-model="dataForm.coolerNumber" placeholder="冷机设备号" maxlength="30" clearable></el-input>
          </el-form-item>
          <el-form-item label="GPS设备号" v-else>
            <el-input v-model="dataForm.gpsNumber" placeholder="GPS设备号" maxlength="30" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align: right;padding-right: 5px">
          <el-form-item>
            <el-button icon="el-icon-circle-plus-outline" @click="getDataList()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      ref="tableList"
      style="width: 100%;">
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        :prop="reachType === 'cooler' ? 'coolerName' : 'gpsName'"
        header-align="center"
        align="center"
        :label="reachType === 'cooler' ? '冷机品牌' : 'GPS品牌'"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        :prop="reachType === 'cooler' ? 'coolerDeviceCode' : 'gpsDeviceCode'"
        header-align="center"
        align="center"
        :label="reachType === 'cooler' ? '冷机设备号' : 'GPS设备号'"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        width="100"
        label="操作">
        <template slot-scope="{ row,$index }">
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteHandle($index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { resetData } from '@/utils'
  export default {
    data () {
      return {
        reachType: '',
        visible: false,
        dataForm: {
          coolerBrand: '',
          gpsBrand: '',
          coolerNumber: '',
          gpsNumber: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        checkVisible: false,
        resultVisible: false,
        selectionDataList: [],
        dataListSelections: [],
        sort: {}
      }
    },
    components: {
    },
    activated () {
    },
    methods: {
      init (type, date) {
        this.visible = true
        this.reachType = type
        this.dataList = date != null ? date : [];
      },
      // 获取数据列表
      getDataList () {
        let item = {}
        if (this.reachType === 'cooler') {
          if (this.dataForm.coolerNumber) {
            item = {
              coolerName: this.dataForm.coolerBrand,
              coolerDeviceCode: this.dataForm.coolerNumber
            }
          }
        } else {
          if (this.dataForm.gpsNumber) {
            item = {
              gpsName: this.dataForm.gpsBrand,
              gpsDeviceCode: this.dataForm.gpsNumber
            }
          }
        }
        if (JSON.stringify(item) !== '{}') {
          this.dataList.push(item)
          resetData(this.dataForm)
        } else {
          this.$message({
            type: 'warning',
            message: '请填写品牌和设备号'
          })
        }
      },
      // 删除
      deleteHandle (index) {
        this.dataList.splice(index, 1)
      },
      dataFormSubmit () {
        if (this.dataList.length) {
          this.$emit('getBrand', this.dataList, this.reachType)
          this.visible = false
        } else {
          this.$message({
            type: 'warning',
            message: '至少选择一条数据'
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .el-table__body-wrapper{
    button{
      width: auto!important;
      height: 25px;
      line-height: 25px;
      padding: 0 4px;
      text-align: center;
      background: none;
      color: #3E8EF7;
      border: none;
    }
  }
</style>


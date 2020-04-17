<template>
  <div class="mod-config">
    <el-form :model="dataForm" @keyup.enter.native="getSearchDataList()" label-width="100px">
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button type="success" :disabled="!selectionDataList.length" size="mini" @click="readHandle">
              <icon-svg name="审核" style="vertical-align: middle"></icon-svg>
              已读</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template>
      <el-table
        ref="elTable"
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        @row-dblclick="dbShowDetails"
        style="width: 100%;">
        <el-table-column
          type="selection"
          width="60"
          align="center"
          label="No.">
        </el-table-column>
        <el-table-column
          type="index"
          align="center"
          width="60"
          label="No.">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="labelName"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.sourceName ? scope.row.sourceName : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="noticeContent"
          align="center"
          label="消息内容"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="expireDate"
          align="center"
          label="到期日期"
          show-overflow-tooltip>
          <template slot-scope = {row}>
            {{$formatDate(row.expireDate)}}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          fixed="right"
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleDetail(scope.row.sourceId)">
              <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
              详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-form style="margin-top: 20px">
      <el-form-item style="text-align: right">
        <el-button type="primary" plain @click="$router.go(-1)">关闭</el-button>
      </el-form-item>
    </el-form>
    <!-- 弹窗, 新增 / 编辑 -->
    <!--<cost-upload v-if="importVisible" ref="importUpdate" @refreshDataList="getDataList"></cost-upload>-->
    <driver-info v-if="detailVisibleDriver" ref="detailUpdateDriver" @refreshDataList="getDataList"></driver-info>
    <business-details v-if="detailVisibleBusiness" ref="detailUpdateBusiness" @refreshDataList="getDataList"></business-details>
    <!--<carrier-detail v-if="detailVisibleCarrier" ref="detailUpdateCarrier" @refreshDataList="getDataList"></carrier-detail>-->
    <certificate-details v-if="detailVisibleCertificate" ref="detailUpdateCertificate" @refreshDataList="getDataList"></certificate-details>
    <car-details v-if="detailVisibleCar" ref="detailUpdateCar" @refreshDataList="getDataList"></car-details>
    <contract-details v-if="detailVisibleContract" ref="detailUpdateContract" @refreshDataList="getDataList"></contract-details>
  </div>
</template>

<script>
  import {formatDate} from '@/utils'
  import DriverInfo from '@/views/modules/trans-resources/driver/driver-detail'
  import BusinessDetails from '@/views/modules/trans-resources/business-license/business-details'
  // import CarrierDetails from '@/views/modules/trans-resources/carrier/carrier-detail'
  import CertificateDetails from '@/views/modules/trans-resources/trans-certificate/certificate-details'
  import CarDetails from '@/views/modules/trans-resources/car/car-details'
  import ContractDetails from '@/views/modules/trans-resources/contract/contract-details'

  export default {
    data () {
      return {
        dataForm: {
          expireType: ''
        },
        labelName: '所属对象',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        detailVisibleDriver: false,
        detailVisibleBusiness: false,
        // detailVisibleCarrier: false,
        detailVisibleCertificate: false,
        detailVisibleCar: false,
        detailVisibleContract: false,
        selectionDataList: []
      }
    },
    components: {
      DriverInfo,
      BusinessDetails,
      // CarrierDetails
      CertificateDetails,
      CarDetails,
      ContractDetails
    },
    activated () {
      this.dataForm = {}
      this.pageIndex = 1
      this.pageSize = 10
      this.dataForm.expireType = this.$route.query.type || null
      if (this.dataForm.expireType === 'carLicence' || this.dataForm.expireType === 'roadTransportLicence') {
        this.labelName = '车牌号'
      }
      if (this.dataForm.expireType === 'carrierLicence' || this.dataForm.expireType === 'roadManagementLicence') {
        this.labelName = '承运商名称'
      }
      if (this.dataForm.expireType === 'driverLicence') {
        this.labelName = '司机名称'
      }
      if (this.dataForm.expireType === 'contract') {
        this.labelName = '合同名称'
      }
      if (this.dataForm.expireType === 'invoice') {
        this.labelName = '开票单号'
      }
      this.getSearchDataList()
    },
    methods: {
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/expirenotice/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm,
            'isRead': 0
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list ? data.page.list.map(item => {
              item.expireDate = formatDate(item.expireDate)
              return item
            }) : []
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      readHandle () {
        var ids = this.selectionDataList.map(item => {
          return item.id
        })
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/expirenotice/update'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('已阅读选中信息')
            if (this.selectionDataList.length === this.dataList.length) {
              this.pageIndex = this.pageIndex === 1 ? 1 : this.pageIndex - 1
            }
            this.getDataList()
          }
          this.dataListLoading = false
        })
      },
      handleDetail (id) {
        switch (this.dataForm.expireType) {
          case 'driverLicence':
            this.detailVisibleDriver = true
            this.$nextTick(() => {
              this.$refs.detailUpdateDriver.init(id)
            })
            break
          case 'roadManagementLicence' :
            this.detailVisibleBusiness = true
            this.$nextTick(() => {
              this.$refs.detailUpdateBusiness.init(id)
            })
            break
          case 'roadTransportLicence' :
            this.detailVisibleCertificate = true
            this.$nextTick(() => {
              this.$refs.detailUpdateCertificate.init(id)
            })
            break
          case 'carLicence' :
            this.detailVisibleCar = true
            this.$nextTick(() => {
              this.$refs.detailUpdateCar.init(id)
            })
            break
          case 'carrierLicence' :
            this.$router.push({
              path: '/carrierDetail',
              query: {
                id: id
              }
            })
            break
          case 'contract' :
            this.detailVisibleContract = true
            this.$nextTick(() => {
              this.$refs.detailUpdateContract.init(id)
            })
            break
          case 'invoice' :
            this.$router.push({
              path: '/cost-settlement-cost/invoice/invoice-detail',
              query: {
                id: id
              }
            })
            break
        }
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.selectionDataList = val
      },
      // 双击显示详情
      dbShowDetails (row) {
        this.handleDetail(row.sourceId)
      },
      resetForm () {
        this.dataForm = {}
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
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
      padding: 0;
      text-align: center;
      background: none;
      color: #3E8EF7;
      border: none;
    }
  }
</style>
